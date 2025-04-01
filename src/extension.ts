import * as vscode from "vscode";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "genpr.generatePrompt",
    async () => {
      // Ask for the parent branch name
      const parentBranch = await vscode.window.showInputBox({
        prompt: "Enter the parent branch name (e.g., main)",
      });
      if (!parentBranch) return;

      // Get the root path of the workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder is open.");
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;
      const templatePath = path.join(
        rootPath,
        ".github/pull_request_template.md"
      );

      // Load the PR template
      let template = "No pull request template found.";
      if (fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, "utf-8");
      }

      // Get git diff logs from the parent branch to HEAD
      let commits = "";
      try {
        commits = execSync(`git log ${parentBranch}..HEAD -p --reverse`, {
          cwd: rootPath,
        }).toString();
      } catch (err) {
        vscode.window.showErrorMessage("Failed to get git log diff.");
        return;
      }

      // Generate prompt text
      const prompt = `
Understand the flow of the following commits and generate a pull request description based on the template below.

Template:
---
${template}
---
Commit diff:
---
${commits}
---
Output format:
- A bullet-point summary
- A one-line PR title at the end
`.trim();

      await vscode.env.clipboard.writeText(prompt);
      vscode.window.showInformationMessage(
        "📋 Prompt has been copied to your clipboard!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
