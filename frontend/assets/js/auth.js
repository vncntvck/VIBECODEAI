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
  } catch {
    Api.clearToken();
    window.location.href = 'login.html';
    return null;
  }
}
