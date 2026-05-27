package com.example.data

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(tableName = "recipes")
data class Recipe(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val defaultServings: Int,
    val instructions: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "recipe_ingredients",
    foreignKeys = [
        ForeignKey(
            entity = Recipe::class,
            parentColumns = ["id"],
            childColumns = ["recipeId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class RecipeIngredient(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val recipeId: Int,
    val name: String,
    val quantity: Double,
    val unit: String
)

@Entity(tableName = "pantry_items")
data class PantryItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val price: Double,
    val quantity: Double, // The total quantity you bought for that price
    val unit: String
)

@Entity(tableName = "grocery_items")
data class GroceryItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val amount: Double,
    val unit: String,
    val isChecked: Boolean = false
)
