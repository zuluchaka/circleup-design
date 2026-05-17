import { AnnouncementsDashboard } from './components/AnnouncementsDashboard'
import data from '@/../product/sections/associations/data.json'

export default function AnnouncementsDashboardPreview() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AnnouncementsDashboard
        announcements={data.announcements || []}
        isOrganizer={true}
        onCreateAnnouncement={() => console.log('Create')}
        onEditAnnouncement={(id: string) => console.log('Edit:', id)}
        onDeleteAnnouncement={(id: string) => console.log('Delete:', id)}
      />
    </div>
  )
}
