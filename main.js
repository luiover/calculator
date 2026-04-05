let num1, num2, operator;
const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('#display-text');

for (const button of buttons) {
	button.addEventListener('click', (e) => {
		const btnElement = e.target.closest('.btn');
		const value = btnElement.dataset.value;

		switch (value) {
			case 'clear':
				display.textContent = '';
				break;

			case 'delete':
				display.textContent = display.textContent.slice(0, -1);
				break;

			case '=':
				const displayText = display.textContent;

			default:
				display.textContent += value;
		}
	});
}

function operate(num1, operator, num2) {
	switch (operator) {
		case '+':
			return add(num1, num2);
		case '-':
			return subtract(num1, num2);
		case '*':
			return multiply(num1, num2);
		case '/':
			return divide(num1, num2);
	}
}

function add(num1, num2) {
	return num1 + num2;
}

function subtract(num1, num2) {
	return num1 - num2;
}

function multiply(num1, num2) {
	return num1 * num2;
}

function divide(num1, num2) {
	return num1 / num2;
}
