import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ComponentManagerProvider implements vscode.TreeDataProvider<Component> {

	private _onDidChangeTreeData: vscode.EventEmitter<Component | undefined | void> = new vscode.EventEmitter<Component | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Component | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private sharedComponentsRoot: string) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Component): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Component): Thenable<Component[]> {
		if (!this.sharedComponentsRoot) {
			vscode.window.showInformationMessage('No shared folder');
			return Promise.resolve([]);
		}

		const components = [];
		const files = fs.readdirSync(this.sharedComponentsRoot);

		files.forEach((file: string) => {
			const uri = vscode.Uri.file(file);
			components.push(new Component(file, uri));
		});

		return Promise.resolve(components);
		

		// return Promise.resolve(this.getSharedComponents(path.join(this.workspaceRoot, 'src', 'shared', 'Button.jsx')));
		// if (element) {
		// 	return Promise.resolve(this.getSharedComponents(path.join(this.workspaceRoot, 'src', 'shared', 'Button.jsx')));
		// } else {
		// 	const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
		// 	if (this.pathExists(packageJsonPath)) {
		// 		return Promise.resolve(this.getSharedComponents(packageJsonPath));
		// 	} else {
		// 		vscode.window.showInformationMessage('Workspace has no package.json');
		// 		return Promise.resolve([]);
		// 	}
		// }

	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getSharedComponents(sharedComponentsPath: string): Component[] {
		if (this.pathExists(sharedComponentsPath)) {
			const packageJson = JSON.parse(fs.readFileSync(sharedComponentsPath, 'utf-8'));

			const toComponent = (name: string): Component => {
				// if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
				return new Component(name, '' as any);
			};

			// const deps = packageJson.dependencies
			// 	? Object.keys(packageJson.dependencies).map(dep => toComponent(dep)]))
			// 	: [];
			// const devDeps = packageJson.devDependencies
			// 	? Object.keys(packageJson.devDependencies).map(dep => toComponent(dep, packageJson.devDependencies[dep]))
			// 	: [];
			return [];
		} else {
			return [];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}
}

export class Component extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		uri: vscode.Uri
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.resourceUri = uri;
		// this.command = { command: 'componentManager.openPreview', title: "Open Preview", arguments: [this.resourceUri] }; // todo create web view
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'component';
}
