const baseUrl = 'https://giphy.com/search/';

const GIPHY_KEY = '';
const GIPHY_API = 'https://api.giphy.com';

const createAlarm = (delay) => browser.alarms.create('alarma', { delayInMinutes: parseFloat(delay), periodInMinutes: parseFloat(delay) });

let currentConfig;
config.load().then((config) => {
	currentConfig = config;
	createAlarm(config.delay);
});

config.onUpdate((config) => {
	currentConfig.delay !== config.delay && createAlarm(config.delay);
	currentConfig = config;
});

const getRandomGif = () => {
	const apiUrl = currentConfig.api === 'random'
		? `${GIPHY_API}/v1/gifs/random?api_key=${GIPHY_KEY}`
		: `${GIPHY_API}/v1/gifs/search?api_key=${GIPHY_KEY}&q=${currentConfig.keywords}`
	;

	const apiPromise = fetch(apiUrl)
		.then((response) => response.json())
		.then((json) => {
			if (Array.isArray(json.data)) {
				const index = Math.floor(Math.random() * json.data.length);
				return json.data[index].images.original.url;
			}

			return json.data.images.original.url;
		})
		.catch((e) => console.log('meh', e))
	;

	const tabPromise = browser.tabs.query({ active: true, currentWindow: true })
		.then((tabs) => tabs[0])
	;

	Promise.all([apiPromise, tabPromise])
		.then(([gifUrl, tab]) => {
			tab && browser.tabs.sendMessage(tab.id, { url: gifUrl });
		})
	;
};

browser.alarms.onAlarm.addListener((alarm) => {
	getRandomGif();
});
