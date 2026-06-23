import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet } from '../lib/api-client.js';

export const shopCommand = new Command('shop')
  .description('View shopping list based on low-stock pantry items')
  .option('--json', 'Output raw JSON')
  .action(async (opts) => {
    const data: any = await apiGet('/api/shopping-list');
    if (opts.json) { console.log(JSON.stringify(data, null, 2)); return; }
    const items = data.items ?? [];
    if (!items.length) {
      console.log(chalk.green('\n✔ Nothing to buy — pantry is well stocked.\n'));
      return;
    }
    console.log(chalk.white.bold(`\nShopping List  (${data.count} item${data.count !== 1 ? 's' : ''})\n`));
    const rows = [
      [chalk.bold('Item'), chalk.bold('Current Qty'), chalk.bold('Unit'), chalk.bold('Reorder At')],
      ...items.map((i: any) => [
        i.name,
        String(i.current_quantity),
        i.unit ?? '—',
        String(i.reorder_at ?? '—'),
      ]),
    ];
    console.log(table(rows));
  });
