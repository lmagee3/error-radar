# Draft: How Error Radar makes workspace diagnostics visible

This article was reviewed and approved by Lawrence Magee for publication. It makes no performance claim.

## The problem

When I work in a multi-file project, the next error is not always in the file I have open. VS Code already has diagnostics from language servers and other tooling, but I wanted one place to review what the editor currently knows about the whole workspace. Error Radar is a small extension built around that need.

## The implementation

The extension calls `vscode.languages.getDiagnostics()` to retrieve the current diagnostic sets. For each diagnostic with a usable file URI, it builds a display item with the file path, range, message, and severity. The collector can filter to errors or warnings and sort by severity or file path. In a multi-root workspace, it computes the displayed path relative to the matching workspace folder.

The tree view presents those items in one panel. Selecting an item invokes a command that opens its file and goes to the diagnostic range. A status-bar item shows current error and warning counts. The extension subscribes to `onDidChangeDiagnostics`; when VS Code reports a change, it refreshes the tree and count.

The relevant public implementation is [`src/diagnostics.ts`](https://github.com/lmagee3/error-radar/blob/master/src/diagnostics.ts), [`src/panel.ts`](https://github.com/lmagee3/error-radar/blob/master/src/panel.ts), and [`src/extension.ts`](https://github.com/lmagee3/error-radar/blob/master/src/extension.ts). The [README](https://github.com/lmagee3/error-radar/blob/master/README.md) covers installation and use.

## What it does not claim

This is visibility over diagnostics already available to VS Code, not a new compiler or code-quality engine. It does not guarantee that every language server has finished loading, and I have not published a measured speed improvement or benchmark for the extension. Those would require a controlled test, documented workload, and raw results.

## What I learned

The useful design choice was to keep the tool narrow: collect existing signals, give them a predictable order, and let a developer jump to the source. That makes the workflow easier to inspect without pretending to solve the underlying errors automatically.
