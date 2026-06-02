import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, RotateCcw } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchSelect from '@/components/ui/SearchSelect';
import Textarea from '@/components/ui/Textarea';
import GroupedSelect from '@/components/ui/GroupedSelect';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';

const suratSchema = z.object({
  penanda_tangan_id: z.string().min(1, 'Pilih penanda tangan'),
  verifikator_id: z.string().min(1, 'Pilih verifikator'),
  tujuan_dosen_id: z.string().min(1, 'Pilih tujuan dosen'),
  kode_hal: z.string().min(1, 'Pilih kode hal'),
  hal: z.string().min(3, 'Minimal 3 karakter').max(500, 'Maksimal 500 karakter'),
  ringkasan: z.string().min(10, 'Minimal 10 karakter'),
});

const demoPenandaTangan = [
  { value: '1', label: 'Prof. Budi Santoso, S.T., M.Kom — Ketua Jurusan' },
  { value: '2', label: 'Dr. Ahmad Wahyudi, M.T. — Wakil Ketua Jurusan' },
];

const demoVerifikator = [
  { value: '1', label: 'Dr. Ahmad Verifikator — Sekretaris Jurusan' },
  { value: '2', label: 'Ir. Siti Rahayu, M.T. — Koordinator Prodi' },
];

// Demo data dosen (same as SearchSelect.DOSEN_LIST for consistency)
const demoDosen = [
  { id: 10, nama_lengkap: 'Dr. Andi Pratama, M.Kom', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 11, nama_lengkap: 'Ir. Fatimah Zahra, M.T.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 12, nama_lengkap: 'Muh. Rizky Aditya, S.Kom., M.Cs.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 13, nama_lengkap: 'Dr. Siti Nurhaliza, M.T.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 14, nama_lengkap: 'Ir. Budi Handoko, M.Eng.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 15, nama_lengkap: 'Prof. Ahmad Mulyanto, Ph.D.', jabatan: 'Dosen Tetap', status: 'Dosen Tetap' },
  { id: 20, nama_lengkap: 'Bambang Suryanto, S.T.', jabatan: 'Dosen Honorer', status: 'Dosen Honorer' },
  { id: 21, nama_lengkap: 'Dewi Lestari, S.Kom.', jabatan: 'Dosen Honorer', status: 'Dosen Honorer' },
];

/**
 * Helper function: find matching dosen by tujuan text
 * Tries to match extracted tujuan text with dosen in demoDosen list
 */
const findDosenByName = (tujuanText) => {
  if (!tujuanText || typeof tujuanText !== 'string') return null;
  
  const searchText = tujuanText.toLowerCase().trim();
  
  // Exact match on full name
  let match = demoDosen.find(d => d.nama_lengkap.toLowerCase() === searchText);
  if (match) return match;
  
  // Partial match: check if any part of dosen name is in tujuan text
  match = demoDosen.find(d => 
    searchText.includes(d.nama_lengkap.toLowerCase()) ||
    d.nama_lengkap.toLowerCase().includes(searchText)
  );
  
  return match || null;
};

/**
 * ModalTambahSurat — 2-column form for creating new surat.
 * Bisa menerima initialData dari upload Word
 */
const ModalTambahSurat = ({ isOpen, onClose, initialData }) => {
  const [files, setFiles] = useState([]);
  const [tujuanDosen, setTujuanDosen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register, handleSubmit, control, reset, watch, setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(suratSchema),
    defaultValues: {
      penanda_tangan_id: '', verifikator_id: '', tujuan_dosen_id: '',
      kode_hal: '', hal: initialData?.hal || '', ringkasan: initialData?.ringkasan || '',
    },
  });

  const halValue = watch('hal') || '';

  // Auto-populate form dari data Word upload
  useEffect(() => {
    if (initialData && isOpen) {
      setValue('hal', initialData.hal || '');
      setValue('ringkasan', initialData.ringkasan || '');
      
      // Auto-populate tujuan dosen jika ada di extracted data
      if (initialData.tujuan) {
        const matchedDosen = findDosenByName(initialData.tujuan);
        if (matchedDosen) {
          setTujuanDosen(matchedDosen);
          setValue('tujuan_dosen_id', String(matchedDosen.id));
        }
      }
    }
  }, [initialData, isOpen, setValue]);

  // Update form saat tujuan dosen berubah
  useEffect(() => {
    if (tujuanDosen?.id) {
      setValue('tujuan_dosen_id', String(tujuanDosen.id));
    }
  }, [tujuanDosen, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleReset();
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    reset();
    setFiles([]);
    setTujuanDosen(null);
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
        Reset
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit(onSubmit)}
        loading={isSubmitting}
        icon={<Save className="w-4 h-4" />}
      >
        Save Draft
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Surat Baru" size="xl" footer={footer}>
      {/* Info Box jika data dari Word */}
      {initialData && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <span className="text-green-700 text-xs font-semibold flex-shrink-0 mt-0.5">✓</span>
          <div className="text-xs text-green-700">
            <p className="font-semibold">Data dari Upload Word</p>
            <p className="mt-0.5">
              Perihal, ringkasan, dan tujuan sudah otomatis terisi. {!tujuanDosen && 'Silakan lengkapi field yang masih kosong.'}
            </p>
          </div>
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <Select
            label="Penanda Tangan"
            placeholder="Pilih Penanda Tangan..."
            options={demoPenandaTangan}
            error={errors.penanda_tangan_id?.message}
            {...register('penanda_tangan_id')}
          />
          <Select
            label="Verifikator"
            placeholder="Pilih Verifikator..."
            options={demoVerifikator}
            error={errors.verifikator_id?.message}
            {...register('verifikator_id')}
          />
          <Controller
            name="tujuan_dosen_id"
            control={control}
            render={() => (
              <SearchSelect
                label="Tujuan / Kepada"
                selected={tujuanDosen}
                onChange={setTujuanDosen}
                error={errors.tujuan_dosen_id?.message}
                placeholder="Cari Dosen..."
              />
            )}
          />
          <Controller
            name="kode_hal"
            control={control}
            render={({ field }) => (
              <GroupedSelect
                label="Kode Hal"
                value={field.value}
                onChange={field.onChange}
                error={errors.kode_hal?.message}
                placeholder="Pilih Kode Hal..."
              />
            )}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          <div>
            <Input
              label="Hal / Perihal"
              placeholder="Masukkan perihal..."
              maxLength={500}
              error={errors.hal?.message}
              {...register('hal')}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">{halValue.length}/500</span>
            </div>
          </div>
          <Controller
            name="ringkasan"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Isi / Ringkasan"
                placeholder="Tulis ringkasan surat..."
                rows={5}
                error={errors.ringkasan?.message}
                {...field}
              />
            )}
          />
          <div>
            <label className="label-field">Lampiran (Opsional)</label>
            <FileUpload files={files} onChange={setFiles} />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalTambahSurat;
