// KidQuest - Sugestões Inteligentes
import { TaskSuggestion, RewardSuggestion, TaskPackage } from './types';

// Categorias de Tarefas
export const taskCategories = [
  { id: 'home', name: 'Casa & Organização', icon: '🏠', color: 'bg-blue-500' },
  { id: 'school', name: 'Escola & Estudo', icon: '📚', color: 'bg-green-500' },
  { id: 'health', name: 'Saúde & Bem-Estar', icon: '💪', color: 'bg-red-500' },
  { id: 'behavior', name: 'Comportamento', icon: '⭐', color: 'bg-yellow-500' },
  { id: 'digital', name: 'Digital & Tecnologia', icon: '💻', color: 'bg-purple-500' },
  { id: 'routine', name: 'Rotina & Responsabilidade', icon: '⏰', color: 'bg-orange-500' },
];

// Sugestões de Tarefas por Categoria
export const taskSuggestions: TaskSuggestion[] = [
  // Casa & Organização
  { id: '1', title: 'Arrumar a cama', description: 'Deixar a cama arrumada pela manhã', points: 5, category: 'home', ageRange: '3-12' },
  { id: '2', title: 'Guardar 5 brinquedos', description: 'Organizar brinquedos no lugar certo', points: 5, category: 'home', ageRange: '3-8' },
  { id: '3', title: 'Organizar mochila', description: 'Deixar a mochila pronta para o dia seguinte', points: 10, category: 'home', ageRange: '6-12' },
  { id: '4', title: 'Guardar roupas no armário', description: 'Dobrar e guardar roupas limpas', points: 10, category: 'home', ageRange: '6-12' },
  { id: '5', title: 'Ajudar a arrumar a mesa', description: 'Colocar pratos e talheres na mesa', points: 5, category: 'home', ageRange: '3-12' },
  
  // Escola & Estudo
  { id: '6', title: 'Ler 5 minutos', description: 'Ler um livro por 5 minutos', points: 5, category: 'school', ageRange: '6-12' },
  { id: '7', title: 'Terminar a lição', description: 'Completar toda a lição de casa', points: 15, category: 'school', ageRange: '6-12' },
  { id: '8', title: 'Ler 10 páginas', description: 'Ler 10 páginas de um livro', points: 10, category: 'school', ageRange: '6-12' },
  { id: '9', title: 'Ler um capítulo inteiro', description: 'Completar a leitura de um capítulo', points: 25, category: 'school', ageRange: '9-12' },
  { id: '10', title: 'Tirar nota acima de 8', description: 'Conseguir nota 8 ou mais em prova/trabalho', points: 30, category: 'school', ageRange: '6-12' },
  { id: '11', title: 'Fazer lição extra', description: 'Fazer exercícios extras de estudo', points: 20, category: 'school', ageRange: '9-12' },
  
  // Saúde & Bem-Estar
  { id: '12', title: 'Beber um copo de água', description: 'Tomar água durante o dia', points: 3, category: 'health', ageRange: '3-12' },
  { id: '13', title: 'Comer uma fruta', description: 'Comer uma fruta saudável', points: 5, category: 'health', ageRange: '3-12' },
  { id: '14', title: 'Escovar os dentes', description: 'Escovar os dentes após as refeições', points: 5, category: 'health', ageRange: '3-12' },
  { id: '15', title: 'Beber água 3 vezes', description: 'Tomar pelo menos 3 copos de água no dia', points: 10, category: 'health', ageRange: '3-12' },
  { id: '16', title: 'Fazer exercício físico', description: 'Praticar atividade física por 20 minutos', points: 15, category: 'health', ageRange: '6-12' },
  
  // Comportamento
  { id: '17', title: 'Ser educado', description: 'Usar palavras mágicas: por favor, obrigado, desculpa', points: 10, category: 'behavior', ageRange: '3-12' },
  { id: '18', title: 'Não brigar com irmãos', description: 'Passar o dia sem brigar', points: 20, category: 'behavior', ageRange: '3-12' },
  { id: '19', title: 'Ajudar um adulto', description: 'Oferecer ajuda em alguma tarefa', points: 20, category: 'behavior', ageRange: '6-12' },
  { id: '20', title: 'Dividir brinquedos', description: 'Compartilhar brinquedos com irmãos ou amigos', points: 15, category: 'behavior', ageRange: '3-8' },
  
  // Digital & Tecnologia
  { id: '21', title: 'Desligar telas no horário', description: 'Desligar tablet/TV no horário combinado', points: 10, category: 'digital', ageRange: '6-12' },
  { id: '22', title: 'Usar tablet com limite', description: 'Respeitar o tempo de uso de telas', points: 10, category: 'digital', ageRange: '6-12' },
  { id: '23', title: 'Não usar celular na mesa', description: 'Não mexer no celular durante as refeições', points: 10, category: 'digital', ageRange: '9-12' },
  
  // Rotina & Responsabilidade
  { id: '24', title: 'Acordar no horário', description: 'Levantar da cama no horário combinado', points: 10, category: 'routine', ageRange: '6-12' },
  { id: '25', title: 'Tomar banho sozinho', description: 'Tomar banho sem precisar ser chamado', points: 10, category: 'routine', ageRange: '6-12' },
  { id: '26', title: 'Dormir no horário', description: 'Ir para a cama no horário combinado', points: 10, category: 'routine', ageRange: '3-12' },
  { id: '27', title: 'Preparar lanche sozinho', description: 'Fazer um lanche simples sem ajuda', points: 15, category: 'routine', ageRange: '9-12' },
];

