import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, saveConfig } from '../lib/config.js';

export const configCommand = new Command('config')
  .description('Manage RecipeOS CLI configuration');

configCommand
  .command('set')
  .description('Set API URL and/or API key')
  .option('--url <url>', 'RecipeOS API base URL (e.g. https://recipeos.onrender.com)')
  .option('--key <key>', 'RecipeOS API key')
  .action((opts) => {
    if (!opts.url && !opts.key) {
      console.error(chalk.red('Provide --url and/or --key'));
      process.exit(1);
    }
    const updates: Record<string, string> = {};
    if (opts.url) updates.apiUrl = opts.url;
    if (opts.key) updates.apiKey = opts.key;
    saveConfig(updates);
    console.log(chalk.green('✔ Config saved to ~/.recipeos.json'));
    if (opts.url) console.log(`  URL: ${opts.url}`);
    if (opts.key) console.log(`  Key: ${opts.key.slice(0, 6)}...`);
  });

configCommand
  .command('show')
  .description('Show current config')
  .action(() => {
    const cfg = loadConfig();
    console.log(chalk.bold('\nRecipeOS CLI Config (~/.recipeos.json)\n'));
    console.log(`  API URL : ${cfg.apiUrl ?? chalk.gray('(not set — using http://localhost:3000)')}`);
    console.log(`  API Key : ${cfg.apiKey ? cfg.apiKey.slice(0, 6) + '...' : chalk.gray('(not set)')}`);
    console.log();
  });
