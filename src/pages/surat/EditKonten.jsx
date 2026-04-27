import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import {
  Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight, Send, Save, FileText, Check
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import useAuthStore from '@/store/authStore';
import { formatTanggalSurat } from '@/utils/formatDate';

const EditKonten = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [saveStatus, setSaveStatus] = useState('');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialContent = `<div style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8">
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="width:100px;vertical-align:top">Nomor</td><td style="width:15px">:</td><td>-</td></tr>
    <tr><td style="vertical-align:top">Lampiran</td><td>:</td><td>1 berkas</td></tr>
    <tr><td style="vertical-align:top">Hal</td><td>:</td><td><strong>Permohonan Izin Magang Industri</strong></td></tr>
  </table>
  <br>
  <p>Yth.<br>Kepala HRD PT. Telkom Indonesia Tbk.<br>di- Tempat</p>
  <br>
  <p style="text-indent:36pt">Dengan ini kami mengundang Bapak/Ibu untuk menghadiri kegiatan yang akan dilaksanakan pada waktu dan tempat yang telah ditentukan.</p>
  <br>
  <p>Demikian disampaikan, atas perhatiannya diucapkan terima kasih.</p>
  <br><br>
  <table style="width:100%">
    <tr>
      <td style="width:55%"></td>
      <td>
        <p>${formatTanggalSurat()}</p>
        <p>Ketua Jurusan Teknik Informatika & Komputer,</p>
        <p>PNUP,</p>
        <br><br><br>
        <p><strong><u>${user?.nama_lengkap || 'Nama Penanda Tangan'}</u></strong></p>
        <p>NIP. ${user?.nip || '-'}</p>
      </td>
    </tr>
  </table>
</div>`;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[600px] font-serif text-base leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
      debouncedSave(editor.getHTML());
    },
  });

  const debouncedSave = useCallback(
    (() => {
      let timeout;
      return (html) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log('Auto-saving konten...', html.substring(0, 50));
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(''), 3000);
        }, 2000);
      };
    })(),
    []
  );

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
      navigate(`/surat/${id}`);
    }, 1500);
  };

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Konten Surat</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {saveStatus === 'saving' && '⏳ Menyimpan...'}
            {saveStatus === 'saved' && <span className="text-green-600">✓ Tersimpan</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-sm font-medium text-gray-700">{user?.nama_lengkap}</p>
            <p className="text-xs text-gray-400">Teknik Informatika & Komputer</p>
          </div>
          <Button variant="primary" icon={<FileText className="w-4 h-4" />}>
            Preview PDF
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card flex items-center gap-1 p-2 border-b">
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
      </div>

      {/* Editor area */}
      <div className="card p-12 shadow-sm min-h-[700px] bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="card flex items-center justify-between p-4 sticky bottom-0">
        <p className="text-sm text-gray-400">Permohonan Izin Magang Industri</p>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Save className="w-4 h-4" />}>Save Draft</Button>
          <Button variant="primary" onClick={() => setShowSubmitConfirm(true)} icon={<Send className="w-4 h-4" />}>
            Kirim ke Verifikator
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmit}
        title="Kirim ke Verifikator?"
        message="Yakin kirim surat ini ke verifikator? Pastikan konten surat sudah benar."
        variant="primary"
        confirmText="Ya, Kirim"
        loading={isSubmitting}
      />
    </div>
  );
};

export default EditKonten;
