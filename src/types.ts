import * as vscode from 'vscode';

export interface DiagnosticItem {
  uri: vscode.Uri;
  diagnostic: vscode.Diagnostic;
  relativePath: string;
}

export type FilterMode = 'all' | 'errors' | 'warnings';
export type SortMode = 'severity' | 'file';
