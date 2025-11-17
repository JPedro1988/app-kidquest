// KidQuest - Auth Types and Utilities (LocalStorage based)

export interface User {
  id: string;
  email: string;
  name: string;
  profile: 'parent' | 'child';
  familyCode?: string;
  parentId?: string;
  age?: number;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Gerar código único de família (6 caracteres)
export function generateFamilyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Gerar ID único
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Registrar novo usuário (localStorage)
export function registerUser(data: {
  email: string;
  password: string;
  name: string;
  profile: 'parent' | 'child';
  familyCode?: string;
  age?: number;
}): { user: User | null; error: string | null } {
  try {
    // Verificar se email já existe
    const users = getAllUsers();
    const existingUser = users.find(u => u.email === data.email);
    
    if (existingUser) {
      return { user: null, error: 'Email já cadastrado' };
    }

    let familyCode = data.familyCode;
    let parentId = undefined;

    if (data.profile === 'parent') {
      familyCode = generateFamilyCode();
    } else if (data.profile === 'child' && data.familyCode) {
      // Buscar pai pelo código de família
      const parent = users.find(u => u.familyCode === data.familyCode && u.profile === 'parent');
      
      if (!parent) {
        return { user: null, error: 'Código de família inválido' };
      }
      
      parentId = parent.id;
    }

    const user: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      profile: data.profile,
      familyCode,
      parentId,
      age: data.age,
      createdAt: new Date(),
    };

    // Salvar usuário
    users.push(user);
    saveAllUsers(users);

    // Salvar senha separadamente (hash simples)
    const passwords = getPasswords();
    passwords[user.id] = btoa(data.password); // Base64 encoding (não é seguro para produção)
    savePasswords(passwords);

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Login de usuário (localStorage)
export function loginUser(email: string, password: string): { user: User | null; error: string | null } {
  try {
    const users = getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { user: null, error: 'Email ou senha incorretos' };
    }

    // Verificar senha
    const passwords = getPasswords();
    const storedPassword = passwords[user.id];
    
    if (!storedPassword || atob(storedPassword) !== password) {
      return { user: null, error: 'Email ou senha incorretos' };
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

// Helpers para localStorage
function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('kidquest-users');
    if (!data) return [];
    
    const users = JSON.parse(data);
    return users.map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }));
  } catch {
    return [];
  }
}

function saveAllUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kidquest-users', JSON.stringify(users));
}

function getPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem('kidquest-passwords');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function savePasswords(passwords: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kidquest-passwords', JSON.stringify(passwords));
}
