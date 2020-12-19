'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import { ComponentManagerProvider, Component } from './componentManager';

const editor = vscode.window.activeTextEditor;

const componentBodyTemplate = `
import React from 'react';
import PropTypes from 'prop-types';

const COMPONENT_NAME = ({ any }) => {
    return (
        COMPONENT_BODY
    );
}

COMPONENT_NAME.propTypes = {
	any: PropTypes.any
};

export default COMPONENT_NAME;
`;

async function saveComponent() {
	const componentBody = editor.document.getText(editor.selection);
	const componentName = await vscode.window.showInputBox({
		placeHolder: "Component's name"
	});

	// todo: save piece of code to file
	const component = componentBodyTemplate
	.replace(/COMPONENT_NAME/g, componentName)
	.replace(/COMPONENT_BODY/g, componentBody);

	const filePath = `${vscode.workspace.rootPath}/src/shared/${componentName}.jsx`;
	fs.writeFileSync(filePath, component);

	const openPath = vscode.Uri.file(filePath);
	const doc = await vscode.workspace.openTextDocument(openPath);
	vscode.window.showTextDocument(doc);
	vscode.commands.executeCommand('componentManager.refreshEntry');
}

export function activate(context: vscode.ExtensionContext) {

	const componentManagerProvider = new ComponentManagerProvider(vscode.workspace.rootPath + '/src/shared'); // todo CRA sharedDir
	vscode.window.registerTreeDataProvider('componentManager', componentManagerProvider);
	vscode.commands.registerCommand('componentManager.refreshEntry', () => componentManagerProvider.refresh());
	// vscode.commands.registerCommand('componentManager.editEntry', (component: Component) => vscode.window.showTextDocument(component.resourceUri));
	vscode.commands.registerCommand('componentManager.editEntry', (node: Component) => vscode.window.showInformationMessage(`Successfully called edit entry.`));

	vscode.commands.registerCommand('extension.saveComponent', saveComponent);
}