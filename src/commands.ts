import * as vscode from 'vscode';
import { DiagnosticsProvider } from './panel';
import { FilterMode, SortMode } from './types';

export function registerCommands(
  context: vscode.ExtensionContext,
  provider: DiagnosticsProvider,
  treeView: vscode.TreeView<vscode.TreeItem>
): void {
  // ── Open Panel ──────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('errorRadar.openPanel', () => {
      vscode.commands.executeCommand('workbench.view.extension.error-radar');
    })
  );

  // ── Refresh ─────────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('errorRadar.refresh', () => {
      provider.refresh();
    })
  );

  // ── Set Filter ──────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('errorRadar.setFilter', async () => {
      const current = provider.getFilter();

      const options: vscode.QuickPickItem[] = [
        {
          label: '$(list-flat) All',
          description: 'Show errors and warnings',
          picked: current === 'all',
        },
        {
          label: '$(error) Errors only',
          description: 'Show only errors',
          picked: current === 'errors',
        },
        {
          label: '$(warning) Warnings only',
          description: 'Show only warnings',
          picked: current === 'warnings',
        },
      ];

      const picked = await vscode.window.showQuickPick(options, {
        placeHolder: `Current filter: ${current} — Select a filter`,
        matchOnDescription: true,
      });

      if (!picked) { return; }

      const map: Record<string, FilterMode> = {
        '$(list-flat) All': 'all',
        '$(error) Errors only': 'errors',
        '$(warning) Warnings only': 'warnings',
      };
      const next = map[picked.label];
      if (next) {
        provider.setFilter(next);
        updateViewTitle(treeView, provider);
      }
    })
  );

  // ── Set Sort ────────────────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('errorRadar.setSort', async () => {
      const current = provider.getSort();

      const options: vscode.QuickPickItem[] = [
        {
          label: '$(sort-precedence) By severity',
          description: 'Errors first, then warnings',
          picked: current === 'severity',
        },
        {
          label: '$(file) By file name',
          description: 'Alphabetical by file path',
          picked: current === 'file',
        },
      ];

      const picked = await vscode.window.showQuickPick(options, {
        placeHolder: `Current sort: ${current} — Select a sort order`,
        matchOnDescription: true,
      });

      if (!picked) { return; }

      const map: Record<string, SortMode> = {
        '$(sort-precedence) By severity': 'severity',
        '$(file) By file name': 'file',
      };
      const next = map[picked.label];
      if (next) {
        provider.setSort(next);
        updateViewTitle(treeView, provider);
      }
    })
  );

  // ── Jump To ─────────────────────────────────────────────────────────────────
  // Internal command wired up by DiagnosticTreeItem.command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'errorRadar.jumpTo',
      async (uri: vscode.Uri, range: vscode.Range) => {
        try {
          const doc = await vscode.workspace.openTextDocument(uri);
          const editor = await vscode.window.showTextDocument(doc);

          // Clamp range to document bounds to handle stale diagnostics
          const lineCount = doc.lineCount;
          const safeLine = Math.min(range.start.line, lineCount - 1);
          const lineText = doc.lineAt(safeLine).text;
          const safeCol = Math.min(range.start.character, lineText.length);
          const safePos = new vscode.Position(safeLine, safeCol);

          editor.selection = new vscode.Selection(safePos, safePos);
          editor.revealRange(
            new vscode.Range(safePos, safePos),
            vscode.TextEditorRevealType.InCenterIfOutsideViewport
          );
        } catch {
          vscode.window.showWarningMessage('Error Radar: Could not open file.');
        }
      }
    )
  );
}

// Update the tree view title to reflect active filter/sort state
export function updateViewTitle(
  treeView: vscode.TreeView<vscode.TreeItem>,
  provider: DiagnosticsProvider
): void {
  const filter = provider.getFilter();
  const sort = provider.getSort();

  const filterLabel = filter === 'all' ? 'All' : filter === 'errors' ? 'Errors' : 'Warnings';
  const sortLabel = sort === 'severity' ? 'Severity' : 'File';
  treeView.title = `Diagnostics [${filterLabel} · ${sortLabel}]`;
}
