import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet, apiPost, apiDelete } from '../lib/api-client.js';

export const recipeCommand = new Command('recipe')
  .description('Manage your recipe vault');

recipeCommand
  .command('list')
  .description('List all recipes')
  .option('--category <cat>', 'Filter by category')
  .option('--json', 'Output raw JSON')
  .action(async (opts) => {
    const qs = opts.category ? `?category=${encodeURIComponent(opts.category)}` : '';
    const recipes: any[] = await apiGet(`/api/recipes${qs}`);
    if (opts.json) { console.log(JSON.stringify(recipes, null, 2)); return; }
    if (!recipes.length) { console.log(chalk.gray('No recipes found.')); return; }
    const rows = [
      [chalk.bold('Name'), chalk.bold('Difficulty'), chalk.bold('Servings'), chalk.bold('Tags')],
      ...recipes.map((r) => [
        r.name,
        r.difficulty ?? '—',
        r.base_servings ?? '—',
        (r.tags ?? []).join(', ') || '—',
      ]),
    ];
    console.log(table(rows));
  });

recipeCommand
  .command('get <id>')
  .description('Show full recipe details')
  .option('--json', 'Output raw JSON')
  .action(async (id, opts) => {
    const r: any = await apiGet(`/api/recipes/${id}`);
    if (opts.json) { console.log(JSON.stringify(r, null, 2)); return; }
    console.log(chalk.white.bold(`\n${r.name}`));
    console.log(chalk.gray(`Difficulty: ${r.difficulty ?? '—'}  |  Servings: ${r.base_servings ?? '—'}  |  Yield: ${r.yield_amount ?? '—'} ${r.yield_unit ?? ''}\n`));
    if (r.description) console.log(`${r.description}\n`);
    if (r.tags?.length) console.log(chalk.gray(`Tags: ${r.tags.join(', ')}\n`));
    console.log(chalk.green.bold('Ingredients:'));
    (r.ingredients ?? []).forEach((i: any) => {
      const name = i.name_override ?? i.ingredient?.name ?? i.name ?? 'Unknown';
      console.log(`  ${i.amount ?? ''} ${i.unit ?? ''}  ${name}`.trimEnd());
    });
    console.log(chalk.green.bold('\nMethod:'));
    (r.steps ?? []).sort((a: any, b: any) => a.step_number - b.step_number).forEach((s: any, idx: number) => {
      console.log(`  ${idx + 1}. ${s.instruction ?? s}`);
    });
    console.log();
  });

recipeCommand
  .command('search <query>')
  .description('Search recipes by name or keyword')
  .option('--ingredient <ing>', 'Search by ingredient instead')
  .action(async (query, opts) => {
    const path = opts.ingredient
      ? `/api/recipes?ingredient=${encodeURIComponent(opts.ingredient)}`
      : `/api/recipes?q=${encodeURIComponent(query)}`;
    const recipes: any[] = await apiGet(path);
    if (!recipes.length) { console.log(chalk.gray('No recipes found.')); return; }
    recipes.forEach((r) => console.log(`  ${chalk.cyan(r.id)}  ${r.name}  ${chalk.gray(r.difficulty ?? '')}`.trimEnd()));
    console.log();
  });

recipeCommand
  .command('add')
  .description('Add a new recipe')
  .requiredOption('--name <name>', 'Recipe name')
  .option('--description <desc>', 'Short description')
  .option('--servings <n>', 'Base serving count', '4')
  .option('--difficulty <d>', 'Beginner | Intermediate | Advanced', 'Intermediate')
  .option('--tags <tags>', 'Comma-separated tags')
  .option('--yield-amount <n>', 'Yield quantity')
  .option('--yield-unit <unit>', 'Yield unit (e.g. portions, loaf, cups)')
  .action(async (opts) => {
    const body: any = {
      name: opts.name,
      description: opts.description,
      base_servings: parseInt(opts.servings, 10),
      difficulty: opts.difficulty,
      tags: opts.tags ? opts.tags.split(',').map((t: string) => t.trim()) : [],
      yield_amount: opts.yieldAmount ? parseFloat(opts.yieldAmount) : undefined,
      yield_unit: opts.yieldUnit,
    };
    const r: any = await apiPost('/api/recipes', body);
    console.log(chalk.green(`\n✔ Recipe added`));
    console.log(`  ID   : ${r.id}`);
    console.log(`  Name : ${r.name}\n`);
  });

recipeCommand
  .command('delete <id>')
  .description('Delete a recipe by ID')
  .action(async (id) => {
    await apiDelete(`/api/recipes/${id}`);
    console.log(chalk.green(`✔ Recipe ${id} deleted.`));
  });
