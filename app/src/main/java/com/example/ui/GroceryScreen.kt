package com.example.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.GroceryItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GroceryScreen(viewModel: GroceryViewModel) {
    val items by viewModel.groceryItems.collectAsStateWithLifecycle()
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Grocery List") },
                actions = {
                    TextButton(onClick = { viewModel.syncCheckedToPantryAndClear() }) {
                        Text("Clear Checked")
                    }
                }
            )
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
                    Text("Your grocery list is empty.", modifier = Modifier.padding(16.dp))
                }
            }
            items(items) { item ->
                GroceryItemRow(
                    item = item,
                    onToggle = { viewModel.toggleItemChecked(item, it) },
                    onDelete = { viewModel.deleteGroceryItem(item.id) }
                )
            }
        }
    }

    if (showDialog) {
        var name by remember { mutableStateOf("") }
        var amountStr by remember { mutableStateOf("") }
        var unit by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Add Grocery") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") })
                    OutlinedTextField(value = amountStr, onValueChange = { amountStr = it }, label = { Text("Amount (e.g. 2)") })
                    OutlinedTextField(value = unit, onValueChange = { unit = it }, label = { Text("Unit (e.g. cups)") })
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    val amt = amountStr.toDoubleOrNull() ?: 1.0
                    if (name.isNotBlank()) {
                        viewModel.addGroceryItem(name, amt, unit)
                        showDialog = false
                    }
                }) {
                    Text("Add")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) { Text("Cancel") }
            }
        )
    }
}

@Composable
fun GroceryItemRow(item: GroceryItem, onToggle: (Boolean) -> Unit, onUpdateAmount: ((Double) -> Unit)? = null, onDelete: () -> Unit) {
    val (buyableAmount, buyableUnit) = computeBuyableSize(item.name, item.amount, item.unit)
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable { onToggle(!item.isChecked) },
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(checked = item.isChecked, onCheckedChange = onToggle)
            Spacer(modifier = Modifier.width(8.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.titleMedium,
                    textDecoration = if (item.isChecked) TextDecoration.LineThrough else TextDecoration.None
                )
                Text(
                    text = "${String.format("%.1f", buyableAmount)} $buyableUnit",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Default.Delete, contentDescription = "Delete")
            }
        }
    }
}

fun computeBuyableSize(name: String, amount: Double, unit: String): Pair<Double, String> {
    val u = unit.lowercase()
    val n = name.lowercase()
    // For liquid ingredients like milk, cream, etc., convert cups/pints/quarts to gallons or half-gallons
    if (u in listOf("cup", "cups", "pint", "pints", "quart", "quarts", "fl oz", "fluid ounce", "ml", "milliliter", "milliliters")) {
        // Convert everything to ml first
        val ml = when (u) {
            "cup", "cups" -> amount * 236.588
            "pint", "pints" -> amount * 473.176
            "quart", "quarts" -> amount * 946.353
            "fl oz", "fluid ounce" -> amount * 29.5735
            else -> amount
        }
        val gallons = ml / 3785.41
        if (gallons > 0.3) {
            return Pair(Math.ceil(gallons), "gallon(s)") // round up to whole gallons
        } else if (ml > 100) {
            return Pair(Math.ceil(ml / 1000.0), "liter(s)")
        }
    }
    // For solid ingredients in g/oz/lb -> convert to buyable package sizes (e.g. 1 lb, 500g, 1kg)
    if (u in listOf("g", "gram", "grams", "oz", "ounce", "ounces", "lb", "lbs", "pound", "pounds", "kg", "kilogram", "kilograms")) {
        val g = when(u) {
            "oz", "ounce", "ounces" -> amount * 28.3495
            "lb", "lbs", "pound", "pounds" -> amount * 453.592
            "kg", "kilogram", "kilograms" -> amount * 1000.0
            else -> amount
        }
        if (g > 500) {
            return Pair(Math.ceil(g / 1000.0), "kg")
        } else if (g > 0) {
            // less than 500g, maybe round to hundreds of grams, or just lb
            return Pair(Math.ceil(g / 250.0) * 250, "g")
        }
    }
    return Pair(Math.ceil(amount), unit)
}
