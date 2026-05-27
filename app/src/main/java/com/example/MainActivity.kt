package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import com.example.data.AppDatabase
import com.example.data.AppRepository
import com.example.ui.MainNavigation
import com.example.ui.MainViewModelFactory
import com.example.ui.theme.MyApplicationTheme

import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import com.example.data.Recipe
import com.example.data.RecipeIngredient

class MainActivity : ComponentActivity() {
    private lateinit var database: AppDatabase
    private lateinit var repository: AppRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        database = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "recipe_boom_db"
        ).fallbackToDestructiveMigration(dropAllTables = true).build()
        
        repository = AppRepository(
            database.recipeDao(),
            database.pantryDao(),
            database.groceryDao(),
            database.ratioDao(),
            database.prepDao()
        )

        lifecycleScope.launch {
            val recipes = repository.allRecipes.first()
            if (recipes.isEmpty()) {
                val kingKongRecipeId = repository.insertRecipe(
                    Recipe(
                        title = "King Kong Method Protein Shake",
                        defaultServings = 1,
                        instructions = "1. Throw all ingredients into an industrial blender.\n2. Blend until smooth.\n3. Drink immediately to absorb the massive protein hit.\n4. Beat chest."
                    )
                )
                repository.insertRecipeIngredient(RecipeIngredient(recipeId = kingKongRecipeId, name = "Bananas", quantity = 3.0, unit = "whole"))
                repository.insertRecipeIngredient(RecipeIngredient(recipeId = kingKongRecipeId, name = "Whey Protein", quantity = 4.0, unit = "scoops"))
                repository.insertRecipeIngredient(RecipeIngredient(recipeId = kingKongRecipeId, name = "Whole Milk", quantity = 500.0, unit = "ml"))
                repository.insertRecipeIngredient(RecipeIngredient(recipeId = kingKongRecipeId, name = "Peanut Butter", quantity = 3.0, unit = "tbsp"))
                repository.insertRecipeIngredient(RecipeIngredient(recipeId = kingKongRecipeId, name = "Raw Eggs", quantity = 2.0, unit = "whole"))
            }

            val pantryItems = repository.allPantryItems.first()
            if (pantryItems.isEmpty()) {
                repository.insertPantryItem(com.example.data.PantryItem(name = "Olive Oil", quantity = 1000.0, unit = "g", price = 15.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Salt", quantity = 500.0, unit = "g", price = 3.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Black Pepper", quantity = 100.0, unit = "g", price = 5.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Garlic", quantity = 10.0, unit = "cloves", price = 2.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Onion", quantity = 10.0, unit = "whole", price = 4.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Flour", quantity = 2000.0, unit = "g", price = 6.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Sugar", quantity = 1000.0, unit = "g", price = 4.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Butter", quantity = 500.0, unit = "g", price = 7.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Milk", quantity = 2000.0, unit = "g", price = 4.0))
                repository.insertPantryItem(com.example.data.PantryItem(name = "Eggs", quantity = 24.0, unit = "whole", price = 8.0))
            }
        }

        val factory = MainViewModelFactory(repository)

        setContent {
            MyApplicationTheme {
                val navController = rememberNavController()
                MainNavigation(navController = navController, factory = factory)
            }
        }
    }
}
