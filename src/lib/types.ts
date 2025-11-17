export type ProfileType = 'parent' | 'child' | null;

export interface Child {
  id: string;
  name: string;
  age?: number;
  avatar?: string;
  totalPoints: number;
  currentPoints: number;
}

export type TaskStatus = 'pending' | 'completed' | 'approved' | 'rejected';
export type ChallengeType = 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  status: TaskStatus;
  createdAt: Date;
  childId: string;
  isRecurring?: boolean;
  challengeType?: ChallengeType; // Novo campo para tipo de desafio
  dueDate?: Date;
  completedAt?: Date;
  photoProof?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  claimed: boolean;
  claimedBy?: string;
  claimedAt?: Date;
  paid?: boolean;
  expiresAt?: Date;
}

export interface AppState {
  profile: ProfileType;
  selectedChild: Child | null;
  children: Child[];
  tasks: Task[];
  rewards: Reward[];
}
