import * as vscode from 'vscode';
import { DiagnosticItem, FilterMode, SortMode } from './types';

export function collectDiagnostics(filter: FilterMode, sort: SortMode): DiagnosticItem[] {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const allDiagnostics = vscode.languages.getDiagnostics();
  const items: DiagnosticItem[] = [];

  for (const [uri, diagnostics] of allDiagnostics) {
    for (const diagnostic of diagnostics) {
      // Apply filter
      if (filter === 'errors' && diagnostic.severity !== vscode.DiagnosticSeverity.Error) {
        continue;
      }
      if (filter === 'warnings' && diagnostic.severity !== vscode.DiagnosticSeverity.Warning) {
        continue;
      }

      // Skip diagnostics with no usable URI
      if (!uri || !uri.fsPath) {
        continue;
      }

      // Compute path relative to workspace root
      let relativePath = uri.fsPath;
      if (workspaceFolders) {
        for (const folder of workspaceFolders) {
          if (uri.fsPath.startsWith(folder.uri.fsPath)) {
            relativePath = uri.fsPath.slice(folder.uri.fsPath.length + 1);
            break;
          }
        }
      }

      items.push({ uri, diagnostic, relativePath });
    }
  }

  // Sort
  if (sort === 'severity') {
    items.sort((a, b) => {
      const sevDiff = a.diagnostic.severity - b.diagnostic.severity;
      if (sevDiff !== 0) { return sevDiff; }
      return a.relativePath.localeCompare(b.relativePath);
    });
  } else {
    items.sort((a, b) => {
      const pathDiff = a.relativePath.localeCompare(b.relativePath);
      if (pathDiff !== 0) { return pathDiff; }
      return a.diagnostic.severity - b.diagnostic.severity;
    });
  }

  return items;
}
