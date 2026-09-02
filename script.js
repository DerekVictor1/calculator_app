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
  if (event.target.tagName === "INPUT") return;

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

// --- Tabs ---

const tabBtns = document.querySelectorAll(".tab-btn");
const calculatorPanel = document.getElementById("calculatorPanel");
const converterPanel = document.getElementById("converterPanel");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const isCalculator = btn.dataset.tab === "calculator";
    calculatorPanel.hidden = !isCalculator;
    converterPanel.hidden = isCalculator;
  });
});

// --- Base converter ---

const decInput = document.getElementById("decInput");
const binInput = document.getElementById("binInput");
const hexInput = document.getElementById("hexInput");
const convError = document.getElementById("convError");
const convClear = document.getElementById("convClear");

const convInputs = { dec: decInput, bin: binInput, hex: hexInput };
const convBases = { dec: 10, bin: 2, hex: 16 };
const convPatterns = { dec: /^[0-9]+$/, bin: /^[01]+$/, hex: /^[0-9a-fA-F]+$/ };

function parseBaseValue(raw, key) {
  let str = raw;
  let negative = false;
  if (str[0] === "-") {
    negative = true;
    str = str.slice(1);
  }
  if (str === "" || !convPatterns[key].test(str)) return undefined;

  const base = BigInt(convBases[key]);
  let value = 0n;
  for (const char of str) {
    value = value * base + BigInt(parseInt(char, convBases[key]));
  }
  return negative ? -value : value;
}

function formatBaseValue(value, key) {
  const negative = value < 0n;
  const abs = negative ? -value : value;
  const digits = abs.toString(convBases[key]);
  const formatted = key === "hex" ? digits.toUpperCase() : digits;
  return (negative ? "-" : "") + formatted;
}

function handleConvInput(key) {
  const input = convInputs[key];
  const raw = input.value.trim();

  convError.textContent = "";
  Object.values(convInputs).forEach((el) => el.classList.remove("invalid"));

  if (raw === "" || raw === "-") {
    Object.entries(convInputs).forEach(([otherKey, el]) => {
      if (otherKey !== key) el.value = "";
    });
    return;
  }

  const value = parseBaseValue(raw, key);
  if (value === undefined) {
    input.classList.add("invalid");
    convError.textContent = `Invalid ${key.toUpperCase()} value`;
    return;
  }

  Object.entries(convInputs).forEach(([otherKey, el]) => {
    if (otherKey !== key) el.value = formatBaseValue(value, otherKey);
  });
}

Object.entries(convInputs).forEach(([key, input]) => {
  input.addEventListener("input", () => handleConvInput(key));
});

convClear.addEventListener("click", () => {
  Object.values(convInputs).forEach((el) => {
    el.value = "";
    el.classList.remove("invalid");
  });
  convError.textContent = "";
});
