import { Command } from 'commander';
import chalk from 'chalk';
import { apiPost } from '../lib/api-client.js';

export const convertCommand = new Command('convert')
  .description('Convert between weight and volume units for baking ingredients')
  .argument('<value>', 'Numeric value to convert')
  .argument('<from>', 'Source unit (g, grams, cups, cup)')
  .argument('<to>', 'Target unit')
  .option('--ingredient <ing>', 'Ingredient name for density-aware conversion (e.g. flour, sugar, butter)')
  .option('--json', 'Output raw JSON')
  .action(async (value, from, to, opts) => {
    const body = {
      value: parseFloat(value),
      fromUnit: from,
      toUnit: to,
      ingredient: opts.ingredient,
    };
    const res: any = await apiPost('/api/convert', body);
    if (opts.json) { console.log(JSON.stringify(res, null, 2)); return; }
    const ing = res.ingredient ? ` (${res.ingredient})` : '';
    console.log(`\n  ${chalk.cyan(value)} ${from}${ing}  →  ${chalk.green.bold(res.result)} ${to}\n`);
  });
