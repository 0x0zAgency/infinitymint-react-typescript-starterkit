import {
	InfinityMintDeploymentLocal,
	InfinityMintProject,
	InfinityMintStaticManifest,
	KeyValue,
} from "infinitymint/dist/app/interfaces"

/**
 * defines the infinitymint.build.json found in the root of the client build (normally src).
 */
export interface InfinityMintSDKBuildConfiguration {
	deploymentsFolder: string;
	gemsFolder: string;
	projectsFolder: string;
	staticManifestFolder: string;
	projectsManifestFilename?: string;
	deploymentsManifestFilename?: string;
	bundled?: boolean;
	custom?: boolean;
	multiProject?: boolean;
	settings?: KeyValue;
}

export interface InfinityMintDeploymentManifest {
	deployments: KeyValue;
	updated?: number;
	created?: number;
}

export interface InfinityMintProjectManifest {
	projects: KeyValue;
	staticManifests: KeyValue;
	imports: KeyValue;
}

export interface InfinityMintSDKOptions extends KeyValue {
	webpackRoot?: string;
}

export const load = (options: InfinityMintSDKOptions) => {
	let config = globalizeBuildConfiguration(options.webpackRoot);
	return config;
};
export default load;

export const globalizeBuildConfiguration = (root?: "/" | string) => {
	(window as any).reactRoot = root;
	(window as any).buildConfiguration = readBuildConfiguration(root);
	return (window as any)
		.buildConfiguration as InfinityMintSDKBuildConfiguration;
};

export const getBuildConfiguration = (
	root?: "/" | string,
	requireAgain?: boolean
) => {
	root = root || (window as any).reactRoot;

	if (requireAgain && (window as any).buildConfiguration !== undefined) {
		if (require.cache[`${root}infinitymint.build.json`])
			delete require.cache[`${root}infinitymint.build.json`];
		(window as any).buildConfiguration = readBuildConfiguration(root);
	}

	(window as any).buildConfiguration =
		(window as any).buildConfiguration || readBuildConfiguration(root);

	return (window as any)
		.buildConfiguration as InfinityMintSDKBuildConfiguration;
};

export const readBuildConfiguration = (
	root?: "src" | string
): InfinityMintSDKBuildConfiguration => {
	root = root || (window as any).reactRoot;
	let result = require(`..${root}infinitymint.build.json`);
	try {
		return result;
	} catch (error) {
		console.error(error);
		return {
			deploymentsFolder: `${root}deployments/`,
			gemsFolder: `${root}gems/`,
			projectsFolder: `${root}projects/`,
			staticManifestFolder: `${root}projects/`,
		};
	}
};
export const readUnbundledDeployment = (
	contractName?: string,
	root?: "src" | string
): InfinityMintDeploymentLocal => {
	let configration = getBuildConfiguration(root);
	try {
		let result = require('..' + configration.deploymentsFolder +
			`/${contractName}.json`);
		return result as InfinityMintDeploymentLocal;
	} catch (error) {
		console.error(error);
		throw new Error("bad deployment: " + error?.message);
	}
};

export const readUnbundledProject = (
	contractName?: string,
	root?: "src" | string
): InfinityMintProject => {
	let configration = getBuildConfiguration(root);
	try {
		let result = require('..' + configration.projectsFolder +
			`/${contractName}.json`);
		return result as InfinityMintProject;
	} catch (error) {
		console.error(error);
		throw new Error("bad project: " + error?.message);
	}
};

export const readUnbundledStaticManifest = (
	contractName?: string,
	root?: "src" | string
): InfinityMintStaticManifest => {
	let configration = getBuildConfiguration(root);
	try {
		let result = require('..' + configration.staticManifestFolder +
			`/${contractName}.json`);
		return result as InfinityMintStaticManifest;
	} catch (error) {
		console.error(error);
		throw new Error("bad project: " + error?.message);
	}
};

export const getStaticManifest = (
	projectName: string
): InfinityMintStaticManifest => {
	let config = getBuildConfiguration();

	if (config.custom)
		throw new Error("SDK cannot be used with this configuration");

	if (!config.bundled) {
		let staticManifest = readUnbundledStaticManifest(projectName);
		return staticManifest;
	}

	let projectManifest = getProjectManifest();
	if (projectManifest?.staticManifests?.[projectName] === undefined)
		throw new Error("cannot find static manifest for " + projectName);

	return projectManifest?.staticManifests?.[
		projectName
	] as InfinityMintStaticManifest;
};

export const getProjectManifest = (): InfinityMintProjectManifest => {
	let config = getBuildConfiguration();
	let projectManifest: InfinityMintProjectManifest;
	try {
		projectManifest = require('..' + config.projectsFolder +
			`${config.projectsManifestFilename || "manifest"}.json`);
	} catch (error) {
		console.log("bad manifest");
		console.error(error);
		throw new Error("cannot fetch project: " + error.message);
	}
	return projectManifest;
};

export const getDeploymentManifest = (): InfinityMintDeploymentManifest => {
	let config = getBuildConfiguration();
	let deploymentManifest: InfinityMintDeploymentManifest;
	try {
		deploymentManifest = require('..' + config.projectsFolder +
			`${config.deploymentsManifestFilename || "manifest"}.json`);
	} catch (error) {
		console.log("bad manifest");
		console.error(error);
		throw new Error("cannot fetch project: " + error.message);
	}
	return deploymentManifest;
};

export const getProject = (projectName: string): InfinityMintProject => {
	let config = getBuildConfiguration();

	if (config.custom)
		throw new Error("SDK cannot be used with this configuration");

	if (!config.bundled) {
		let project = readUnbundledProject(projectName);
		return project;
	}

	let projectManifest = getProjectManifest();
	if (projectManifest?.projects?.[projectName] === undefined)
		throw new Error("cannot find project: " + projectName);

	return projectManifest?.projects?.[projectName] as InfinityMintProject;
};

export const getDeployment = (
	contractName: string,
	projectName: string
): InfinityMintDeploymentLocal => {
	let config = getBuildConfiguration();

	if (config.custom)
		throw new Error("SDK cannot be used with this configuration");

	if (!config.bundled) {
		let contract = readUnbundledDeployment(
			config.multiProject
				? projectName + "/" + contractName
				: contractName
		);
		return contract;
	}

	let manifest = getDeploymentManifest();
	if (manifest?.deployments?.[projectName]?.[contractName] === undefined)
		throw new Error("cannot find contract: " + contractName);

	return manifest?.deployments?.[projectName]?.[
		contractName
	] as InfinityMintDeploymentLocal;
};
