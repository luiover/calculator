const decimalLimit = 6; // Limit the number of decimals
const errorText = 'Error 404 ☠️🪦';
let clearAfterResult = true;
let tempResult = true;

let num1 = '',
	num2 = '',
	operator = '';
const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('#display-text');

const toggleClear = document.querySelector('#toggleClear');
const boop = document.querySelector('#boop');

// Set num1 to match display
num1 = display.textContent;
console.log(num1);

boop.addEventListener('click', (e) => alert('Beep! 🚨'));

toggleClear.addEventListener('click', (e) => {
	const btnClass = [...e.target.classList];
	if (btnClass.some((item) => item === 'active')) {
		// Disable clearAfterResult
		e.target.classList.remove('active');
		e.target.classList.add('inactive');
		clearAfterResult = false;
	} else {
		// Enable clearAfterResult
		e.target.classList.remove('inactive');
		e.target.classList.add('active');
		clearAfterResult = true;
	}
	console.log(btnClass);
	e.target;
});

// Handle calculator button presses
for (const button of buttons) {
	button.addEventListener('click', (e) => {
		const btnElement = e.target.closest('.btn');
		const value = btnElement.dataset.value;

		if (tempResult) {
			clearDisplay();
			tempResult = false;
		}

		switch (value) {
			case 'clear':
				clearDisplay();
				break;

			case 'delete':
				cancelLast();
				break;

			case '=':
				if (!num2 || !operator) {
					abort();
					break;
				}
				calculate();
				break;

			default:
				// Check if the button is an operator
				if (isNaN(value)) {
					// If no num1 yet, treat + or - as number part, else it's a mistake
					if (!num1) {
						if (value === '-' || value === '+') {
							num1 += value;
							display.textContent += value;
						} else {
							abort();
						}
						break;
					}

					// If the operator is already assigned, replace it
					if (operator) {
						if (num2) {
							// Write the result and append the operator
							calculate();
							display.textContent += value;
							// Set the second operator to be the current
							operator = value;
							break;
						}
						display.textContent = display.textContent.slice(0, -1);
					}
					operator = value;
				} else {
					// Update num1 or num2 based on whether an operator is assigned
					if (!operator) {
						num1 += value;
					} else {
						num2 += value;
					}
				}
				display.textContent += value;
		}
		console.log('Num1:', num1, 'Op:', operator, 'Num2:', num2);
	});
}

function abort() {
	console.log('The expression is incomplete! Aborting');
}

function calculate() {
	// Evaluate the result to be the new num1
	num1 = operate(num1, operator, num2);
	num1 = limitDecimals(num1);
	operator = '';
	num2 = '';

	// Handle numbers divided by 0 with an error message
	if (num1 === Infinity || Number.isNaN(num1)) {
		num1 = errorText;
		tempResult = true;
	}

	if (clearAfterResult) {
		tempResult = true;
	}

	display.textContent = num1;
}

function cancelLast() {
	lastChar = display.textContent.slice(-1);
	display.textContent = display.textContent.slice(0, -1);
	// Check if an operator or number has been removed to update it
	if (isNaN(lastChar)) {
		operator = '';
	} else {
		num1 = String(num1).slice(0, -1);
	}
}

function limitDecimals(number) {
	// Count the number of decimals
	const decimal = String(number)?.split('.')[1];
	if (decimal && decimal.length > decimalLimit) {
		const shorterNum = Number(number).toFixed(decimalLimit);
		return shorterNum;
		console.log(shorterNum);
	} else {
		return number;
	}
}

function clearDisplay() {
	display.textContent = '';
	clearVariables();
}

function clearVariables() {
	num1 = '';
	num2 = '';
	operator = '';
}

function operate(num1, operator, num2) {
	switch (operator) {
		case '+':
			return add(Number(num1), Number(num2));
		case '-':
			return subtract(Number(num1), Number(num2));
		case '*':
			return multiply(Number(num1), Number(num2));
		case '/':
			return divide(Number(num1), Number(num2));
		case '%':
			return modulo(Number(num1), Number(num2));
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

function modulo(num1, num2) {
	return num1 % num2;
}
