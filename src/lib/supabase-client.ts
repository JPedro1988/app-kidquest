import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Usar service_role key para bypass RLS em desenvolvimento
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Tipos para o banco de dados
export type DbParent = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type DbChild = {
  id: string;
  parent_id: string;
  name: string;
  age: number | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DbTask = {
  id: string;
  child_id: string;
  title: string;
  description: string | null;
  points: number;
  status: 'pending' | 'completed' | 'approved' | 'rejected' | 'expired';
  is_recurring: boolean;
  recurrence_type: 'daily' | 'weekly' | 'monthly' | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbReward = {
  id: string;
  parent_id: string;
  title: string;
  description: string | null;
  points_required: number;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbRewardRedemption = {
  id: string;
  child_id: string;
  reward_id: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'rejected';
  redeemed_at: string;
  approved_at: string | null;
  created_at: string;
};

// Funções auxiliares para calcular pontos das crianças
export async function calculateChildPoints(childId: string) {
  // Buscar todas as tarefas aprovadas da criança
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('points')
    .eq('child_id', childId)
    .eq('status', 'approved');

  if (error) {
    console.error('Erro ao calcular pontos:', error);
    return { totalPoints: 0, currentPoints: 0 };
  }

  const totalPoints = tasks?.reduce((sum, task) => sum + task.points, 0) || 0;

  // Buscar pontos gastos em recompensas
  const { data: redemptions, error: redemptionsError } = await supabase
    .from('reward_redemptions')
    .select('points_spent')
    .eq('child_id', childId)
    .eq('status', 'approved');

  if (redemptionsError) {
    console.error('Erro ao calcular pontos gastos:', redemptionsError);
    return { totalPoints, currentPoints: totalPoints };
  }

  const pointsSpent = redemptions?.reduce((sum, r) => sum + r.points_spent, 0) || 0;
  const currentPoints = totalPoints - pointsSpent;

  return { totalPoints, currentPoints };
}
