const decimalLimit = 6; // Limit the number of decimals
const errorText = 'Error 404 ☠️🪦';
let clearAfterResult = false;
let tempResult = true;

let num1 = '',
	num2 = '',
	operator = '';
const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('#display-text');

const dotButton = document.querySelector('#dot');
const toggleClear = document.querySelector('#toggleClear');
const boop = document.querySelector('#boop');

// Set num1 to match display
num1 = display.textContent;
console.log(num1);

// EVENT LISTENERS // // // // // // // // // // // //
// Assign button click logic to each calculator button
for (const button of buttons) {
	button.addEventListener('click', (e) => {
		// Get the button char
		const btnElement = e.target.closest('.btn');
		const value = btnElement.dataset.value;
		handleButton(value);
	});
}
// Alternatively use keyboard presses
document.addEventListener('keydown', keyPressed);

// Extra buttons click event logic
boop.addEventListener('click', (e) => alert('Beep! 🚨'));
toggleClear.addEventListener('click', toggleClearFn);
// // // // // // // // // // // // // // // // // //

function handleButton(value) {
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
			// Ignore if the expression is incorrect
			if (!num2 || !operator) {
				abort();
				break;
			}

			calculate();
			break;

		default:
			// Update numbers if the button is a number
			if (!isNaN(value) || value === '.') {
				updateNumVariable(value);
				break;
			}

			// Handle early operator button
			if (!num1) {
				handleStartingSymbol(value);
				break;
			}

			// Check if an operator is already typed
			if (operator) {
				// Handle case where an expression is already typed
				if (num2) {
					// Calculate before adding another operator
					calculate();
				} else {
					// Remove the old unwanted operator
					display.textContent = display.textContent.slice(0, -1);
				}
			}

			// Check whether the number isn't valid
			if (num1 === '.' || num2 === '.') {
				abort();
				break;
			}

			// Add the operator
			operator = value;
			display.textContent += value;

			// Allow again dots
			dotButton.disabled = false;
	}
	// Debugging purposes
	console.log('Num1:', num1, 'Op:', operator, 'Num2:', num2);
}

function keyPressed(e) {
	let pressedKey = e.key.toLowerCase();

	console.log(pressedKey);

	switch (pressedKey) {
		case 'enter':
			pressedKey = '=';
			break;
		case 'backspace':
			pressedKey = 'delete';
			break;
		case 'delete':
			pressedKey = 'clear';
			break;
		case 't':
			toggleClearFn();
			return;
	}

	const calcButton = document.querySelector(`.btn[data-value="${pressedKey}"]`);

	// Check if the pressed key corresponds to a calculator button
	if (calcButton) {
		handleButton(pressedKey);
	}
}

function toggleClearFn() {
	const btnClass = [...toggleClear.classList];
	if (btnClass.some((item) => item === 'active')) {
		// Disable clearAfterResult
		toggleClear.classList.remove('active');
		toggleClear.classList.add('inactive');
		clearAfterResult = false;
	} else {
		// Enable clearAfterResult
		toggleClear.classList.remove('inactive');
		toggleClear.classList.add('active');
		clearAfterResult = true;
	}
}

// Input handling and formatting helpers
function handleStartingSymbol(value) {
	// Consider positive or negative values
	if (value === '-' || value === '+') {
		num1 += value;
		display.textContent += value;
	} else {
		abort();
	}
}

function limitDecimals(number) {
	// Count the number of decimals
	const decimal = String(number)?.split('.')[1];
	if (decimal && decimal.length > decimalLimit) {
		const shorterNum = Number(number).toFixed(decimalLimit);
		return Number(shorterNum);
	} else {
		return number;
	}
}

// Display-related mutating functions
function clearDisplay() {
	display.textContent = '';
	clearVariables();
}

function cancelLast() {
	lastChar = display.textContent.slice(-1);
	display.textContent = display.textContent.slice(0, -1);

	// Re-enable dot if it has been removed
	if (lastChar === '.') {
		dotButton.disabled = false;
		return;
	}

	// Check if an operator or number has been removed to update it
	if (isNaN(lastChar)) {
		operator = '';
		// Check if dot should be blocked now
		noMultipleDots(num1);
	} else {
		num1 = String(num1).slice(0, -1);
	}
}

function abort() {
	alert('The expression is incomplete!');
	// console.log('The expression is incomplete! Aborting');
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

// Handling variables functions
function updateNumVariable(value) {
	// Update num1 or num2 based on whether an operator is assigned
	if (!operator) {
		num1 += value;
		noMultipleDots(num1);
	} else {
		num2 += value;
		noMultipleDots(num2);
	}
	display.textContent += value;
}

function noMultipleDots(number) {
	if (String(number).includes('.')) {
		dotButton.disabled = true;
	}
}

function clearVariables() {
	num1 = '';
	num2 = '';
	operator = '';
	dotButton.disabled = false;
}

// Mathematical operations

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
