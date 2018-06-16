import config from './lib/config';
import giphy from './lib/giphy';

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

const getNewGif = async () => {
	const gif = await giphy.get(currentConfig.api, currentConfig.keywords);
	const tab = await browser.tabs.query({ active: true, currentWindow: true })
		.then((tabs) => tabs[0])
	;

	gif && tab && browser.tabs.sendMessage(tab.id, { url: gif });
};

browser.alarms.onAlarm.addListener(getNewGif);
