'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Gift, ListTodo, Users, TrendingUp, CheckCircle, XCircle, Clock, Lightbulb, Sparkles, Package, Key } from 'lucide-react';
import { Task, Reward, Child } from '@/lib/types';
import { taskCategories, taskSuggestions, taskPackages, rewardSuggestions, smartTips, filterTasksByAge, getTasksByCategory, getRewardsByCategory } from '@/lib/suggestions';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ParentDashboard() {
  const { user, logout: authLogout } = useAuth();
  const { profile, children, tasks, rewards, addChild, addTask, addReward, updateTask, updateChildPoints, updateChild, logout: appLogout } = useApp();
  const router = useRouter();

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number>(6);
  const [newTask, setNewTask] = useState({ title: '', description: '', points: 10, childId: '' });
  const [newReward, setNewReward] = useState({ title: '', description: '', pointsRequired: 50 });
  const [openChildDialog, setOpenChildDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openRewardDialog, setOpenRewardDialog] = useState(false);
  const [openSuggestionsDialog, setOpenSuggestionsDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (!user || user.type !== 'parent') {
      router.push('/');
    }
  }, [user, router]);

  // Rotação de dicas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % smartTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authLogout();
    appLogout();
    router.push('/');
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      const child: Child = {
        id: Date.now().toString(),
        name: newChildName,
        totalPoints: 0,
        currentPoints: 0,
        age: newChildAge,
      };
      addChild(child);
      setNewChildName('');
      setNewChildAge(6);
      setOpenChildDialog(false);
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim() && newTask.childId) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        points: newTask.points,
        status: 'pending',
        createdAt: new Date(),
        childId: newTask.childId,
      };
      addTask(task);
      setNewTask({ title: '', description: '', points: 10, childId: '' });
      setOpenTaskDialog(false);
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
    };
    addTask(task);
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
      };
      addTask(task);
    });
  };

  const handleAddReward = () => {
    if (newReward.title.trim()) {
      const reward: Reward = {
        id: Date.now().toString(),
        title: newReward.title,
        description: newReward.description,
        pointsRequired: newReward.pointsRequired,
        claimed: false,
      };
      addReward(reward);
      setNewReward({ title: '', description: '', pointsRequired: 50 });
      setOpenRewardDialog(false);
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
  };

  const handleRejectTask = (task: Task) => {
    updateTask(task.id, { status: 'pending', completedAt: undefined, photoProof: undefined });
  };

  const pendingApprovalTasks = tasks.filter(t => t.status === 'completed');
  const approvedTasks = tasks.filter(t => t.status === 'approved');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🎮 KidQuest - Painel dos Pais</h1>
            <p className="text-sm text-gray-600">Transforme a rotina da sua criança em uma aventura cheia de conquistas.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Family Code Display */}
        {user.familyCode && (
          <Alert className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <Key className="w-5 h-5 text-purple-600" />
            <AlertDescription className="ml-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Código da Família: <span className="text-purple-600 text-lg tracking-wider">{user.familyCode}</span></p>
                  <p className="text-sm text-gray-600">Compartilhe este código com seus filhos para que eles possam criar suas contas</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Dica Inteligente */}
        <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <p className="text-sm md:text-base text-gray-700 font-medium">{smartTips[currentTip]}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Sugestões
            </TabsTrigger>
            <TabsTrigger value="children" className="gap-2">
              <Users className="w-4 h-4" />
              Crianças
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="w-4 h-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="rewards" className="gap-2">
              <Gift className="w-4 h-4" />
              Recompensas
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-2">
              <Clock className="w-4 h-4" />
              Aprovações ({pendingApprovalTasks.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Crianças
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-800">{children.length}</p>
                  <p className="text-sm text-gray-600">cadastradas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-green-500" />
                    Tarefas Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-800">{tasks.filter(t => t.status === 'pending').length}</p>
                  <p className="text-sm text-gray-600">aguardando conclusão</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-500" />
                    Recompensas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-800">{rewards.filter(r => !r.claimed).length}</p>
                  <p className="text-sm text-gray-600">disponíveis</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats per Child */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso das Crianças</CardTitle>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma criança cadastrada ainda</p>
                ) : (
                  <div className="space-y-4">
                    {children.map(child => {
                      const childTasks = tasks.filter(t => t.childId === child.id);
                      const completedCount = childTasks.filter(t => t.status === 'approved').length;
                      return (
                        <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-800">{child.name} {child.age && `(${child.age} anos)`}</p>
                            <p className="text-sm text-gray-600">{child.totalPoints} pontos totais</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">{completedCount} tarefas concluídas</p>
                            <p className="text-xs text-gray-500">{childTasks.length - completedCount} pendentes</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab - MÓDULO COMPLETO */}
          <TabsContent value="suggestions" className="space-y-6">
            {/* Categorias de Tarefas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Categorias de Tarefas
                </CardTitle>
                <CardDescription>Toque em uma categoria para ver tarefas prontas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {taskCategories.map(category => (
                    <Dialog key={category.id}>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300">
                          <CardContent className="pt-6 text-center">
                            <div className="text-4xl mb-2">{category.icon}</div>
                            <p className="font-semibold text-sm">{category.name}</p>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            {category.name}
                          </DialogTitle>
                          <DialogDescription>Selecione uma criança e adicione tarefas com 1 toque</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          {children.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Cadastre uma criança primeiro</p>
                          ) : (
                            <>
                              {children.map(child => {
                                const filteredTasks = child.age 
                                  ? getTasksByCategory(category.id).filter(task => {
                                      const [min, max] = task.ageRange.split('-').map(Number);
                                      return child.age! >= min && child.age! <= max;
                                    })
                                  : getTasksByCategory(category.id);

                                return (
                                  <div key={child.id} className="space-y-3">
                                    <h3 className="font-semibold text-gray-800 border-b pb-2">
                                      Para: {child.name} {child.age && `(${child.age} anos)`}
                                    </h3>
                                    <div className="grid gap-2">
                                      {filteredTasks.map(suggestion => (
                                        <Card key={suggestion.id} className="border-l-4 border-l-purple-500">
                                          <CardContent className="py-3">
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex-1">
                                                <p className="font-semibold text-sm text-gray-800">{suggestion.title}</p>
                                                <p className="text-xs text-gray-600">{suggestion.description}</p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Badge className="bg-green-600">+{suggestion.points} XP</Badge>
                                                <Button
                                                  size="sm"
                                                  onClick={() => {
                                                    handleAddSuggestedTask(suggestion, child.id);
                                                  }}
                                                  className="gap-1"
                                                >
                                                  <Plus className="w-3 h-3" />
                                                  Adicionar
                                                </Button>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pacotes de Missões */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  Pacotes de Missões
                </CardTitle>
                <CardDescription>Pacotes de missões prontas para facilitar a sua vida.</CardDescription>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Cadastre uma criança primeiro</p>
                ) : (
                  <div className="space-y-6">
                    {children.map(child => (
                      <div key={child.id} className="space-y-3">
                        <h3 className="font-semibold text-gray-800 border-b pb-2">
                          Para: {child.name} {child.age && `(${child.age} anos)`}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {taskPackages.map(pkg => (
                            <Card key={pkg.id} className="border-2 hover:border-blue-300 transition-colors">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <span className="text-2xl">{pkg.icon}</span>
                                      {pkg.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">{pkg.description}</CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 mb-4">
                                  {pkg.tasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700">• {task.title}</span>
                                      <Badge variant="outline" className="text-xs">+{task.points} XP</Badge>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  onClick={() => {
                                    handleAddTaskPackage(pkg.id, child.id);
                                  }}
                                  className="w-full gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Adicionar Pacote Completo
                                </Button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                  Missão adicionada! Seu filho tem mais uma chance de evoluir.
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sugestões de Recompensas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-500" />
                  Sugestões de Recompensas
                </CardTitle>
                <CardDescription>Recompensas prontas com pontos já calculados</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="small" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="small">Pequenas</TabsTrigger>
                    <TabsTrigger value="medium">Médias</TabsTrigger>
                    <TabsTrigger value="large">Grandes</TabsTrigger>
                    <TabsTrigger value="epic">Épicas</TabsTrigger>
                  </TabsList>

                  {(['small', 'medium', 'large', 'epic'] as const).map(category => (
                    <TabsContent key={category} value={category} className="space-y-3">
                      {getRewardsByCategory(category).map(suggestion => (
                        <Card key={suggestion.id} className="border-l-4 border-l-purple-500">
                          <CardContent className="py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">{suggestion.title}</p>
                                <p className="text-xs text-gray-600">{suggestion.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-purple-600">{suggestion.pointsRequired} pts</Badge>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddSuggestedReward(suggestion)}
                                  className="gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Crianças Cadastradas</CardTitle>
                    <CardDescription>Gerencie as crianças do sistema</CardDescription>
                  </div>
                  <Dialog open={openChildDialog} onOpenChange={setOpenChildDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar Criança
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Criança</DialogTitle>
                        <DialogDescription>Cadastre uma criança para começar a criar missões</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="childName">Nome da Criança</Label>
                          <Input
                            id="childName"
                            value={newChildName}
                            onChange={(e) => setNewChildName(e.target.value)}
                            placeholder="Ex: João"
                          />
                        </div>
                        <div>
                          <Label htmlFor="childAge">Idade</Label>
                          <Input
                            id="childAge"
                            type="number"
                            value={newChildAge}
                            onChange={(e) => setNewChildAge(parseInt(e.target.value) || 6)}
                            min="3"
                            max="12"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            As sugestões de tarefas serão adaptadas para a idade
                          </p>
                        </div>
                        <Button onClick={handleAddChild} className="w-full">Adicionar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma criança cadastrada</p>
                    <p className="text-sm text-gray-400">Clique em "Adicionar Criança" para começar</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {children.map(child => (
                      <Card key={child.id} className="border-2">
                        <CardHeader>
                          <CardTitle className="text-xl">{child.name}</CardTitle>
                          {child.age && <CardDescription>{child.age} anos</CardDescription>}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Pontos Totais:</span>
                              <span className="font-semibold text-gray-800">{child.totalPoints}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Pontos Disponíveis:</span>
                              <span className="font-semibold text-green-600">{child.currentPoints}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Tarefas Concluídas:</span>
                              <span className="font-semibold text-blue-600">
                                {tasks.filter(t => t.childId === child.id && t.status === 'approved').length}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tarefas e Missões</CardTitle>
                    <CardDescription>Crie e gerencie tarefas para as crianças</CardDescription>
                  </div>
                  <Button onClick={() => setOpenTaskDialog(true)} className="gap-2" disabled={children.length === 0}>
                    <Plus className="w-4 h-4" />
                    Nova Tarefa
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma tarefa criada</p>
                    <p className="text-sm text-gray-400">Crie tarefas para as crianças completarem</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map(task => {
                      const child = children.find(c => c.id === task.childId);
                      return (
                        <Card key={task.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                  <Badge variant={task.status === 'approved' ? 'default' : task.status === 'completed' ? 'secondary' : 'outline'}>
                                    {task.status === 'approved' ? 'Aprovada' : task.status === 'completed' ? 'Aguardando' : 'Pendente'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600">Para: <strong>{child?.name}</strong></span>
                                  <span className="text-green-600 font-semibold">+{task.points} XP</span>
                                </div>
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

            {/* Dialog para criar tarefa manual */}
            <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                  <DialogDescription>Defina uma missão para a criança completar</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="taskChild">Para qual criança?</Label>
                    <select
                      id="taskChild"
                      value={newTask.childId}
                      onChange={(e) => setNewTask({ ...newTask, childId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Selecione uma criança</option>
                      {children.map(child => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="taskTitle">Título da Tarefa</Label>
                    <Input
                      id="taskTitle"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Ex: Arrumar a cama"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDesc">Descrição</Label>
                    <Textarea
                      id="taskDesc"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Descreva o que precisa ser feito..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskPoints">Pontos (XP)</Label>
                    <Input
                      id="taskPoints"
                      type="number"
                      value={newTask.points}
                      onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                  <Button onClick={handleAddTask} className="w-full">Criar Tarefa</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recompensas</CardTitle>
                    <CardDescription>Crie prêmios que as crianças podem resgatar</CardDescription>
                  </div>
                  <Dialog open={openRewardDialog} onOpenChange={setOpenRewardDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nova Recompensa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Recompensa</DialogTitle>
                        <DialogDescription>Defina um prêmio que pode ser resgatado</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="rewardTitle">Nome da Recompensa</Label>
                          <Input
                            id="rewardTitle"
                            value={newReward.title}
                            onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                            placeholder="Ex: Jogo novo, Passeio no parque"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rewardDesc">Descrição</Label>
                          <Textarea
                            id="rewardDesc"
                            value={newReward.description}
                            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                            placeholder="Descreva a recompensa..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="rewardPoints">Pontos Necessários</Label>
                          <Input
                            id="rewardPoints"
                            type="number"
                            value={newReward.pointsRequired}
                            onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) || 0 })}
                            min="1"
                          />
                        </div>
                        <Button onClick={handleAddReward} className="w-full">Criar Recompensa</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {rewards.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma recompensa criada</p>
                    <p className="text-sm text-gray-400">Crie recompensas para motivar as crianças</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {rewards.map(reward => (
                      <Card key={reward.id} className={`border-2 ${reward.claimed ? 'opacity-50' : ''}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{reward.title}</CardTitle>
                            {reward.claimed && <Badge variant="secondary">Resgatada</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Custo:</span>
                            <span className="text-lg font-bold text-purple-600">{reward.pointsRequired} pontos</span>
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
            <Card>
              <CardHeader>
                <CardTitle>Tarefas Aguardando Aprovação</CardTitle>
                <CardDescription>Revise e aprove as tarefas concluídas pelas crianças</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovalTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma tarefa aguardando aprovação</p>
                    <p className="text-sm text-gray-400">As tarefas concluídas aparecerão aqui</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovalTasks.map(task => {
                      const child = children.find(c => c.id === task.childId);
                      return (
                        <Card key={task.id} className="border-l-4 border-l-yellow-500">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                  <Badge variant="secondary">Aguardando Aprovação</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600">Criança: <strong>{child?.name}</strong></span>
                                  <span className="text-green-600 font-semibold">+{task.points} XP</span>
                                </div>
                              </div>

                              {task.photoProof && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Foto de Prova:</p>
                                  <img
                                    src={task.photoProof}
                                    alt="Prova da tarefa"
                                    className="w-full max-w-md rounded-lg border-2 border-gray-200"
                                  />
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApproveTask(task)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Aprovar
                                </Button>
                                <Button
                                  onClick={() => handleRejectTask(task)}
                                  variant="outline"
                                  className="flex-1 gap-2 text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reprovar
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

            {/* Recently Approved */}
            {approvedTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tarefas Aprovadas Recentemente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {approvedTasks.slice(-5).reverse().map(task => {
                      const child = children.find(c => c.id === task.childId);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <p className="font-medium text-gray-800">{task.title}</p>
                            <p className="text-sm text-gray-600">{child?.name}</p>
                          </div>
                          <Badge className="bg-green-600">+{task.points} XP</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
