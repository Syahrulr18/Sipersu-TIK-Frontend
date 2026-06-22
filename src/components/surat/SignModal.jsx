import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';
import { uploadTtd } from '@/api/auth.api';
import toast from 'react-hot-toast';
import { Loader2, Camera, AlertTriangle } from 'lucide-react';

const SignModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleTtdChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran tanda tangan maksimal 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('ttd', file);

    setIsUploading(true);
    try {
      const res = await uploadTtd(formData);
      toast.success('Tanda tangan berhasil diupload');
      updateUser({ ttd_url: res.data.ttd_url });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah tanda tangan');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tanda Tangan & Terbitkan Surat"
      size="md"
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={onClose} disabled={loading || isUploading} fullWidth>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            loading={loading}
            disabled={!user?.ttd_url || isUploading}
            fullWidth
          >
            Ya, Tanda Tangan
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pb-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-red-100 text-[#8B0000]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm text-gray-500 text-center mb-4">
          Surat akan resmi diterbitkan dengan nomor surat. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">Tanda Tangan Elektronik Anda</h3>
          
          <div className="flex flex-col items-center gap-3">
            {user?.ttd_url ? (
              <img 
                src={user.ttd_url} 
                alt="Tanda Tangan" 
                className="h-24 w-auto object-contain border border-gray-200 bg-white p-2 rounded-lg" 
              />
            ) : (
              <div className="w-full h-24 bg-white border-2 border-dashed border-red-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <span className="text-xs text-gray-600">Belum ada tanda tangan</span>
                <span className="text-[10px] text-red-500 mt-1 font-medium">Harap upload untuk menandatangani surat</span>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleTtdChange}
              accept=".png"
              className="hidden"
            />
            <Button 
              size="sm" 
              variant="outline" 
              icon={isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {user?.ttd_url ? 'Ubah Tanda Tangan' : 'Upload Tanda Tangan (PNG)'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignModal;
