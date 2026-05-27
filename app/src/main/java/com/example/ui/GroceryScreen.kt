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
fun GroceryItemRow(item: GroceryItem, onToggle: (Boolean) -> Unit, onDelete: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().clickable { onToggle(!item.isChecked) }.padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(checked = item.isChecked, onCheckedChange = onToggle)
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = "${item.amount} ${item.unit} ${item.name}",
            style = MaterialTheme.typography.bodyLarge,
            textDecoration = if (item.isChecked) TextDecoration.LineThrough else TextDecoration.None,
            modifier = Modifier.weight(1f)
        )
        IconButton(onClick = onDelete) {
            Icon(Icons.Default.Delete, contentDescription = "Delete")
        }
    }
}
