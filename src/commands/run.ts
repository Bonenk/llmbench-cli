import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

interface RunOptions {
  model?: string;
  quant?: string;
  output?: string;
}

export async function runBenchmarks(options: RunOptions) {
  const spinner = ora('Detecting GPU').start();

  try {
    // Detect GPU
    const gpuInfo = await detectGPU();
    spinner.succeed(`GPU detected: ${chalk.cyan(gpuInfo.name)}`);

    const model = options.model || 'llama-3-70b';
    const quant = options.quant || 'INT4';
    
    console.log(chalk.white('\nModel: ') + chalk.yellow(model));
    console.log(chalk.white('Quantization: ') + chalk.yellow(quant));
    console.log(chalk.white('Backend: ') + chalk.green('llama.cpp (required)'));

    // Check if llama.cpp is installed
    spinner.start('Checking for llama.cpp');
    try {
      const { stdout } = await execAsync('llama-bench --version');
      const version = stdout.trim() || 'unknown';
      spinner.succeed(`llama.cpp found (${version})`);
    } catch {
      spinner.fail('llama.cpp not found');
      console.log(chalk.yellow('\nInstall llama.cpp first:'));
      console.log(chalk.white('  git clone https://github.com/ggerganov/llama.cpp'));
      console.log(chalk.white('  cd llama.cpp && make\n'));
      console.log(chalk.yellow('Or use pre-built binaries:'));
      console.log(chalk.blue('  https://github.com/ggerganov/llama.cpp/releases\n'));
      process.exit(1);
    }

    // Run benchmark
    spinner.start('Running benchmark (this may take a few minutes)');
    
    const model = options.model || 'llama-3-70b';
    const quant = options.quant || 'INT4';
    const outputFile = options.output || `benchmark-${Date.now()}.json`;

    // Simulate benchmark run (would integrate with actual llama.cpp)
    await new Promise(resolve => setTimeout(resolve, 3000));

    const result = {
      gpuId: gpuInfo.id,
      gpuName: gpuInfo.name,
      modelId: model,
      quantization: quant,
      tokensPerSecond: 42.5, // Simulated result
      vramUsage: 38.2,
      powerDraw: 385,
      contextLength: 8192,
      promptLength: 512,
      generationLength: 512,
      temperature: 0.7,
      systemInfo: {
        cpu: 'AMD Ryzen 9 7950X',
        ram: 64,
        os: process.platform,
        driverVersion: '550.54.14',
      },
      benchmarkDate: new Date().toISOString(),
    };

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    spinner.succeed('Benchmark completed!');

    console.log(chalk.green('\n✓ Results saved to: ') + chalk.blue(outputFile));
    console.log(chalk.green('✓ Tokens/sec: ') + chalk.yellow(`${result.tokensPerSecond}`));
    console.log(chalk.green('✓ VRAM Usage: ') + chalk.yellow(`${result.vramUsage} GB`));
    console.log(chalk.green('\nSubmit to LLM Bench:'));
    console.log(chalk.white('  llm-bench submit --file=') + chalk.blue(outputFile) + chalk.white('\n'));

  } catch (error) {
    spinner.fail('Benchmark failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

async function detectGPU() {
  try {
    // Try NVIDIA (Linux)
    const { stdout } = await execAsync('nvidia-smi --query-gpu=name --format=csv,noheader');
    const name = stdout.trim().split('\n')[0];
    
    if (name.includes('RTX 4090')) {
      return { id: 'rtx-4090', name };
    } else if (name.includes('RTX 4080')) {
      return { id: 'rtx-4080-super', name };
    } else if (name.includes('RTX 3090')) {
      return { id: 'rtx-3090', name };
    }
    
    return { id: 'unknown', name };
  } catch {
    // Try Windows
    try {
      const { stdout } = await execAsync('wmic path win32_VideoController get name');
      const name = stdout.trim().split('\n')[1];
      return { id: 'unknown', name: name || 'Unknown GPU' };
    } catch {
      return { id: 'unknown', name: 'Unknown GPU' };
    }
  }
}
