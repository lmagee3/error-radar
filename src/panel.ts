import * as vscode from 'vscode';
import { collectDiagnostics } from './diagnostics';
import { DiagnosticItem, FilterMode, SortMode } from './types';

const SEVERITY_LABEL: Record<vscode.DiagnosticSeverity, string> = {
  [vscode.DiagnosticSeverity.Error]: 'Error',
  [vscode.DiagnosticSeverity.Warning]: 'Warning',
  [vscode.DiagnosticSeverity.Information]: 'Info',
  [vscode.DiagnosticSeverity.Hint]: 'Hint',
};

const SEVERITY_ICON: Record<vscode.DiagnosticSeverity, string> = {
  [vscode.DiagnosticSeverity.Error]: 'error',
  [vscode.DiagnosticSeverity.Warning]: 'warning',
  [vscode.DiagnosticSeverity.Information]: 'info',
  [vscode.DiagnosticSeverity.Hint]: 'lightbulb',
};

const SEVERITY_COLOR: Record<vscode.DiagnosticSeverity, string> = {
  [vscode.DiagnosticSeverity.Error]: 'errorForeground',
  [vscode.DiagnosticSeverity.Warning]: 'editorWarning.foreground',
  [vscode.DiagnosticSeverity.Information]: 'editorInfo.foreground',
  [vscode.DiagnosticSeverity.Hint]: 'editorHint.foreground',
};

export class DiagnosticTreeItem extends vscode.TreeItem {
  constructor(
    public readonly diagnosticItem: DiagnosticItem,
  ) {
    const { diagnostic, relativePath } = diagnosticItem;
    const line = diagnostic.range.start.line + 1;
    const col = diagnostic.range.start.character + 1;
    const sevLabel = SEVERITY_LABEL[diagnostic.severity] ?? 'Info';

    // Truncate long messages for the label
    const maxLen = 80;
    const msg =
      diagnostic.message.length > maxLen
        ? diagnostic.message.slice(0, maxLen - 3) + '...'
        : diagnostic.message;

    super(msg, vscode.TreeItemCollapsibleState.None);

    this.description = `${relativePath} ${line}:${col}`;
    this.tooltip = new vscode.MarkdownString(
      `**${sevLabel}** — \`${relativePath}\` (${line}:${col})\n\n${diagnostic.message}`
    );

    const iconName = SEVERITY_ICON[diagnostic.severity] ?? 'info';
    const colorId = SEVERITY_COLOR[diagnostic.severity] ?? 'foreground';
    this.iconPath = new vscode.ThemeIcon(iconName, new vscode.ThemeColor(colorId));

    this.command = {
      command: 'errorRadar.jumpTo',
      title: 'Jump to diagnostic',
      arguments: [diagnosticItem.uri, diagnostic.range],
    };

    this.contextValue = 'diagnosticItem';
  }
}

export class DiagnosticsProvider
  implements vscode.TreeDataProvider<DiagnosticTreeItem | vscode.TreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    DiagnosticTreeItem | vscode.TreeItem | undefined | null
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private filter: FilterMode = 'all';
  private sort: SortMode = 'severity';

  // ── Public state accessors ──────────────────────────────────────────────────

  getFilter(): FilterMode { return this.filter; }
  getSort(): SortMode { return this.sort; }

  setFilter(filter: FilterMode): void {
    this.filter = filter;
    this.refresh();
  }

  setSort(sort: SortMode): void {
    this.sort = sort;
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  // ── TreeDataProvider implementation ────────────────────────────────────────

  getTreeItem(element: DiagnosticTreeItem | vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): (DiagnosticTreeItem | vscode.TreeItem)[] {
    if (!vscode.workspace.workspaceFolders) {
      return [this.statusItem('Open a folder to see diagnostics', 'folder')];
    }

    const items = collectDiagnostics(this.filter, this.sort);

    if (items.length === 0) {
      const msg =
        this.filter === 'all'
          ? 'No diagnostics — workspace is clean!'
          : `No ${this.filter} found`;
      return [this.statusItem(msg, 'check')];
    }

    // Show a summary header
    const errors = items.filter(
      (i) => i.diagnostic.severity === vscode.DiagnosticSeverity.Error
    ).length;
    const warnings = items.filter(
      (i) => i.diagnostic.severity === vscode.DiagnosticSeverity.Warning
    ).length;

    const header = this.statusItem(
      `${errors} error${errors !== 1 ? 's' : ''}, ${warnings} warning${warnings !== 1 ? 's' : ''}`,
      errors > 0 ? 'error' : 'warning'
    );
    header.contextValue = 'summary';

    return [header, ...items.map((item) => new DiagnosticTreeItem(item))];
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private statusItem(label: string, icon?: string): vscode.TreeItem {
    const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
    if (icon) {
      item.iconPath = new vscode.ThemeIcon(icon);
    }
    item.contextValue = 'status';
    return item;
  }

  // ── Diagnostics count (for status bar) ──────────────────────────────────────

  getDiagnosticCount(): { errors: number; warnings: number } {
    const items = collectDiagnostics('all', 'severity');
    return {
      errors: items.filter((i) => i.diagnostic.severity === vscode.DiagnosticSeverity.Error).length,
      warnings: items.filter((i) => i.diagnostic.severity === vscode.DiagnosticSeverity.Warning).length,
    };
  }
}
