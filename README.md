# Error Radar

**A VS Code extension that surfaces workspace errors in one place.**

Error Radar is a lightweight developer utility that aggregates diagnostics across an entire workspace so developers can quickly see what is broken without opening files one by one.

The goal is simple:

> Spend less time hunting for problems and more time fixing them.

---

## The problem

Modern projects generate diagnostics from everywhere: TypeScript, ESLint, Python, build tools, language servers, and framework tooling.

The default workflow in many editors is reactive:

- open a file
- discover an error
- fix it
- move to the next file
- repeat

That works for small projects.

For larger codebases, it becomes friction.

Error Radar gives developers a single place to understand the state of a workspace.

---

## What it does

- Aggregates diagnostics across the full workspace
- Displays errors and warnings in one panel
- Supports one-click navigation to files and lines
- Filters by severity (all, warnings, errors)
- Sorts diagnostics for faster triage
- Refreshes automatically as diagnostics update
- Includes status-bar visibility for quick awareness
- Supports multi-root workspaces

---

## Example workflow

Instead of:

```text
Open file → notice error → repeat across project
```

You get:

```text
Open Error Radar → see all issues → prioritize → fix
```

This helps developers quickly answer:

> “What is actually broken right now?”

---

## Usage

1. Open the **Error Radar** view in VS Code
2. Review all workspace diagnostics in a single panel
3. Click an issue to jump directly to the source file and line
4. Filter or sort to focus on high-priority fixes

### Commands

| Command | Purpose |
|---|---|
| `Error Radar: Open Panel` | Focus the diagnostics panel |
| `Error Radar: Refresh` | Refresh diagnostics |
| `Error Radar: Set Filter` | Show all, warnings only, or errors only |
| `Error Radar: Set Sort` | Sort diagnostics by file or severity |

---

## Installation

Install from the VS Code Marketplace:

https://marketplace.visualstudio.com/items?itemName=chaosmonk.error-radar

Or open VS Code Extensions and search:

```text
Error Radar
```

---

## Why I built it

I found myself repeatedly opening files just to discover what had already broken somewhere else in the workspace.

The underlying diagnostics already existed — the friction was visibility.

Error Radar is a small example of the kinds of tools I like building:

- solve a real workflow pain
- reduce cognitive load
- keep the experience simple
- improve execution without adding complexity

---

## Technical notes

| Area | Details |
|---|---|
| Platform | VS Code extension |
| Language | TypeScript |
| Runtime | VS Code Extension API |
| Scope | Workspace-wide diagnostics |
| Audience | Developers working across medium or large projects |

---

## Future improvements

Planned ideas include:

- grouping diagnostics by file
- filtering by diagnostic source
- persistent filter preferences
- keyboard shortcuts for triage
- exportable diagnostic reports

---

## Portfolio note

This repo exists both as a working utility and as a public demonstration of how I think about product design:

> Find friction → simplify workflow → make useful things.

---

## Built by

**Lawrence Magee**  
U.S. Army IT veteran · AI systems builder · founder/operator focused on practical tools and workflow improvement

- GitHub: [@lmagee3](https://github.com/lmagee3)
- Related tools: [Chaos Monk](https://chaosmonk.netlify.app)

---

## License

MIT
