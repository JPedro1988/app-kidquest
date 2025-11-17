'use client';

import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Star, Trophy, Camera, CheckCircle, Gift, Zap } from 'lucide-react';
import { Child } from '@/lib/types';

export default function ChildDashboard() {
  const { profile, children, selectedChild, setSelectedChild, tasks, rewards, updateTask, updateReward, updateChildPoints, logout } = useApp();
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);

  useEffect(() => {
    if (profile !== 'child') {
      router.push('/');
    }
  }, [profile, router]);

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteTask = (taskId: string) => {
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

  const handleClaimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && selectedChild && selectedChild.currentPoints >= reward.pointsRequired) {
      updateReward(rewardId, { claimed: true, claimedAt: new Date() });
      updateChildPoints(selectedChild.id, -reward.pointsRequired);
      setShowRewardDialog(false);
      setSelectedRewardId(null);
    }
  };

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">🎮 Quem está jogando?</CardTitle>
            <CardDescription className="text-lg">Selecione seu perfil para começar</CardDescription>
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhuma criança cadastrada ainda</p>
                <p className="text-sm text-gray-400">Peça para seus pais criarem seu perfil!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {children.map(child => (
                  <Card
                    key={child.id}
                    className="cursor-pointer hover:scale-105 transition-transform border-4 border-purple-200 hover:border-purple-400"
                    onClick={() => handleSelectChild(child)}
                  >
                    <CardHeader className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl">
                        {child.avatar || '👤'}
                      </div>
                      <CardTitle className="text-2xl">{child.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-2 text-yellow-600">
                        <Star className="w-5 h-5 fill-yellow-500" />
                        <span className="text-xl font-bold">{child.currentPoints} pontos</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <Button onClick={logout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const childTasks = tasks.filter(t => t.childId === selectedChild.id);
  const pendingTasks = childTasks.filter(t => t.status === 'pending');
  const completedTasks = childTasks.filter(t => t.status === 'completed');
  const approvedTasks = childTasks.filter(t => t.status === 'approved');
  const availableRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed);

  const nextReward = availableRewards.sort((a, b) => a.pointsRequired - b.pointsRequired)[0];
  const progressToNextReward = nextReward
    ? Math.min((selectedChild.currentPoints / nextReward.pointsRequired) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur">
                {selectedChild.avatar || '👤'}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Olá, {selectedChild.name}! 👋</h1>
                <p className="text-white/90">Continue suas aventuras!</p>
              </div>
            </div>
            <Button onClick={() => setSelectedChild(null)} variant="secondary" className="gap-2">
              <LogOut className="w-4 h-4" />
              Trocar
            </Button>
          </div>

          {/* Points Display */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-medium">Pontos</span>
              </div>
              <p className="text-3xl font-bold">{selectedChild.currentPoints}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Total XP</span>
              </div>
              <p className="text-3xl font-bold">{selectedChild.totalPoints}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Concluídas</span>
              </div>
              <p className="text-3xl font-bold">{approvedTasks.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-orange-300" />
                <span className="text-sm font-medium">Prêmios</span>
              </div>
              <p className="text-3xl font-bold">{claimedRewards.length}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Progress to Next Reward */}
        {nextReward && (
          <Card className="border-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Gift className="w-6 h-6" />
                Próxima Recompensa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{nextReward.title}</span>
                  <span className="text-sm text-gray-600">
                    {selectedChild.currentPoints} / {nextReward.pointsRequired} pontos
                  </span>
                </div>
                <Progress value={progressToNextReward} className="h-4" />
                <p className="text-sm text-gray-600">
                  Faltam apenas <strong>{Math.max(0, nextReward.pointsRequired - selectedChild.currentPoints)} pontos</strong> para conquistar!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-500" />
              Suas Missões de Hoje
            </CardTitle>
            <CardDescription>Complete as tarefas e ganhe pontos!</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Você completou todas as missões! 🎉</p>
                <p className="text-sm text-gray-400">Aguarde novas missões dos seus pais</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map(task => (
                  <Card key={task.id} className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <Badge className="bg-green-600 text-white">
                            <Star className="w-3 h-3 mr-1 fill-white" />
                            +{task.points} XP
                          </Badge>
                        </div>
                      </div>

                      {selectedTaskId === task.id ? (
                        <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Tire uma foto como prova:</p>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoCapture}
                            className="w-full text-sm"
                          />
                          {photoPreview && (
                            <div>
                              <img src={photoPreview} alt="Preview" className="w-full max-w-sm rounded-lg border-2 mb-3" />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleCompleteTask(task.id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Enviar Tarefa
                                </Button>
                                <Button
                                  onClick={() => {
                                    setSelectedTaskId(null);
                                    setPhotoPreview(null);
                                  }}
                                  variant="outline"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedTaskId(task.id)}
                          className="w-full mt-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Marcar como Concluída
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Waiting Approval */}
        {completedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <CheckCircle className="w-6 h-6" />
                Aguardando Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-600">Seus pais vão revisar em breve</p>
                    </div>
                    <Badge variant="secondary">Aguardando</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Gift className="w-6 h-6" />
              Recompensas Disponíveis
            </CardTitle>
            <CardDescription>Troque seus pontos por prêmios incríveis!</CardDescription>
          </CardHeader>
          <CardContent>
            {availableRewards.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma recompensa disponível</p>
                <p className="text-sm text-gray-400">Peça para seus pais criarem recompensas!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {availableRewards.map(reward => {
                  const canClaim = selectedChild.currentPoints >= reward.pointsRequired;
                  return (
                    <Card
                      key={reward.id}
                      className={`border-2 ${canClaim ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Trophy className={`w-5 h-5 ${canClaim ? 'text-green-600' : 'text-gray-400'}`} />
                          {reward.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">Custo:</span>
                          <span className="text-lg font-bold text-purple-600">{reward.pointsRequired} pontos</span>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedRewardId(reward.id);
                            setShowRewardDialog(true);
                          }}
                          disabled={!canClaim}
                          className={`w-full ${canClaim ? 'bg-green-600 hover:bg-green-700' : ''}`}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Trophy className="w-6 h-6" />
                Seus Prêmios Conquistados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {claimedRewards.map(reward => (
                  <div key={reward.id} className="p-4 bg-green-50 rounded-lg border-2 border-green-200 text-center">
                    <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-800">{reward.title}</p>
                    <p className="text-xs text-gray-600 mt-1">Conquistado! 🎉</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Reward Claim Dialog */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Parabéns!</DialogTitle>
            <DialogDescription>Você está prestes a resgatar uma recompensa!</DialogDescription>
          </DialogHeader>
          {selectedRewardId && (() => {
            const reward = rewards.find(r => r.id === selectedRewardId);
            return reward ? (
              <div className="space-y-4 pt-4">
                <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <Trophy className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.title}</h3>
                  <p className="text-gray-600">{reward.description}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Custo:</span>
                  <span className="text-xl font-bold text-purple-600">{reward.pointsRequired} pontos</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Seus pontos após resgate:</span>
                  <span className="text-xl font-bold text-green-600">
                    {selectedChild.currentPoints - reward.pointsRequired} pontos
                  </span>
                </div>
                <Button
                  onClick={() => handleClaimReward(reward.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg h-12"
                >
                  Confirmar Resgate! 🎁
                </Button>
              </div>
            ) : null;
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
