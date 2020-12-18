'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';

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
	const nodeDependenciesProvider = new DepNodeProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('extension.saveComponent', () => saveComponent());
	vscode.commands.registerCommand('nodeDependencies.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('nodeDependencies.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));
}