package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import com.example.data.AppDatabase
import com.example.data.AppRepository
import com.example.ui.MainNavigation
import com.example.ui.MainViewModelFactory
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    private lateinit var database: AppDatabase
    private lateinit var repository: AppRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        database = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "recipe_boom_db"
        ).fallbackToDestructiveMigration().build()
        
        repository = AppRepository(
            database.recipeDao(),
            database.pantryDao(),
            database.groceryDao()
        )

        val factory = MainViewModelFactory(repository)

        setContent {
            MyApplicationTheme {
                val navController = rememberNavController()
                MainNavigation(navController = navController, factory = factory)
            }
        }
    }
}
