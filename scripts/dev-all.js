import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const isWindows = process.platform === 'win32'

function run(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
  })

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      process.exit(code)
    }
  })

  return child
}

console.log('Iniciando API (porta 3001) e site (porta 5173)...\n')

run('node', ['index.js'], path.join(root, '..', 'server'))
run('npx', ['vite'], path.join(root, '..'))

process.on('SIGINT', () => process.exit(0))
