import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet, apiPost } from '../lib/api-client';

export const recipeCommand = new Command('recipe')
  .description('Manage your recipe vault');

recipeCommand
  .command('list')
  .description('List all recipes')
  .option('--category <cat>', 'Filter by category')
  .action(async (opts) => {
    const qs = opts.category ? `?category=${opts.category}` : '';
    const recipes: any[] = await apiGet(`/api/recipes${qs}`);
    const rows = [['Name', 'Category', 'Yield', 'Difficulty'],
      ...recipes.map((r) => [r.name, r.category ?? '—', r.yield ?? '—', r.difficulty ?? '—'])];
    console.log(table(rows));
  });

recipeCommand
  .command('get <id>')
  .description('Show full recipe details')
  .action(async (id) => {
    const r: any = await apiGet(`/api/recipes/${id}`);
    console.log(chalk.white.bold(`\n${r.name}`));
    console.log(chalk.gray(`Category: ${r.category}  |  Yield: ${r.yield}  |  Difficulty: ${r.difficulty}\n`));
    console.log(chalk.green.bold('Ingredients:'));
    r.ingredients?.forEach((i: any) => console.log(`  ${i.amount} ${i.unit}  ${i.name}`));
    console.log(chalk.green.bold('\nMethod:'));
    r.steps?.forEach((s: any, idx: number) => console.log(`  ${idx + 1}. ${s}`));
    console.log();
  });

recipeCommand
  .command('add')
  .description('Add a new recipe')
  .requiredOption('--name <name>', 'Recipe name')
  .requiredOption('--category <category>', 'Category (e.g. Sauce, Protein, Dessert)')
  .requiredOption('--yield <yield>', 'Yield (e.g. 4 portions, 500ml)')
  .option('--difficulty <difficulty>', 'Difficulty (Beginner|Intermediate|Advanced)', 'Intermediate')
  .action(async (opts) => {
    const r: any = await apiPost('/api/recipes', { name: opts.name, category: opts.category, yield: opts.yield, difficulty: opts.difficulty });
    console.log(chalk.green(`✔ Recipe added: ${r.id} — ${r.name}`));
  });
