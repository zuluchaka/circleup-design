import data from '@/../product/sections/community-and-social/data.json'
import { BadgeGallery } from './components/BadgeGallery'

export default function BadgeGalleryPreview() {
  return (
    <BadgeGallery
      badges={data.badges as any}
      userBadges={data.userBadges as any}
      badgeProgress={data.badgeProgress as any}
      onShareBadge={(id) => console.log('Share badge:', id)}
      onViewBadge={(id) => console.log('View badge:', id)}
    />
  )
}
