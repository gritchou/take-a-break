const DEFAULT_SETTINGS = { delay: 0.1, api: 'random', keywords: 'trump' };

const load = () => new Promise((resolve) => {
	// chrome.storage.sync.get(['settings'], (result) => {
	// 	return resolve(result.settings || DEFAULT_SETTINGS);
	// });
	chrome.runtime.sendMessage({ type: 'settings', action: 'load' }, (settings) => {
		console.log('loaded from background!', settings);
		resolve(settings);
	});
});

const save = (option) => new Promise((resolve) => {
	return load().then((settings) => {
		const updatedSettings = Object.assign(settings, option);
		chrome.storage.sync.set({ settings: updatedSettings }, () => resolve());
		chrome.runtime.sendMessage({ type: 'settings', settings: updatedSettings });
	});
});

load().then((settings) => {
	Object.keys(settings).forEach((key) => {
		const input = document.querySelector(`input[name=${key}]`);
		switch (input.type) {
			case 'text':
				input.value = settings[key];
				break;
			case 'radio':
				document.querySelector(`input[name=${key}][value=${settings[key]}]`).checked = true;
				// TODO: Check if event trigger needed
				break;
		}
	});

	document.body.addEventListener('change', (event) => {
		const input = event.target;
		if (input.name === 'api') {
			document.querySelector('.keywords').classList.toggle('keywords--visible', input.value === 'search');
		}

		// TODO: Validate before saving
		save({ [input.name]: input.value });
	});

	document.querySelectorAll('input[type=text]').forEach((input) => input.addEventListener('keyup', (event) => {
		// TODO: Validate before saving
		save({ [input.name]: input.value });
	}));
});
