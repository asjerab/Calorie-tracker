const addFoodBtn = document.querySelector(".add-food-btn");
const modal = document.getElementById("addFoodModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const addBtn = document.getElementById("addBtn");
const foodNameInput = document.getElementById("foodName");
const foodCaloriesInput = document.getElementById("foodCalories");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const closeError = document.getElementById("closeError");

let calorieTracker = [];
const dailyCalorieGoal = 3250; // Daglig kaloribudsjett
const circumference = 2 * Math.PI * 90; // 2 * π * radius

// Last inn data fra localStorage når siden starter
const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('calorieTracker');
  if (saved) {
    calorieTracker = JSON.parse(saved);
    updateFoodDisplay();
    updateCaloriesLeft();
  }
};

// Lagre data til localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('calorieTracker', JSON.stringify(calorieTracker));
};

// Vis error melding
const showError = (message) => {
  errorText.textContent = message;
  errorMessage.classList.add('show');
  
  // Auto-hide etter 5 sekunder
  setTimeout(() => {
    hideError();
  }, 5000);
};

// Skjul error melding
const hideError = () => {
  errorMessage.classList.remove('show');
};

// Vis modal
const showModal = () => {
  modal.classList.add('show');
  foodNameInput.focus();
};

// Skjul modal
const hideModal = () => {
  modal.classList.remove('show');
  // Reset form
  foodNameInput.value = '';
  foodCaloriesInput.value = '';
};

// Valider input
const validateInput = () => {
  const name = foodNameInput.value.trim();
  const calories = foodCaloriesInput.value.trim();
  
  if (!name) {
    showError('Vennligst skriv inn et matnavn');
    foodNameInput.focus();
    return false;
  }
  
  if (!calories || isNaN(calories) || parseInt(calories) <= 0) {
    showError('Vennligst skriv inn et gyldig antall kalorier');
    foodCaloriesInput.focus();
    return false;
  }
  
  return true;
};

// Legg til mat
const addFood = () => {
  if (!validateInput()) return;
  
  const name = foodNameInput.value.trim();
  const calories = parseInt(foodCaloriesInput.value);
  
  calorieTracker.push({ name, calories });
  updateFoodDisplay();
  updateCaloriesLeft();
  saveToLocalStorage();
  hideModal();
};

// Beregn og oppdater kalorier igjen med sirkulær progress
const updateCaloriesLeft = () => {
  const totalConsumed = calorieTracker.reduce((total, item) => {
    return total + parseInt(item.calories) || 0;
  }, 0);
  
  const caloriesLeft = dailyCalorieGoal - totalConsumed;
  const progress = Math.max(0, Math.min(1, caloriesLeft / dailyCalorieGoal));
  
  // Oppdater tekst
  const caloriesNumber = document.querySelector('.calories-number');
  caloriesNumber.textContent = Math.max(0, caloriesLeft);
  
  // Oppdater sirkel progress
  const progressCircle = document.querySelector('.progress-ring-circle');
  const progressContainer = document.querySelector('.progress-circle');
  
  const offset = circumference - (progress * circumference);
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = offset;
  
  // Endre farge basert på progress
  progressContainer.className = 'progress-circle';
  if (caloriesLeft < 0) {
    progressContainer.classList.add('danger');
  } else if (caloriesLeft < 200) {
    progressContainer.classList.add('warning');
  } else {
    progressContainer.classList.add('success');
  }
};

// Event listeners
addFoodBtn.addEventListener("click", showModal);

closeModal.addEventListener("click", hideModal);
cancelBtn.addEventListener("click", hideModal);
closeError.addEventListener("click", hideError);

addBtn.addEventListener("click", addFood);

// Lukk modal når man klikker utenfor
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// Enter key for å legge til mat
foodCaloriesInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addFood();
  }
});

const foodContainer = document.getElementById("food-container");

const updateFoodDisplay = () => {
  foodContainer.innerHTML = ""; // Tøm containeren først
  calorieTracker.forEach((item, index) => {
    const foodItem = document.createElement("div");
    foodItem.className = "food-items";
    
    const foodInfo = document.createElement("span");
    foodInfo.textContent = `${item.name}: ${item.calories + " kcal"}`;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff4444" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>`;
    
    deleteBtn.addEventListener("click", () => {
      deleteFoodItem(index);
    });
    
    foodItem.appendChild(foodInfo);
    foodItem.appendChild(deleteBtn);
    foodContainer.appendChild(foodItem);
  });
};

const deleteFoodItem = (index) => {
  calorieTracker.splice(index, 1);
  updateFoodDisplay();
  updateCaloriesLeft();
  saveToLocalStorage();
};

// Last inn data når siden starter
loadFromLocalStorage();