import { Command } from 'commander';
import chalk from 'chalk';
import { apiGet } from '../lib/api-client.js';

export const prepCommand = new Command('prep')
  .description('View kitchen prep lists');

prepCommand
  .command('list')
  .description('List all prep lists with tasks')
  .option('--date <date>', 'Filter by scheduled date (YYYY-MM-DD)')
  .option('--json', 'Output raw JSON')
  .action(async (opts) => {
    const qs = opts.date ? `?date=${opts.date}` : '';
    const lists: any[] = await apiGet(`/api/prep${qs}`);
    if (opts.json) { console.log(JSON.stringify(lists, null, 2)); return; }
    if (!lists.length) { console.log(chalk.gray('No prep lists found.')); return; }
    lists.forEach((list) => {
      console.log(chalk.white.bold(`\n${list.name}`));
      const tasks: any[] = (list.tasks ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
      if (!tasks.length) { console.log(chalk.gray('  (no tasks)')); return; }
      tasks.forEach((t) => {
        const done  = t.is_done ? chalk.green('✔') : chalk.gray('○');
        const time  = t.estimated_minutes ? chalk.gray(` [${t.estimated_minutes}m]`) : '';
        const station = t.station ? chalk.cyan(` [${t.station}]`) : '';
        console.log(`  ${done} ${t.task}${station}${time}`);
      });
      const doneCount = tasks.filter((t) => t.is_done).length;
      console.log(chalk.gray(`\n  ${doneCount}/${tasks.length} done`));
    });
    console.log();
  });

prepCommand
  .command('generate')
  .description('Generate a prep list for a given date')
  .option('--date <date>', 'Target date YYYY-MM-DD (default: today)')
  .option('--json', 'Output raw JSON')
  .action(async (opts) => {
    const body = { date: opts.date ?? new Date().toISOString().slice(0, 10) };
    const res = await fetch(`${(await import('../lib/api-client.js')).getBaseUrl()}/api/prep/generate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${(await import('../lib/api-client.js')).getApiKey()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST /api/prep/generate failed: ${res.status}`);
    const data = await res.json();
    if (opts.json) { console.log(JSON.stringify(data, null, 2)); return; }
    console.log(chalk.green(`\n✔ Prep list generated for ${body.date}`));
    console.log(JSON.stringify(data, null, 2));
  });
