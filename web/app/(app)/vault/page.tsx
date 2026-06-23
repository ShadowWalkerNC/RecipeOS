'use client';

import { useRecipes } from '@/lib/queries/recipes';

export default function VaultPage() {
  const { data: recipes, isLoading, error } = useRecipes();

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Recipe Vault</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Recipe Vault</h1>
        <p className="text-red-500">Failed to load recipes. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recipe Vault</h1>
        <span className="text-sm text-gray-400">{recipes?.length ?? 0} recipes</span>
      </div>

      {!recipes || recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🍳</div>
          <h2 className="text-lg font-semibold">No recipes yet</h2>
          <p className="mt-2 text-sm text-gray-500">Your vault is empty. Add your first recipe to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-xl border border-gray-200 p-5 hover:border-gray-400 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-base leading-snug">{recipe.name}</h2>
                {recipe.difficulty && (
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {recipe.difficulty}
                  </span>
                )}
              </div>
              {recipe.description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                {recipe.base_servings && (
                  <span>{recipe.base_servings} serving{recipe.base_servings !== 1 ? 's' : ''}</span>
                )}
                {recipe.category && (
                  <span className="capitalize">{recipe.category.name}</span>
                )}
                {recipe.tags?.length > 0 && (
                  <span>{recipe.tags.slice(0, 2).join(', ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
