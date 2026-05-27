package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppRepository
import com.example.data.PrepList
import com.example.data.PrepTask
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class PrepViewModel(private val repository: AppRepository) : ViewModel() {
    val allPrepLists = repository.allPrepLists.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    fun getPrepListById(id: Int) = repository.getPrepListById(id)
    fun getPrepTasksForList(id: Int) = repository.getPrepTasksForList(id)

    fun addOrUpdatePrepList(prepList: PrepList, onComplete: (Int) -> Unit = {}) {
        viewModelScope.launch {
            if (prepList.id == 0) {
                val newId = repository.insertPrepList(prepList).toInt()
                onComplete(newId)
            } else {
                repository.updatePrepList(prepList)
                onComplete(prepList.id)
            }
        }
    }

    fun deletePrepList(id: Int) {
        viewModelScope.launch {
            repository.deletePrepList(id)
        }
    }

    fun addOrUpdatePrepTask(prepTask: PrepTask) {
        viewModelScope.launch {
            if (prepTask.id == 0) {
                repository.insertPrepTask(prepTask)
            } else {
                repository.updatePrepTask(prepTask)
            }
        }
    }

    fun deletePrepTask(id: Int) {
        viewModelScope.launch {
            repository.deletePrepTask(id)
        }
    }

    fun toggleTaskComplete(task: PrepTask) {
        viewModelScope.launch {
            repository.updatePrepTask(task.copy(isComplete = !task.isComplete))
        }
    }
}
