package com.example.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.RestaurantMenu
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState

@Composable
fun MainNavigation(navController: NavHostController, factory: MainViewModelFactory) {
    Scaffold(
        bottomBar = {
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentDestination = navBackStackEntry?.destination
            val screens = listOf("recipes", "pantry", "grocery")
            val icons = listOf(Icons.Default.RestaurantMenu, Icons.AutoMirrored.Filled.List, Icons.Default.ShoppingCart)
            val labels = listOf("Recipes", "Pantry", "Grocery")
            
            // only show bottom bar on main screens
            if (currentDestination?.route in screens) {
                NavigationBar(
                    containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface
                ) {
                    screens.forEachIndexed { index, screen ->
                        NavigationBarItem(
                            icon = { Icon(icons[index], contentDescription = labels[index]) },
                            label = { Text(labels[index]) },
                            selected = currentDestination?.hierarchy?.any { it.route == screen } == true,
                            onClick = {
                                navController.navigate(screen) {
                                    popUpTo("recipes") { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "recipes",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("recipes") {
                val vm: RecipeViewModel = viewModel(factory = factory)
                RecipeListScreen(vm, navController)
            }
            composable("recipe_detail/{recipeId}") { backStackEntry ->
                val recipeId = backStackEntry.arguments?.getString("recipeId")?.toIntOrNull() ?: return@composable
                val vm: RecipeViewModel = viewModel(factory = factory)
                val groceryVm: GroceryViewModel = viewModel(factory = factory)
                RecipeDetailScreen(recipeId, vm, groceryVm, navController)
            }
            composable("add_edit_recipe/{recipeId}") { backStackEntry ->
                val recipeId = backStackEntry.arguments?.getString("recipeId")?.toInt() ?: 0
                val vm: RecipeViewModel = viewModel(factory = factory)
                AddEditRecipeScreen(recipeId, vm, navController)
            }
            composable("pantry") {
                val vm: PantryViewModel = viewModel(factory = factory)
                PantryScreen(vm)
            }
            composable("grocery") {
                val vm: GroceryViewModel = viewModel(factory = factory)
                GroceryScreen(vm)
            }
        }
    }
}
