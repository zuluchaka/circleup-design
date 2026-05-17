import { MyProfilePage } from './components/MyProfilePage'

export default function MyProfilePagePreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MyProfilePage associationId="assoc-001" />
    </div>
  )
}
