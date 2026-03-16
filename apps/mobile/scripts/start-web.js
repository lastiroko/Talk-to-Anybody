#!/usr/bin/env node
const { spawn } = require('node:child_process');
const net = require('node:net');

function parseArgs(args) {
  const cleaned = [];
  let port;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--non-interactive') continue;
    if (arg === '--port' && i + 1 < args.length) {
      port = Number(args[i + 1]);
      i += 1;
      continue;
    }
    cleaned.push(arg);
  }
  return { cleaned, port };
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });
}

async function main() {
  const { cleaned, port } = parseArgs(process.argv.slice(2));
  let selectedPort = port || 19006;
  for (let attempts = 0; attempts < 20; attempts += 1) {
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortOpen(selectedPort);
    if (free) break;
    selectedPort += 1;
  }

  const child = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['expo', 'start', '--web', '--port', String(selectedPort), ...cleaned],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        CI: process.env.CI || '1',
        EXPO_OFFLINE: process.env.EXPO_OFFLINE || '1',
      },
    },
  );

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
}

main();
