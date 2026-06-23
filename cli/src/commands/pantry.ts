import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api-client.js';

export const pantryCommand = new Command('pantry')
  .description('Manage pantry stock');

pantryCommand
  .command('list')
  .description('List all pantry items')
  .option('--low', 'Show low-stock items only')
  .option('--json', 'Output raw JSON')
  .action(async (opts) => {
    const items: any[] = await apiGet(`/api/pantry${opts.low ? '?filter=low' : ''}`);
    if (opts.json) { console.log(JSON.stringify(items, null, 2)); return; }
    if (!items.length) { console.log(chalk.gray(opts.low ? 'No low-stock items.' : 'Pantry is empty.')); return; }
    const rows = [
      [chalk.bold('Name'), chalk.bold('Qty'), chalk.bold('Unit'), chalk.bold('Status')],
      ...items.map((i) => [
        i.displayName ?? i.name_override ?? '—',
        String(i.quantity),
        i.unit ?? '—',
        i.isLow ? chalk.yellow('⚠ Low') : chalk.green('OK'),
      ]),
    ];
    console.log(table(rows));
  });

pantryCommand
  .command('add')
  .description('Add a new pantry item')
  .requiredOption('--name <name>', 'Item name')
  .requiredOption('--qty <qty>', 'Quantity')
  .option('--unit <unit>', 'Unit (g, ml, cups, etc.)')
  .option('--reorder-at <n>', 'Reorder threshold')
  .action(async (opts) => {
    const body: any = {
      name_override: opts.name,
      quantity: parseFloat(opts.qty),
      unit: opts.unit,
      reorder_at: opts.reorderAt ? parseFloat(opts.reorderAt) : undefined,
    };
    const item: any = await apiPost('/api/pantry', body);
    console.log(chalk.green(`\n✔ Pantry item added`));
    console.log(`  ID   : ${item.id}`);
    console.log(`  Name : ${item.name_override}`);
    console.log(`  Qty  : ${item.quantity} ${item.unit ?? ''}\n`);
  });

pantryCommand
  .command('update <id> <qty>')
  .description('Update stock quantity for a pantry item')
  .action(async (id, qty) => {
    const item: any = await apiPatch(`/api/pantry/${id}`, { quantity: parseFloat(qty) });
    console.log(chalk.green(`✔ Updated: ${item.name_override ?? id} → ${item.quantity} ${item.unit ?? ''}`.trimEnd()));
  });

pantryCommand
  .command('delete <id>')
  .description('Remove a pantry item')
  .action(async (id) => {
    await apiDelete(`/api/pantry/${id}`);
    console.log(chalk.green(`✔ Pantry item ${id} removed.`));
  });
