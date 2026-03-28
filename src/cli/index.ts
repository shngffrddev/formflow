import { existsSync, readFileSync } from 'fs'
import { execSync } from 'child_process'

const RESET  = '\x1b[0m'
const BOLD   = '\x1b[1m'
const DIM    = '\x1b[2m'
const GREEN  = '\x1b[32m'
const CYAN   = '\x1b[36m'
const YELLOW = '\x1b[33m'
const RED    = '\x1b[31m'

const args   = process.argv.slice(2)
const cmd    = args[0]

function log(msg: string)  { console.log(`  ${msg}`) }
function ok(msg: string)   { log(`${GREEN}✓${RESET} ${msg}`) }
function info(msg: string) { log(`${DIM}${msg}${RESET}`) }
function warn(msg: string) { log(`${YELLOW}!${RESET} ${msg}`) }
function err(msg: string)  { log(`${RED}✗${RESET} ${msg}`) }
function br()              { console.log() }

type PM = 'pnpm' | 'bun' | 'yarn' | 'npm'

function detectPM(): PM {
  if (existsSync('pnpm-lock.yaml'))            return 'pnpm'
  if (existsSync('bun.lockb') || existsSync('bun.lock')) return 'bun'
  if (existsSync('yarn.lock'))                 return 'yarn'
  return 'npm'
}

function addCmd(pm: PM, pkgs: string[]): string {
  const p = pkgs.join(' ')
  switch (pm) {
    case 'pnpm': return `pnpm add ${p}`
    case 'bun':  return `bun add ${p}`
    case 'yarn': return `yarn add ${p}`
    default:     return `npm install ${p}`
  }
}

function getInstalledDeps(): Record<string, string> {
  try {
    const raw = readFileSync('package.json', 'utf-8')
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    return { ...pkg.dependencies, ...pkg.devDependencies }
  } catch {
    return {}
  }
}

async function init() {
  br()
  log(`${BOLD}FormFlow${RESET}  ${DIM}v0.1.0${RESET}`)
  br()

  if (!existsSync('package.json')) {
    err('No package.json found. Run this inside a React project.')
    br()
    process.exit(1)
  }

  const pm      = detectPM()
  const deps    = ['@shngffrddev/formflow', 'zod']
  const installed = getInstalledDeps()
  const missing   = deps.filter(d => !(d in installed))

  info(`Package manager  ${CYAN}${pm}${RESET}`)
  br()

  if (missing.length === 0) {
    ok('All dependencies already installed')
    br()
    return
  }

  const alreadyHave = deps.filter(d => d in installed)
  if (alreadyHave.length) {
    for (const d of alreadyHave) ok(`${d} already installed`)
  }

  for (const d of missing) {
    info(`Installing ${CYAN}${d}${RESET}`)
  }
  br()

  const command = addCmd(pm, missing)
  info(`${DIM}$ ${command}${RESET}`)
  br()

  try {
    execSync(command, { stdio: 'inherit' })
  } catch {
    br()
    err('Installation failed. Run the command above manually.')
    br()
    process.exit(1)
  }

  br()
  ok(`${missing.join(', ')} installed`)
  br()
  log(`${DIM}Get started:${RESET}`)
  log(`  ${DIM}https://formflow.shngffrd.com/docs/getting-started${RESET}`)
  br()
}

function help() {
  br()
  log(`${BOLD}FormFlow CLI${RESET}`)
  br()
  log('Usage:')
  log(`  ${CYAN}pnpm dlx @shngffrddev/formflow init${RESET}`)
  br()
  log('Commands:')
  log(`  ${CYAN}init${RESET}    Install dependencies into your project`)
  log(`  ${CYAN}help${RESET}    Show this message`)
  br()
}

switch (cmd) {
  case 'init':
  case undefined:
    init().catch((e: unknown) => {
      err(String(e))
      process.exit(1)
    })
    break
  case 'help':
  case '--help':
  case '-h':
    help()
    break
  default:
    err(`Unknown command: ${cmd}`)
    help()
    process.exit(1)
}
