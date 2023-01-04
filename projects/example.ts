const example = {
	name: 'example',
	price: '$1',
	modules: {
		random: 'SeededRandom',
		assets: 'SimpleSVG',
		minter: 'DefaultMinter',
		royalty: 'DefaultRoyalty',
	},
	information: {
		tokenSymbol: '†',
		tokenSingular: 'Example',
	},
	permissions: {
		all: [],
	},
	assets: [
		{
			name: 'Example Asset',
			fileName: '/imports/example-asset.svg',
			settings: true,
		},
	],
	paths: [
		{
			name: 'Example Token',
			fileName: '/imports/example.svg',
			settings: true,
		},
	],
	events: {
		initialized: async ({log, eventEmitter}) => {
			log('project initialized');
		},
		failure: async ({log, event: error}) => {
			log('failed to launch successfully');
			console.error(error);
		},
		success: async ({log}) => {
			log('successfully launched example project');
		},
	},
};

export default example;
