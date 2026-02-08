import { adminService } from '@/services/adminService'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  // The Admin component itself handles authentication internally
  // by showing the login form when not authenticated
  // So we just render the children (Admin component) directly
  return <>{children}</>
}