import config from './lib/config';
import giphy from './lib/giphy';

const createAlarm = (delay) => browser.alarms.create('alarma', { delayInMinutes: parseFloat(delay), periodInMinutes: parseFloat(delay) });

let currentConfig;
config.load().then((config) => {
	currentConfig = config;
	createAlarm(config.delay);
});

browser.storage.onChanged.addListener(({ config }) => {
	if (config) {
		currentConfig.delay !== config.newValue.delay && createAlarm(config.newValue.delay);
		currentConfig = config.newValue;
	}
});

const getNewGif = async () => {
	const gif = await giphy.get(currentConfig.api, currentConfig.keywords);
	const tab = await browser.tabs.query({ active: true, currentWindow: true })
		.then((tabs) => tabs[0])
	;
	var audio = new Audio('./resources/casio_hour_chime.mp3');
	audio.play();

	gif && tab && browser.tabs.sendMessage(tab.id, { url: gif });
};

browser.alarms.onAlarm.addListener(getNewGif);
