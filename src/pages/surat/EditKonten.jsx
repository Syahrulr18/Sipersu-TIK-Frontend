import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Extension } from '@tiptap/core';
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Save, FileText,
  Table as TableIcon, TableCellsMerge, TableCellsSplit, IndentIncrease, IndentDecrease
} from 'lucide-react';

const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: 'normal',
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
            renderHTML: attributes => {
              if (attributes.lineHeight === this.options.defaultLineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight) => ({ commands }) => {
        return commands.setNode('paragraph', { lineHeight });
      },
    };
  },
});

// Extension untuk text-indent (tab pada awal paragraf)
const TextIndent = Extension.create({
  name: 'textIndent',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          textIndent: {
            default: null,
            parseHTML: element => element.style.textIndent || null,
            renderHTML: attributes => {
              if (!attributes.textIndent) return {};
              return { style: `text-indent: ${attributes.textIndent}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextIndent: (textIndent) => ({ commands }) => {
        return commands.setNode('paragraph', { textIndent });
      },
      toggleTextIndent: () => ({ commands, editor }) => {
        const isActive = editor.isActive({ textIndent: '36pt' });
        return commands.setNode('paragraph', { textIndent: isActive ? null : '36pt' });
      },
    };
  },
});

// Extension untuk padding-left (indent jadwal dll.)
const PaddingLeft = Extension.create({
  name: 'paddingLeft',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          paddingLeft: {
            default: null,
            parseHTML: element => element.style.paddingLeft || null,
            renderHTML: attributes => {
              if (!attributes.paddingLeft) return {};
              return { style: `padding-left: ${attributes.paddingLeft}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setPaddingLeft: (paddingLeft) => ({ commands }) => {
        return commands.setNode('paragraph', { paddingLeft });
      },
      togglePaddingLeft: () => ({ commands, editor }) => {
        const isActive = editor.isActive({ paddingLeft: '36pt' });
        return commands.setNode('paragraph', { paddingLeft: isActive ? null : '36pt' });
      },
    };
  },
});
import Button from '@/components/ui/Button';

import useAuthStore from '@/store/authStore';
import { useSuratDetail, useUpdateKonten } from '@/hooks/useSurat';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditKonten = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [saveStatus, setSaveStatus] = useState('');

  const { data: suratWrapper, isLoading } = useSuratDetail(id);
  const surat = suratWrapper?.data;
  const updateKonten = useUpdateKonten(id);
  const role = user?.role;

  const [selectedIdx, setSelectedIdx] = useState(0);
  const kontenStateRef = useRef([]);

  const generateInitialContent = (s) => {
    if (s.konten_html) return s.konten_html;

    let ringkasanHtml = '';
    if (s.ringkasan) {
      // Pisahkan teks berdasarkan baris baru
      const lines = s.ringkasan.split('\n').filter(l => l.trim() !== '');
      // Kelompokkan baris-baris menjadi paragraf
      // Paragraf baru dimulai setelah baris kosong atau setiap baris yang merupakan kalimat panjang
      let isFirstParagraph = true;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Paragraf pertama mendapatkan indent (tab)
        if (isFirstParagraph) {
          ringkasanHtml += `<p style="text-align:justify;text-indent:36pt">${line}</p>\n`;
          isFirstParagraph = false;
        } else if (line.match(/^(Hari|Waktu|Tempat|Agenda|Tanggal)\s*[:/]/i)) {
          // Baris jadwal/detail — tanpa indent, rata kiri
          ringkasanHtml += `<p style="text-align:left;padding-left:36pt">${line}</p>\n`;
        } else if (line.toLowerCase().startsWith('oleh karena') ||
                   line.toLowerCase().startsWith('sehubungan') ||
                   line.toLowerCase().startsWith('mengingat') ||
                   line.toLowerCase().startsWith('demikian') ||
                   line.toLowerCase().startsWith('berdasarkan') ||
                   line.toLowerCase().startsWith('dengan hormat') ||
                   line.toLowerCase().startsWith('untuk itu')) {
          // Paragraf baru dengan indent
          ringkasanHtml += `<p style="text-align:justify;text-indent:36pt">${line}</p>\n`;
        } else {
          // Baris biasa — justify tanpa indent
          ringkasanHtml += `<p style="text-align:justify">${line}</p>\n`;
        }
      }
    }

    if (!ringkasanHtml) {
      ringkasanHtml = `<p style="text-align:justify;text-indent:36pt">Isi surat di sini...</p>\n`;
    }

    return `<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.5">
${ringkasanHtml}  <br>
  <p style="text-align:justify;text-indent:36pt">Demikian disampaikan, atas perhatiannya diucapkan terima kasih.</p>
</div>`;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LineHeight,
      TextIndent,
      PaddingLeft,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] font-serif text-base leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
      
      // Update ref state
      if (kontenStateRef.current[selectedIdx]) {
        kontenStateRef.current[selectedIdx].konten_html = editor.getHTML();
      }
      
      // trigger save with current array
      debouncedSave([...kontenStateRef.current]);
    },
  });

  const debouncedSave = useCallback(
    (() => {
      let timeout;
      return (dataArray) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setSaveStatus('saving');
          
          let payload = {};
          if (dataArray.length > 1 && dataArray[0]?.penerima_id !== null) {
              payload.konten_penerima = dataArray.map(item => ({
                  penerima_id: item.penerima_id,
                  konten_html: item.konten_html
              }));
          } else {
              payload.konten_html = dataArray[0]?.konten_html || '';
          }

          updateKonten.mutate(payload, {
            onSuccess: () => {
              setSaveStatus('saved');
              setTimeout(() => setSaveStatus(''), 3000);
            },
            onError: () => {
              setSaveStatus('error');
              toast.error('Gagal menyimpan otomatis');
            }
          });
        }, 2000);
      };
    })(),
    [updateKonten]
  );

  useEffect(() => {
    if (surat && kontenStateRef.current.length === 0) {
      if (role !== 'dosen' && surat.penerima?.length > 1) {
        kontenStateRef.current = surat.penerima.map(p => ({
          penerima_id: p.id,
          nama_lengkap: p.nama_lengkap,
          konten_html: p.konten_html || generateInitialContent(surat)
        }));
      } else {
        kontenStateRef.current = [{
          penerima_id: null,
          konten_html: surat.konten_html || generateInitialContent(surat)
        }];
      }
      
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(kontenStateRef.current[0].konten_html);
      }
    }
  }, [surat, editor, role]);

  const handleTabClick = (idx) => {
    setSelectedIdx(idx);
    if (editor && kontenStateRef.current[idx]) {
      editor.commands.setContent(kontenStateRef.current[idx].konten_html);
    }
  };

  if (isLoading || !surat) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );

  const handlePreviewSurat = () => {
    // Pastikan konten HTML tersimpan dulu sebelum berpindah
    updateKonten.mutate({ konten_html: editor.getHTML() }, {
      onSuccess: () => {
        navigate(`/surat/${id}`);
      },
      onError: () => {
        toast.error('Gagal menyimpan sebelum preview');
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="card flex items-center gap-1 p-2 border-b mt-4">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Rata Kiri">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Rata Tengah">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Rata Kanan">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Rata Kiri-Kanan">
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleTextIndent().run()} active={editor.isActive({ textIndent: '36pt' })} title="Tab Paragraf (Baris Pertama)">
          <IndentIncrease className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().togglePaddingLeft().run()} active={editor.isActive({ paddingLeft: '36pt' })} title="Indentasi Seluruh Baris (Untuk Jadwal)">
          <IndentDecrease className="w-4 h-4 transform rotate-180" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none"
          defaultValue="Times New Roman"
        >
          <option value="Times New Roman">Times New Roman</option>
          <option value="Arial">Arial</option>
          <option value="Inter">Inter</option>
        </select>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <select
          onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
          className="text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none"
          defaultValue="1.5"
          title="Line Spacing"
        >
          <option value="1">1</option>
          <option value="1.15">1.15</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
        </select>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Sisipkan Tabel">
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="Hapus Tabel">
          <TableIcon className="w-4 h-4 text-red-500" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Tambah Kolom Kanan">
          <TableCellsSplit className="w-4 h-4 transform rotate-90" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Tambah Baris Bawah">
          <TableCellsSplit className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().mergeCells().run()} title="Gabung Sel">
          <TableCellsMerge className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Warning message if user has duplicate headers */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <p className="text-sm text-yellow-800">
          <strong>Perhatian:</strong> Editor di bawah ini <strong>hanya untuk mengedit ISI SURAT (Body)</strong>. 
          Kop surat, identitas (nomor, perihal), nama penerima, dan kolom tanda tangan akan ditambahkan secara otomatis oleh sistem saat surat dicetak/diterbitkan. 
          <br/>Jika Anda melihat nomor surat atau nama tujuan di dalam area editor, <strong>mohon dihapus saja</strong> agar tidak terjadi duplikasi ganda!
        </p>
      </div>

      {/* Editor area - Full Paper Mockup */}
      <div className="bg-gray-100 py-8 overflow-x-auto">
        
        {/* ── TAB PENERIMA (hanya jika > 1 penerima dan bukan dosen) ── */}
        {role !== 'dosen' && kontenStateRef.current?.length > 1 && (
          <div className="flex gap-0 mb-0 overflow-x-auto max-w-[794px] mx-auto">
            {kontenStateRef.current.map((p, idx) => (
              <button
                key={p.penerima_id || idx}
                onClick={() => handleTabClick(idx)}
                title={p.nama_lengkap}
                className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  selectedIdx === idx
                    ? 'bg-white text-[#8B0000] border-[#8B0000] shadow-sm'
                    : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
                }`}
                style={{
                  borderTopLeftRadius: idx === 0 ? '8px' : '0',
                  borderTopRightRadius: idx === kontenStateRef.current.length - 1 ? '8px' : '0',
                }}
              >
                Tab {idx + 1}
              </button>
            ))}
          </div>
        )}

        <div 
          className="bg-white shadow-xl mx-auto"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '12pt',
            lineHeight: '1.5',
            color: '#000',
            padding: '48px 64px',
            maxWidth: '794px',
            width: '100%',
          }}
        >
          {/* READONLY: KOP SURAT */}
          <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '16px', opacity: 0.7 }} className="select-none pointer-events-none">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '80px', verticalAlign: 'middle' }}>
                    <img src="/logo_PNUP.png" alt="Logo PNUP" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingLeft: '8px' }}>
                    <div style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Kementerian Pendidikan Tinggi, Sains, dan Teknologi
                    </div>
                    <div style={{ fontSize: '14pt', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Politeknik Negeri Ujung Pandang
                    </div>
                    <div style={{ fontSize: '9pt', marginTop: '2px' }}>
                      Jurusan Teknik Informatika dan Komputer
                    </div>
                    <div style={{ fontSize: '9pt' }}>
                      Jl. P. Kemerdekaan Km. 10, Makassar 90245
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* READONLY: IDENTITAS */}
          <table style={{ width: '100%', marginBottom: '24px', marginTop: '12px', opacity: 0.7 }} className="select-none pointer-events-none">
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top', width: '60%' }}>
                  <table style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                          <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>Nomor</td>
                          <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                          <td style={{ paddingBottom: '2px' }}>{surat.nomor_surat || '—'}</td>
                        </tr>
                        <tr>
                          <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>Lampiran</td>
                          <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                          <td style={{ paddingBottom: '2px' }}>
                            {surat.lampiran?.length > 0
                              ? surat.lampiran.reduce((sum, l) => sum + (l.jumlah_halaman || 1), 0) + ' Lembar'
                              : '-'}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingRight: '6px', paddingBottom: '2px', whiteSpace: 'nowrap' }}>Perihal</td>
                          <td style={{ paddingRight: '8px', paddingBottom: '2px' }}>:</td>
                          <td style={{ paddingBottom: '2px' }}><strong>{surat.hal}</strong></td>
                        </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                  Makassar, {surat.tanggal_terbit || surat.created_at_date}
                </td>
              </tr>
            </tbody>
          </table>

          {/* READONLY: PENERIMA */}
          <div style={{ marginBottom: '20px', opacity: 0.7 }} className="select-none pointer-events-none">
            <div>Kepada Yth.</div>
            {kontenStateRef.current?.length > 1 ? (
              <div style={{ paddingLeft: '16px' }}>
                {kontenStateRef.current[selectedIdx]?.nama_lengkap}
              </div>
            ) : (
              (surat.penerima || []).map((p, i) => (
                <div key={p.id || i} style={{ paddingLeft: '16px' }}>{p.nama_lengkap}</div>
              ))
            )}
            <div style={{ paddingLeft: '16px' }}>Di - Tempat</div>
          </div>

          {/* THE ACTUAL EDITOR FOR BODY */}
          <div className="border-2 border-dashed border-blue-200 p-4 -mx-4 rounded bg-blue-50/10 min-h-[200px]">
             <div className="mb-2 text-xs text-blue-400 uppercase tracking-widest font-bold">AREA EDIT KONTEN SURAT</div>
             <EditorContent editor={editor} />
          </div>

          {/* READONLY: TANDA TANGAN */}
          <table style={{ width: '100%', marginTop: '40px', opacity: 0.7 }} className="select-none pointer-events-none">
            <tbody>
              <tr>
                <td style={{ width: '60%' }} />
                <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                  <strong>
                    <div>Ketua Jurusan</div>
                    <div>Teknik Informatika dan Komputer</div>
                  </strong>
                  <div style={{ height: '64px' }} />
                  <strong>
                    <u>{surat.penanda_tangan?.nama_lengkap}</u>
                    <br />
                    NIP. {surat.penanda_tangan?.nip}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="card flex items-center justify-between p-4 sticky bottom-0">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400 font-medium">{surat.hal}</p>
          <span className="text-sm text-gray-500">
            {saveStatus === 'saving' && '⏳ Menyimpan...'}
            {saveStatus === 'saved' && <span className="text-green-600">✓ Tersimpan</span>}
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Save className="w-4 h-4" />} onClick={() => debouncedSave([...kontenStateRef.current])}>
            Save Draft
          </Button>
          <Button variant="primary" icon={<FileText className="w-4 h-4" />} onClick={handlePreviewSurat} loading={updateKonten.isPending}>
            Preview Surat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditKonten;
