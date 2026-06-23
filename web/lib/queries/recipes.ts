import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/lib/supabase/database.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('recipes')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as (Recipe & { category: Database['public']['Tables']['categories']['Row'] | null })[];
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  });
}
