import type { DisplayStatus } from '../../types/invoice'
import { Badge } from './StatusBadge.styled'

interface StatusBadgeProp {
  status: DisplayStatus
}

export const StatusBadge = ({ status }: StatusBadgeProp) => <Badge $status={status}>{status}</Badge>