// Pacotes de Missões Pré-configurados
export const taskPackages: TaskPackage[] = [
  {
    id: 'organized',
    name: 'Criança Organizada',
    description: 'Pacote de missões prontas para facilitar a sua vida.',
    icon: '🏠',
    tasks: [
      { title: 'Arrumar a cama', description: 'Deixar a cama arrumada pela manhã', points: 5, category: 'home' },
      { title: 'Guardar brinquedos', description: 'Organizar brinquedos no lugar certo', points: 5, category: 'home' },
      { title: 'Organizar mochila', description: 'Deixar a mochila pronta para o dia seguinte', points: 10, category: 'home' },
    ],
  },
  {
    id: 'student',
    name: 'Super Estudante',
    description: 'Missões para incentivar o estudo e a leitura.',
    icon: '📚',
    tasks: [
      { title: 'Ler 10 páginas', description: 'Ler 10 páginas de um livro', points: 10, category: 'school' },
      { title: 'Fazer a lição', description: 'Completar toda a lição de casa', points: 15, category: 'school' },
      { title: 'Lição extra', description: 'Fazer exercícios extras de estudo', points: 25, category: 'school' },
    ],
  },
  {
    id: 'behavior',
    name: 'Comportamento Ninja',
    description: 'Desenvolva bons hábitos de comportamento.',
    icon: '⭐',
    tasks: [
      { title: 'Ser educado', description: 'Usar palavras mágicas: por favor, obrigado, desculpa', points: 10, category: 'behavior' },
      { title: 'Não brigar com irmãos', description: 'Passar o dia sem brigar', points: 20, category: 'behavior' },
      { title: 'Ajudar um adulto', description: 'Oferecer ajuda em alguma tarefa', points: 20, category: 'behavior' },
    ],
  },
  {
    id: 'health',
    name: 'Saúde e Bem-estar',
    description: 'Cuide da saúde com pequenas ações diárias.',
    icon: '💪',
    tasks: [
      { title: 'Comer fruta', description: 'Comer uma fruta saudável', points: 5, category: 'health' },
      { title: 'Beber água 3x', description: 'Tomar pelo menos 3 copos de água no dia', points: 10, category: 'health' },
      { title: 'Escovar dentes', description: 'Escovar os dentes após as refeições', points: 5, category: 'health' },
    ],
  },
];

