import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

// Gerar código único de família (6 caracteres)
export function generateFamilyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Registrar novo usuário
export async function registerUser(data: {
  email: string
  password: string
  name: string
  profile: 'parent' | 'child'
  familyCode?: string
  age?: number
}) {
  try {
    // Hash da senha
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Se for pai, gerar código de família
    let familyCode = data.familyCode
    let parentId = null

    if (data.profile === 'parent') {
      familyCode = generateFamilyCode()
    } else if (data.profile === 'child' && data.familyCode) {
      // Buscar pai pelo código de família
      const { data: parent, error: parentError } = await supabase
        .from('users')
        .select('id')
        .eq('family_code', data.familyCode)
        .eq('profile', 'parent')
        .single()

      if (parentError || !parent) {
        throw new Error('Código de família inválido')
      }

      parentId = parent.id
    }

    // Inserir usuário
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: data.email,
        password_hash: passwordHash,
        name: data.name,
        profile: data.profile,
        family_code: familyCode,
        parent_id: parentId,
        age: data.age
      })
      .select()
      .single()

    if (error) throw error

    // Se for criança, criar relacionamento na tabela children
    if (data.profile === 'child' && parentId) {
      await supabase.from('children').insert({
        parent_id: parentId,
        child_id: user.id,
        name: data.name,
        age: data.age
      })
    }

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Login de usuário
export async function loginUser(email: string, password: string) {
  try {
    // Buscar usuário por email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      throw new Error('Email ou senha incorretos')
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos')
    }

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Buscar filhos de um pai
export async function getChildren(parentId: string) {
  const { data, error } = await supabase
    .from('children')
    .select(`
      *,
      child:child_id (
        id,
        name,
        email,
        age
      )
    `)
    .eq('parent_id', parentId)

  return { data, error }
}

// Buscar tarefas de uma criança
export async function getTasks(childId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Buscar recompensas de uma criança
export async function getRewards(childId: string) {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Criar tarefa
export async function createTask(data: {
  childId: string
  parentId: string
  title: string
  description?: string
  points: number
}) {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      child_id: data.childId,
      parent_id: data.parentId,
      title: data.title,
      description: data.description,
      points: data.points
    })
    .select()
    .single()

  return { task, error }
}

// Criar recompensa
export async function createReward(data: {
  childId: string
  parentId: string
  title: string
  description?: string
  pointsRequired: number
}) {
  const { data: reward, error } = await supabase
    .from('rewards')
    .insert({
      child_id: data.childId,
      parent_id: data.parentId,
      title: data.title,
      description: data.description,
      points_required: data.pointsRequired
    })
    .select()
    .single()

  return { reward, error }
}

// Completar tarefa
export async function completeTask(taskId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: true,
      completed_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single()

  return { data, error }
}

// Resgatar recompensa
export async function redeemReward(rewardId: string) {
  const { data, error } = await supabase
    .from('rewards')
    .update({
      redeemed: true,
      redeemed_at: new Date().toISOString()
    })
    .eq('id', rewardId)
    .select()
    .single()

  return { data, error }
}

// Deletar criança
export async function deleteChild(childId: string) {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('child_id', childId)

  return { error }
}

// Deletar recompensa
export async function deleteReward(rewardId: string) {
  const { error } = await supabase
    .from('rewards')
    .delete()
    .eq('id', rewardId)

  return { error }
}

// Atualizar criança
export async function updateChild(childId: string, data: { name: string; age: number }) {
  const { error } = await supabase
    .from('users')
    .update({
      name: data.name,
      age: data.age,
      updated_at: new Date().toISOString()
    })
    .eq('id', childId)

  // Atualizar também na tabela children
  await supabase
    .from('children')
    .update({
      name: data.name,
      age: data.age
    })
    .eq('child_id', childId)

  return { error }
}
