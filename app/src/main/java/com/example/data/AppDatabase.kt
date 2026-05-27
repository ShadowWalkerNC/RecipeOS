package com.example.data

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [
        Recipe::class, 
        RecipeIngredient::class, 
        PantryItem::class, 
        GroceryItem::class,
        RatioBlueprint::class,
        PrepList::class,
        PrepTask::class
    ], 
    version = 4, 
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun recipeDao(): RecipeDao
    abstract fun pantryDao(): PantryDao
    abstract fun groceryDao(): GroceryDao
    abstract fun ratioDao(): RatioDao
    abstract fun prepDao(): PrepDao
}
