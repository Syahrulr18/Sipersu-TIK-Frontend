import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, RotateCcw } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import GroupedSelect from '@/components/ui/GroupedSelect';
import FileUpload from '@/components/ui/FileUpload';
import SearchMultiSelect from '@/components/shared/SearchMultiSelect';
import Button from '@/components/ui/Button';

const suratSchema = z.object({
  penanda_tangan_id: z.string().min(1, 'Pilih penanda tangan'),
  verifikator_id: z.string().min(1, 'Pilih verifikator'),
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

/**
 * ModalTambahSurat — 2-column form for creating new surat.
 */
const ModalTambahSurat = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [penerima, setPenerima] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register, handleSubmit, control, reset, watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(suratSchema),
    defaultValues: {
      penanda_tangan_id: '', verifikator_id: '',
      kode_hal: '', hal: '', ringkasan: '',
    },
  });

  const halValue = watch('hal') || '';

  const handleSearchDosen = async (query) => {
    const demoResults = [
      { id: 10, nama_lengkap: 'Dr. Andi Pratama, M.Kom', jabatan: 'Dosen Tetap' },
      { id: 11, nama_lengkap: 'Ir. Fatimah Zahra, M.T.', jabatan: 'Dosen Tetap' },
      { id: 12, nama_lengkap: 'Muh. Rizky Aditya, S.Kom., M.Cs.', jabatan: 'Dosen Tetap' },
    ].filter((d) => d.nama_lengkap.toLowerCase().includes(query.toLowerCase()));
    return demoResults;
  };

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
    setPenerima([]);
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
          <SearchMultiSelect
            label="Tujuan / Kepada"
            selected={penerima}
            onChange={setPenerima}
            onSearch={handleSearchDosen}
            placeholder="Cari Dosen..."
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
