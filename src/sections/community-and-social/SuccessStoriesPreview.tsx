import data from '@/../product/sections/community-and-social/data.json'
import { SuccessStories } from './components/SuccessStories'

export default function SuccessStoriesPreview() {
  return (
    <SuccessStories
      stories={data.successStories as any}
      onSubmitStory={() => console.log('Submit story')}
      onLikeStory={(id) => console.log('Like story:', id)}
      onShareStory={(id) => console.log('Share story:', id)}
      onViewStory={(id) => console.log('View story:', id)}
      onFilterCategory={(category) => console.log('Filter category:', category)}
    />
  )
}
