package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppRepository
import com.example.data.PantryItem
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class PantryViewModel(private val repository: AppRepository) : ViewModel() {
    val pantryItems: StateFlow<List<PantryItem>> = repository.allPantryItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addOrUpdatePantryItem(item: PantryItem) {
        viewModelScope.launch {
            if (item.id == 0) {
                repository.insertPantryItem(item)
            } else {
                repository.updatePantryItem(item)
            }
        }
    }

    fun deletePantryItem(id: Int) {
        viewModelScope.launch {
            repository.deletePantryItem(id)
        }
    }
}
