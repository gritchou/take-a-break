const DEFAULT_CONFIG = { delay: 0.1, api: 'random', keywords: 'trump' };

const config = (() => {
	let updateCallback;
	return {
		load: () => new Promise((resolve) => {
			chrome.storage.sync.get(['config'], (result) => {
				return resolve(result.config || DEFAULT_CONFIG);
			});
		}),

		save: (option) => new Promise((resolve) => {
			return config.load().then((config) => {
				const updatedConfig = Object.assign(config, option);
				chrome.storage.sync.set({ config: updatedConfig }, () => resolve());
				updateCallback && updateCallback(updatedConfig);
			});
		}),

		onUpdate: (callback) => {
			updateCallback = callback;
		},
	};
})();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'config') {
		message.action === 'load' ? config.load().then(sendResponse) : config.save(message.option);
	}
	return true;
});
