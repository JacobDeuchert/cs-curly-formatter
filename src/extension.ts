import { moveCursor } from 'readline';
import { start } from 'repl';
import * as vscode from 'vscode';

const Cursor = {
	Up: "cursorUp",
	Down: "cursorDown",
	Left: "cursorLeft",
	Right: "cursorRight"
};
Object.freeze(Cursor);

// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cscurlyformatter.curlyformat', () => {
		var editor = vscode.window.activeTextEditor;
		if (!editor)
			return false;

		if(!isCursorAtZeroPosition(editor) && isCursorBetweenCurly(editor))
			manualFormat();
		else
			newLineAndTab(editor);
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}

function isCursorAtZeroPosition(editor : vscode.TextEditor) {
	const cursorPosition = editor.selection.active;
	return cursorPosition.character == 0;
}

function isCursorBetweenCurly(editor : vscode.TextEditor) {
	const nearCursor = getAdjacentText(editor);
	return nearCursor[0] == "{" && nearCursor[1] == "}";

	function getAdjacentText(editor : vscode.TextEditor) {
		const cursorPosition = editor.selection.active;
		return editor.document.getText(
			vsRange(cursorPosition.line, cursorPosition.character -1, cursorPosition.character + 1)
		);
	
		function vsRange(line : number, from : number, to : number) {
			return new vscode.Range(line, from, line, to);
		}
	}
}

function manualFormat() {
	move(Cursor.Left);
	type('\n');
	move(Cursor.Right);
	type('\n\n');
	move(Cursor.Up);
	type('\t');
}

function newLineAndTab(editor : vscode.TextEditor) {
	type('\n');
	const automaticTabIndent = vscode.workspace.getConfiguration("cscurlyformatter").get("automaticTabIntendationEnabled");
	if (automaticTabIndent) {
		vscode.commands.executeCommand("editor.action.indentationToTabs");
	}
}

function type(text : string) {
	vscode.commands.executeCommand('type', { "text": text });
}

function move(dir : string) {
	vscode.commands.executeCommand(dir);
}
