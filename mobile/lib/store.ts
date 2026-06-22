import { create } from 'zustand';
import { Ingredient } from './ratio-engine';

interface RecipeOSState {
  // Active recipe being scaled
  activeRecipeId: string | null;
  setActiveRecipe: (id: string | null) => void;

  // Pantry
  pantryUpdatedAt: string | null;
  setPantryUpdatedAt: (ts: string) => void;
}

export const useAppStore = create<RecipeOSState>((set) => ({
  activeRecipeId: null,
  setActiveRecipe: (id) => set({ activeRecipeId: id }),
  pantryUpdatedAt: null,
  setPantryUpdatedAt: (ts) => set({ pantryUpdatedAt: ts }),
}));
