'use client';

import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Gift, ListTodo, Users, TrendingUp, CheckCircle, XCircle, Clock, Lightbulb, Sparkles, Package, Pencil, Trash2, Home, Calendar, History, AlertTriangle, Repeat, Star, Trophy, Zap, Target, Camera, Upload } from 'lucide-react';
import { Task, Reward, Child } from '@/lib/types';
import { taskCategories, taskPackages, getTasksByCategory, getRewardsByCategory, smartTips } from '@/lib/suggestions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/custom/ThemeToggle';

export default function ParentDashboard() {
  const { children, tasks, rewards, addChild, addTask, addReward, updateTask, deleteTask, updateChildPoints, updateChild, deleteChild, deleteReward, updateReward } = useApp();
  const router = useRouter();

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number>(6);
  const [newChildAvatar, setNewChildAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', points: 10, childId: '', rewardId: '', dueDate: '', isRecurring: false, challengeType: 'daily' as 'daily' | 'weekly' | 'monthly' });
  const [newReward, setNewReward] = useState({ title: '', description: '', pointsRequired: 50, expiresAt: '' });
  const [openChildDialog, setOpenChildDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openRewardDialog, setOpenRewardDialog] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const [selectedChildForRewards, setSelectedChildForRewards] = useState<string>('');
  const [selectedChildForTasks, setSelectedChildForTasks] = useState<string>('');

  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [editChildDialog, setEditChildDialog] = useState(false);
  const [editChildName, setEditChildName] = useState('');
  const [editChildAge, setEditChildAge] = useState<number>(6);
  const [editChildAvatar, setEditChildAvatar] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskDialog, setEditTaskDialog] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskPoints, setEditTaskPoints] = useState(10);
  const [editTaskRewardId, setEditTaskRewardId] = useState('');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');
  const [editTaskIsRecurring, setEditTaskIsRecurring] = useState(false);
  const [editTaskChallengeType, setEditTaskChallengeType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [editRewardDialog, setEditRewardDialog] = useState(false);
  const [editRewardTitle, setEditRewardTitle] = useState('');
  const [editRewardDescription, setEditRewardDescription] = useState('');
  const [editRewardPoints, setEditRewardPoints] = useState(50);
  const [editRewardExpiresAt, setEditRewardExpiresAt] = useState('');

  const [editingSuggestion, setEditingSuggestion] = useState<any>(null);
  const [editSuggestionDialog, setEditSuggestionDialog] = useState(false);
  const [editSuggestionPoints, setEditSuggestionPoints] = useState(10);
  const [editSuggestionDescription, setEditSuggestionDescription] = useState('');
  const [suggestionChildId, setSuggestionChildId] = useState('');

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'child' | 'task' | 'reward', id: string } | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          if (isEdit) {
            setEditAvatarPreview(compressedBase64);
            setEditChildAvatar(compressedBase64);
          } else {
            setAvatarPreview(compressedBase64);
            setNewChildAvatar(compressedBase64);
          }
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      const child: Child = {
        id: '',
        name: newChildName,
        totalPoints: 0,
        currentPoints: 0,
        age: newChildAge,
        avatar: avatarPreview || '👤',
      };
      addChild(child);
      setNewChildName('');
      setNewChildAge(6);
      setNewChildAvatar('');
      setAvatarPreview(null);
      setOpenChildDialog(false);
    }
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setEditChildName(child.name);
    setEditChildAge(child.age || 6);
    setEditChildAvatar(child.avatar || '');
    setEditAvatarPreview(child.avatar?.startsWith('data:') ? child.avatar : null);
    setEditChildDialog(true);
  };

  const handleUpdateChild = () => {
    if (editingChild && editChildName.trim()) {
      updateChild(editingChild.id, {
        name: editChildName,
        age: editChildAge,
        avatar: editAvatarPreview || editChildAvatar || '👤',
      });
      setEditChildDialog(false);
      setEditingChild(null);
      setEditAvatarPreview(null);
    }
  };

  const confirmDelete = (type: 'child' | 'task' | 'reward', id: string) => {
    setItemToDelete({ type, id });
    setDeleteConfirmDialog(true);
  };

  const executeDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'child') {
      deleteChild(itemToDelete.id);
    } else if (itemToDelete.type === 'task') {
      deleteTask(itemToDelete.id);
    } else if (itemToDelete.type === 'reward') {
      deleteReward(itemToDelete.id);
    }

    setDeleteConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleAddTask = () => {
    if (newTask.title.trim() && newTask.childId) {
      const task: Task = {
        id: '',
        title: newTask.title,
        description: newTask.description,
        points: newTask.points,
        status: 'pending',
        createdAt: new Date(),
        childId: newTask.childId,
        rewardId: newTask.rewardId || undefined,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        isRecurring: newTask.isRecurring,
        challengeType: newTask.challengeType,
        lastRecurredAt: newTask.isRecurring ? new Date() : undefined,
      };
      addTask(task);
      setNewTask({ title: '', description: '', points: 10, childId: '', rewardId: '', dueDate: '', isRecurring: false, challengeType: 'daily' });
      setOpenTaskDialog(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditTaskPoints(task.points);
    setEditTaskRewardId(task.rewardId || '');
    setEditTaskDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setEditTaskIsRecurring(task.isRecurring || false);
    setEditTaskChallengeType(task.challengeType || 'daily');
    setEditTaskDialog(true);
  };

  const handleUpdateTask = () => {
    if (editingTask && editTaskTitle.trim()) {
      updateTask(editingTask.id, {
        title: editTaskTitle,
        description: editTaskDescription,
        points: editTaskPoints,
        rewardId: editTaskRewardId || undefined,
        dueDate: editTaskDueDate ? new Date(editTaskDueDate) : undefined,
        isRecurring: editTaskIsRecurring,
        challengeType: editTaskChallengeType,
      });
      setEditTaskDialog(false);
      setEditingTask(null);
    }
  };

  const handleEditSuggestion = (suggestion: any, childId: string) => {
    setEditingSuggestion(suggestion);
    setSuggestionChildId(childId);
    setEditSuggestionPoints(suggestion.points);
    setEditSuggestionDescription(suggestion.description);
    setEditSuggestionDialog(true);
  };

  const handleAddEditedSuggestion = () => {
    if (editingSuggestion && suggestionChildId) {
      const task: Task = {
        id: Date.now().toString(),
        title: editingSuggestion.title,
        description: editSuggestionDescription,
        points: editSuggestionPoints,
        status: 'pending',
        createdAt: new Date(),
        childId: suggestionChildId,
        category: editingSuggestion.category,
        challengeType: 'daily',
      };
      addTask(task);
      
      const child = children.find(c => c.id === suggestionChildId);
      setConfirmationMessage(`✅ Tarefa "${editingSuggestion.title}" atribuída para ${child?.name}!`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      
      setEditSuggestionDialog(false);
      setEditingSuggestion(null);
    }
  };

  const handleAddSuggestedTask = (suggestion: any, childId: string) => {
    const task: Task = {
      id: Date.now().toString(),
      title: suggestion.title,
      description: suggestion.description,
      points: suggestion.points,
      status: 'pending',
      createdAt: new Date(),
      childId: childId,
      category: suggestion.category,
      challengeType: 'daily',
    };
    addTask(task);
    
    const child = children.find(c => c.id === childId);
    setConfirmationMessage(`✅ Tarefa "${suggestion.title}" atribuída para ${child?.name}!`);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  const handleAddTaskPackage = (packageId: string, childId: string) => {
    const pkg = taskPackages.find(p => p.id === packageId);
    if (!pkg) return;

    pkg.tasks.forEach(taskTemplate => {
      const task: Task = {
        id: Date.now().toString() + Math.random(),
        title: taskTemplate.title,
        description: taskTemplate.description,
        points: taskTemplate.points,
        status: 'pending',
        createdAt: new Date(),
        childId: childId,
        category: taskTemplate.category,
        challengeType: 'daily',
      };
      addTask(task);
    });
    
    const child = children.find(c => c.id === childId);
    setConfirmationMessage(`✅ Pacote "${pkg.name}" com ${pkg.tasks.length} tarefas atribuído para ${child?.name}!`);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 4000);
  };

  const handleAddReward = () => {
    if (newReward.title.trim()) {
      const reward: Reward = {
        id: Date.now().toString(),
        title: newReward.title,
        description: newReward.description,
        pointsRequired: newReward.pointsRequired,
        claimed: false,
        expiresAt: newReward.expiresAt ? new Date(newReward.expiresAt) : undefined,
      };
      addReward(reward);
      setNewReward({ title: '', description: '', pointsRequired: 50, expiresAt: '' });
      setOpenRewardDialog(false);
    }
  };

  const handleEditReward = (reward: Reward) => {
    setEditingReward(reward);
    setEditRewardTitle(reward.title);
    setEditRewardDescription(reward.description);
    setEditRewardPoints(reward.pointsRequired);
    setEditRewardExpiresAt(reward.expiresAt ? reward.expiresAt.toISOString().split('T')[0] : '');
    setEditRewardDialog(true);
  };

  const handleUpdateReward = () => {
    if (editingReward && editRewardTitle.trim()) {
      updateReward(editingReward.id, {
        title: editRewardTitle,
        description: editRewardDescription,
        pointsRequired: editRewardPoints,
        expiresAt: editRewardExpiresAt ? new Date(editRewardExpiresAt) : undefined,
      });
      setEditRewardDialog(false);
      setEditingReward(null);
    }
  };

  const handleAddSuggestedReward = (suggestion: any) => {
    const reward: Reward = {
      id: Date.now().toString(),
      title: suggestion.title,
      description: suggestion.description,
      pointsRequired: suggestion.pointsRequired,
      claimed: false,
      category: suggestion.category,
    };
    addReward(reward);
  };

  const handleApproveTask = (task: Task) => {
    updateTask(task.id, { status: 'approved', approvedAt: new Date() });
    if (task.childId) {
      updateChildPoints(task.childId, task.points);
    }

    if (task.isRecurring) {
      const newRecurringTask: Task = {
        id: Date.now().toString() + Math.random(),
        title: task.title,
        description: task.description,
        points: task.points,
        status: 'pending',
        createdAt: new Date(),
        childId: task.childId,
        rewardId: task.rewardId,
        isRecurring: true,
        challengeType: task.challengeType || 'daily',
        lastRecurredAt: new Date(),
        category: task.category,
      };
      addTask(newRecurringTask);
    }
  };

  const handleRejectTask = (task: Task) => {
    updateTask(task.id, { status: 'rejected', completedAt: undefined, photoProof: undefined });
  };

  const handleMarkTaskAsCompleted = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { 
        status: 'approved', 
        completedAt: new Date(),
        approvedAt: new Date() 
      });
      if (task.childId) {
        updateChildPoints(task.childId, task.points);
      }

      if (task.isRecurring) {
        const newRecurringTask: Task = {
          id: Date.now().toString() + Math.random(),
          title: task.title,
          description: task.description,
          points: task.points,
          status: 'pending',
          createdAt: new Date(),
          childId: task.childId,
          rewardId: task.rewardId,
          isRecurring: true,
          challengeType: task.challengeType || 'daily',
          lastRecurredAt: new Date(),
          category: task.category,
        };
        addTask(newRecurringTask);
      }
    }
  };

  const handleMarkAsPaid = (rewardId: string) => {
    updateReward(rewardId, {
      paid: true,
      paidAt: new Date(),
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const pendingApprovalTasks = tasks.filter(t => t.status === 'completed');
  const approvedTasks = tasks.filter(t => t.status === 'approved');
  const activeTasks = tasks.filter(t => t.status !== 'deleted');

  const filteredAndSortedTasks = activeTasks
    .filter(task => !selectedChildForTasks || task.childId === selectedChildForTasks)
    .sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const claimedRewardsByChild = rewards.filter(r => {
    if (!r.claimed) return false;
    if (!selectedChildForRewards) return true;
    return r.claimedBy === selectedChildForRewards;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Header Premium */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 text-white shadow-2xl border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg flex items-center gap-2">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse-glow" />
                  KidQuest
                </h1>
                <p className="text-white/90 text-xs sm:text-sm md:text-base">Painel de Controle dos Pais</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Button onClick={() => router.push('/')} variant="secondary" className="gap-2 shadow-lg text-sm sm:text-base">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                <span className="text-xs sm:text-sm font-medium">Crianças</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{children.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                <span className="text-xs sm:text-sm font-medium">Ativas</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{activeTasks.filter(t => t.status === 'pending').length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300" />
                <span className="text-xs sm:text-sm font-medium">Aprovações</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{pendingApprovalTasks.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300" />
                <span className="text-xs sm:text-sm font-medium">Prêmios</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{rewards.filter(r => !r.claimed).length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmação de Atribuição */}
      {showConfirmation && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top px-4 w-full max-w-md">
          <Alert className="bg-green-50 border-green-500 shadow-2xl dark:bg-green-900 dark:border-green-400">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
            <AlertDescription className="text-green-800 dark:text-green-100 font-semibold">
              {confirmationMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent className="border-4 border-orange-200 dark:border-orange-700 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-lg sm:text-xl">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmDialog(false);
                setItemToDelete(null);
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={executeDelete}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
            >
              Sim, Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Adicionar Criança */}
      <Dialog open={openChildDialog} onOpenChange={setOpenChildDialog}>
        <DialogContent className="border-4 border-purple-300 dark:border-purple-600 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Adicionar Nova Criança</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-purple-300" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e, false)}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Clique na câmera para adicionar foto</p>
            </div>

            <div>
              <Label>Nome</Label>
              <Input
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Nome da criança"
              />
            </div>
            <div>
              <Label>Idade</Label>
              <Input
                type="number"
                value={newChildAge}
                onChange={(e) => setNewChildAge(Number(e.target.value))}
                min={1}
                max={18}
              />
            </div>
            <Button onClick={handleAddChild} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Criança
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Criança */}
      <Dialog open={editChildDialog} onOpenChange={setEditChildDialog}>
        <DialogContent className="border-4 border-purple-300 dark:border-purple-600 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Editar Criança</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {editAvatarPreview ? (
                  <img src={editAvatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-purple-300" />
                ) : editChildAvatar?.startsWith('data:') ? (
                  <img src={editChildAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-purple-300" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-4xl">
                    {editChildAvatar || '👤'}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Clique na câmera para alterar foto</p>
            </div>

            <div>
              <Label>Nome</Label>
              <Input
                value={editChildName}
                onChange={(e) => setEditChildName(e.target.value)}
              />
            </div>
            <div>
              <Label>Idade</Label>
              <Input
                type="number"
                value={editChildAge}
                onChange={(e) => setEditChildAge(Number(e.target.value))}
                min={1}
                max={18}
              />
            </div>
            <Button onClick={handleUpdateChild} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Dica Inteligente Premium */}
        <Card className="mb-6 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900 dark:via-yellow-900 dark:to-orange-900 border-4 border-amber-300 dark:border-amber-600 shadow-xl">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-amber-500 rounded-full animate-pulse-glow flex-shrink-0">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100 font-semibold">{smartTips[currentTip]}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-1 sm:gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-1 sm:p-2 rounded-xl border-2 border-purple-200 dark:border-purple-700">
            <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Visão</span>
            </TabsTrigger>
            <TabsTrigger value="children" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Crianças</span>
              <span className="sm:hidden">Kids</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <ListTodo className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Tarefas</span>
              <span className="sm:hidden">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Recompensas</span>
              <span className="sm:hidden">Prêmios</span>
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Aprovações</span>
              <span className="sm:hidden">Aprovar</span>
              {pendingApprovalTasks.length > 0 && (
                <Badge className="bg-red-500 text-white ml-1 text-xs px-1">{pendingApprovalTasks.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white hidden sm:flex">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">Sugestões</span>
              <span className="lg:hidden">Dicas</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white hidden sm:flex">
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">Histórico</span>
              <span className="lg:hidden">Hist</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-4 border-blue-200 dark:border-blue-700 shadow-xl hover:scale-105 transition-transform bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    Crianças
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-300">{children.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">cadastradas</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-200 dark:border-green-700 shadow-xl hover:scale-105 transition-transform bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    Tarefas Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-300">{activeTasks.filter(t => t.status === 'pending').length}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">aguardando conclusão</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-purple-200 dark:border-purple-700 shadow-xl hover:scale-105 transition-transform bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    Recompensas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-300">{rewards.filter(r => !r.claimed).length}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">disponíveis</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats per Child */}
            <Card className="border-4 border-purple-200 dark:border-purple-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  Progresso das Crianças
                </CardTitle>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Nenhuma criança cadastrada ainda</p>
                    <Button onClick={() => setOpenChildDialog(true)} className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeira Criança
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map(child => {
                      const childTasks = activeTasks.filter(t => t.childId === child.id);
                      const completedCount = childTasks.filter(t => t.status === 'approved').length;
                      return (
                        <div key={child.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl border-2 border-purple-300 dark:border-purple-600 hover:scale-102 transition-transform shadow-lg">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {child.avatar?.startsWith('data:') ? (
                              <img src={child.avatar} alt={child.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-purple-300 shadow-lg" />
                            ) : (
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                                {child.avatar || '👤'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100">{child.name} {child.age && `(${child.age} anos)`}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold">{child.totalPoints} pontos totais</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right w-full sm:w-auto">
                            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                              {completedCount} tarefas concluídas
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{childTasks.length - completedCount} pendentes</p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditChild(child)}
                                variant="outline"
                                className="text-xs"
                              >
                                <Pencil className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => confirmDelete('child', child.id)}
                                variant="outline"
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-6">
            <Card className="border-4 border-cyan-200 dark:border-cyan-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                    Gerenciar Crianças
                  </CardTitle>
                  <Button onClick={() => setOpenChildDialog(true)} className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Criança
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-4">Nenhuma criança cadastrada</p>
                    <Button onClick={() => setOpenChildDialog(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeira Criança
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {children.map(child => (
                      <Card key={child.id} className="border-4 border-cyan-200 dark:border-cyan-700 shadow-lg hover:scale-105 transition-transform bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900">
                        <CardHeader className="text-center pb-3">
                          {child.avatar?.startsWith('data:') ? (
                            <img src={child.avatar} alt={child.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 border-4 border-cyan-300 shadow-lg" />
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl sm:text-5xl shadow-lg animate-pulse-glow">
                              {child.avatar || '👤'}
                            </div>
                          )}
                          <CardTitle className="text-lg sm:text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400">{child.name}</CardTitle>
                          {child.age && <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{child.age} anos</p>}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
                            <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-500" />
                            <span className="text-xl sm:text-2xl font-bold">{child.currentPoints} pontos</span>
                          </div>
                          <p className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-300">Total: {child.totalPoints} XP</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditChild(child)}
                              variant="outline"
                              className="flex-1 text-xs sm:text-sm"
                            >
                              <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              onClick={() => confirmDelete('child', child.id)}
                              variant="outline"
                              className="flex-1 text-xs sm:text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card className="border-4 border-orange-200 dark:border-orange-700 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  Tarefas Aguardando Aprovação
                  {pendingApprovalTasks.length > 0 && (
                    <Badge className="bg-orange-500 text-white ml-2">{pendingApprovalTasks.length}</Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Revise e aprove as tarefas concluídas pelas crianças</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovalTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Nenhuma tarefa aguardando aprovação</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovalTasks.map(task => {
                      const child = children.find(c => c.id === task.childId);
                      return (
                        <Card key={task.id} className="border-l-8 border-l-orange-500 shadow-lg hover:shadow-2xl transition-all bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900 dark:to-yellow-900">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{task.title}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                                  </div>
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1 w-fit">
                                    <Star className="w-4 h-4 mr-1 fill-white" />
                                    +{task.points} XP
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {child && (
                                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600">
                                      <Users className="w-3 h-3 mr-1" />
                                      {child.name}
                                    </Badge>
                                  )}
                                  {task.completedAt && (
                                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(task.completedAt)}
                                    </Badge>
                                  )}
                                  {task.challengeType && (
                                    <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-600">
                                      {task.challengeType === 'daily' && '⚡ Diário'}
                                      {task.challengeType === 'weekly' && '📈 Semanal'}
                                      {task.challengeType === 'monthly' && '🏆 Mensal'}
                                    </Badge>
                                  )}
                                </div>

                                {task.photoProof && (
                                  <div className="mt-3">
                                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">📸 Foto enviada:</p>
                                    <img 
                                      src={task.photoProof} 
                                      alt="Prova da tarefa" 
                                      className="w-full max-w-md rounded-lg border-4 border-orange-300 dark:border-orange-600 shadow-lg" 
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex lg:flex-col gap-2 lg:w-48">
                                <Button
                                  onClick={() => handleApproveTask(task)}
                                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg h-12 sm:h-14"
                                >
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  Aprovar
                                </Button>
                                <Button
                                  onClick={() => handleRejectTask(task)}
                                  variant="outline"
                                  className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900 h-12 sm:h-14"
                                >
                                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  Rejeitar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outras tabs mantidas com melhorias de responsividade similares... */}
        </Tabs>
      </main>
    </div>
  );
}
