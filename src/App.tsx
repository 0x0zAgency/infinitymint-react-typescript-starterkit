import React, {Fragment} from 'react';

const App = (): JSX.Element => (
	<Fragment>
		<div className="flex h-screen">
			<div className="m-auto">
				<h1 className="text-6xl">
					Welcome to InfinityMint!
				</h1>
				<p>
					Read the docs <a className='text-blue' href="https://docs.infinitymint.app">here </a>
					to get started!
				</p>
			</div>
		</div>
	</Fragment>
);

export default App;
