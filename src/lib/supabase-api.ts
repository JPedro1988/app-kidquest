import { supabase, calculateChildPoints } from './supabase-client';
import { Child, Task, Reward, ChallengeType } from './types';

// ==================== CHILDREN ====================

export async function getChildren(parentId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar crianças:', error);
    return [];
  }

  // Calcular pontos para cada criança
  const childrenWithPoints = await Promise.all(
    (data || []).map(async (child) => {
      const { totalPoints, currentPoints } = await calculateChildPoints(child.id);
      return {
        id: child.id,
        name: child.name,
        age: child.age || undefined,
        totalPoints,
        currentPoints,
      };
    })
  );

  return childrenWithPoints;
}

export async function createChild(parentId: string, child: Omit<Child, 'id' | 'totalPoints' | 'currentPoints'>): Promise<Child | null> {
  const { data, error } = await supabase
    .from('children')
    .insert({
      parent_id: parentId,
      name: child.name,
      age: child.age || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar criança:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    age: data.age || undefined,
    totalPoints: 0,
    currentPoints: 0,
  };
}

export async function updateChild(childId: string, updates: Partial<Child>): Promise<boolean> {
  const { error } = await supabase
    .from('children')
    .update({
      name: updates.name,
      age: updates.age || null,
    })
    .eq('id', childId);

  if (error) {
    console.error('Erro ao atualizar criança:', error);
    return false;
  }

  return true;
}

export async function deleteChild(childId: string): Promise<boolean> {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId);

  if (error) {
    console.error('Erro ao deletar criança:', error);
    return false;
  }

  return true;
}

// ==================== TASKS ====================

// Função auxiliar para determinar o tipo de desafio baseado na descrição ou título
function inferChallengeType(task: any): ChallengeType {
  const text = `${task.title} ${task.description || ''}`.toLowerCase();
  
  if (text.includes('mensal') || text.includes('mês') || text.includes('month')) {
    return 'monthly';
  }
  if (text.includes('semanal') || text.includes('semana') || text.includes('week')) {
    return 'weekly';
  }
  return 'daily';
}

export async function getTasks(parentId: string): Promise<Task[]> {
  // Buscar todas as crianças do pai
  const { data: children, error: childrenError } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', parentId);

  if (childrenError || !children) {
    console.error('Erro ao buscar crianças para tarefas:', childrenError);
    return [];
  }

  const childIds = children.map(c => c.id);

  if (childIds.length === 0) return [];

  // Buscar tarefas das crianças
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .in('child_id', childIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }

  return (data || []).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    points: task.points,
    status: task.status as 'pending' | 'completed' | 'approved' | 'rejected',
    createdAt: new Date(task.created_at),
    childId: task.child_id,
    isRecurring: task.is_recurring,
    challengeType: inferChallengeType(task),
    dueDate: task.due_date ? new Date(task.due_date) : undefined,
    completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
  }));
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      child_id: task.childId,
      title: task.title,
      description: task.description || null,
      points: task.points,
      status: task.status,
      is_recurring: task.isRecurring || false,
      due_date: task.dueDate?.toISOString() || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar tarefa:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    points: data.points,
    status: data.status,
    createdAt: new Date(data.created_at),
    childId: data.child_id,
    isRecurring: data.is_recurring,
    challengeType: inferChallengeType(data),
    dueDate: data.due_date ? new Date(data.due_date) : undefined,
  };
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.points !== undefined) updateData.points = updates.points;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.isRecurring !== undefined) updateData.is_recurring = updates.isRecurring;
  if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString() || null;
  if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt?.toISOString() || null;

  const { error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId);

  if (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return false;
  }

  return true;
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete(
)
    .eq('id', taskId);

  if (error) {
    console.error('Erro ao deletar tarefa:', error);
    return false;
  }

  return true;
}

// ==================== REWARDS ====================

export async function getRewards(parentId: string): Promise<Reward[]> {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar recompensas:', error);
    return [];
  }

  // Buscar resgates para verificar se foram resgatadas
  const rewardIds = (data || []).map(r => r.id);
  
  if (rewardIds.length === 0) return [];

  const { data: redemptions, error: redemptionsError } = await supabase
    .from('reward_redemptions')
    .select('*')
    .in('reward_id', rewardIds);

  if (redemptionsError) {
    console.error('Erro ao buscar resgates:', redemptionsError);
  }

  return (data || []).map(reward => {
    const redemption = redemptions?.find(r => r.reward_id === reward.id);
    return {
      id: reward.id,
      title: reward.title,
      description: reward.description || '',
      pointsRequired: reward.points_required,
      claimed: !!redemption,
      claimedBy: redemption?.child_id,
      claimedAt: redemption?.redeemed_at ? new Date(redemption.redeemed_at) : undefined,
      paid: false, // TODO: adicionar campo paid na tabela
    };
  });
}

export async function createReward(parentId: string, reward: Omit<Reward, 'id' | 'claimed'>): Promise<Reward | null> {
  const { data, error } = await supabase
    .from('rewards')
    .insert({
      parent_id: parentId,
      title: reward.title,
      description: reward.description || null,
      points_required: reward.pointsRequired,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar recompensa:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    pointsRequired: data.points_required,
    claimed: false,
  };
}

export async function updateReward(rewardId: string, updates: Partial<Reward>): Promise<boolean> {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.pointsRequired !== undefined) updateData.points_required = updates.pointsRequired;

  const { error } = await supabase
    .from('rewards')
    .update(updateData)
    .eq('id', rewardId);

  if (error) {
    console.error('Erro ao atualizar recompensa:', error);
    return false;
  }

  return true;
}

export async function deleteReward(rewardId: string): Promise<boolean> {
  const { error } = await supabase
    .from('rewards')
    .update({ is_active: false })
    .eq('id', rewardId);

  if (error) {
    console.error('Erro ao deletar recompensa:', error);
    return false;
  }

  return true;
}

export async function redeemReward(childId: string, rewardId: string, pointsSpent: number): Promise<boolean> {
  const { error } = await supabase
    .from('reward_redemptions')
    .insert({
      child_id: childId,
      reward_id: rewardId,
      points_spent: pointsSpent,
      status: 'approved',
    });

  if (error) {
    console.error('Erro ao resgatar recompensa:', error);
    return false;
  }

  return true;
}
