const load = () => new Promise((resolve) => {
	chrome.runtime.sendMessage({ type: 'config', action: 'load' }, (config) => {
		resolve(config);
	});
});

const save = (option) => new Promise((resolve) => {
	chrome.runtime.sendMessage({ type: 'config', action: 'save', option });
});

load().then((config) => {
	Object.keys(config).forEach((key) => {
		const input = document.querySelector(`input[name=${key}]`);
		switch (input.type) {
			case 'text':
				input.value = config[key];
				break;
			case 'radio':
				document.querySelector(`input[name=${key}][value=${config[key]}]`).checked = true;
				key === 'api' && config[key] === 'search' && document.querySelector('.keywords').classList.add('keywords--visible');
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
