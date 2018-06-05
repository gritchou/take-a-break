const baseUrl = 'https://giphy.com/search/';

const GIPHY_KEY = '';
const GIPHY_API = 'https://api.giphy.com';

const createAlarm = (delay) => chrome.alarms.create('alarma', { delayInMinutes: parseFloat(delay), periodInMinutes: parseFloat(delay) });

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

	let apiPromise = fetch(apiUrl)
		.then((response) => response.json())
		.then((json) => {
			if (Array.isArray(json.data)) {
				const index = Math.floor(Math.random() * json.data.length);
				return json.data[index].images.original.url;
			}

			return json.data.images.original.url;
		})
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
