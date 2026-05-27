package com.example.data

import kotlinx.coroutines.flow.Flow

class AppRepository(
    private val recipeDao: RecipeDao,
    private val pantryDao: PantryDao,
    private val groceryDao: GroceryDao,
    private val ratioDao: RatioDao,
    private val prepDao: PrepDao
) {
    val allRecipes: Flow<List<Recipe>> = recipeDao.getAllRecipes()
    val allPantryItems: Flow<List<PantryItem>> = pantryDao.getAllPantryItems()
    val allGroceryItems: Flow<List<GroceryItem>> = groceryDao.getAllGroceryItems()
    val allRatioBlueprints: Flow<List<RatioBlueprint>> = ratioDao.getAllRatioBlueprints()
    val allPrepLists: Flow<List<PrepList>> = prepDao.getAllPrepLists()

    fun searchRecipes(query: String) = recipeDao.searchRecipes(query)
    fun getRecipeById(id: Int) = recipeDao.getRecipeById(id)
    fun getIngredientsForRecipe(recipeId: Int) = recipeDao.getIngredientsForRecipe(recipeId)
    fun getPantryItemById(id: Int) = pantryDao.getPantryItemByIdFlow(id)
    fun getRatioBlueprintById(id: Int) = ratioDao.getRatioBlueprintById(id)
    fun getPrepListById(id: Int) = prepDao.getPrepListById(id)
    fun getPrepTasksForList(id: Int) = prepDao.getPrepTasksForList(id)

    suspend fun insertRecipe(recipe: Recipe): Int {
        return recipeDao.insertRecipe(recipe).toInt()
    }
    suspend fun updateRecipe(recipe: Recipe) = recipeDao.updateRecipe(recipe)
    suspend fun deleteRecipe(id: Int) = recipeDao.deleteRecipe(id)

    suspend fun insertRecipeIngredient(ingredient: RecipeIngredient) = recipeDao.insertRecipeIngredient(ingredient)
    suspend fun deleteIngredientsForRecipe(recipeId: Int) = recipeDao.deleteIngredientsForRecipe(recipeId)
    suspend fun deleteRecipeIngredient(id: Int) = recipeDao.deleteRecipeIngredient(id)
    
    suspend fun insertPantryItem(item: PantryItem) = pantryDao.insertPantryItem(item)
    suspend fun updatePantryItem(item: PantryItem) = pantryDao.updatePantryItem(item)
    suspend fun deletePantryItem(id: Int) = pantryDao.deletePantryItem(id)
    suspend fun getPantryItemByName(name: String) = pantryDao.getPantryItemByName(name)

    suspend fun insertGroceryItem(item: GroceryItem) = groceryDao.insertGroceryItem(item)
    suspend fun updateGroceryItem(item: GroceryItem) = groceryDao.updateGroceryItem(item)
    suspend fun deleteGroceryItem(id: Int) = groceryDao.deleteGroceryItem(id)
    suspend fun clearCheckedGroceryItems() = groceryDao.clearCheckedItems()

    suspend fun insertRatioBlueprint(ratioBlueprint: RatioBlueprint) = ratioDao.insertRatioBlueprint(ratioBlueprint)
    suspend fun updateRatioBlueprint(ratioBlueprint: RatioBlueprint) = ratioDao.updateRatioBlueprint(ratioBlueprint)
    suspend fun deleteRatioBlueprint(id: Int) = ratioDao.deleteRatioBlueprint(id)

    suspend fun insertPrepList(prepList: PrepList) = prepDao.insertPrepList(prepList)
    suspend fun updatePrepList(prepList: PrepList) = prepDao.updatePrepList(prepList)
    suspend fun deletePrepList(id: Int) = prepDao.deletePrepList(id)
    
    suspend fun insertPrepTask(prepTask: PrepTask) = prepDao.insertPrepTask(prepTask)
    suspend fun updatePrepTask(prepTask: PrepTask) = prepDao.updatePrepTask(prepTask)
    suspend fun deletePrepTask(id: Int) = prepDao.deletePrepTask(id)

    suspend fun syncCheckedGroceryToPantryAndClear() {
        val checked = groceryDao.getCheckedGroceryItems()
        if (checked.isNotEmpty()) {
            checked.forEach { groceryItem ->
                val pantryItem = pantryDao.getPantryItemByName(groceryItem.name)
                if (pantryItem != null && pantryItem.unit == groceryItem.unit) {
                    // Increase quantity
                    pantryDao.updatePantryItem(pantryItem.copy(quantity = pantryItem.quantity + groceryItem.amount))
                } else if (pantryItem == null) {
                    // Create a new one with 0 price since we don't know it
                    pantryDao.insertPantryItem(PantryItem(0, groceryItem.name, 0.0, groceryItem.amount, groceryItem.unit))
                }
            }
            groceryDao.clearCheckedItems()
        }
    }
    
    suspend fun addOrUpdateGroceryItem(name: String, amount: Double, unit: String) {
        val existing = groceryDao.getGroceryItemByName(name)
        if (existing != null && existing.unit == unit) {
            groceryDao.updateGroceryItem(existing.copy(amount = existing.amount + amount, isChecked = false))
        } else {
            groceryDao.insertGroceryItem(GroceryItem(name = name, amount = amount, unit = unit))
        }
    }
}
