const load = () => browser.runtime.sendMessage({ type: 'config', action: 'load' });
const save = (option) => browser.runtime.sendMessage({ type: 'config', action: 'save', option });
const toggleKeywords = (state) => document.querySelector('.section-keywords').classList.toggle('section-keywords--visible', state);

load().then((config) => {
	toggleKeywords(config.api === 'search');
	Object.keys(config).forEach((key) => {
		const input = document.querySelector(`input[name=${key}]`);
		switch (input.type) {
			case 'text':
				input.value = config[key];
				break;
			case 'radio':
				document.querySelector(`input[name=${key}][value=${config[key]}]`).checked = true;
				break;
		}
	});

	document.body.addEventListener('change', (event) => {
		const input = event.target;
		if (input.name === 'api') {
			toggleKeywords(input.value === 'search');
		}

		save({ [input.name]: input.value });
	});

	document.querySelectorAll('input[type=text]').forEach((input) => input.addEventListener('keyup', (event) => {
		if (event.key === 'Enter') {
			input.blur();
		}

		save({ [input.name]: input.value });
	}));
});
