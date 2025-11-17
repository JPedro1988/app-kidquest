'use client';

import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Star, Trophy, Camera, CheckCircle, Gift, Zap, Calendar, Share2, Facebook, Twitter, Instagram, Target, TrendingUp, Sparkles, X, Upload } from 'lucide-react';
import { Child, ChallengeType } from '@/lib/types';
import { Logo } from '@/components/custom/Logo';

const formatDate = (date: Date | undefined) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function ChildDashboard() {
  const { profile, children, selectedChild, setSelectedChild, tasks, rewards, updateTask, updateReward, updateChildPoints, updateChild, logout } = useApp();
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [claimedRewardForShare, setClaimedRewardForShare] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  useEffect(() => {
    if (profile !== null && profile !== 'child') {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [profile, router]);

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setProfilePhotoPreview(compressedBase64);
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfilePhoto = () => {
    if (selectedChild && profilePhotoPreview) {
      updateChild(selectedChild.id, {
        avatar: profilePhotoPreview,
      });
      setShowProfileDialog(false);
      setProfilePhotoPreview(null);
    }
  };

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setPhotoPreview(compressedBase64);
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteTaskWithPhoto = (taskId: string) => {
    if (photoPreview) {
      updateTask(taskId, {
        status: 'completed',
        completedAt: new Date(),
        photoProof: photoPreview,
      });
      setPhotoPreview(null);
      setSelectedTaskId(null);
    }
  };

  const handleCompleteTaskWithoutPhoto = (taskId: string) => {
    updateTask(taskId, {
      status: 'completed',
      completedAt: new Date(),
    });
    setSelectedTaskId(null);
  };

  const handleClaimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && selectedChild && selectedChild.currentPoints >= reward.pointsRequired) {
      updateReward(rewardId, { 
        claimed: true, 
        claimedAt: new Date(),
        claimedBy: selectedChild.id 
      });
      updateChildPoints(selectedChild.id, -reward.pointsRequired);
      setShowRewardDialog(false);
      setSelectedRewardId(null);
      
      setClaimedRewardForShare(reward);
      setShowShareDialog(true);
    }
  };

  const generateShareText = (reward: any) => {
    return `🎉 Acabei de conquistar "${reward.title}" no KidQuest! 🏆\n\nCom ${reward.pointsRequired} pontos de esforço e dedicação, consegui essa recompensa incrível! 💪✨\n\n#KidQuest #Conquista #Recompensa #Gamificação`;
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    if (!claimedRewardForShare) return;

    const text = generateShareText(claimedRewardForShare);
    const url = 'https://kidquest.app';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        break;
      case 'copy':
        const textArea = document.createElement('textarea');
        textArea.value = text + '\n' + url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
          alert('Texto copiado! Cole nas suas redes sociais 📋');
        } catch (err) {
          console.error('Erro ao copiar:', err);
          textArea.remove();
          alert('Não foi possível copiar automaticamente. Texto: ' + text + '\n' + url);
        }
        break;
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 dark:from-pink-900 dark:via-purple-900 dark:to-orange-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-float" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
          <Star className="absolute top-10 right-10 w-8 h-8 text-yellow-300/40 animate-pulse" />
          <Trophy className="absolute bottom-10 left-10 w-10 h-10 text-yellow-300/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <Card className="w-full max-w-2xl border-4 border-white/30 shadow-2xl backdrop-blur-md bg-white/95 dark:bg-gray-900/95 relative z-10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <CardTitle className="text-3xl sm:text-4xl bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-orange-400">🎮 Quem está jogando?</CardTitle>
            <CardDescription className="text-base sm:text-lg">Selecione seu perfil para começar a aventura</CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-base sm:text-lg">Nenhuma criança cadastrada ainda</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Peça para seus pais criarem seu perfil!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {children.map(child => (
                  <Card
                    key={child.id}
                    className="cursor-pointer hover:scale-105 transition-all duration-300 border-4 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 shadow-xl hover:shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900"
                    onClick={() => handleSelectChild(child)}
                  >
                    <CardHeader className="text-center">
                      {child.avatar?.startsWith('data:') ? (
                        <img src={child.avatar} alt={child.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 border-4 border-purple-300 shadow-lg animate-pulse-glow" />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl sm:text-5xl shadow-lg animate-pulse-glow">
                          {child.avatar || '👤'}
                        </div>
                      )}
                      <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">{child.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-500" />
                        <span className="text-xl sm:text-2xl font-bold">{child.currentPoints} pontos</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <Button onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const childTasks = tasks.filter(t => t.childId === selectedChild.id);
  
  const dailyTasks = childTasks.filter(t => t.challengeType === 'daily');
  const weeklyTasks = childTasks.filter(t => t.challengeType === 'weekly');
  const monthlyTasks = childTasks.filter(t => t.challengeType === 'monthly');

  const calculateProgress = (tasksOfType: typeof childTasks) => {
    const total = tasksOfType.length;
    const completed = tasksOfType.filter(t => t.status === 'approved').length;
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const dailyProgress = calculateProgress(dailyTasks);
  const weeklyProgress = calculateProgress(weeklyTasks);
  const monthlyProgress = calculateProgress(monthlyTasks);

  const pendingTasks = childTasks.filter(t => t.status === 'pending');
  const completedTasks = childTasks.filter(t => t.status === 'completed');
  const approvedTasks = childTasks.filter(t => t.status === 'approved');
  const availableRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed && r.claimedBy === selectedChild.id);

  const nextReward = availableRewards.sort((a, b) => a.pointsRequired - b.pointsRequired)[0];
  const progressToNextReward = nextReward
    ? Math.min((selectedChild.currentPoints / nextReward.pointsRequired) * 100, 100)
    : 0;

  const renderTasksByType = (tasksOfType: typeof childTasks, type: ChallengeType, icon: React.ReactNode, color: string, bgColor: string) => {
    const pending = tasksOfType.filter(t => t.status === 'pending');
    
    if (pending.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          {icon}
          {type === 'daily' && '⚡ Desafios Diários'}
          {type === 'weekly' && '📈 Missões Semanais'}
          {type === 'monthly' && '🏆 Objetivos Mensais'}
        </h3>
        {pending.map(task => (
          <Card key={task.id} className={`border-l-8 ${color} hover:shadow-2xl transition-all duration-300 hover:scale-102 ${bgColor}`}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{task.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-white" />
                      +{task.points} XP
                    </Badge>
                    {task.dueDate && (
                      <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Prazo: {formatDate(task.dueDate)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {selectedTaskId === task.id ? (
                <div className="space-y-3 mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">Escolha como completar:</p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-600 dark:text-gray-300">📸 Enviar foto como prova:</p>
                      <label className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors">
                          <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            {photoPreview ? 'Foto selecionada ✓' : 'Clique para anexar foto'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoCapture}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {photoPreview && (
                      <div className="space-y-2">
                        <img src={photoPreview} alt="Preview" className="w-full max-w-sm rounded-lg border-2 shadow-lg" />
                        <Button
                          onClick={() => handleCompleteTaskWithPhoto(task.id)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg h-12"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Enviar com Foto
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => handleCompleteTaskWithoutPhoto(task.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg h-12"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Marcar como Concluída (sem foto)
                    </Button>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedTaskId(null);
                      setPhotoPreview(null);
                    }}
                    variant="outline"
                    className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 h-12"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setSelectedTaskId(task.id)}
                  className="w-full mt-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-base sm:text-lg h-12 sm:h-14 shadow-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Marcar como Concluída
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Header Premium */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 dark:from-pink-800 dark:via-purple-800 dark:to-orange-800 text-white shadow-2xl border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                {selectedChild.avatar?.startsWith('data:') ? (
                  <img 
                    src={selectedChild.avatar} 
                    alt={selectedChild.name} 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/30 backdrop-blur shadow-xl cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setShowProfileDialog(true)}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl sm:text-4xl backdrop-blur shadow-xl animate-pulse-glow cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setShowProfileDialog(true)}
                  >
                    {selectedChild.avatar || '👤'}
                  </div>
                )}
                <button 
                  onClick={() => setShowProfileDialog(true)}
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1.5 sm:p-2 shadow-lg"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">Olá, {selectedChild.name}! 👋</h1>
                <p className="text-white/90 text-sm sm:text-base md:text-lg">Continue suas aventuras épicas!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button onClick={() => setSelectedChild(null)} variant="secondary" className="gap-2 shadow-lg text-sm sm:text-base">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Trocar</span>
              </Button>
            </div>
          </div>

          {/* Points Display Premium */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center border-2 border-white/20 hover:scale-105 transition-transform shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-300 text-yellow-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium">Pontos</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{selectedChild.currentPoints}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center border-2 border-white/20 hover:scale-105 transition-transform shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium">Total XP</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{selectedChild.totalPoints}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center border-2 border-white/20 hover:scale-105 transition-transform shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                <span className="text-xs sm:text-sm font-medium">Concluídas</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{approvedTasks.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-center border-2 border-white/20 hover:scale-105 transition-transform shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300 animate-pulse-glow" />
                <span className="text-xs sm:text-sm font-medium">Prêmios</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{claimedRewards.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Dialog de Foto de Perfil */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="border-4 border-purple-300 dark:border-purple-600 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Alterar Foto de Perfil</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">Escolha uma foto legal para seu perfil!</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex flex-col items-center gap-4">
              {profilePhotoPreview ? (
                <img src={profilePhotoPreview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 shadow-lg" />
              ) : selectedChild.avatar?.startsWith('data:') ? (
                <img src={selectedChild.avatar} alt={selectedChild.name} className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-5xl shadow-lg">
                  {selectedChild.avatar || '👤'}
                </div>
              )}
              
              <label className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg transition-all">
                  <Camera className="w-5 h-5" />
                  <span className="font-medium">Escolher Foto</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {profilePhotoPreview && (
              <Button 
                onClick={handleSaveProfilePhoto} 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg h-12"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Salvar Foto
              </Button>
            )}
            
            <Button 
              onClick={() => {
                setShowProfileDialog(false);
                setProfilePhotoPreview(null);
              }} 
              variant="outline" 
              className="w-full border-2 h-12"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Progress Bars Premium */}
        <Card className="border-4 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xl sm:text-2xl">
              <Target className="w-6 h-6 sm:w-7 sm:h-7" />
              Progresso dos Desafios
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Acompanhe seu desempenho em cada tipo de missão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-base sm:text-lg">Desafios Diários</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {dailyProgress.completed} / {dailyProgress.total}
                </span>
              </div>
              <Progress value={dailyProgress.percentage} className="h-3 sm:h-4 bg-orange-100 dark:bg-orange-900" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {dailyProgress.total > 0 
                  ? `${Math.round(dailyProgress.percentage)}% completo`
                  : 'Nenhum desafio diário disponível'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-base sm:text-lg">Missões Semanais</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {weeklyProgress.completed} / {weeklyProgress.total}
                </span>
              </div>
              <Progress value={weeklyProgress.percentage} className="h-3 sm:h-4 bg-blue-100 dark:bg-blue-900" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {weeklyProgress.total > 0 
                  ? `${Math.round(weeklyProgress.percentage)}% completo`
                  : 'Nenhuma missão semanal disponível'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-base sm:text-lg">Objetivos Mensais</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {monthlyProgress.completed} / {monthlyProgress.total}
                </span>
              </div>
              <Progress value={monthlyProgress.percentage} className="h-3 sm:h-4 bg-purple-100 dark:bg-purple-900" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {monthlyProgress.total > 0 
                  ? `${Math.round(monthlyProgress.percentage)}% completo`
                  : 'Nenhum objetivo mensal disponível'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Reward Premium */}
        {nextReward && (
          <Card className="border-4 border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xl sm:text-2xl">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse-glow" />
                Próxima Recompensa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-base sm:text-lg">{nextReward.title}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                    {selectedChild.currentPoints} / {nextReward.pointsRequired} pontos
                  </span>
                </div>
                <Progress value={progressToNextReward} className="h-4 sm:h-5" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Faltam apenas <strong className="text-purple-600 dark:text-purple-400">{Math.max(0, nextReward.pointsRequired - selectedChild.currentPoints)} pontos</strong> para conquistar!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Tasks Premium */}
        <Card className="border-4 border-orange-200 dark:border-orange-700 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500 animate-pulse-glow" />
              Suas Missões
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Complete as tarefas e ganhe pontos!</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Você completou todas as missões! 🎉</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Aguarde novas missões dos seus pais</p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {renderTasksByType(dailyTasks, 'daily', <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />, 'border-l-orange-500', 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900 dark:to-yellow-900')}
                {renderTasksByType(weeklyTasks, 'weekly', <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />, 'border-l-blue-500', 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900')}
                {renderTasksByType(monthlyTasks, 'monthly', <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />, 'border-l-purple-500', 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Waiting Approval */}
        {completedTasks.length > 0 && (
          <Card className="border-4 border-yellow-200 dark:border-yellow-700 shadow-2xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-xl sm:text-2xl">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                Aguardando Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-yellow-100 dark:bg-yellow-800 rounded-lg border-2 border-yellow-300 dark:border-yellow-600">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{task.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Seus pais vão revisar em breve</p>
                    </div>
                    <Badge variant="secondary" className="w-fit">Aguardando</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Rewards Premium */}
        <Card className="border-4 border-purple-200 dark:border-purple-700 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xl sm:text-2xl">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse-glow" />
              Recompensas Disponíveis
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">Troque seus pontos por prêmios incríveis!</CardDescription>
          </CardHeader>
          <CardContent>
            {availableRewards.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">Nenhuma recompensa disponível</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Peça para seus pais criarem recompensas!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {availableRewards.map(reward => {
                  const canClaim = selectedChild.currentPoints >= reward.pointsRequired;
                  return (
                    <Card
                      key={reward.id}
                      className={`border-4 ${canClaim ? 'border-green-400 dark:border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900' : 'border-gray-200 dark:border-gray-700'} shadow-xl hover:scale-105 transition-transform`}
                    >
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                          <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 ${canClaim ? 'text-green-600 dark:text-green-400 animate-pulse-glow' : 'text-gray-400'}`} />
                          {reward.title}
                        </CardTitle>
                        {reward.expiresAt && (
                          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            Válido até {formatDate(reward.expiresAt)}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{reward.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Custo:</span>
                          <span className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">{reward.pointsRequired} pontos</span>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedRewardId(reward.id);
                            setShowRewardDialog(true);
                          }}
                          disabled={!canClaim}
                          className={`w-full text-base sm:text-lg h-12 ${canClaim ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg' : ''}`}
                        >
                          {canClaim ? 'Resgatar Agora! 🎉' : `Faltam ${reward.pointsRequired - selectedChild.currentPoints} pontos`}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claimed Rewards */}
        {claimedRewards.length > 0 && (
          <Card className="border-4 border-green-200 dark:border-green-700 shadow-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xl sm:text-2xl">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse-glow" />
                Seus Prêmios Conquistados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {claimedRewards.map(reward => (
                  <div key={reward.id} className="p-4 bg-green-100 dark:bg-green-800 rounded-lg border-4 border-green-300 dark:border-green-600 text-center hover:scale-105 transition-transform shadow-lg">
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base">{reward.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Conquistado! 🎉</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Reward Claim Dialog */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="border-4 border-purple-300 dark:border-purple-600 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl">🎉 Parabéns!</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">Você está prestes a resgatar uma recompensa!</DialogDescription>
          </DialogHeader>
          {selectedRewardId && (() => {
            const reward = rewards.find(r => r.id === selectedRewardId);
            return reward ? (
              <div className="space-y-4 pt-4">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                  <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-purple-600 dark:text-purple-400 mx-auto mb-3 animate-pulse-glow" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{reward.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{reward.description}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Custo:</span>
                  <span className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{reward.pointsRequired} pontos</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Seus pontos após resgate:</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedChild.currentPoints - reward.pointsRequired} pontos
                  </span>
                </div>
                <Button
                  onClick={() => handleClaimReward(reward.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg sm:text-xl h-12 sm:h-14 shadow-lg"
                >
                  Confirmar Resgate! 🎁
                </Button>
              </div>
            ) : null;
          })()}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md mx-4 border-4 border-purple-300 dark:border-purple-600">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl text-center">🎉 Conquista Desbloqueada!</DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Compartilhe sua conquista e inspire outras crianças!
            </DialogDescription>
          </DialogHeader>
          {claimedRewardForShare && (
            <div className="space-y-4 sm:space-y-6 pt-4">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 rounded-xl border-4 border-purple-300 dark:border-purple-600 shadow-lg">
                <div className="text-center mb-4">
                  <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-500 mx-auto mb-3 drop-shadow-lg animate-pulse-glow" />
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {claimedRewardForShare.title}
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-4 py-2 rounded-full">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-purple-700 dark:text-purple-300 text-sm sm:text-base">{claimedRewardForShare.pointsRequired} pontos</span>
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p className="font-semibold mb-2">🎉 Acabei de conquistar esta recompensa no KidQuest!</p>
                  <p>Com {claimedRewardForShare.pointsRequired} pontos de esforço e dedicação, consegui essa conquista incrível! 💪✨</p>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    KidQuest
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center font-medium">Compartilhar em:</p>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={() => handleShare('facebook')}
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white gap-2 text-sm"
                  >
                    <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    Facebook
                  </Button>
                  
                  <Button
                    onClick={() => handleShare('twitter')}
                    className="bg-[#1DA1F2] hover:bg-[#1A94DA] text-white gap-2 text-sm"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    Twitter
                  </Button>
                  
                  <Button
                    onClick={() => handleShare('whatsapp')}
                    className="bg-[#25D366] hover:bg-[#22C55E] text-white gap-2 text-sm"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    className="gap-2 border-2 text-sm"
                  >
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                    Copiar
                  </Button>
                </div>

                <Button
                  onClick={() => setShowShareDialog(false)}
                  variant="ghost"
                  className="w-full"
                >
                  Agora não
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
