#!/usr/bin/env node
import { Command } from 'commander';
import { recipeCommand } from './commands/recipe';
import { scaleCommand } from './commands/scale';
import { pantryCommand } from './commands/pantry';
import { prepCommand } from './commands/prep';
import { shopCommand } from './commands/shop';

const program = new Command();

program
  .name('recipe')
  .description('RecipeOS CLI — professional kitchen tool for the terminal')
  .version('1.0.0');

program.addCommand(recipeCommand);
program.addCommand(scaleCommand);
program.addCommand(pantryCommand);
program.addCommand(prepCommand);
program.addCommand(shopCommand);

program.parse(process.argv);
