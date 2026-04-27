import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Send, CreditCard, Calendar, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { clsx } from 'clsx';

export function PaymentConfirmation() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    order_reference: hash || '',
    amount_paid: '',
    notes: '',
    payment_date: new Date().toISOString().split('T')[0]
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (1MB)
    if (file.size > 1024 * 1024) {
      setError('Ukuran gambar maksimal 1MB');
      e.target.value = null;
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      e.target.value = null;
      return;
    }

    setError(null);
    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError('Silakan lengkapi verifikasi keamanan (Turnstile)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('order_reference', formData.order_reference);
      formDataToSend.append('amount_paid', formData.amount_paid);
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('payment_date', formData.payment_date);
      formDataToSend.append('turnstileToken', turnstileToken);
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch(`${apiUrl}/payment-confirmations`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/orders/${hash || formData.order_reference}`);
        }, 3000);
      } else {
        setError(data.message || 'Gagal mengirim konfirmasi pembayaran');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Konfirmasi Terkirim!</h1>
        <p className="text-slate-500 mb-8 font-medium">Terima kasih. Kami akan segera membagikan status pembayaran Anda setelah diverifikasi.</p>
        <p className="text-sm text-slate-400">Pindah ke detail pesanan dalam beberapa detik...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link 
        to={hash ? `/orders/${hash}` : '/'} 
        className="inline-flex items-center text-slate-500 hover:text-violet-600 transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Kembali
      </Link>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
              <CreditCard size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Konfirmasi Pembayaran</h1>
          </div>
          <p className="text-slate-500 text-sm">Silakan isi formulir di bawah ini untuk mengonfirmasi pembayaran Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Referensi Pesanan (ID atau Hash)</label>
              <div className="relative group">
                <input 
                  required
                  readOnly={!!hash}
                  type="text" 
                  className={clsx(
                    "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300",
                    hash && "bg-slate-100 cursor-not-allowed opacity-75"
                  )}
                  placeholder="Contoh: ord-123-abc"
                  value={formData.order_reference}
                  onChange={(e) => setFormData({...formData, order_reference: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Jumlah yang Dibayar (Rp)</label>
                <div className="relative">
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900"
                    placeholder="Contoh: 50000"
                    value={formData.amount_paid}
                    onChange={(e) => setFormData({...formData, amount_paid: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tanggal Bayar</label>
                <div className="relative">
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-slate-900"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Unggah Bukti Pembayaran (Maks 1MB)</label>
              <div className="space-y-4">
                <div className="relative group">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label 
                    htmlFor="payment-proof"
                    className="flex flex-col items-center justify-center w-full min-h-[120px] px-6 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all group"
                  >
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <p className="text-white text-xs font-bold px-3 py-1.5 bg-violet-600 rounded-lg">Ganti Gambar</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-violet-500 group-hover:scale-110 transition-all mb-3 border border-slate-100">
                          <CreditCard size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-600">Klik untuk pilih gambar</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG atau JPEG (Maks. 1MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Catatan Tambahan (Opsional)</label>
              <div className="relative">
                <MessageSquare className="absolute right-4 top-4 text-slate-400" size={18} />
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-violet-500 outline-none transition-all font-medium text-slate-700 resize-none min-h-[100px]"
                  placeholder="Misal: Pembayaran via Bank BCA a/n Budi"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-4">
            <Turnstile 
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
              onSuccess={(token) => setTurnstileToken(token)}
            />
            
            <button 
              disabled={loading}
              type="submit"
              className={clsx(
                "w-full px-8 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 shadow-lg",
                loading ? "bg-slate-400" : "bg-violet-600 hover:bg-violet-700 shadow-violet-200"
              )}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send size={20} />
                  Kirim Konfirmasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
