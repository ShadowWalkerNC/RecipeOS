package com.example.data

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "recipes",
    foreignKeys = [
        ForeignKey(
            entity = RatioBlueprint::class,
            parentColumns = ["id"],
            childColumns = ["ratioId"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [
        Index("ratioId")
    ]
)
data class Recipe(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val description: String = "",
    val skillLevel: String = "BEGINNER",
    val cuisine: String = "",
    val defaultServings: Int,
    val yieldUnit: String = "servings",
    val ratioId: Int? = null,
    val isBlueprint: Boolean = false,
    val instructions: String,
    val tags: String = "",
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
    ],
    indices = [
        Index("recipeId")
    ]
)
data class RecipeIngredient(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val recipeId: Int,
    val section: String = "",
    val name: String,
    val quantity: Double,
    val unit: String,
    val ratioPart: String? = null,
    val notes: String = ""
)

@Entity(tableName = "pantry_items")
data class PantryItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val price: Double,
    val quantity: Double, // The total quantity you bought for that price
    val unit: String,
    val category: String = "",
    val barcode: String? = null,
    val updatedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "grocery_items")
data class GroceryItem(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val amount: Double,
    val unit: String,
    val isChecked: Boolean = false
)

@Entity(tableName = "ratio_blueprints")
data class RatioBlueprint(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val description: String,
    val category: String,
    val ratioJson: String,
    val notes: String,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "prep_lists")
data class PrepList(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val recipeId: Int? = null,
    val date: Long,
    val isTemplate: Boolean = false
)

@Entity(
    tableName = "prep_tasks",
    foreignKeys = [
        ForeignKey(
            entity = PrepList::class,
            parentColumns = ["id"],
            childColumns = ["prepListId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index("prepListId")
    ]
)
data class PrepTask(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val prepListId: Int,
    val taskType: String,
    val description: String,
    val ingredient: String,
    val estimatedMinutes: Int,
    val isComplete: Boolean = false,
    val sortOrder: Int = 0
)