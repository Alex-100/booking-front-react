import * as jose from 'jose'

interface AuthUser {
  username: string
  roles: string[]
}

export const useAuth = () => {
  if (!localStorage.getItem('auth')) {
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

  const jwt = jose.decodeJwt(
    JSON.parse(localStorage.getItem('auth') || '{}').access_token
  )

  const user: AuthUser = {
    username: jwt.sub as string,
    roles: jwt.roles as string[],
  }

  const check = (...roles: string[]): boolean => {
    return roles.some((role) => user.roles.includes(role))
  }

  const logout = () => {
    localStorage.removeItem('auth')
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
