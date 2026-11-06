// Referencias a elementos del DOM (Pasos 14 a 16)
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

// Variable de estado para indicar errores de entrada (Paso 17)
let isError = false;

// Elimina signos +, - y espacios de un texto (Pasos 18 a 24)
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

// Detecta notación científica (ej: 1e3) (Pasos 28 a 34)
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Agrega campos de entrada dinámicos (Pasos 38 a 55)
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entrada ${entryNumber} Nombre</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Nombre" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entrada ${entryNumber} Calorías</label>
  <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calorías" />`;

  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// Suma las calorías de una lista de inputs verificando errores (Pasos 56 a 60 + cálculo)
function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Entrada inválida: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

// Calcula las calorías consumidas, quemadas y el déficit/superávit
function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastInputs = document.querySelectorAll('#breakfast input[type="number"]');
  const lunchInputs = document.querySelectorAll('#lunch input[type="number"]');
  const dinnerInputs = document.querySelectorAll('#dinner input[type="number"]');
  const snacksInputs = document.querySelectorAll('#snacks input[type="number"]');
  const exerciseInputs = document.querySelectorAll('#exercise input[type="number"]');

  const breakfastCalories = getCaloriesFromInputs(breakfastInputs);
  const lunchCalories = getCaloriesFromInputs(lunchInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerInputs);
  const snacksCalories = getCaloriesFromInputs(snacksInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Superávit' : 'Déficit';

  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorías de ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Presupuesto de calorías</p>
  <p>${consumedCalories} Calorías consumidas</p>
  <p>${exerciseCalories} Calorías quemadas</p>
  `;

  output.classList.remove('hide');
}

// Limpia el formulario y vuelve al estado inicial
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

// Asignación de eventos a los botones y formulario
addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);