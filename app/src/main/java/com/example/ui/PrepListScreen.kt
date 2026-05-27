package com.example.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.data.PrepList
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrepListScreen(viewModel: PrepViewModel, navController: NavController) {
    val prepLists by viewModel.allPrepLists.collectAsStateWithLifecycle()
    var showDialog by remember { mutableStateOf(false) }
    var editPrepList by remember { mutableStateOf<PrepList?>(null) } // for editing the name

    Scaffold(
        topBar = { TopAppBar(title = { Text("Prep Lists") }) },
        floatingActionButton = {
            FloatingActionButton(onClick = { showDialog = true; editPrepList = null }) {
                Icon(Icons.Default.Add, contentDescription = "Add Prep List")
            }
        }
    ) { innerPadding ->
        LazyColumn(contentPadding = innerPadding, modifier = Modifier.fillMaxSize()) {
            if (prepLists.isEmpty()) {
                item {
                    Text("No prep lists yet. Tap + to add one.", modifier = Modifier.padding(16.dp))
                }
            }
            items(prepLists) { prepList ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                        .clickable { navController.navigate("prep_detail/${prepList.id}") },
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(prepList.name, style = MaterialTheme.typography.titleMedium)
                            val df = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
                            Text(df.format(Date(prepList.date)), style = MaterialTheme.typography.bodySmall)
                        }
                        IconButton(onClick = { showDialog = true; editPrepList = prepList }) {
                            Icon(Icons.Default.Edit, contentDescription = "Edit")
                        }
                        IconButton(onClick = { viewModel.deletePrepList(prepList.id) }) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete")
                        }
                    }
                }
            }
        }
    }

    if (showDialog) {
        var name by remember(editPrepList) { mutableStateOf(editPrepList?.name ?: "") }
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text(if (editPrepList == null) "New Prep List" else "Edit Prep List") },
            text = {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("List Name (e.g. Sunday Baking)") },
                    singleLine = true
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (name.isNotBlank()) {
                            viewModel.addOrUpdatePrepList(
                                (editPrepList ?: PrepList(name = name, date = System.currentTimeMillis())).copy(name = name)
                            ) { newId ->
                                if (editPrepList == null) {
                                    navController.navigate("prep_detail/$newId")
                                }
                            }
                            showDialog = false
                        }
                    }
                ) { Text("Save") }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) { Text("Cancel") }
            }
        )
    }
}
