const CONFIG_DEFAULT = { delay: 0.1, api: 'random', keywords: 'trump' };

class Config {
	constructor() {
		this._updateCallbacks = [];
	}

	async load() {
		const query = await browser.storage.local.get(['config']);
		return query.config || CONFIG_DEFAULT;
	}

	async save(option) {
		const previousConfig = await this.load();
		const config = Object.assign(previousConfig, option);
		this._updateCallbacks.forEach((callback) => callback(config));
		return browser.storage.local.set({ config });
	}

	onUpdate(callback) {
		!this._updateCallbacks.includes(callback) && this._updateCallbacks.push(callback);
	}
}

export default new Config();
