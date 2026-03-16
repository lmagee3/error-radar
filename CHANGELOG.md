# Changelog

All notable changes to Error Radar will be documented here.

## [0.1.0] — 2026-02-28

### Added
- Initial release of Error Radar
- Workspace-wide diagnostics panel via VS Code Activity Bar
- Aggregates errors and warnings from all open workspace folders (multi-root support)
- Click-to-jump navigation — click any diagnostic to open the file and jump to the exact line and column
- Filter control: All / Errors only / Warnings only
- Sort control: By severity (errors first) or by file name (alphabetical)
- Auto-refresh when diagnostics change
- Status bar indicator showing live error and warning counts (click to open panel)
- Toolbar shortcuts for Refresh, Filter, and Sort directly in the panel header
- Graceful empty states: "No diagnostics found" and "Open a workspace to see diagnostics"
- Edge case handling: missing URIs skipped, stale positions clamped to document bounds
