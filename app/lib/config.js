const CONFIG_DEFAULT = { delay: 0.1, api: 'random', keywords: 'trump' };

export default {
	async load() {
		const query = await browser.storage.local.get(['config']);
		return query.config || CONFIG_DEFAULT;
	},

	async save(option) {
		const previousConfig = await this.load();
		const config = Object.assign(previousConfig, option);
		return browser.storage.local.set({ config });
	},
};
