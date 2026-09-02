const expressionEl = document.getElementById("expression");
const currentEl = document.getElementById("current");

let previousValue = null;
let operator = null;
let currentValue = "0";
let justEvaluated = false;

const operatorSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateDisplay() {
  currentEl.textContent = currentValue;
  expressionEl.textContent =
    previousValue !== null && operator
      ? `${previousValue} ${operatorSymbols[operator]}`
      : "";
}

function inputDigit(digit) {
  if (justEvaluated) {
    currentValue = digit;
    justEvaluated = false;
    return;
  }
  currentValue = currentValue === "0" ? digit : currentValue + digit;
}

function inputDecimal() {
  if (justEvaluated) {
    currentValue = "0.";
    justEvaluated = false;
    return;
  }
  if (!currentValue.includes(".")) {
    currentValue += ".";
  }
}

function chooseOperator(nextOperator) {
  if (operator && previousValue !== null && !justEvaluated) {
    evaluate();
  }
  previousValue = currentValue;
  operator = nextOperator;
  currentValue = "0";
  justEvaluated = false;
}

function evaluate() {
  if (operator === null || previousValue === null) return;

  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        currentValue = "Error: div by 0";
        previousValue = null;
        operator = null;
        justEvaluated = true;
        return;
      }
      result = a / b;
      break;
    default:
      return;
  }

  currentValue = Number(result.toFixed(10)).toString();
  previousValue = null;
  operator = null;
  justEvaluated = true;
}

function clearAll() {
  previousValue = null;
  operator = null;
  currentValue = "0";
  justEvaluated = false;
}

function backspace() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
}

document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { action, value } = button.dataset;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      chooseOperator(value);
      break;
    case "equals":
      evaluate();
      break;
    case "clear":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
  }

  updateDisplay();
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    evaluate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearAll();
  } else {
    return;
  }

  updateDisplay();
});

updateDisplay();
