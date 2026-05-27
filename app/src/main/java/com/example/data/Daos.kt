package com.example.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface RecipeDao {
    @Query("SELECT * FROM recipes ORDER BY timestamp DESC")
    fun getAllRecipes(): Flow<List<Recipe>>

    @Query("SELECT * FROM recipes WHERE id = :id")
    fun getRecipeById(id: Int): Flow<Recipe?>

    @Query("SELECT * FROM recipes WHERE title LIKE '%' || :searchQuery || '%'")
    fun searchRecipes(searchQuery: String): Flow<List<Recipe>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecipe(recipe: Recipe): Long

    @Update
    suspend fun updateRecipe(recipe: Recipe)

    @Query("DELETE FROM recipes WHERE id = :id")
    suspend fun deleteRecipe(id: Int)

    // Recipe Ingredients
    @Query("SELECT * FROM recipe_ingredients WHERE recipeId = :recipeId")
    fun getIngredientsForRecipe(recipeId: Int): Flow<List<RecipeIngredient>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecipeIngredient(ingredient: RecipeIngredient)

    @Query("DELETE FROM recipe_ingredients WHERE recipeId = :recipeId")
    suspend fun deleteIngredientsForRecipe(recipeId: Int)

    @Query("DELETE FROM recipe_ingredients WHERE id = :id")
    suspend fun deleteRecipeIngredient(id: Int)
}

@Dao
interface PantryDao {
    @Query("SELECT * FROM pantry_items ORDER BY name ASC")
    fun getAllPantryItems(): Flow<List<PantryItem>>

    @Query("SELECT * FROM pantry_items WHERE name = :name LIMIT 1")
    suspend fun getPantryItemByName(name: String): PantryItem?

    @Query("SELECT * FROM pantry_items WHERE id = :id LIMIT 1")
    fun getPantryItemByIdFlow(id: Int): Flow<PantryItem?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPantryItem(item: PantryItem)

    @Update
    suspend fun updatePantryItem(item: PantryItem)

    @Query("DELETE FROM pantry_items WHERE id = :id")
    suspend fun deletePantryItem(id: Int)
}

@Dao
interface GroceryDao {
    @Query("SELECT * FROM grocery_items ORDER BY isChecked ASC, name ASC")
    fun getAllGroceryItems(): Flow<List<GroceryItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGroceryItem(item: GroceryItem)

    @Update
    suspend fun updateGroceryItem(item: GroceryItem)

    @Query("DELETE FROM grocery_items WHERE id = :id")
    suspend fun deleteGroceryItem(id: Int)

    @Query("SELECT * FROM grocery_items WHERE isChecked = 1")
    suspend fun getCheckedGroceryItems(): List<GroceryItem>

    @Query("DELETE FROM grocery_items WHERE isChecked = 1")
    suspend fun clearCheckedItems()

    @Query("SELECT * FROM grocery_items WHERE name = :name")
    suspend fun getGroceryItemByName(name: String): GroceryItem?
}

@Dao
interface RatioDao {
    @Query("SELECT * FROM ratio_blueprints ORDER BY createdAt DESC")
    fun getAllRatioBlueprints(): Flow<List<RatioBlueprint>>

    @Query("SELECT * FROM ratio_blueprints WHERE id = :id")
    fun getRatioBlueprintById(id: Int): Flow<RatioBlueprint?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRatioBlueprint(ratioBlueprint: RatioBlueprint): Long

    @Update
    suspend fun updateRatioBlueprint(ratioBlueprint: RatioBlueprint)

    @Query("DELETE FROM ratio_blueprints WHERE id = :id")
    suspend fun deleteRatioBlueprint(id: Int)
}

@Dao
interface PrepDao {
    @Query("SELECT * FROM prep_lists ORDER BY date DESC")
    fun getAllPrepLists(): Flow<List<PrepList>>

    @Query("SELECT * FROM prep_lists WHERE id = :id")
    fun getPrepListById(id: Int): Flow<PrepList?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPrepList(prepList: PrepList): Long

    @Update
    suspend fun updatePrepList(prepList: PrepList)

    @Query("DELETE FROM prep_lists WHERE id = :id")
    suspend fun deletePrepList(id: Int)

    @Query("SELECT * FROM prep_tasks WHERE prepListId = :prepListId ORDER BY sortOrder ASC")
    fun getPrepTasksForList(prepListId: Int): Flow<List<PrepTask>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPrepTask(prepTask: PrepTask)

    @Update
    suspend fun updatePrepTask(prepTask: PrepTask)

    @Query("DELETE FROM prep_tasks WHERE id = :id")
    suspend fun deletePrepTask(id: Int)
}
