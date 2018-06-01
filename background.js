const baseUrl = 'https://giphy.com/search/';

const GIPHY_KEY = '';
const GIPHY_API = 'https://api.giphy.com';

let DELAY = 0.1;
chrome.alarms.create("alarma", { delayInMinutes: DELAY, periodInMinutes: DELAY });
chrome.alarms.get("alarma", (alarm) => console.log(alarm));

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
