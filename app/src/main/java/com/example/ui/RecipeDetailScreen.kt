package com.example.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AddShoppingCart
import androidx.compose.material.icons.filled.Edit
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.data.PantryItem
import com.example.data.RecipeIngredient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RecipeDetailScreen(
    recipeId: Int,
    viewModel: RecipeViewModel,
    groceryViewModel: GroceryViewModel,
    navController: NavController
) {
    val recipe by viewModel.getRecipeById(recipeId).collectAsStateWithLifecycle(null)
    val ingredients by viewModel.getIngredientsForRecipe(recipeId).collectAsStateWithLifecycle(emptyList())
    val pantryItems by viewModel.allPantryItems.collectAsStateWithLifecycle()

    var servings by remember { mutableStateOf(1) }

    LaunchedEffect(recipe) {
        if (recipe != null) {
            servings = recipe!!.defaultServings
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(recipe?.title ?: "") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { navController.navigate("add_edit_recipe/$recipeId") }) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (recipe == null) {
            Box(modifier = Modifier.padding(innerPadding).fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            return@Scaffold
        }

        // Calculate scaling factor
        val scale = if (recipe!!.defaultServings > 0) servings.toDouble() / recipe!!.defaultServings.toDouble() else 1.0

        // Calculate cost per serving
        var totalCost = 0.0
        val pantryItemMap = pantryItems.associateBy { it.name.lowercase() }

        val scaledIngredients = ingredients.map { ing ->
            val scaledQty = ing.quantity * scale
            val pantryItem = pantryItemMap[ing.name.lowercase()]
            var itemCost = 0.0
            if (pantryItem != null && pantryItem.quantity > 0) {
                // assume unit match for simplicity
                val unitPrice = pantryItem.price / pantryItem.quantity
                itemCost = unitPrice * scaledQty
                totalCost += itemCost
            }
            Pair(ing, scaledQty)
        }

        val costPerServing = if (servings > 0) totalCost / servings else 0.0

        LazyColumn(contentPadding = innerPadding, modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 16.dp)) {
                    Text("Servings: ", style = MaterialTheme.typography.titleMedium)
                    Slider(
                        value = servings.toFloat(),
                        onValueChange = { servings = it.toInt() },
                        valueRange = 1f..20f,
                        steps = 18,
                        modifier = Modifier.weight(1f)
                    )
                    Text(servings.toString(), style = MaterialTheme.typography.titleLarge)
                }

                Row(modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("COST / SERVING", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("\$${String.format("%.2f", costPerServing)}", style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.onSurface)
                        }
                    }
                    
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("TOTAL COST", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("\$${String.format("%.2f", totalCost)}", style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.onSurface)
                        }
                    }
                }
                
                Text("Ingredients", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.height(8.dp))
            }

            items(scaledIngredients) { (ing, scaledQty) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("${String.format("%.1f", scaledQty)} ", style = MaterialTheme.typography.displaySmall)
                        Text("${ing.unit} ${ing.name}", style = MaterialTheme.typography.bodyLarge)
                    }
                    IconButton(onClick = {
                        groceryViewModel.addGroceryItem(ing.name, scaledQty, ing.unit)
                    }) {
                        Icon(Icons.Default.AddShoppingCart, contentDescription = "Add to Grocery List")
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
                Text("Instructions", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.height(8.dp))
                Text(recipe!!.instructions, style = MaterialTheme.typography.bodyLarge)
            }
        }
    }
}
