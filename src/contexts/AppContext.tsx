'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileType, Child, Task, Reward, AppState } from '@/lib/types';
import * as api from '@/lib/supabase-api';

interface AppContextType extends AppState {
  setProfile: (profile: ProfileType) => void;
  setSelectedChild: (child: Child | null) => void;
  addChild: (child: Child) => void;
  updateChild: (childId: string, updates: Partial<Child>) => void;
  deleteChild: (childId: string) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addReward: (reward: Reward) => void;
  updateReward: (rewardId: string, updates: Partial<Reward>) => void;
  deleteReward: (rewardId: string) => void;
  updateChildPoints: (childId: string, points: number) => void;
  logout: () => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ID do pai padrão (em produção, isso viria da autenticação)
const DEFAULT_PARENT_ID = '2cf8d795-b616-4406-8707-f4b3035a6140';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: null,
    selectedChild: null,
    children: [],
    tasks: [],
    rewards: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [parentId, setParentId] = useState<string>(DEFAULT_PARENT_ID);

  // Função para carregar dados do Supabase
  const loadDataFromSupabase = async () => {
    try {
      setIsLoading(true);
      
      // Carregar dados em paralelo
      const [childrenData, tasksData, rewardsData] = await Promise.all([
        api.getChildren(parentId),
        api.getTasks(parentId),
        api.getRewards(parentId),
      ]);

      setState(prev => ({
        ...prev,
        children: childrenData,
        tasks: tasksData,
        rewards: rewardsData,
      }));
    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    // Verificar se há um perfil salvo no localStorage
    const savedProfile = localStorage.getItem('kidquest-profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setState(prev => ({ ...prev, profile }));
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    }

    // Carregar dados do Supabase
    loadDataFromSupabase();
  }, [parentId]);

  const refreshData = async () => {
    await loadDataFromSupabase();
  };

  const setProfile = (profile: ProfileType) => {
    setState(prev => ({ ...prev, profile }));
    localStorage.setItem('kidquest-profile', JSON.stringify(profile));
  };

  const setSelectedChild = (child: Child | null) => {
    setState(prev => ({ ...prev, selectedChild: child }));
  };

  const addChild = async (child: Child) => {
    const newChild = await api.createChild(parentId, child);
    if (newChild) {
      setState(prev => ({ ...prev, children: [...prev.children, newChild] }));
    }
  };

  const updateChild = async (childId: string, updates: Partial<Child>) => {
    const success = await api.updateChild(childId, updates);
    if (success) {
      setState(prev => ({
        ...prev,
        children: prev.children.map(c => c.id === childId ? { ...c, ...updates } : c),
      }));
    }
  };

  const deleteChild = async (childId: string) => {
    const success = await api.deleteChild(childId);
    if (success) {
      setState(prev => ({
        ...prev,
        children: prev.children.filter(c => c.id !== childId),
        selectedChild: prev.selectedChild?.id === childId ? null : prev.selectedChild,
      }));
    }
  };

  const addTask = async (task: Task) => {
    const newTask = await api.createTask(task);
    if (newTask) {
      setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const success = await api.updateTask(taskId, updates);
    if (success) {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      }));
      
      // Recarregar dados para atualizar pontos das crianças
      await refreshData();
    }
  };

  const deleteTask = async (taskId: string) => {
    const success = await api.deleteTask(taskId);
    if (success) {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
      }));
    }
  };

  const addReward = async (reward: Reward) => {
    const newReward = await api.createReward(parentId, reward);
    if (newReward) {
      setState(prev => ({ ...prev, rewards: [...prev.rewards, newReward] }));
    }
  };

  const updateReward = async (rewardId: string, updates: Partial<Reward>) => {
    const success = await api.updateReward(rewardId, updates);
    if (success) {
      setState(prev => ({
        ...prev,
        rewards: prev.rewards.map(r => r.id === rewardId ? { ...r, ...updates } : r),
      }));
      
      // Recarregar dados para sincronizar
      await refreshData();
    }
  };

  const deleteReward = async (rewardId: string) => {
    const success = await api.deleteReward(rewardId);
    if (success) {
      setState(prev => ({
        ...prev,
        rewards: prev.rewards.filter(r => r.id !== rewardId),
      }));
    }
  };

  const updateChildPoints = async (childId: string, points: number) => {
    // Os pontos são calculados automaticamente baseados nas tarefas aprovadas
    // Apenas atualizar o estado local para refletir imediatamente
    setState(prev => ({
      ...prev,
      children: prev.children.map(c =>
        c.id === childId
          ? { ...c, totalPoints: c.totalPoints + points, currentPoints: c.currentPoints + points }
          : c
      ),
    }));
    
    // Recarregar dados para garantir sincronização
    setTimeout(() => refreshData(), 500);
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      profile: null,
      selectedChild: null,
    }));
    localStorage.removeItem('kidquest-profile');
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setProfile,
        setSelectedChild,
        addChild,
        updateChild,
        deleteChild,
        addTask,
        updateTask,
        deleteTask,
        addReward,
        updateReward,
        deleteReward,
        updateChildPoints,
        logout,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
