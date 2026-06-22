// ============================================================
// RecipeOS — TanStack Query hooks for Supabase data
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { Recipe, PantryItem, PrepTask, Category } from './types';

// ---- CATEGORIES ----

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as Category[];
    },
    staleTime: Infinity, // categories never change
  });
}

// ---- RECIPES ----

export function useRecipes(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['recipes', search, categoryId],
    queryFn: async () => {
      let q = supabase
        .from('recipes')
        .select('*, category:categories(id, name, icon)')
        .order('name');
      if (search) q = q.ilike('name', `%${search}%`);
      if (categoryId) q = q.eq('category_id', categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return data as Recipe[];
    },
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          category:categories(id, name, icon),
          steps:recipe_steps(* order by step_number asc),
          ingredients:recipe_ingredients(
            *, ingredient:ingredients(id, name, default_unit, grams_per_cup)
            order by sort_order asc
          )
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Recipe;
    },
    enabled: !!id,
  });
}

export function useAddRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: Partial<Recipe>) => {
      const { data, error } = await supabase.from('recipes').insert(recipe).select().single();
      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

// ---- PANTRY ----

export function usePantry(lowStockOnly = false) {
  return useQuery({
    queryKey: ['pantry', lowStockOnly],
    queryFn: async () => {
      let q = supabase.from('pantry').select('*').order('name_override');
      const { data, error } = await q;
      if (error) throw error;
      const items = (data as any[]).map((item) => ({
        ...item,
        displayName: item.name_override ?? item.ingredient?.name ?? 'Unknown',
        isLow: item.reorder_at != null && item.quantity <= item.reorder_at,
      })) as PantryItem[];
      return lowStockOnly ? items.filter((i) => i.isLow) : items;
    },
  });
}

export function useUpdatePantry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase.from('pantry').update({ quantity }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pantry'] }),
  });
}

// ---- PREP TASKS ----

export function usePrepTasks(date?: string) {
  const targetDate = date ?? new Date().toISOString().slice(0, 10);
  return useQuery({
    queryKey: ['prep', targetDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prep_tasks')
        .select('*')
        .eq('scheduled_for', targetDate)
        .order('sort_order');
      if (error) throw error;
      return data as PrepTask[];
    },
  });
}

export function useTogglePrepTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_done }: { id: string; is_done: boolean }) => {
      const { error } = await supabase
        .from('prep_tasks')
        .update({ is_done, completed_at: is_done ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      const date = new Date().toISOString().slice(0, 10);
      qc.invalidateQueries({ queryKey: ['prep', date] });
    },
  });
}
