export const debugTokens = () => {
  console.group('Auth Debug Info');
  console.log('Access Token:', localStorage.getItem('accessToken'));
  console.log('Refresh Token:', localStorage.getItem('refreshToken'));
  console.log('User:', localStorage.getItem('user'));
  console.groupEnd();
};
