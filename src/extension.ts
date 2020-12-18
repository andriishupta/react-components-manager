'use strict';

import * as vscode from 'vscode';

import { FileSystemProvider } from './fileExplorer';

const editor = vscode.window.activeTextEditor;

async function saveComponent() {
	const text = editor.document.getText(editor.selection);

	// User Input to name Gist file
	const componentName = await vscode.window.showInputBox({
		placeHolder: "Component's name"
	});

	console.log(componentName);

	// fs.writeFileSync(`./${componentName}.jsx`, 'test');
}

export function activate(context: vscode.ExtensionContext) {

	// Samples of `window.registerTreeDataProvider`
	const fileSystemProvider = new FileSystemProvider(`${vscode.workspace.rootPath}/src/shared`);
	vscode.window.registerTreeDataProvider('fileExplorer', fileSystemProvider);
	vscode.commands.registerCommand('extension.saveComponent', saveComponent);
	vscode.commands.registerCommand('fileExplorer.openFile', vscode.window.showTextDocument);
}