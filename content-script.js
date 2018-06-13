const gifTemplate = `
	<div class="take-a-break-container">
		<div class="take-a-break-title">Take a Break!</div>
		<div class="take-a-break-gif"><img src="about:blank"/></div>
		<div class="take-a-break-benjamin-button">I am ready to go back to work!</div>
	</div>
`;

const listener = (message) => {
	if (message.url) {
		document.querySelector('.take-a-break-container') && document.querySelector('.take-a-break-container').remove();
		document.body.insertAdjacentHTML('beforeend', gifTemplate);
		document.querySelector('.take-a-break-gif img').src = message.url;
		document.querySelector('.take-a-break-benjamin-button').addEventListener('click', goBackToWork);
	}
}

browser.runtime.onMessage.addListener(listener);

const goBackToWork = () => {
	document.querySelector('.take-a-break-container').remove();
}
