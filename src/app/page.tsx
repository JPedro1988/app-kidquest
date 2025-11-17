'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Baby, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import { Logo } from '@/components/custom/Logo';

export default function Home() {
  const router = useRouter();

  const handleQuickAccess = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-300/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1.5s' }} />
        <Star className="absolute top-10 right-10 w-8 h-8 text-yellow-300/40 animate-pulse" />
        <Trophy className="absolute bottom-10 left-10 w-10 h-10 text-yellow-300/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute top-1/3 left-1/4 w-6 h-6 text-pink-300/40 animate-pulse" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-1/3 right-1/4 w-7 h-7 text-orange-300/40 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-float">
            KidQuest
          </h1>
          <p className="text-xl md:text-3xl text-white/95 drop-shadow-lg font-semibold">
            ✨ Transforme tarefas em aventuras épicas! ✨
          </p>
          <p className="text-md md:text-lg text-white/80 mt-2 drop-shadow">
            Ganhe pontos, complete missões e conquiste recompensas incríveis!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300 animate-pulse-glow">
                <User className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                Sou Pai/Mãe
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                🎯 Crie missões épicas e recompensas
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                onClick={() => handleQuickAccess('/parent')}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Entrar como Responsável
              </Button>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Criar tarefas e missões
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-blue-500" />
                  Definir recompensas
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-500" />
                  Aprovar conclusões
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Acompanhar progresso
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-4 relative z-10">
              <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
                <Baby className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-orange-400">
                Sou Criança
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                🚀 Complete missões e ganhe prêmios
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                onClick={() => handleQuickAccess('/child')}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Entrar como Criança
              </Button>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-500" />
                  Ver suas missões
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-pink-500" />
                  Marcar como concluída
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-pink-500" />
                  Enviar foto de prova
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Ganhar pontos e prêmios
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-white/90 text-sm md:text-base font-medium flex items-center gap-2 justify-center">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Pais criam as missões, crianças completam e ganham recompensas!
              <Trophy className="w-5 h-5 text-yellow-300" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
