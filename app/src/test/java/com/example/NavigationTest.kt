package com.example

import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.*
import com.example.MainActivity

@RunWith(AndroidJUnit4::class)
class NavigationTest {
    @get:Rule
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun testAppFlowWithData() {
        composeTestRule.waitForIdle()
        
        // Go to Add Recipe
        composeTestRule.onNodeWithContentDescription("Add Recipe").performClick()
        composeTestRule.waitForIdle()
        
        // Enter Title
        composeTestRule.onNodeWithText("Recipe Title").performTextInput("My Recipe")
        
        // Click Save
        composeTestRule.onNodeWithText("Save").performClick()
        composeTestRule.waitForIdle()
        
        // Now there should be an item in the list, click it
        composeTestRule.onNodeWithText("My Recipe").performClick()
        composeTestRule.waitForIdle()
        
        // Interact with slider
    }
}
