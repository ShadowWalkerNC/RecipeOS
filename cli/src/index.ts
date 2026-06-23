#!/usr/bin/env node
import { Command } from 'commander';
import { recipeCommand } from './commands/recipe.js';
import { scaleCommand } from './commands/scale.js';
import { pantryCommand } from './commands/pantry.js';
import { prepCommand } from './commands/prep.js';
import { shopCommand } from './commands/shop.js';
import { convertCommand } from './commands/convert.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('recipe')
  .description('RecipeOS CLI — professional kitchen tool for the terminal')
  .version('2.0.0');

program.addCommand(recipeCommand);
program.addCommand(scaleCommand);
program.addCommand(pantryCommand);
program.addCommand(prepCommand);
program.addCommand(shopCommand);
program.addCommand(convertCommand);
program.addCommand(configCommand);

program.parse(process.argv);
