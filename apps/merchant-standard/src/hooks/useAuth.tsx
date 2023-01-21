export default function useAuth() {
  function getUserLoggedIn() {
    return true;
  }

  return {
    getUserLoggedIn,
  };
}
