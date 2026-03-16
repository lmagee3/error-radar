# Error Radar

**See every workspace error in one place.**

Error Radar is a free VS Code extension that surfaces diagnostics (errors + warnings) across your entire codebase in a single panel, with fast filters and click-to-jump navigation.

---

## What it does

Stop opening files one by one just to find what's broken.

- **Aggregates all diagnostics** — errors and warnings from every file in your workspace, not just the currently open one
- **One-click navigation** — click any item to jump directly to the exact file and line
- **Filter by severity** — view all diagnostics, errors only, or warnings only
- **Sort controls** — sort by severity (errors first) or alphabetically by file name
- **Auto-refresh** — the panel updates automatically as diagnostics change
- **Status bar indicator** — see your error/warning count at a glance without opening the panel
- **Multi-root workspace support** — aggregates diagnostics across all workspace roots

---

## Install

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=chaosmonk.error-radar).

Or press `Ctrl+Shift+X` (Windows/Linux) / `Cmd+Shift+X` (Mac), search for **Error Radar**, and click Install.

---

## Usage

1. Click the **Error Radar** icon in the Activity Bar (radar icon on the left sidebar)
2. The **Diagnostics** panel shows all errors and warnings across your workspace
3. Click any item to jump to that exact location in the file
4. Use the toolbar icons to **Refresh**, **Set Filter**, or **Set Sort**

### Commands

| Command | Description |
|---------|-------------|
| `Error Radar: Open Panel` | Focus the diagnostics panel |
| `Error Radar: Refresh` | Force-refresh the diagnostics list |
| `Error Radar: Set Filter` | Choose All / Errors only / Warnings only |
| `Error Radar: Set Sort` | Sort by Severity or File name |

Access commands via `Ctrl+Shift+P` / `Cmd+Shift+P` and type `Error Radar`.

---

## Running from Source (Dev)

```bash
git clone https://github.com/lmagee3/error-radar
cd error-radar
npm install
```

Then press **F5** in VS Code to launch the Extension Development Host with Error Radar loaded.

---

## Known Limitations

- Diagnostics from language servers that haven't loaded yet won't appear until they initialize (use Refresh after the workspace fully loads)
- For very large projects (>1000 diagnostics), scroll performance may vary depending on VS Code's tree view rendering
- The `icon.png` marketplace icon needs to be exported from `resources/icon.svg` before publishing

---

## Roadmap

- [ ] Group diagnostics by file (collapsible tree)
- [ ] Filter by source (ESLint, TypeScript, etc.)
- [ ] Keyboard shortcut to cycle filter modes
- [ ] Persistent filter/sort preferences across sessions
- [ ] Export diagnostics to a report file

---

## Built by Chaos Monk

Error Radar is built by **[Chaos Monk](https://chaosmonk.netlify.app)** — practical tools for developers who value clarity, speed, and local-first workflows.

## More from Chaos Monk

- **Chaos Monk Workspace Sitemap** ($10) — Map and index your entire Notion workspace in seconds. [Get it here](https://chaosmonk.netlify.app/#pricing)

---

## License

MIT
