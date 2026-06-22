import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet } from '../lib/api-client';

export const scaleCommand = new Command('scale')
  .description('Scale a recipe to a target serving count');

scaleCommand
  .command('run <recipeId>')
  .description('Scale a recipe')
  .requiredOption('--base <n>', 'Base servings', parseInt)
  .requiredOption('--target <n>', 'Target servings', parseInt)
  .action(async (recipeId, opts) => {
    const r: any = await apiGet(`/api/recipes/${recipeId}/scale?base=${opts.base}&target=${opts.target}`);
    const factor = (opts.target / opts.base).toFixed(2);
    console.log(chalk.white.bold(`\n${r.name} — Scaled ${opts.base} → ${opts.target} servings (${factor}x)\n`));
    const rows = [['Ingredient', 'Original', 'Scaled', 'Unit'],
      ...r.scaledIngredients.map((i: any) => [i.name, i.originalAmount, i.scaledAmount, i.unit])];
    console.log(table(rows));
  });
