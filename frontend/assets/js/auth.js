/**
 * Auth guard — dipanggil di setiap halaman yang butuh login
 * Mengembalikan Promise<user> atau redirect ke login
 */
async function requireLogin() {
  // Coba sampai 3x dengan jeda — antisipasi cookie belum tersimpan
  for (let i = 0; i < 3; i++) {
    try {
      const { user } = await Api.auth.me();
      return user;
    } catch {
      if (i < 2) await new Promise(r => setTimeout(r, 300));
    }
  }
  window.location.href = 'login.html';
  return null;
}
