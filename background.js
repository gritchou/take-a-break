const baseUrl = 'https://giphy.com/search/';

const GIPHY_KEY = '';
const GIPHY_API = 'https://api.giphy.com';

const DEFAULT_SETTINGS = { delay: 0.1, api: 'random', keywords: 'trump' };

let DELAY = 0.1;
chrome.alarms.create("alarma", { delayInMinutes: DELAY, periodInMinutes: DELAY });
chrome.alarms.get("alarma", (alarm) => console.log(alarm));

const settings = {
	load: () => new Promise((resolve) => {
		chrome.storage.sync.get(['settings'], (result) => {
			return resolve(result.settings || DEFAULT_SETTINGS);
		});
	}),

	save: (option) => new Promise((resolve) => {
		return load().then((settings) => {
			const updatedSettings = Object.assign(settings, option);
			chrome.storage.sync.set({ settings: updatedSettings }, () => resolve());
		});
	}),
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'settings') {
		sendResponse(message.action === 'load' ? settings.load() : settings.save(message.option));
	}
});

const getRandomGif = () => {
	let apiPromise = fetch(`${GIPHY_API}/v1/gifs/random?api_key=${GIPHY_KEY}`)
		.then((response) => response.json())
		.then((json) => json.data.images.original.url)
	;
	apiPromise.then((gifUrl) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { url: gifUrl });
		});
	});
};

chrome.alarms.onAlarm.addListener((alarm) => {
	getRandomGif();
});
