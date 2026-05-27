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
            } else {
                val grouped = items.groupBy { it.category.ifBlank { "Uncategorized" } }.toSortedMap()
                grouped.forEach { (category, categoryItems) ->
                    item {
                        Text(
                            text = category,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                    items(categoryItems) { item ->
                        PantryItemRow(
                            item = item,
                            onUpdate = { updatedItem -> viewModel.addOrUpdatePantryItem(updatedItem) },
                            onDelete = { viewModel.deletePantryItem(item.id) }
                        )
                    }
                }
            }
        }
    }

    if (showDialog) {
        var name by remember { mutableStateOf("") }
        var priceStr by remember { mutableStateOf("") }
        var quantityStr by remember { mutableStateOf("") }
        var unit by remember { mutableStateOf("") }
        var category by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Add Pantry Item") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name (e.g. Flour)") })
                    OutlinedTextField(value = priceStr, onValueChange = { priceStr = it }, label = { Text("Total Price (e.g. 5.99)") })
                    OutlinedTextField(value = quantityStr, onValueChange = { quantityStr = it }, label = { Text("Quantity Bought (e.g. 1000)") })
                    var unitExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = unitExpanded, 
                        onExpandedChange = { unitExpanded = it }
                    ) {
                        OutlinedTextField(
                            value = unit,
                            onValueChange = { unit = it },
                            label = { Text("Unit (e.g. g)") },
                            modifier = Modifier.fillMaxWidth().menuAnchor(),
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(unitExpanded) }
                        )
                        ExposedDropdownMenu(
                            expanded = unitExpanded,
                            onDismissRequest = { unitExpanded = false }
                        ) {
                            listOf("g", "kg", "oz", "lb", "ml", "L", "cup", "tbsp", "tsp", "whole").forEach { u ->
                                DropdownMenuItem(
                                    text = { Text(u) },
                                    onClick = { 
                                        unit = u
                                        unitExpanded = false 
                                    }
                                )
                            }
                        }
                    }
                    OutlinedTextField(value = category, onValueChange = { category = it }, label = { Text("Category (e.g. Baking)") })
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    val price = priceStr.toDoubleOrNull() ?: 0.0
                    val qty = quantityStr.toDoubleOrNull() ?: 1.0
                    if (name.isNotBlank() && unit.isNotBlank()) {
                        viewModel.addOrUpdatePantryItem(PantryItem(name = name, price = price, quantity = qty, unit = unit, category = category))
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
fun PantryItemRow(item: PantryItem, onUpdate: (PantryItem) -> Unit, onDelete: () -> Unit) {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                Text(item.name, style = MaterialTheme.typography.titleMedium)
                IconButton(onClick = onDelete) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete")
                }
            }
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                var qtyStr by remember(item.id, item.quantity) { mutableStateOf(if (item.quantity == item.quantity.toInt().toDouble()) item.quantity.toInt().toString() else item.quantity.toString()) }
                OutlinedTextField(
                    value = qtyStr,
                    onValueChange = { 
                        qtyStr = it
                        val newQty = it.toDoubleOrNull()
                        if (newQty != null) {
                            onUpdate(item.copy(quantity = newQty))
                        }
                    },
                    modifier = Modifier.width(100.dp),
                    label = { Text("Qty") },
                    singleLine = true
                )
                Text(item.unit, style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.weight(1f))
                val unitPrice = if (item.quantity > 0) item.price / item.quantity else 0.0
                Text(String.format("$%.2f per %s", unitPrice, item.unit), style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}
