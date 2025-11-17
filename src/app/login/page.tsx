'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser, registerUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Baby, Lock, Mail, UserCircle, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register states
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerType, setRegisterType] = useState<'parent' | 'child'>('parent');
  const [familyCode, setFamilyCode] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    const result = loginUser(loginEmail, loginPassword);
    
    setIsLoading(false);

    if (result.success && result.user) {
      login(result.user);
      
      // Redirect based on user type
      if (result.user.type === 'parent') {
        router.push('/parent');
      } else {
        router.push('/child');
      }
    } else {
      setLoginError(result.error || 'Erro ao fazer login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    const result = registerUser(
      registerEmail,
      registerPassword,
      registerName,
      registerType,
      registerType === 'child' ? familyCode : undefined
    );
    
    setIsLoading(false);

    if (result.success && result.user) {
      // Show family code for parents
      if (registerType === 'parent' && result.user.familyCode) {
        setGeneratedCode(result.user.familyCode);
      } else {
        // Auto-login after registration
        login(result.user);
        
        if (result.user.type === 'parent') {
          router.push('/parent');
        } else {
          router.push('/child');
        }
      }
    } else {
      setRegisterError(result.error || 'Erro ao criar conta');
    }
  };

  const handleContinueAfterCode = () => {
    // After showing code, login the user
    const result = loginUser(registerEmail, registerPassword);
    if (result.success && result.user) {
      login(result.user);
      router.push('/parent');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🎮 KidQuest
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            Transforme tarefas em aventuras!
          </p>
        </div>

        {generatedCode ? (
          <Card className="shadow-2xl border-4 border-white/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Conta Criada com Sucesso!</CardTitle>
              <CardDescription>Guarde este código para seus filhos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Código da Família:</p>
                <p className="text-4xl font-bold text-purple-600 tracking-wider">
                  {generatedCode}
                </p>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm text-gray-700">
                  <strong>Importante:</strong> Compartilhe este código com seus filhos para que eles possam criar suas contas e se conectar com você!
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleContinueAfterCode}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Continuar para o Painel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-2xl border-4 border-white/20">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <CardHeader>
                  <CardTitle>Bem-vindo de volta!</CardTitle>
                  <CardDescription>Entre com seu email e senha</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <CardHeader>
                  <CardTitle>Criar Nova Conta</CardTitle>
                  <CardDescription>Preencha os dados abaixo</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    {registerError && (
                      <Alert variant="destructive">
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    {/* User Type Selection */}
                    <div className="space-y-2">
                      <Label>Tipo de Conta</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={registerType === 'parent' ? 'default' : 'outline'}
                          className={`h-20 ${
                            registerType === 'parent'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : ''
                          }`}
                          onClick={() => setRegisterType('parent')}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <User className="w-6 h-6" />
                            <span className="text-sm">Pai/Mãe</span>
                          </div>
                        </Button>
                        <Button
                          type="button"
                          variant={registerType === 'child' ? 'default' : 'outline'}
                          className={`h-20 ${
                            registerType === 'child'
                              ? 'bg-gradient-to-r from-pink-500 to-orange-500'
                              : ''
                          }`}
                          onClick={() => setRegisterType('child')}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Baby className="w-6 h-6" />
                            <span className="text-sm">Criança</span>
                          </div>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome</Label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Seu nome"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {registerType === 'child' && (
                      <div className="space-y-2">
                        <Label htmlFor="family-code">Código da Família</Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="family-code"
                            type="text"
                            placeholder="Digite o código dos seus pais"
                            value={familyCode}
                            onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                            className="pl-10 uppercase"
                            maxLength={6}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Peça o código para seus pais
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className={`w-full h-12 ${
                        registerType === 'parent'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                          : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600'
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>💡 Pais criam conta primeiro e recebem um código</p>
          <p>Crianças usam o código para se conectar aos pais</p>
        </div>
      </div>
    </div>
  );
}
