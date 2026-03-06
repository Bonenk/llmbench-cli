# @llmbench/cli

CLI tool for submitting GPU benchmarks to [LLM Bench](https://llmbench.net).

## Installation

```bash
npm install -g @llmbench/cli
```

## Quick Start

### 1. Install llama.cpp (Required)

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && make
sudo make install  # Or add to PATH manually
```

### 2. Initialize with API Key

Get your free API key at [llmbench.net/api/keys](https://llmbench.net/api/keys), then:

```bash
llm-bench init --api-key=your_api_key
```

### 3. Run Benchmarks

```bash
# Auto-detect GPU, run default benchmark (llama-3-70b INT4)
llm-bench run

# Specify model and quantization
llm-bench run --model=llama-3-70b --quant=INT4

# Save results to specific file
llm-bench run --output=my-benchmark.json

# Custom llama-bench path (if not in PATH)
llm-bench run --path=/home/user/llama.cpp/llama-bench
```

**Auto-detection:**
- Searches common locations (`~/llama.cpp`, `/usr/local/bin`, etc.)
- Checks your PATH
- Use `--path` if llama-bench is in custom location

### 4. Submit Results

```bash
llm-bench submit --file=benchmark.json
```

## Commands

### `llm-bench init`

Initialize configuration with your API key.

```bash
llm-bench init --api-key=llmbench_xxx
```

### `llm-bench run`

Run benchmarks on your GPU using llama.cpp (required backend).

**Options:**
- `-m, --model <model>` - Model to benchmark (default: llama-3-70b)
- `-q, --quant <quantization>` - Quantization: INT4, INT8, FP16 (default: INT4)
- `-o, --output <file>` - Output file path (default: benchmark-[timestamp].json)

**Requirements:**
- llama.cpp installed and in PATH (`llama-bench` command must work)
- NVIDIA GPU with CUDA support (AMD ROCm support coming soon)
- Sufficient VRAM for selected model (e.g., 70B INT4 needs ~40GB)

### `llm-bench submit`

Submit benchmark results to LLM Bench.

**Options:**
- `-f, --file <file>` - Benchmark results JSON file (required)
- `-k, --api-key <key>` - API key (overrides config file)

**Example:**
```bash
llm-bench submit --file=result.json
```

### `llm-bench status`

Check submission status and history.

```bash
llm-bench status
```

## Configuration

Config is stored at `~/.llmbench/config.json`:

```json
{
  "apiKey": "llmbench_xxx",
  "apiEndpoint": "https://llmbench.net/api/v1",
  "createdAt": "2026-03-06T12:00:00Z"
}
```

## API Rate Limits

- **Free tier:** 100 submissions/day
- **Pro tier:** 10,000 submissions/day ($99/mo)
- **Enterprise:** 100,000 submissions/day ($499/mo)

## Benchmark Output Format

```json
{
  "gpuId": "rtx-4090",
  "gpuName": "NVIDIA GeForce RTX 4090",
  "modelId": "llama-3-70b",
  "quantization": "INT4",
  "tokensPerSecond": 42.5,
  "vramUsage": 38.2,
  "powerDraw": 385,
  "contextLength": 8192,
  "promptLength": 512,
  "generationLength": 512,
  "temperature": 0.7,
  "systemInfo": {
    "cpu": "AMD Ryzen 9 7950X",
    "ram": 64,
    "os": "linux",
    "driverVersion": "550.54.14"
  },
  "benchmarkDate": "2026-03-06T12:00:00Z"
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/Bonenk/llmbench-cli.git
cd llmbench-cli

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm run dev -- --help
```

## License

MIT

---

**Contributing:** Help build the most comprehensive LLM GPU benchmark database! Submit your results and improve the community data.

**Support:** [GitHub Issues](https://github.com/Bonenk/llmbench/issues)
