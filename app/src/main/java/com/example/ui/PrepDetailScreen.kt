package com.example.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.example.data.PrepTask
import kotlinx.coroutines.flow.first

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrepDetailScreen(prepListId: Int, viewModel: PrepViewModel, navController: NavController) {
    val prepList by produceState(initialValue = null as com.example.data.PrepList?) {
        value = viewModel.getPrepListById(prepListId).first()
    }
    val tasks by viewModel.getPrepTasksForList(prepListId).collectAsStateWithLifecycle(initialValue = emptyList())
    var showDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(prepList?.name ?: "Prep List") },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = "Add Task")
            }
        }
    ) { innerPadding ->
        LazyColumn(contentPadding = innerPadding, modifier = Modifier.fillMaxSize()) {
            items(tasks) { task ->
                Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp)) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = task.isComplete,
                            onCheckedChange = { viewModel.toggleTaskComplete(task) }
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(task.taskType, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.primary)
                            Text(task.description, style = MaterialTheme.typography.bodyLarge)
                            if (task.ingredient.isNotBlank()) {
                                Text("Ingredient: ${task.ingredient}", style = MaterialTheme.typography.bodySmall)
                            }
                            if (task.estimatedMinutes > 0) {
                                Text("Est. Time: ${task.estimatedMinutes} min", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                        IconButton(onClick = { viewModel.deletePrepTask(task.id) }) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete Task")
                        }
                    }
                }
            }
        }
    }

    if (showDialog) {
        var taskType by remember { mutableStateOf("CHOP") }
        var description by remember { mutableStateOf("") }
        var ingredient by remember { mutableStateOf("") }
        var estTime by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Add Prep Task") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    // Quick task type picker
                    var expanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }) {
                        OutlinedTextField(
                            value = taskType,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Task Type") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
                            modifier = Modifier.menuAnchor()
                        )
                        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                            listOf("WASH", "PEEL", "CHOP", "DICE", "MINCE", "JULIENNE", "WEIGH", "PORTION", "MARINATE", "BLANCH").forEach { selectionOption ->
                                DropdownMenuItem(
                                    text = { Text(selectionOption) },
                                    onClick = { taskType = selectionOption; expanded = false }
                                )
                            }
                        }
                    }
                    OutlinedTextField(value = description, onValueChange = { description = it }, label = { Text("Description") })
                    OutlinedTextField(value = ingredient, onValueChange = { ingredient = it }, label = { Text("Ingredient") })
                    OutlinedTextField(value = estTime, onValueChange = { estTime = it }, label = { Text("Est. Minutes") })
                }
            },
            confirmButton = {
                TextButton(onClick = {
                    if (description.isNotBlank()) {
                        viewModel.addOrUpdatePrepTask(
                            PrepTask(
                                prepListId = prepListId,
                                taskType = taskType,
                                description = description,
                                ingredient = ingredient,
                                estimatedMinutes = estTime.toIntOrNull() ?: 0
                            )
                        )
                        showDialog = false
                    }
                }) { Text("Save") }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) { Text("Cancel") }
            }
        )
    }
}
