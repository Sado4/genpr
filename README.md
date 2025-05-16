# 🚀 PR Prompt Generator

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/Sado4.genpr?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Sado4.genpr)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/Sado4.genpr?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Sado4.genpr)

A VS Code extension that helps you generate prompts for AI tools (like ChatGPT) to write Pull Request descriptions based on your Git commit diffs.

It reads your `.github/pull_request_template.md` and combines it with commit changes to create a structured, easy-to-paste prompt.

---

> ✨ Now supports **English and Japanese** based on your VS Code display language!

---

## ✨ Features

- Automatically generates a PR prompt based on commit diffs
- **Merge commits are excluded** — only actual change commits are considered
- Formats the prompt using your existing PR template
- Copies the prompt to your clipboard — just paste it into ChatGPT or your favorite AI tool!
- 🗣️ **Language auto-switching** between English and Japanese

## 📸 Demo

![Demo](images/demo.gif)

## 🛠 How to Use

1. Open the Command Palette and run:  
   `Generate PR Prompt from Commit Diff`
2. Enter the name of the parent branch (e.g. `main`)
3. The prompt will be copied to your clipboard!

## 💡 Requirements

- A `.github/pull_request_template.md` file must exist in your project root.

## 🌐 Language Support

This extension automatically switches its UI between **English** and **Japanese**  
based on your **VS Code display language setting**.

| VS Code Language | Extension Language |
|------------------|--------------------|
| `English`        | English            |
| `Japanese (ja)`  | Japanese           |

No extra setup required — it just works! 🎉

---

👉 [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=Sado4.genpr)
