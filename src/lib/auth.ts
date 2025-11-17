// KidQuest - Authentication System

export interface User {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  type: 'parent' | 'child';
  name: string;
  familyCode?: string; // Code that links parent and children
  parentId?: string; // For children, reference to their parent
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Generate a unique 6-digit family code
export function generateFamilyCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Simple password validation (min 6 characters)
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// Hash password (simplified - in production use bcrypt or similar)
export function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use proper hashing like bcrypt
  return btoa(password);
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

// Get all users from localStorage
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const users = localStorage.getItem('kidquest-users');
    if (users) {
      const parsed = JSON.parse(users);
      return parsed.map((u: User) => ({
        ...u,
        createdAt: new Date(u.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  
  return [];
}

// Save users to localStorage
export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('kidquest-users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Register new user
export function registerUser(
  email: string,
  password: string,
  name: string,
  type: 'parent' | 'child',
  familyCode?: string
): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email já cadastrado' };
  }
  
  // Validate email
  if (!isValidEmail(email)) {
    return { success: false, error: 'Email inválido' };
  }
  
  // Validate password
  if (!isValidPassword(password)) {
    return { success: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }
  
  // For children, validate family code
  if (type === 'child') {
    if (!familyCode) {
      return { success: false, error: 'Código da família é obrigatório para crianças' };
    }
    
    const parent = users.find(u => u.type === 'parent' && u.familyCode === familyCode);
    if (!parent) {
      return { success: false, error: 'Código da família inválido' };
    }
  }
  
  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    email,
    password: hashPassword(password),
    type,
    name,
    familyCode: type === 'parent' ? generateFamilyCode() : familyCode,
    parentId: type === 'child' ? users.find(u => u.familyCode === familyCode)?.id : undefined,
    createdAt: new Date(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, user: newUser };
}

// Login user
export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, error: 'Email não encontrado' };
  }
  
  if (!verifyPassword(password, user.password)) {
    return { success: false, error: 'Senha incorreta' };
  }
  
  return { success: true, user };
}

// Get children by parent ID
export function getChildrenByParentId(parentId: string): User[] {
  const users = getAllUsers();
  return users.filter(u => u.type === 'child' && u.parentId === parentId);
}

// Get parent by family code
export function getParentByFamilyCode(familyCode: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.type === 'parent' && u.familyCode === familyCode);
}
