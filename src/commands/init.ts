import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';

interface InitOptions {
  apiKey?: string;
}

export async function initConfig(options: InitOptions) {
  const configDir = path.join(os.homedir(), '.llmbench');
  const configPath = path.join(configDir, 'config.json');

  const spinner = ora('Initializing configuration').start();

  try {
    // Create config directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    let apiKey = options.apiKey;

    // If no API key provided, prompt user
    if (!apiKey) {
      console.log(chalk.yellow('\nNo API key provided.'));
      console.log(chalk.white('Get your free API key at: ') + chalk.blue('https://llmbench.net/api/keys'));
      console.log(chalk.white('\nThen run: ') + chalk.green('llm-bench init --api-key=your_key\n'));
      process.exit(0);
    }

    // Save config
    const config = {
      apiKey,
      apiEndpoint: 'https://llmbench.net/api/v1',
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    spinner.succeed('Configuration initialized!');

    console.log(chalk.green('\n✓ Config saved to: ') + chalk.gray(configPath));
    console.log(chalk.green('✓ API endpoint: ') + chalk.blue('https://llmbench.net/api/v1'));
    console.log(chalk.green('\nNext steps:'));
    console.log(chalk.white('  1. Run benchmarks: ') + chalk.green('llm-bench run'));
    console.log(chalk.white('  2. Submit results: ') + chalk.green('llm-bench submit --file=result.json\n'));

  } catch (error) {
    spinner.fail('Failed to initialize configuration');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}
