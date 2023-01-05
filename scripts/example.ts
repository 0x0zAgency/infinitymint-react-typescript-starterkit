import type {InfinityMintScript} from 'infinitymint/dist/app/interfaces';

const script: InfinityMintScript = {
	name: 'My Example Scriptt',
	description:
    'This is an example of how you can create a custom InfinityMint script',
	async execute(IM) {
		IM.log('Hello World');
	},
};
export default script;
