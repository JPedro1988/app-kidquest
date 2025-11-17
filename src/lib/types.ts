// KidQuest - Types
export type ProfileType = 'parent' | 'child';

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'pending' | 'completed' | 'approved';
  createdAt: Date;
  completedAt?: Date;
  approvedAt?: Date;
  photoProof?: string;
  childId?: string;
  category?: string;
  dueDate?: Date; // Data de objetivo da tarefa
  rewardId?: string; // ID da recompensa associada
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
  claimed: boolean;
  claimedAt?: Date;
  category?: 'small' | 'medium' | 'large' | 'epic';
  expiresAt?: Date; // Data de validade da recompensa
}

export interface Child {
  id: string;
  name: string;
  avatar?: string;
  totalPoints: number;
  currentPoints: number;
  age?: number;
}

export interface AppState {
  profile: ProfileType | null;
  selectedChild: Child | null;
  children: Child[];
  tasks: Task[];
  rewards: Reward[];
}

// Suggestion Types
export interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  ageRange: string;
}

export interface RewardSuggestion {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: 'small' | 'medium' | 'large' | 'epic';
}

export interface TaskPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  tasks: Omit<TaskSuggestion, 'id' | 'ageRange'>[];
}
