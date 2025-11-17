'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Baby } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to appropriate page
    if (isAuthenticated && user) {
      if (user.type === 'parent') {
        router.push('/parent');
      } else if (user.type === 'child') {
        router.push('/child');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSelectProfile = (profile: 'parent' | 'child') => {
    router.push('/login');
  };

  // Show loading while checking auth
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎮 KidQuest
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow">
            Transforme tarefas em aventuras!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:scale-105 transition-transform duration-300 cursor-pointer border-4 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Sou Pai/Mãe</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Crie missões e recompensas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleSelectProfile('parent')}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              >
                Entrar como Responsável
              </Button>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ Criar tarefas e missões</li>
                <li>✓ Definir recompensas</li>
                <li>✓ Aprovar conclusões</li>
                <li>✓ Acompanhar progresso</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 cursor-pointer border-4 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <Baby className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800">Sou Criança</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Complete missões e ganhe prêmios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleSelectProfile('child')}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg"
              >
                Entrar como Criança
              </Button>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>✓ Ver suas missões</li>
                <li>✓ Marcar como concluída</li>
                <li>✓ Enviar foto de prova</li>
                <li>✓ Ganhar pontos e prêmios</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          <p>💡 Dica: Pais criam as missões, crianças completam e ganham recompensas!</p>
        </div>
      </div>
    </div>
  );
}
