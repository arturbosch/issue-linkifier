import * as vscode from "vscode";
import { OPEN_LINK_COMMAND } from "./extension";

export class IssueLinkProvider implements vscode.CodeLensProvider {
    provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        if (token.isCancellationRequested) {
            return [];
        }

        const result: vscode.CodeLens[] = [];

        for (const [id, entry] of Object.entries(this.getConfiguredEntries())) {
            result.push(...this.handleEntry(document, id, entry));
        }

        return result;
    }

    handleEntry(document: vscode.TextDocument, id: string, entry: Entry): vscode.CodeLens[] {
        const result = [];
        try {
            if (entry) {
                const pattern = String(entry.pattern);
                const url = String(entry.url);
                const matches =
                    document.getText().matchAll(new RegExp(`${pattern}`, "g")) ?? [];

                for (const match of matches) {
                    if (!match.index) {
                        continue;
                    }
                    if (!match.input) {
                        continue;
                    }

                    const content = match.slice()[0];

                    const range = new vscode.Range(
                        document.positionAt(match.index),
                        document.positionAt(match.index + match.input.length)
                    );

                    const link = `${url}${url.endsWith("/") ? content : "/" + content}`;
                    result.push(
                        new vscode.CodeLens(range, {
                            command: OPEN_LINK_COMMAND,
                            title: link,
                            arguments: [
                                {
                                    link,
                                },
                            ],
                        })
                    );
                }
            }
        } catch (err) {
            console.error(`issue-linkifier: error with ${id}: ${err}`);
        }
        return result;
    }

    getConfiguredEntries() {
        return vscode.workspace
            .getConfiguration("issueLinkifier")
            .get<{ [key: string]: Entry }>("entries", {});
    }
}
