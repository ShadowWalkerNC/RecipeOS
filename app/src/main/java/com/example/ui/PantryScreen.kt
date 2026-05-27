package com.example.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.PantryItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PantryScreen(viewModel: PantryViewModel) {
    val items by viewModel.pantryItems.collectAsStateWithLifecycle()
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Pantry & Costs") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = "Add Item")
            }
        }
    ) { innerPadding ->
        LazyColumn(contentPadding = innerPadding, modifier = Modifier.fillMaxSize()) {
            if (items.isEmpty()) {
                item {
                    Text("No items in pantry yet. Add items to track ingredient costs.", modifier = Modifier.padding(16.dp))
                }
            }
            items(items) { item ->
                PantryItemRow(item, onDelete = { viewModel.deletePantryItem(item.id) })
            }
        }
    }

    if (showDialog) {
        var name by remember { mutableStateOf("") }
        var priceStr by remember { mutableStateOf("") }
        var quantityStr by remember { mutableStateOf("") }
        var unit by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Add Pantry Item") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name (e.g. Flour)") })
                    OutlinedTextField(value = priceStr, onValueChange = { priceStr = it }, label = { Text("Total Price (e.g. 5.99)") })
                    OutlinedTextField(value = quantityStr, onValueChange = { quantityStr = it }, label = { Text("Quantity Bought (e.g. 1000)") })
                    OutlinedTextField(value = unit, onValueChange = { unit = it }, label = { Text("Unit (e.g. g)") })
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    val price = priceStr.toDoubleOrNull() ?: 0.0
                    val qty = quantityStr.toDoubleOrNull() ?: 1.0
                    if (name.isNotBlank() && unit.isNotBlank()) {
                        viewModel.addOrUpdatePantryItem(PantryItem(0, name, price, qty, unit))
                        showDialog = false
                    }
                }) {
                    Text("Save")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun PantryItemRow(item: PantryItem, onDelete: () -> Unit) {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp)) {
        Row(modifier = Modifier.padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Column {
                Text(item.name, style = MaterialTheme.typography.titleMedium)
                val unitPrice = if (item.quantity > 0) item.price / item.quantity else 0.0
                Text(String.format("$%.2f per %s (bought at $%.2f for %.1f %s)", unitPrice, item.unit, item.price, item.quantity, item.unit), style = MaterialTheme.typography.bodySmall)
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Default.Delete, contentDescription = "Delete")
            }
        }
    }
}