// Sugestões de Recompensas
export const rewardSuggestions: RewardSuggestion[] = [
  // Pequenas
  { id: 'r1', title: 'Tempo extra de tablet', description: '30 minutos extras de tablet', pointsRequired: 20, category: 'small' },
  { id: 'r2', title: 'Escolher sobremesa', description: 'Escolher a sobremesa do dia', pointsRequired: 15, category: 'small' },
  { id: 'r3', title: 'Jogar 30 min videogame', description: '30 minutos de videogame', pointsRequired: 25, category: 'small' },
  { id: 'r4', title: 'Assistir desenho favorito', description: 'Escolher o desenho para assistir', pointsRequired: 20, category: 'small' },
  
  // Médias
  { id: 'r5', title: 'Passeio no parque', description: 'Ir ao parque no fim de semana', pointsRequired: 50, category: 'medium' },
  { id: 'r6', title: 'Assistir filme escolhido', description: 'Escolher o filme da noite', pointsRequired: 40, category: 'medium' },
  { id: 'r7', title: 'Mini brinquedo', description: 'Ganhar um brinquedo pequeno', pointsRequired: 60, category: 'medium' },
  { id: 'r8', title: 'Sorvete especial', description: 'Ir tomar sorvete', pointsRequired: 45, category: 'medium' },
  { id: 'r9', title: 'Dormir mais tarde', description: 'Dormir 1 hora mais tarde no fim de semana', pointsRequired: 50, category: 'medium' },
  
  // Grandes
  { id: 'r10', title: 'Jogo de videogame', description: 'Ganhar um jogo novo', pointsRequired: 150, category: 'large' },
  { id: 'r11', title: 'Action figure', description: 'Boneco ou figura de ação', pointsRequired: 120, category: 'large' },
  { id: 'r12', title: 'Mesada extra', description: 'Ganhar mesada extra', pointsRequired: 100, category: 'large' },
  { id: 'r13', title: 'Livro novo', description: 'Escolher um livro novo', pointsRequired: 100, category: 'large' },
  { id: 'r14', title: 'Kit de arte', description: 'Kit de materiais de arte', pointsRequired: 130, category: 'large' },
  
  // Épicas
  { id: 'r15', title: 'Bicicleta', description: 'Ganhar uma bicicleta nova', pointsRequired: 500, category: 'epic' },
  { id: 'r16', title: 'Patinete', description: 'Ganhar um patinete', pointsRequired: 400, category: 'epic' },
  { id: 'r17', title: 'Viagem curta', description: 'Viagem de fim de semana', pointsRequired: 600, category: 'epic' },
  { id: 'r18', title: 'Console de videogame', description: 'Ganhar um console novo', pointsRequired: 800, category: 'epic' },
  { id: 'r19', title: 'Tablet', description: 'Ganhar um tablet', pointsRequired: 700, category: 'epic' },
];

// Dicas Inteligentes
export const smartTips = [
  'Use pequenas metas para criar disciplina aos poucos.',
  'Recompensas podem ser experiências, não apenas objetos!',
  'Pais costumam usar missões rápidas no fim do dia. Quer adicionar uma?',
  'Que tal equilibrar missões de estudo com tarefas de casa?',
  'Missões de comportamento ajudam a desenvolver valores importantes.',
  'Lembre-se: consistência é mais importante que perfeição.',
  'Celebre as pequenas conquistas! Elas motivam muito.',
  'Tarefas em família criam memórias e ensinam responsabilidade.',
];

// Filtrar sugestões por idade
export function filterTasksByAge(age: number): TaskSuggestion[] {
  return taskSuggestions.filter(task => {
    const [min, max] = task.ageRange.split('-').map(Number);
    return age >= min && age <= max;
  });
}

// Obter sugestões por categoria
export function getTasksByCategory(category: string): TaskSuggestion[] {
  return taskSuggestions.filter(task => task.category === category);
}

// Obter recompensas por categoria
export function getRewardsByCategory(category: 'small' | 'medium' | 'large' | 'epic'): RewardSuggestion[] {
  return rewardSuggestions.filter(reward => reward.category === category);
}
