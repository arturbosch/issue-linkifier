import * as vscode from "vscode";
import { IssueLinkProvider } from "./IssueLinkProvider";

export const OPEN_LINK_COMMAND = "issue-linkifier.openUrl";

// TEST: MY-COMPANY-16333
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      OPEN_LINK_COMMAND,
      (params: OpenLinkParams) => {
        vscode.env.openExternal(vscode.Uri.parse(params.link));
      }
    ),
    vscode.languages.registerCodeLensProvider(
      [
        { scheme: "file" },
        { scheme: "git" },
        { scheme: "vsls" },
        { scheme: "untitled" },
      ],
      new IssueLinkProvider()
    )
  );
}

export function deactivate() { }
