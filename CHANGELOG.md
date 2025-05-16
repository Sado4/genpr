# Changelog

All notable changes to the "genpr" extension will be documented in this file.

## [0.0.90] - 2025-05-16

### Changed

- Merge commit exclusion is now applied when generating PR descriptions
- README updated to clarify behavior

## [0.0.89] - 2025-05-16

### Changed

- Improve error handling for `git log` failures
- Show detailed errors in VS Code output panel (`genpr` channel)

## [0.0.88] - 2025-04-23

### Improved

- 📝 Dialog language displayed when copied to the clipboard has been adjusted.

## [0.0.87] - 2025-04-02

### Improved

- 📝 Clarified in the prompt that the generated PR description should be easy to copy in Markdown format
- 🧠 Refined language to better guide AI placement of commit summaries under the appropriate template section

## [0.0.86] - 2025-04-02

### Improved

- 📝 Clarified in the prompt that the generated PR description should be easy to copy in Markdown format
- 🧠 Refined language to better guide AI placement of commit summaries under the appropriate template section

## [0.0.85] - 2025-04-02

### Fixed

- 🧠 Clarified where to place commit summaries when change sections are optional
- ✍️ Updated AI prompt instructions to preserve full PR template structure and avoid ambiguity

## [0.0.84] - 2025-04-02

### Improved

- ✍️ Enhanced AI prompt instructions for more accurate and factual PR summaries
- 📌 Enforced rule to exclude subjective or inferred expressions in AI output
- 🔗 Clarified hash format should not be Markdown links

## [0.0.83] - 2025-04-02

### Changed

- Improved AI prompt instructions to ensure commit summaries are placed under the correct section
- Enforced plain commit hashes (not Markdown links) for better GitHub compatibility


## [0.0.82] - 2025-04-02

### Changed

- Simplified commit section to use only short hashes (GitHub auto-links them)
- Removed repository URL parsing logic for simplicity and compatibility

## [0.0.81] - 2025-04-01

### Changed

- 🔄 Updated `engines.vscode` back to `^1.84.0` for better alignment with the latest VS Code
- 💡 Useful for users on stable VS Code, but may not be compatible with Cursor

## [0.0.8] - 2025-04-01

### Fixed

- ✅ Made the extension installable on [Cursor](https://www.cursor.com) by changing `engines.vscode` to `^1.84.0`

## [0.0.7] - 2025-04-01

### Fixed

- ✅ Loosened `vscode` engine compatibility to allow installation on Cursor and older VS Code versions

## [0.0.6] - 2025-04-01

### Added

- 🈁 Command name now switches between English and Japanese depending on the VS Code UI language

## [0.0.5] - 2025-04-01

### Added

- 🇯🇵 Japanese language support based on VS Code's display language
- Prompt messages and UI texts will now switch between English and Japanese

## [0.0.4] - 2025-04-01

### Added

- 🖼️ Added extension icon for better visibility in the Marketplace and VS Code extension list

## [0.0.3] - 2025-04-01

### Changed

- Added `categories` and `keywords` to improve discoverability on the Marketplace

## [0.0.2] - 2025-04-01

### Fixed

- Replaced deprecated badge URLs (`vsmarketplacebadge.apphb.com`) with official `shields.io` badges
- Updated `README.md` to pass Marketplace validation

## [0.0.1] - 2025-04-01

### Added

- Initial release of PR Prompt Generator
- Supports generating AI-ready PR prompts from Git commit diffs
