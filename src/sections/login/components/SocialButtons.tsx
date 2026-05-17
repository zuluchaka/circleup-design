interface SocialButtonsProps {
  onGoogle?: () => void
  onApple?: () => void
  label?: 'sign_in' | 'sign_up'
}

export function SocialButtons({ onGoogle, onApple, label = 'sign_in' }: SocialButtonsProps) {
  const text = label === 'sign_in' ? 'Continue with' : 'Sign up with'

  return (
    <div className="space-y-3">
      <button
        onClick={() => onGoogle?.()}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-[0.98]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        {text} Google
      </button>

      <button
        onClick={() => onApple?.()}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 dark:bg-white border border-slate-900 dark:border-white rounded-xl text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.98]"
      >
        <svg width="16" height="18" viewBox="0 0 16 20" fill="currentColor">
          <path d="M13.182 10.55c-.023-2.396 1.957-3.547 2.045-3.604-1.113-1.628-2.847-1.851-3.464-1.877-1.474-.15-2.878.868-3.626.868-.747 0-1.904-.846-3.128-.823C3.428 5.14 1.972 5.96 1.162 7.282c-1.632 2.83-.418 7.023 1.173 9.322.778 1.126 1.706 2.39 2.926 2.345 1.173-.047 1.617-.759 3.035-.759s1.816.759 3.058.735c1.264-.023 2.067-1.148 2.84-2.279.895-1.306 1.264-2.57 1.287-2.635-.028-.012-2.47-.948-2.498-3.762l.199.1zM10.875 3.541c.647-.783 1.083-1.872.964-2.956-.931.038-2.06.62-2.729 1.403-.599.694-1.125 1.802-.984 2.865 1.04.082 2.1-.527 2.749-1.312z" />
        </svg>
        {text} Apple
      </button>
    </div>
  )
}
