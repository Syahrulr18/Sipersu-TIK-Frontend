import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchSelect from '@/components/ui/SearchSelect';
import Textarea from '@/components/ui/Textarea';
import GroupedSelect from '@/components/ui/GroupedSelect';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { useCreateSurat } from '@/hooks/useSurat';
import { getPenandaTangan, getVerifikator } from '@/api/master.api';

const suratSchema = z.object({
  penanda_tangan_id: z.string().min(1, 'Pilih penanda tangan'),
  verifikator_id: z.string().min(1, 'Pilih verifikator'),
  tujuan_dosen_id: z.array(z.string()).min(1, 'Pilih minimal 1 tujuan dosen'),
  kode_hal: z.string().min(1, 'Pilih kode hal'),
  hal: z.string().min(3, 'Minimal 3 karakter').max(500, 'Maksimal 500 karakter'),
  ringkasan: z.string().min(10, 'Minimal 10 karakter'),
});

/**
 * ModalTambahSurat — 2-column form for creating new surat.
 * Data penanda tangan, verifikator, dosen, dan kode hal diambil dari API.
 */
const ModalTambahSurat = ({ isOpen, onClose, initialData }) => {
  const [files, setFiles] = useState([]);
  const [tujuanDosen, setTujuanDosen] = useState([]);

  const createSurat = useCreateSurat();

  // Fetch penanda tangan dari API
  const { data: penandaTanganData } = useQuery({
    queryKey: ['penanda-tangan'],
    queryFn: () => getPenandaTangan().then((r) => r.data?.data || []),
    enabled: isOpen,
  });

  // Fetch verifikator dari API
  const { data: verifikatorData } = useQuery({
    queryKey: ['verifikator'],
    queryFn: () => getVerifikator().then((r) => r.data?.data || []),
    enabled: isOpen,
  });

  // Format untuk Select component: { value: 'id', label: 'nama — jabatan' }
  const penandaTanganOptions = (penandaTanganData || []).map((u) => ({
    value: String(u.id),
    label: `${u.nama_lengkap}${u.jabatan ? ` — ${u.jabatan}` : ''}`,
  }));

  const verifikatorOptions = (verifikatorData || []).map((u) => ({
    value: String(u.id),
    label: `${u.nama_lengkap}${u.jabatan ? ` — ${u.jabatan}` : ''}`,
  }));

  const {
    register, handleSubmit, control, reset, watch, setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(suratSchema),
    defaultValues: {
      penanda_tangan_id: '', verifikator_id: '', tujuan_dosen_id: [],
      kode_hal: '', hal: initialData?.hal || '', ringkasan: initialData?.ringkasan || '',
    },
  });

  const halValue = watch('hal') || '';

  // Auto-populate dari data Word upload
  useEffect(() => {
    if (initialData && isOpen) {
      setValue('hal', initialData.hal || '');
      setValue('ringkasan', initialData.ringkasan || '');
      
      if (initialData.penanda_tangan_id) {
        setValue('penanda_tangan_id', initialData.penanda_tangan_id);
      }
      if (initialData.verifikator_id) {
        setValue('verifikator_id', initialData.verifikator_id);
      }
      if (initialData.kode_hal) {
        setValue('kode_hal', initialData.kode_hal);
      }
      
      if (initialData.tujuan_dosen_list && initialData.tujuan_dosen_list.length > 0) {
        setTujuanDosen(initialData.tujuan_dosen_list);
      } else if (initialData.tujuan_dosen_id) {
        setTujuanDosen([{ id: initialData.tujuan_dosen_id, nama_lengkap: initialData.tujuan }]);
      }
      
      // Kosongkan lampiran saat upload Word (file Word bukan lampiran)
      setFiles([]);
    } else if (!isOpen) {
      // Reset files when closed
      setFiles([]);
      setTujuanDosen([]);
    }
  }, [initialData, isOpen, setValue]);

  // Sync tujuan dosen ke form
  useEffect(() => {
    if (tujuanDosen && tujuanDosen.length > 0) {
      setValue('tujuan_dosen_id', tujuanDosen.map(d => String(d.id)));
    } else {
      setValue('tujuan_dosen_id', '');
    }
  }, [tujuanDosen, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(val => formData.append(`${k}[]`, val));
      } else {
        formData.append(k, v);
      }
    });
    files.forEach((file) => formData.append('lampiran[]', file));
    createSurat.mutate(formData, {
      onSuccess: () => {
        handleReset();
        onClose();
      },
    });
  };

  const handleReset = () => {
    reset({
      penanda_tangan_id: '', verifikator_id: '', tujuan_dosen_id: '',
      kode_hal: '', hal: '', ringkasan: '',
    });
    setFiles([]);
    setTujuanDosen([]);
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
        Reset
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit(onSubmit)}
        loading={createSurat.isPending}
        icon={<Save className="w-4 h-4" />}
      >
        Save Draft
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Surat Baru" size="xl" footer={footer}>
      {initialData && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <span className="text-green-700 text-xs font-semibold flex-shrink-0 mt-0.5">✓</span>
          <div className="text-xs text-green-700">
            <p className="font-semibold">Data dari Upload Word</p>
            <p className="mt-0.5">Perihal dan ringkasan sudah otomatis terisi.</p>
          </div>
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <Select
            label="Penanda Tangan"
            placeholder="Pilih Penanda Tangan..."
            options={penandaTanganOptions}
            error={errors.penanda_tangan_id?.message}
            {...register('penanda_tangan_id')}
          />
          <Select
            label="Verifikator"
            placeholder="Pilih Verifikator..."
            options={verifikatorOptions}
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
                isMulti={true}
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
