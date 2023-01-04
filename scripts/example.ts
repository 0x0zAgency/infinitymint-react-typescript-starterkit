import {InfinityMintScript} from 'infinitymint/dist/app/interfaces';

const script: InfinityMintScript = {
	name: 'My Example Scriptt',
	description:
    'This is an example of how you can create a custom InfinityMint script',
	execute: async IM => {
		IM.log('Hello World');
	},
};
export default script;
