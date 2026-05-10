/**
 * Auth guard — JWT based
 * Token disimpan di localStorage, tidak bergantung pada cookie
 */
async function requireLogin() {
  const token = Api.getToken();
  if (!token) {
    window.location.href = 'login.html';
    return null;
  }
  try {
    const { user } = await Api.auth.me();
    return user;
  } catch (err) {
    // Hanya hapus token dan redirect jika backend eksplisit bilang Unauthorized
    // Jika network error (misal Railway lagi restart), jangan hapus token agar user tidak ter-logout paksa
    if (err.message.includes('401') || err.message.includes('403') || err.message.includes('Unauthorized') || err.message.includes('Token tidak valid')) {
      console.warn('Auth check failed:', err.message);
      Api.clearToken();
      window.location.href = 'login.html';
    } else {
      console.error('Network or server error during auth check:', err.message);
      // Optional: beri tau user lewat UI bahwa sedang gangguan koneksi
    }
    return null;
  }
}
