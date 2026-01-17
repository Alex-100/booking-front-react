import * as jose from 'jose'

interface AuthUser {
  username: string
  roles: string[]
}

export const useAuth = () => {
  const cookies = document.cookie;
  const accessToken = cookies.match(/accessToken=([^;]+)/);
  const refreshToken = cookies.match(/refreshToken=([^;]+)/);
  const auth = refreshToken !== null && accessToken !== null;

  if (!auth) {
    return {
      user: {
        username: '',
        roles: [''],
      },
      check(...roles: string[]) {
        return !!roles
      },
      logout() { },
    }
  }

  var aToken = '{}';
  if (accessToken) {
    aToken = accessToken[1];
  }
  const jwt = jose.decodeJwt(
    aToken
  )

  const user: AuthUser = {
    username: jwt.sub as string,
    roles: jwt.roles as string[],
  }

  const check = (...roles: string[]): boolean => {
    return roles.some((role) => user.roles.includes(role))
  }

  const logout = () => {
    location.href = '/signin'
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "hospital=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "department=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  return {
    user,
    check,
    logout,
  }
}
