# Contributing to OpenSpec

Thanks for your interest in contributing! OpenSpec is a community-driven project and we welcome all contributions.

## Getting Started

```bash
# Fork and clone
git clone https://github.com/<your-username>/openspec.git
cd openspec

# Install dependencies
npm install

# Run in dev mode (uses tsx, no build needed)
npm run dev -- init
npm run dev -- sync
npm run dev -- status

# Build for production
npm run build
```

## Development Workflow

1. **Create a branch** from `main` for your feature or fix
2. **Make your changes** in `src/`
3. **Test manually** using `npm run dev -- <command>`
4. **Build** with `npm run build` to ensure TypeScript compiles cleanly
5. **Submit a PR** with a clear description of what and why

## Project Structure

```
src/
├── cli.ts              # CLI entry point — add new commands here
├── compiler.ts          # Orchestrates module → target compilation
├── config.ts            # Config loading and merging
├── modules.ts           # Module discovery and filtering
├── types.ts             # Shared types and defaults
├── watcher.ts           # File watcher
├── hooks.ts             # Git hook management
├── commands/            # CLI command handlers
│   ├── init.ts
│   ├── sync.ts
│   └── status.ts
└── targets/
    └── index.ts         # Per-target renderers
```

## Adding a New Target

To add support for a new AI tool:

1. Add the target's default config in `src/types.ts` → `DEFAULT_CONFIG.targets`
2. Add a description in `src/types.ts` → `TARGET_DESCRIPTIONS`
3. Optionally add a custom renderer in `src/targets/index.ts`
4. Update the `HOOK_SCRIPT` in `src/hooks.ts` to include the new output file
5. Update `README.md` with the new target

## Conventions

- **TypeScript** — strict mode, no `any` unless absolutely necessary
- **ESM** — use `.js` extensions in imports (TypeScript ESM convention)
- **No external runtime dependencies** unless they provide significant value
- **Keep it simple** — this tool should be fast, predictable, and easy to understand
- **Backwards compatible** — config changes should be additive

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add support for Cody AI target
fix: handle modules with no frontmatter
docs: add monorepo usage examples
refactor: extract renderer interface
```

## Reporting Issues

- Use GitHub Issues for bugs and feature requests
- Include your Node.js version, OS, and `openspec --version`
- For bugs, include the minimal config/modules to reproduce

## Code of Conduct

Be kind, be constructive, be welcoming. We're all here to make AI tooling better.
