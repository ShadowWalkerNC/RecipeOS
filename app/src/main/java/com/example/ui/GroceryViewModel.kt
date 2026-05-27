package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppRepository
import com.example.data.GroceryItem
import com.example.data.PantryItem
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class GroceryViewModel(private val repository: AppRepository) : ViewModel() {
    val groceryItems: StateFlow<List<GroceryItem>> = repository.allGroceryItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addGroceryItem(name: String, amount: Double, unit: String) {
        viewModelScope.launch {
            repository.addOrUpdateGroceryItem(name, amount, unit)
        }
    }

    fun toggleItemChecked(item: GroceryItem, isChecked: Boolean) {
        viewModelScope.launch {
            repository.updateGroceryItem(item.copy(isChecked = isChecked))
            
            // Optionally, if checked, we could add it to pantry
            // but let's keep it simple and just mark as checked.
            // If they want to sync with inventory, we can do it on a button press, e.g. "Sync checked to Pantry"
        }
    }

    fun syncCheckedToPantryAndClear() {
        viewModelScope.launch {
            repository.syncCheckedGroceryToPantryAndClear()
        }
    }

    fun deleteGroceryItem(id: Int) {
        viewModelScope.launch {
            repository.deleteGroceryItem(id)
        }
    }
}
