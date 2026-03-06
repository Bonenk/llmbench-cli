#!/usr/bin/env node

import { Command } from 'commander';
import { runBenchmarks } from './commands/run';
import { submitResults } from './commands/submit';
import { initConfig } from './commands/init';
import { checkStatus } from './commands/status';

const program = new Command();

program
  .name('llm-bench')
  .description('CLI tool for submitting GPU benchmarks to LLM Bench')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize configuration with API key')
  .option('-k, --api-key <key>', 'Your LLM Bench API key')
  .action(async (options) => {
    await initConfig(options);
  });

program
  .command('run')
  .description('Run benchmarks on your GPU')
  .option('-m, --model <model>', 'Model to benchmark (e.g., llama-3-70b)')
  .option('-q, --quant <quantization>', 'Quantization (INT4, INT8, FP16)')
  .option('-o, --output <file>', 'Output file path')
  .option('-p, --path <path>', 'Custom llama-bench binary path')
  .option('--model-path <path>', 'Custom model path (skip download)')
  .action(async (options) => {
    await runBenchmarks(options);
  });

program
  .command('submit')
  .description('Submit benchmark results to LLM Bench')
  .requiredOption('-f, --file <file>', 'Benchmark results JSON file')
  .option('-k, --api-key <key>', 'API key (overrides config)')
  .action(async (options) => {
    await submitResults(options);
  });

program
  .command('status')
  .description('Check submission status')
  .action(async () => {
    await checkStatus();
  });

program.parse();
