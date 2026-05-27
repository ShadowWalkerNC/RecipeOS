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
    var useMetric by remember { mutableStateOf(false) }

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
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(if (useMetric) "Metric" else "Imperial", style = MaterialTheme.typography.labelMedium)
                        Switch(
                            checked = useMetric,
                            onCheckedChange = { useMetric = it },
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )
                    }
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
                // Convert both to a common metric base to find price
                val (ingBaseQty, _) = convertUnit(scaledQty, ing.unit, true)
                val (pantryBaseQty, _) = convertUnit(pantryItem.quantity, pantryItem.unit, true)
                if (pantryBaseQty > 0) {
                    val unitPrice = pantryItem.price / pantryBaseQty
                    itemCost = unitPrice * ingBaseQty
                    totalCost += itemCost
                }
            }
            Pair(ing, scaledQty)
        }

        val costPerServing = if (servings > 0) totalCost / servings else 0.0

        LazyColumn(contentPadding = innerPadding, modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 16.dp)) {
                    Text("Servings: ", style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.width(8.dp))
                    OutlinedTextField(
                        value = if (servings > 0) servings.toString() else "",
                        onValueChange = { 
                            val s = it.toIntOrNull()
                            if (s != null && s in 1..999) { servings = s }
                        },
                        modifier = Modifier.width(80.dp),
                        singleLine = true,
                        textStyle = MaterialTheme.typography.titleLarge
                    )
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

            val groupedIngredients = scaledIngredients.groupBy { it.first.section.ifBlank { "Main" } }
            groupedIngredients.forEach { (section, itemsList) ->
                item {
                    if (groupedIngredients.size > 1 || section != "Main") {
                        Text(section, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(top = 8.dp, bottom = 4.dp))
                    }
                }
                items(itemsList) { (ing, scaledQty) ->
                    val (displayQty, displayUnit) = convertUnit(scaledQty, ing.unit, useMetric)
                    Card(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Text(
                                    "${String.format("%.1f", displayQty)} ",
                                    style = MaterialTheme.typography.titleLarge,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("$displayUnit ${ing.name}", style = MaterialTheme.typography.bodyLarge)
                            }
                            IconButton(onClick = {
                                groceryViewModel.addGroceryItem(ing.name, displayQty, displayUnit)
                            }) {
                                Icon(Icons.Default.AddShoppingCart, contentDescription = "Add to Grocery List")
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
                Text("Instructions", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(recipe!!.instructions, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.padding(16.dp))
                }
            }
        }
    }
}

fun convertUnit(qty: Double, unit: String, toMetric: Boolean): Pair<Double, String> {
    val u = unit.lowercase()
    if (toMetric) {
        when (u) {
            "oz", "ounce", "ounces" -> return Pair(qty * 28.3495, "g")
            "lb", "lbs", "pound", "pounds" -> return Pair(qty * 0.453592, "kg")
            "cup", "cups" -> return Pair(qty * 236.588, "ml")
            "tbsp", "tablespoon", "tablespoons" -> return Pair(qty * 14.7868, "ml")
            "tsp", "teaspoon", "teaspoons" -> return Pair(qty * 4.92892, "ml")
            "fl oz", "fluid ounce" -> return Pair(qty * 29.5735, "ml")
            "pint", "pints" -> return Pair(qty * 473.176, "ml")
            "quart", "quarts" -> return Pair(qty * 946.353, "ml")
            "gallon", "gallons" -> return Pair(qty * 3.78541, "L")
        }
    } else {
        when (u) {
            "g", "gram", "grams" -> return Pair(qty / 28.3495, "oz")
            "kg", "kilogram", "kilograms" -> return Pair(qty / 0.453592, "lb")
            "ml", "milliliter", "milliliters" -> {
                if (qty >= 236.588) return Pair(qty / 236.588, "cups")
                if (qty >= 14.7868) return Pair(qty / 14.7868, "tbsp")
                return Pair(qty / 4.92892, "tsp")
            }
            "l", "liter", "liters" -> return Pair(qty / 3.78541, "gallons")
        }
    }
    return Pair(qty, unit)
}
