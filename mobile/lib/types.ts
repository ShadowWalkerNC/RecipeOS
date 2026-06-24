export interface Category {
  id: string;
  name: string;
  icon?: string;
  sort_order?: number;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id?: string;
  name_override?: string;
  amount: number;
  unit?: string;
  sort_order: number;
  ingredient?: { id: string; name: string; default_unit?: string; grams_per_cup?: number };
}

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category_id?: string;
  category?: Category;
  base_servings: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  yield_amount?: number;
  yield_unit?: string;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}

export interface PantryItem {
  id: string;
  user_id: string;
  ingredient_id?: string;
  name_override?: string;
  displayName: string;
  quantity: number;
  unit?: string;
  reorder_at?: number;
  location?: string;
  isLow: boolean;
  updated_at: string;
}

export interface PrepTask {
  id: string;
  user_id: string;
  prep_list_id?: string;
  task: string;
  station?: string;
  estimated_minutes?: number;
  scheduled_for?: string;
  is_done: boolean;
  completed_at?: string;
  sort_order: number;
}

export interface PrepList {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  tasks?: PrepTask[];
}
