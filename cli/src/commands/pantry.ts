import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet, apiPost } from '../lib/api-client';

export const pantryCommand = new Command('pantry')
  .description('Manage pantry / ingredient stock');

pantryCommand
  .command('list')
  .description('Show all pantry items')
  .option('--low', 'Show only low-stock items')
  .action(async (opts) => {
    const items: any[] = await apiGet(`/api/pantry${opts.low ? '?filter=low' : ''}`);
    const rows = [['Ingredient', 'Qty', 'Unit', 'Status'],
      ...items.map((i) => [
        i.name, i.quantity, i.unit,
        i.isLow ? chalk.red('LOW') : chalk.green('OK'),
      ])];
    console.log(table(rows));
  });

pantryCommand
  .command('update <itemId>')
  .description('Update stock quantity')
  .requiredOption('--qty <n>', 'New quantity', parseFloat)
  .action(async (itemId, opts) => {
    await apiPost(`/api/pantry/${itemId}`, { quantity: opts.qty });
    console.log(chalk.green(`✔ Pantry updated: ${itemId} → ${opts.qty}`));
  });
