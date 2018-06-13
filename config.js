const DEFAULT_CONFIG = { delay: 0.1, api: 'random', keywords: 'trump' };

const config = (() => {
	let updateCallback;
	return {
		load: () => browser.storage.local.get(['config'])
			.then((result) => result.config || DEFAULT_CONFIG)
		,

		save: (option) => config.load()
			.then((config) => {
				const updatedConfig = Object.assign(config, option);
				updateCallback && updateCallback(updatedConfig);
				return browser.storage.local.set({ config: updatedConfig });
			})
		,

		onUpdate: (callback) => {
			updateCallback = callback;
		},
	};
})();

browser.runtime.onMessage.addListener((message) => {
	if (message.type === 'config') {
		return message.action === 'load' ? config.load() : config.save(message.option);
	}
});
