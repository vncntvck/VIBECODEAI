/**
 * Auth guard — dipanggil di setiap halaman yang butuh login
 * Mengembalikan Promise<user> atau redirect ke login
 */
async function requireLogin() {
  try {
    const { user } = await Api.auth.me();
    return user;
  } catch {
    window.location.href = 'login.html';
    return null;
  }
}
