/**
 * Parser email notifikasi Krom Bank
 *
 * Krom Bank mengirim email notifikasi transaksi dengan format seperti:
 * - "Transaksi Debit sebesar Rp50.000 di MERCHANT_NAME"
 * - "Pembayaran berhasil Rp 150.000 ke MERCHANT"
 * - "Top Up Krom Pay Rp 500.000 berhasil"
 *
 * NOTE: Format email Krom Bank bisa berubah. Jika ada transaksi yang
 * tidak ter-parse, kirim contoh email ke developer untuk update parser.
 */

function parseKromEmail(body, messageData) {
  if (!body) return null;

  const text = body.toLowerCase();

  // Pastikan ini email dari Krom Bank
  const isKrom = (
    text.includes('krom') ||
    text.includes('krom bank') ||
    text.includes('krom pay') ||
    (messageData?.payload?.headers || []).some(h =>
      h.name.toLowerCase() === 'from' &&
      (h.value.toLowerCase().includes('krom') || h.value.toLowerCase().includes('@krom.id'))
    )
  );
  if (!isKrom) return null;

  // ── Ekstrak nominal ──────────────────────────────────────
  // Pola: Rp50.000 / Rp 50.000 / Rp50,000 / IDR 50000
  const amountPatterns = [
    /rp\.?\s*([\d.,]+)/i,
    /idr\.?\s*([\d.,]+)/i,
    /sebesar\s+rp\.?\s*([\d.,]+)/i,
    /nominal\s+rp\.?\s*([\d.,]+)/i,
  ];

  let amount = null;
  for (const pattern of amountPatterns) {
    const match = body.match(pattern);
    if (match) {
      // Bersihkan: hapus titik ribuan, ganti koma desimal
      const raw = match[1].replace(/\./g, '').replace(/,/g, '');
      amount = parseInt(raw, 10);
      if (!isNaN(amount) && amount > 0) break;
    }
  }
  if (!amount) return null;

  // ── Tentukan tipe transaksi ──────────────────────────────
  const expenseKeywords = [
    'debit', 'pembayaran', 'belanja', 'transfer keluar',
    'penarikan', 'tarik tunai', 'pembelian', 'bayar',
    'pengeluaran', 'charged', 'payment',
  ];
  const incomeKeywords = [
    'kredit', 'top up', 'topup', 'transfer masuk', 'terima',
    'penerimaan', 'masuk', 'received', 'credit', 'refund',
    'pengembalian', 'cashback',
  ];

  let type = null;
  for (const kw of expenseKeywords) {
    if (text.includes(kw)) { type = 'expense'; break; }
  }
  if (!type) {
    for (const kw of incomeKeywords) {
      if (text.includes(kw)) { type = 'income'; break; }
    }
  }
  if (!type) return null; // Tidak bisa tentukan tipe

  // ── Tentukan kategori ────────────────────────────────────
  const category = guessCategory(text, type);

  // ── Ekstrak merchant/keterangan ──────────────────────────
  const note = extractNote(body, type);

  // ── Ekstrak tanggal ──────────────────────────────────────
  const date = extractDate(body, messageData);

  return { type, amount, category, note, date };
}

function guessCategory(text, type) {
  if (type === 'income') {
    if (text.includes('gaji') || text.includes('salary'))    return 'Gaji / Pendapatan';
    if (text.includes('top up') || text.includes('topup'))   return 'Top Up';
    if (text.includes('refund') || text.includes('kembali')) return 'Refund / Cashback';
    if (text.includes('investasi') || text.includes('invest')) return 'Investasi';
    return 'Gaji / Pendapatan';
  }

  // expense
  if (text.includes('makan') || text.includes('resto') || text.includes('food') ||
      text.includes('kfc') || text.includes('mcd') || text.includes('grab food') ||
      text.includes('gofood') || text.includes('shopee food'))
    return 'Makanan & Minuman';

  if (text.includes('gojek') || text.includes('grab') || text.includes('ojek') ||
      text.includes('transjakarta') || text.includes('commuter') || text.includes('bensin') ||
      text.includes('parkir') || text.includes('toll') || text.includes('tol'))
    return 'Transportasi';

  if (text.includes('shopee') || text.includes('tokopedia') || text.includes('lazada') ||
      text.includes('indomaret') || text.includes('alfamart') || text.includes('belanja'))
    return 'Belanja';

  if (text.includes('listrik') || text.includes('pln') || text.includes('air') ||
      text.includes('pdam') || text.includes('internet') || text.includes('wifi') ||
      text.includes('telkom') || text.includes('indihome'))
    return 'Tagihan & Utilitas';

  if (text.includes('transfer'))
    return 'Transfer';

  return 'Lainnya';
}

function extractNote(body, type) {
  // Coba ekstrak nama merchant dari berbagai pola
  const patterns = [
    /di\s+([A-Z][A-Z0-9\s\-&.]{2,40})/,
    /ke\s+([A-Z][A-Z0-9\s\-&.]{2,40})/,
    /dari\s+([A-Z][A-Z0-9\s\-&.]{2,40})/,
    /merchant[:\s]+([A-Z][A-Z0-9\s\-&.]{2,40})/i,
    /toko[:\s]+([A-Z][A-Z0-9\s\-&.]{2,40})/i,
  ];

  for (const p of patterns) {
    const m = body.match(p);
    if (m) {
      const note = m[1].trim().replace(/\s+/g, ' ');
      if (note.length > 2) return note;
    }
  }

  return type === 'income' ? 'Transfer Masuk' : 'Transaksi Krom Bank';
}

function extractDate(body, messageData) {
  // Coba dari header email (paling akurat)
  const headers = messageData?.payload?.headers || [];
  const dateHeader = headers.find(h => h.name.toLowerCase() === 'date');
  if (dateHeader) {
    const d = new Date(dateHeader.value);
    if (!isNaN(d)) return d.toISOString().split('T')[0];
  }

  // Coba dari body email
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    /(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/i,
  ];

  const MONTHS = {
    januari:1, februari:2, maret:3, april:4, mei:5, juni:6,
    juli:7, agustus:8, september:9, oktober:10, november:11, desember:12
  };

  for (const p of datePatterns) {
    const m = body.match(p);
    if (m) {
      let d;
      if (MONTHS[m[2]?.toLowerCase()]) {
        d = new Date(parseInt(m[3]), MONTHS[m[2].toLowerCase()] - 1, parseInt(m[1]));
      } else if (m[1].length === 4) {
        d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
      } else {
        d = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
      }
      if (!isNaN(d)) return d.toISOString().split('T')[0];
    }
  }

  // Fallback: hari ini
  return new Date().toISOString().split('T')[0];
}

module.exports = { parseKromEmail };
