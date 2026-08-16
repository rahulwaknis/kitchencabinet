export type DebateStyle = 'concise' | 'verbose'

export interface FormInput {
  ingredients: string
  mealType: string
  timeAvailable: string
  preference: string
  servings: number
  debateStyle?: DebateStyle
}

export interface ParsedInventory {
  proteins: string[]
  vegetables: string[]
  carbs: string[]
  dairy: string[]
  leftovers: string[]
  urgent_use: string[]
  assumed_staples: string[]
}

export interface CandidateRecipe {
  name: string
  uses: string[]
  missing_ingredients: string[]
  estimated_time_minutes: number
  short_description: string
  taste_note?: string
}

export interface Agent {
  id: string
  name: string
  role: string
  icon: string
  shortDescription?: string
  focus?: string
  debateStyle?: string
  personality?: string
  scoring_focus?: string
  scoringFocus?: string
  motto?: string
  loadingLine?: string
  color?: string
  colorTheme?: string
  avatarInitials?: string
  avatarEmoji?: string
  speechStyle?: string
  caresAbout?: string
  objectsTo?: string
  exampleLine?: string
}

export interface Moderator {
  id: string
  name: string
  role: string
  icon: string
  personality?: string
  scoring_focus?: string
  scoringFocus?: string
  motto?: string
  loadingLine?: string
  color?: string
  colorTheme?: string
  avatarInitials?: string
  avatarEmoji?: string
  speechStyle?: string
  caresAbout?: string
  objectsTo?: string
  exampleLine?: string
}

export interface AgentScore {
  agent_id: string
  agent_name: string
  agent_icon: string
  score: number
  note: string
}

export interface RecipeEvaluation {
  recipe_name: string
  agent_scores: AgentScore[]
  average_score: number
  moderator_note?: string
}

export interface DialogueLine {
  agent_id: string
  agent_name: string
  agent_icon: string
  tone?: string
  mood?: string
  line: string
}

export interface RecipeDiscussion {
  recipe_name: string
  status: 'selected' | 'eliminated' | 'backup'
  supporting_agents: string[]
  objecting_agents: string[]
  dialogue: DialogueLine[]
  moderator_decision: string
}

export interface CabinetMeeting {
  opening_note: string
  recipe_discussions: RecipeDiscussion[]
  closing_note: string
}

export interface AgentNotes {
  nutrition_agent: string
  time_agent: string
  waste_saver_agent: string
  feasibility_agent: string
  taste_agent?: string
}

export interface AgentScoreItem {
  recipe_name: string
  nutrition_score: number
  time_score: number
  waste_saver_score: number
  feasibility_score: number
  final_score: number
  agent_notes: AgentNotes
}

export interface EliminatedRecipe {
  name: string
  reason: string
}

export interface FinalRecommendation {
  rank: number
  name: string
  why_selected: string
  uses: string[]
  missing_ingredients: string[]
  estimated_time_minutes: number
  difficulty: string
  best_for: string
  steps: string[]
}

export interface CabinetResponse {
  parsed_inventory: ParsedInventory
  candidate_recipes: CandidateRecipe[]
  // legacy fixed structure (Phase1/2)
  agent_scorecard?: AgentScoreItem[]
  // new flexible structure (Phase3)
  recipe_evaluations?: RecipeEvaluation[]
  selected_agents?: Agent[]
  moderator?: Moderator
  eliminated_recipes: EliminatedRecipe[]
  final_recommendations: FinalRecommendation[]
  cabinet_summary: string
  // Phase 4: optional cabinet meeting for verbose mode
  cabinet_meeting?: CabinetMeeting | null
}

export interface KitchenCabinetResponse extends CabinetResponse {}
