package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppRepository
import com.example.data.Recipe
import com.example.data.RecipeIngredient
import com.example.data.PantryItem
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class RecipeViewModel(private val repository: AppRepository) : ViewModel() {
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    val recipes: StateFlow<List<Recipe>> = _searchQuery.flatMapLatest { query ->
        if (query.isBlank()) {
            repository.allRecipes
        } else {
            repository.searchRecipes(query)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    
    val allPantryItems: StateFlow<List<PantryItem>> = repository.allPantryItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun getRecipeById(id: Int) = repository.getRecipeById(id)
    fun getIngredientsForRecipe(id: Int) = repository.getIngredientsForRecipe(id)

    fun saveRecipe(recipe: Recipe, ingredients: List<RecipeIngredient>) {
        viewModelScope.launch {
            val id = if (recipe.id == 0) {
                repository.insertRecipe(recipe)
            } else {
                repository.updateRecipe(recipe)
                recipe.id
            }

            // Simple update: delete old ingredients and insert new ones
            repository.deleteIngredientsForRecipe(id)
            ingredients.forEach { 
                repository.insertRecipeIngredient(it.copy(recipeId = id, id = 0)) 
            }
        }
    }

    fun deleteRecipe(id: Int) {
        viewModelScope.launch {
            repository.deleteRecipe(id)
        }
    }
}
