const baseUrl = 'https://giphy.com/search/';

const GIPHY_KEY = '';
const GIPHY_API = 'https://api.giphy.com';

let DELAY = 0.1;
chrome.alarms.create("alarmaaaaaaa", { delayInMinutes: DELAY, periodInMinutes: DELAY });
chrome.alarms.get("alarmaaaaaaa", (alarm) => console.log(alarm));

const processRequest = (query) => {
	chrome.storage.sync.get('search', (res) => {
		let apiPromise;
		if(res.search) {
			apiPromise = new Promise((resolve) => {
				chrome.storage.sync.get('limitation', (res) => {
					resolve(`${GIPHY_API}/v1/gifs/search?api_key=${GIPHY_KEY}&q=${query}&limit=${res.limitation}`);
				});
			})
				.then((api) => fetch(api))
				.then((response) => response.json())
				.then((json) => json.data[0].bitly_url)
			;
		} else {
			apiPromise = fetch(`${GIPHY_API}/v1/gifs/random?api_key=${GIPHY_KEY}`)
				.then((response) => response.json())
				.then((json) => json.data.bitly_url)
			;
		}
		apiPromise.then((gifUrl) => {
			addToClipBoard(gifUrl);
		});
	});
};

const gifit = (info, tab) => {
	if (info.menuItemId === 'gifit') {
		const text = info.selectionText;
		processRequest(text);
	}
};

chrome.alarms.onAlarm.addListener((alarm) => {
	// var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
	// gettingActiveTab.then((tabs) => {
	// 	browser.pageAction.show(tabs[0].id);
	// });
	console.log(alarm);
});
