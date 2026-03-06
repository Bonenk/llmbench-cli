import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import os from 'os';

interface SubmitOptions {
  file: string;
  apiKey?: string;
}

export async function submitResults(options: SubmitOptions) {
  const spinner = ora('Reading benchmark file').start();

  try {
    // Read benchmark file
    const filePath = path.resolve(options.file);
    if (!fs.existsSync(filePath)) {
      spinner.fail(`File not found: ${filePath}`);
      process.exit(1);
    }

    const benchmarkData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    spinner.succeed('Benchmark file loaded');

    // Get API key
    let apiKey = options.apiKey;
    if (!apiKey) {
      const configPath = path.join(os.homedir(), '.llmbench', 'config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        apiKey = config.apiKey;
      }
    }

    if (!apiKey) {
      spinner.fail('No API key found');
      console.log(chalk.yellow('\nRun: ') + chalk.green('llm-bench init --api-key=your_key\n'));
      process.exit(1);
    }

    // Submit to API
    spinner.start('Submitting to LLM Bench');

    const response = await axios.post(
      'https://llmbench.net/api/v1/benchmarks',
      benchmarkData,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      spinner.succeed('Benchmark submitted!');

      console.log(chalk.green('\n✓ Submission ID: ') + chalk.blue(response.data.data.id));
      console.log(chalk.green('✓ Status: ') + chalk.yellow(response.data.data.status));
      console.log(chalk.white('\nYour benchmark will be reviewed and added to the database.\n'));
      console.log(chalk.gray('View at: ') + chalk.blue(`https://llmbench.net/gpus/${benchmarkData.gpuId}\n`));
    } else {
      spinner.fail('Submission failed');
      console.error(chalk.red('Error: ') + response.data.error);
      process.exit(1);
    }

  } catch (error: any) {
    spinner.fail('Submission failed');
    
    if (error.response) {
      console.error(chalk.red('API Error: ') + error.response.data.error);
    } else {
      console.error(chalk.red('Error: ') + error.message);
    }
    
    process.exit(1);
  }
}
