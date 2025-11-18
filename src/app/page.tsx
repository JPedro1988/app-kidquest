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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
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
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl animate-float px-2">
            KidQuest
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-white/95 drop-shadow-lg font-semibold px-3">
            ✨ Transforme tarefas em aventuras épicas! ✨
          </p>
          <p className="text-sm sm:text-md md:text-lg text-white/80 mt-2 drop-shadow px-3">
            Ganhe pontos, complete missões e conquiste recompensas incríveis!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-2">
          <Card className="hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-3 sm:pb-4 relative z-10 px-3 sm:px-6">
              <div className="mx-auto mb-3 sm:mb-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300 animate-pulse-glow">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                Sou Pai/Mãe
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
                🎯 Crie missões épicas e recompensas
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 px-3 sm:px-6 pb-4 sm:pb-6">
              <Button
                onClick={() => handleQuickAccess('/parent')}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Entrar como Responsável
              </Button>
              <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span>Criar tarefas e missões</span>
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span>Definir recompensas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span>Aprovar conclusões</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span>Acompanhar progresso</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-3 sm:pb-4 relative z-10 px-3 sm:px-6">
              <div className="mx-auto mb-3 sm:mb-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
                <Baby className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-orange-400">
                Sou Criança
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
                🚀 Complete missões e ganhe prêmios
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 px-3 sm:px-6 pb-4 sm:pb-6">
              <Button
                onClick={() => handleQuickAccess('/child')}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Entrar como Criança
              </Button>
              <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" />
                  <span>Ver suas missões</span>
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" />
                  <span>Marcar como concluída</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" />
                  <span>Enviar foto de prova</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 flex-shrink-0" />
                  <span>Ganhar pontos e prêmios</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 sm:mt-8 text-center px-2">
          <div className="inline-block bg-white/20 dark:bg-gray-900/20 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
            <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium flex items-center gap-2 justify-center flex-wrap">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-center">Pais criam as missões, crianças completam e ganham recompensas!</span>
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
