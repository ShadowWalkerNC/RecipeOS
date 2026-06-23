import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet } from '../lib/api-client.js';

export const scaleCommand = new Command('scale')
  .description('Scale a recipe from base to target servings')
  .argument('<recipe-id>', 'Recipe UUID')
  .argument('<base>', 'Base serving count')
  .argument('<target>', 'Target serving count')
  .option('--json', 'Output raw JSON')
  .action(async (recipeId, base, target, opts) => {
    const data: any = await apiGet(`/api/recipes/${recipeId}/scale?base=${base}&target=${target}`);
    if (opts.json) { console.log(JSON.stringify(data, null, 2)); return; }
    console.log(chalk.white.bold(`\n${data.name}`));
    console.log(chalk.gray(`Base: ${data.base_servings}  →  Target: ${data.target_servings}  |  Factor: ${data.scale_factor?.toFixed(3)}×\n`));
    const rows = [
      [chalk.bold('Ingredient'), chalk.bold('Original'), chalk.bold('Scaled')],
      ...data.ingredients.map((i: any) => [
        i.name,
        `${i.amount} ${i.unit ?? ''}`.trim(),
        `${i.scaledAmount} ${i.unit ?? ''}`.trim(),
      ]),
    ];
    console.log(table(rows));
  });
