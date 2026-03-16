import * as vscode from 'vscode';
import { DiagnosticsProvider } from './panel';
import { registerCommands, updateViewTitle } from './commands';

export function activate(context: vscode.ExtensionContext): void {
  const provider = new DiagnosticsProvider();

  // Register the tree view
  const treeView = vscode.window.createTreeView('errorRadar.diagnosticsView', {
    treeDataProvider: provider,
    showCollapseAll: false,
  });

  context.subscriptions.push(treeView);

  // Set initial title
  updateViewTitle(treeView, provider);

  // Register all commands
  registerCommands(context, provider, treeView);

  // Status bar item: quick error/warning count
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = 'errorRadar.openPanel';
  statusBarItem.tooltip = 'Error Radar — click to open diagnostics panel';
  context.subscriptions.push(statusBarItem);

  updateStatusBar(statusBarItem, provider);
  statusBarItem.show();

  // Auto-refresh when diagnostics change
  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics(() => {
      provider.refresh();
      updateStatusBar(statusBarItem, provider);
    })
  );
}

function updateStatusBar(
  item: vscode.StatusBarItem,
  provider: DiagnosticsProvider
): void {
  const { errors, warnings } = provider.getDiagnosticCount();
  item.text = `$(error) ${errors}  $(warning) ${warnings}`;

  if (errors > 0) {
    item.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
  } else if (warnings > 0) {
    item.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    item.backgroundColor = undefined;
  }
}

export function deactivate(): void {
  // Nothing to clean up — subscriptions handle disposal
}
