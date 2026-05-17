// Design-OS stub for circleup's AuthContext.
// Provides a static "current user" so ported components render in previews
// without needing a real auth system.

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'member' | 'organizer' | 'admin' | 'president' | 'treasurer'
}

const STUB_USER: AuthUser = {
  id: 'user-001',
  name: 'Chukwuemeka Okonkwo',
  email: 'chukwuemeka@example.com',
  role: 'organizer',
}

export function useAuth() {
  return {
    user: STUB_USER,
    currentUser: STUB_USER,
    isAuthenticated: true,
    loading: false,
    login: async () => {},
    logout: async () => {},
  }
}
