import GIPHY_API_KEY from '../.giphy.key';

const GIPHY_API_ROOT = 'https://api.giphy.com/v1/gifs';

export default {
	async get(mode, keywords) {
		let url = `${GIPHY_API_ROOT}/${mode}?api_key=${GIPHY_API_KEY}`;
		if (mode === 'search') {
			url += `&q=${encodeURIComponent(keywords)}`;
		}

		return fetch(url)
			.then((result) => result.json())
			.then(({ data }) => {
				if (!data || !data.length) {
					return undefined;
				}

				if (Array.isArray(data)) {
					const index = Math.floor(Math.random() * data.length);
					return data[index].images.original.url;
				}

				return data.images.original.url;
			})
		;
	}
};
