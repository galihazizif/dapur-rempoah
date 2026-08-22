import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-lime-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center">
            <Shield size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kebijakan Privasi</h1>
            <p className="text-sm text-slate-400 font-medium">Terakhir diperbarui: 16 Agustus 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed font-medium">
          <p>
            Selamat datang di <strong>Dapur Rempoah</strong>. Kami berkomitmen untuk melindungi dan menghormati privasi Anda. 
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat menggunakan layanan pemesanan makanan kami.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan beberapa jenis informasi untuk memberikan dan meningkatkan layanan pemesanan kepada Anda:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informasi Pemesanan & Kontak:</strong> Nama lengkap, nomor telepon (WhatsApp), dan alamat lengkap pengiriman yang Anda masukkan saat membuat pesanan.</li>
              <li><strong>Informasi Akun (Google Auth):</strong> Jika Anda masuk menggunakan Google Sign-In, kami mengumpulkan nama, alamat email, dan foto profil yang disediakan oleh Google.</li>
              <li><strong>Informasi Lokasi:</strong> Koordinat lokasi (latitude & longitude) yang Anda bagikan secara sukarela untuk menghitung estimasi jarak dan biaya pengiriman.</li>
              <li><strong>Bukti Pembayaran:</strong> Catatan transaksi atau bukti transfer berupa gambar yang Anda unggah pada halaman konfirmasi pembayaran.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Memproses, mengonfirmasi, dan mengantarkan pesanan makanan Anda.</li>
              <li>Menghitung ongkos kirim secara akurat sesuai lokasi pengiriman.</li>
              <li>Mengirimkan notifikasi status pesanan melalui WhatsApp atau pemberitahuan di situs.</li>
              <li>Verifikasi pembayaran dan pencegahan transaksi tidak sah atau kecurangan (bot protection).</li>
              <li>Meningkatkan kualitas layanan, pilihan menu, dan pengalaman pengguna di situs kami.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Keamanan Data & Perlindungan Bot</h2>
            <p>
              Kami mengimplementasikan langkah-langkah keamanan teknis untuk melindungi data pribadi Anda. 
              Layanan kami menggunakan <strong>Cloudflare Turnstile</strong> untuk perlindungan dari akses otomatis (bot) dan spam tanpa mengganggu privasi Anda. 
              Data pembayaran Anda tidak kami simpan dalam bentuk informasi kartu atau kredensial perbankan sensitif.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Pembagian Informasi Kepada Pihak Ketiga</h2>
            <p>
              Kami tidak menjual, menyewakan, atau memperdagangkan informasi pribadi Anda kepada pihak ketiga. 
              Informasi Anda hanya dibagikan kepada penyedia layanan terpercaya sebatas yang diperlukan untuk mengoperasikan layanan kami (seperti kurir pengiriman dan layanan pemberitahuan otomatis).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Hak Anda</h2>
            <p>Anda berhak untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Memeriksa dan memperbarui informasi profil akun Anda.</li>
              <li>Meminta penghapusan data pribadi Anda dari sistem kami dengan menghubungi layanan pelanggan kami.</li>
              <li>Menolak atau membatasi izin akses lokasi pada perangkat/peramban Anda.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan, saran, atau keluhan terkait Kebijakan Privasi ini, silakan hubungi kami melalui:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-1">
              <p><strong>Dapur Rempoah</strong></p>
              <p>Alamat: Babakan, Purbalingga, Jawa Tengah</p>
              <p>WhatsApp: <a href="https://wa.me/6285117054626" className="text-lime-600 underline font-bold">+62 851-1705-4626</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
