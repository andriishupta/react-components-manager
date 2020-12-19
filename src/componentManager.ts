import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ComponentManagerProvider implements vscode.TreeDataProvider<Component> {

	private _onDidChangeTreeData: vscode.EventEmitter<Component | undefined | void> = new vscode.EventEmitter<Component | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Component | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Component): vscode.TreeItem {
		return element;
	}

	getChildren(): Thenable<Component[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('Not a React workspace');
			return Promise.resolve([]);
		}

		const components = [];
		const rootSharedPath = this.workspaceRoot + '/src/shared';
		const files = fs.readdirSync(rootSharedPath);

		files.forEach((file: string) => {
			const filePath = rootSharedPath + '/' + file;
			const uri = vscode.Uri.file(filePath);
			components.push(new Component(path.parse(file).name, uri));
		});

		return Promise.resolve(components);
	}
}

export class Component extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		uri: vscode.Uri
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.resourceUri = uri;
		this.command = { command: 'extension.applyComponent', title: "Apply Component", arguments: [this.label] };
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'component';
}
