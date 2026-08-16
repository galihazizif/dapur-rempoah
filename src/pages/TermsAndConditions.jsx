import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TermsAndConditions() {
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
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <FileText size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Syarat & Ketentuan</h1>
            <p className="text-sm text-slate-400 font-medium">Terakhir diperbarui: 16 Agustus 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed font-medium">
          <p>
            Selamat datang di layanan <strong>Dapur Rempoah</strong>. Dengan mengakses, membuat pesanan, atau menggunakan platform kami, 
            Anda menyatakan setuju untuk terikat oleh Syarat & Ketentuan di bawah ini. Harap membaca ketentuan ini secara saksama sebelum bertransaksi.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Ketentuan Pemesanan</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pesanan dibuat melalui website resmi Dapur Rempoah atau melalui layanan resmi yang terhubung.</li>
              <li>Pelanggan wajib memberikan informasi nama, nomor telepon WhatsApp, dan alamat pengiriman yang benar dan akurat.</li>
              <li>Pemesanan hanya akan diproses setelah toko berstatus buka dan pesanan telah dikonfirmasi oleh sistem atau admin kami.</li>
              <li>Dapur Rempoah berhak menolak atau membatalkan pesanan jika stok menu habis, lokasi pengiriman di luar jangkauan, atau indikasi kecurangan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Layanan Pengiriman & Ambil Sendiri (Pickup)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pengiriman (Delivery):</strong> Layanan pengiriman berlaku untuk radius maksimum 10 km dari lokasi toko. Ongkos kirim dihitung berdasarkan jarak aktual.</li>
              <li><strong>Ambil Sendiri (Pickup):</strong> Pelanggan dapat mengambil pesanan secara langsung di toko sesuai dengan waktu dan tanggal yang telah ditentukan saat pemesanan.</li>
              <li>Keterlambatan pengiriman yang disebabkan oleh kondisi cuaca ekstrem, kemacetan lalu lintas berat, atau alamat yang tidak jelas di luar kendali wajar Dapur Rempoah.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Pembayaran & Konfirmasi</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pembayaran dilakukan melalui metode yang tersedia (seperti QRIS atau Transfer Bank).</li>
              <li>Untuk pembayaran nontunai/transfer, pelanggan dianjurkan mengunggah bukti pembayaran melalui fitur <em>Konfirmasi Pembayaran</em> agar pesanan segera diproses.</li>
              <li>Pesanan yang belum dibayar dalam batas waktu tertentu dapat dibatalkan secara otomatis oleh sistem.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Voucher & Diskon</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Voucher promo hanya berlaku untuk 1 (satu) kali penggunaan per transaksi sesuai dengan syarat dan masa berlaku voucher.</li>
              <li>Voucher tidak dapat ditukarkan dengan uang tunai atau digabungkan secara tidak sah.</li>
              <li>Dapur Rempoah berhak membatalkan diskon jika ditemukan penyalahgunaan kode voucher.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Pembatalan & Pengembalian Dana (Refund)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pesanan yang sudah masuk tahap pemrosesan/dapur tidak dapat dibatalkan oleh pelanggan.</li>
              <li>Jika terjadi kesalahan pesanan dari pihak kami atau makanan dalam kondisi tidak layak, silakan hubungi kami segera pada hari yang sama dengan melampirkan foto/video bukti untuk solusi penggantian atau refund.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Perubahan Syarat & Ketentuan</h2>
            <p>
              Dapur Rempoah berhak mengubah atau memperbarui Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan akan berlaku efektif setelah diunggah pada halaman ini.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Layanan Pelanggan</h2>
            <p>
              Apabila terdapat kendala terkait pesanan atau pertanyaan mengenai syarat ketentuan ini, Anda dapat menghubungi kami di:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-1">
              <p><strong>Dapur Rempoah</strong></p>
              <p>Alamat: Babakan RT 09 / RW 02, Purbalingga, Jawa Tengah</p>
              <p>WhatsApp: <a href="https://wa.me/6285117054626" className="text-lime-600 underline font-bold">+62 851-1705-4626</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
