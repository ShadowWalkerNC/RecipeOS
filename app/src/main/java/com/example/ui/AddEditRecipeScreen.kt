package com.example.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.data.Recipe
import com.example.data.RecipeIngredient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditRecipeScreen(recipeId: Int, viewModel: RecipeViewModel, navController: NavController) {
    var title by remember { mutableStateOf("") }
    var defaultServings by remember { mutableStateOf("1") }
    var instructions by remember { mutableStateOf("") }
    
    // For local state before saving
    var ingredients by remember { mutableStateOf(listOf<RecipeIngredient>()) }
    
    val recipeFlow = if (recipeId != 0) viewModel.getRecipeById(recipeId) else null
    val recipe by (recipeFlow ?: kotlinx.coroutines.flow.flowOf(null)).collectAsStateWithLifecycle(null)
    
    val ingredientsFlow = if (recipeId != 0) viewModel.getIngredientsForRecipe(recipeId) else null
    val savedIngredients by (ingredientsFlow ?: kotlinx.coroutines.flow.flowOf(emptyList())).collectAsStateWithLifecycle(emptyList())

    // Load data when present
    LaunchedEffect(recipe, savedIngredients) {
        if (recipe != null) {
            title = recipe!!.title
            defaultServings = recipe!!.defaultServings.toString()
            instructions = recipe!!.instructions
        }
        if (savedIngredients.isNotEmpty()) {
            ingredients = savedIngredients
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (recipeId == 0) "New Recipe" else "Edit Recipe") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    TextButton(onClick = {
                        val servings = defaultServings.toIntOrNull() ?: 1
                        val newRecipe = Recipe(id = recipeId, title = title, defaultServings = servings, instructions = instructions)
                        viewModel.saveRecipe(newRecipe, ingredients)
                        navController.popBackStack()
                    }) {
                        Text("Save")
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(contentPadding = innerPadding, modifier = Modifier.fillMaxSize().padding(16.dp)) {
            item {
                OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Recipe Title") }, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(value = defaultServings, onValueChange = { defaultServings = it }, label = { Text("Default Servings") }, modifier = Modifier.fillMaxWidth())
                Spacer(modifier = Modifier.height(16.dp))
                Text("Ingredients", style = MaterialTheme.typography.titleMedium)
            }
            
            itemsIndexed(ingredients) { index, ing ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = ing.name, onValueChange = { n -> ingredients = ingredients.toMutableList().apply { this[index] = ing.copy(name = n) } }, label = { Text("Name") }, modifier = Modifier.weight(1.5f))
                    OutlinedTextField(value = ing.quantity.toString(), onValueChange = { qstr -> 
                        val q = qstr.toDoubleOrNull() ?: 0.0
                        ingredients = ingredients.toMutableList().apply { this[index] = ing.copy(quantity = q) } 
                    }, label = { Text("Qty") }, modifier = Modifier.weight(1f))
                    OutlinedTextField(value = ing.unit, onValueChange = { u -> ingredients = ingredients.toMutableList().apply { this[index] = ing.copy(unit = u) } }, label = { Text("Unit") }, modifier = Modifier.weight(1f))
                    IconButton(onClick = { ingredients = ingredients.toMutableList().apply { removeAt(index) } }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete")
                    }
                }
            }
            
            item {
                TextButton(onClick = { ingredients = ingredients + RecipeIngredient(0, 0, "", 1.0, "") }) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Text("Add Ingredient")
                }
                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(value = instructions, onValueChange = { instructions = it }, label = { Text("Instructions") }, modifier = Modifier.fillMaxWidth().height(200.dp))
            }
        }
    }
}
