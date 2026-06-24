import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { Recipe, PantryItem, PrepTask, PrepList, Category } from './types';

// ---- CATEGORIES ----

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order');
      if (error) throw error;
      return data as Category[];
    },
    staleTime: Infinity,
  });
}

// ---- RECIPES ----

export function useRecipes(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['recipes', search, categoryId],
    queryFn: async () => {
      let q = supabase.from('recipes').select('*, category:categories(id, name, icon)').order('name');
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('recipes')
        .insert({ ...recipe, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

// ---- PANTRY ----

export function usePantry(lowStockOnly = false) {
  return useQuery({
    queryKey: ['pantry', lowStockOnly],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .order('name_override');
      if (error) throw error;
      const items = (data as any[]).map((item) => ({
        ...item,
        displayName: item.name_override ?? 'Unknown',
        isLow: item.reorder_at != null && item.quantity <= item.reorder_at,
      })) as PantryItem[];
      return lowStockOnly ? items.filter((i) => i.isLow) : items;
    },
  });
}

export function useAddPantryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: { name_override: string; quantity: number; unit?: string; reorder_at?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('pantry_items').insert({ ...item, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pantry'] }),
  });
}

export function useUpdatePantryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase
        .from('pantry_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pantry'] }),
  });
}

export function useDeletePantryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pantry_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pantry'] }),
  });
}

// ---- PREP LISTS ----

export function usePrepLists(date?: string) {
  return useQuery({
    queryKey: ['prep-lists', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prep_lists')
        .select('*, tasks:prep_tasks(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PrepList[];
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prep-lists'] }),
  });
}
