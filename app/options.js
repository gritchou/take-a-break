import config from './lib/config';

const toggleKeywords = (state) => document.querySelector('.section-keywords').classList.toggle('section-keywords--visible', state);

config.load().then((data) => {
	toggleKeywords(data.api === 'search');
	Object.keys(data).forEach((key) => {
		const input = document.querySelector(`input[name=${key}]`);
		switch (input.type) {
			case 'text':
				input.value = data[key];
				break;
			case 'radio':
				document.querySelector(`input[name=${key}][value=${data[key]}]`).checked = true;
				break;
		}
	});

	document.body.addEventListener('change', (event) => {
		const input = event.target;
		if (input.name === 'api') {
			toggleKeywords(input.value === 'search');
		}

		config.save({ [input.name]: input.value });
	});

	document.querySelectorAll('input[type=text]').forEach((input) => input.addEventListener('keyup', (event) => {
		if (event.key === 'Enter') {
			input.blur();
		}

		config.save({ [input.name]: input.value });
	}));
});
