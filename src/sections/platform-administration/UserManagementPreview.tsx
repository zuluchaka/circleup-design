import { UserManagement } from './components/UserManagement'

export default function UserManagementPreview() {
  return (
    <UserManagement
      onSearch={(query) => console.log('Search:', query)}
      onUserSelect={(userId) => console.log('Selected user:', userId)}
      onUserAction={(userId, action) => console.log('User action:', userId, action)}
    />
  )
}
