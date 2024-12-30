import { UserData } from './UserData';

export interface TicketData {
  id: number | null;
  name: string | '';
  description: string | null;
  status: string | '';
  assignedUserId: number | null;
  assignedUser: UserData | null;
}
