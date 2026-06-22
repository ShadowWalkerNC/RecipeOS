import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet } from '../lib/api-client';

export const shopCommand = new Command('shop')
  .description('Generate shopping lists from pantry gaps and upcoming menus');

shopCommand
  .command('list')
  .description('Generate a shopping list based on low-stock pantry items')
  .action(async () => {
    const items: any[] = await apiGet('/api/shopping-list');
    if (items.length === 0) {
      console.log(chalk.green('\n✔ Pantry fully stocked — no items needed\n'));
      return;
    }
    const rows = [['Ingredient', 'Need', 'Unit', 'Estimated Cost'],
      ...items.map((i) => [i.name, i.quantityNeeded, i.unit, i.estimatedCost ? `$${i.estimatedCost.toFixed(2)}` : '—'])];
    console.log(chalk.white.bold('\nShopping List\n'));
    console.log(table(rows));
  });
