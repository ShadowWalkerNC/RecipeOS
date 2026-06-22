import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { apiGet, apiPost } from '../lib/api-client';

export const prepCommand = new Command('prep')
  .description('Generate and manage kitchen prep lists');

prepCommand
  .command('generate')
  .description('Generate a prep list for a given date or menu')
  .option('--date <date>', 'Target date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10))
  .action(async (opts) => {
    const tasks: any[] = await apiPost('/api/prep/generate', { date: opts.date });
    const rows = [['Task', 'Station', 'Est. Time'],
      ...tasks.map((t) => [t.task, t.station ?? '—', t.estimatedMinutes ? `${t.estimatedMinutes}m` : '—'])];
    console.log(chalk.white.bold(`\nPrep List — ${opts.date}\n`));
    console.log(table(rows));
  });

prepCommand
  .command('list')
  .description('Show current prep list with completion status')
  .option('--date <date>', 'Date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10))
  .action(async (opts) => {
    const tasks: any[] = await apiGet(`/api/prep?date=${opts.date}`);
    tasks.forEach((t) => {
      const icon = t.done ? chalk.green('✔') : chalk.gray('○');
      const text = t.done ? chalk.gray(t.task) : chalk.white(t.task);
      console.log(`  ${icon}  ${text}  ${chalk.dim(t.station ?? '')}`);
    });
    const done = tasks.filter((t) => t.done).length;
    console.log(chalk.dim(`\n${done}/${tasks.length} complete\n`));
  });
