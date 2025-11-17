'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ProfileType, Child, Task, Reward, AppState } from '@/lib/types';

interface AppContextType extends AppState {
  setProfile: (profile: ProfileType) => void;
  setSelectedChild: (child: Child | null) => void;
  addChild: (child: Child) => void;
  updateChild: (childId: string, updates: Partial<Child>) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addReward: (reward: Reward) => void;
  updateReward: (rewardId: string, updates: Partial<Reward>) => void;
  updateChildPoints: (childId: string, points: number) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: null,
    selectedChild: null,
    children: [],
    tasks: [],
    rewards: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load from localStorage on mount (only once)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kidquest-data');
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            ...parsed,
            profile: null, // Reset profile to avoid auto-redirect
            tasks: parsed.tasks.map((t: Task) => ({
              ...t,
              createdAt: new Date(t.createdAt),
              completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
              approvedAt: t.approvedAt ? new Date(t.approvedAt) : undefined,
            })),
            rewards: parsed.rewards.map((r: Reward) => ({
              ...r,
              claimedAt: r.claimedAt ? new Date(r.claimedAt) : undefined,
            })),
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage with debounce
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('kidquest-data', JSON.stringify(state));
        } catch (error) {
          console.error('Error saving data:', error);
        }
      }, 500);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state, isLoaded]);

  const setProfile = (profile: ProfileType) => {
    setState(prev => ({ ...prev, profile }));
  };

  const setSelectedChild = (child: Child | null) => {
    setState(prev => ({ ...prev, selectedChild: child }));
  };

  const addChild = (child: Child) => {
    setState(prev => ({ ...prev, children: [...prev.children, child] }));
  };

  const updateChild = (childId: string, updates: Partial<Child>) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(c => c.id === childId ? { ...c, ...updates } : c),
    }));
  };

  const addTask = (task: Task) => {
    setState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
    }));
  };

  const addReward = (reward: Reward) => {
    setState(prev => ({ ...prev, rewards: [...prev.rewards, reward] }));
  };

  const updateReward = (rewardId: string, updates: Partial<Reward>) => {
    setState(prev => ({
      ...prev,
      rewards: prev.rewards.map(r => r.id === rewardId ? { ...r, ...updates } : r),
    }));
  };

  const updateChildPoints = (childId: string, points: number) => {
    setState(prev => ({
      ...prev,
      children: prev.children.map(c =>
        c.id === childId
          ? { ...c, totalPoints: c.totalPoints + points, currentPoints: c.currentPoints + points }
          : c
      ),
    }));
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      profile: null,
      selectedChild: null,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setProfile,
        setSelectedChild,
        addChild,
        updateChild,
        addTask,
        updateTask,
        addReward,
        updateReward,
        updateChildPoints,
        logout,
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
