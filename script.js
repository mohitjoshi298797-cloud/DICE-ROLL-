
const table = document.getElementById("table");            
const totalText = document.getElementById("total");        
const diceCount = document.getElementById("diceCount");    
const rollButton = document.getElementById("rollButton");
const clearButton = document.getElementById("clearButton");
const historyList = document.getElementById("history");   



const dotPositions = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

const TOTAL_FRAMES = 64;
const FRAME_DELAY_MS = 30;


let rollHistory = [];



function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}


function rollManyDice(howMany) {
  const numbers = [];
  for (let i = 0; i < howMany; i++) {
    numbers.push(randomDie());  
  }
  return numbers;
}

function addUp(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i];
  }
  return sum;
}



function createDie(number) {
  const die = document.createElement("div");   
  die.classList.add("die");                   

  if (number === 1) {
    die.classList.add("one");
  }

  
  for (let cell = 0; cell < 9; cell++) {
    const box = document.createElement("div");


    if (dotPositions[number].includes(cell)) {
      box.classList.add("pip");
    }

    die.appendChild(box);
  }

  return die;
}


function showDice(numbers, state) {
  table.innerHTML = "";

  for (let i = 0; i < numbers.length; i++) {
    const die = createDie(numbers[i]);

    if (state === "rolling") {
      die.classList.add("rolling");
    
      const tilt = Math.random() * 50 - 25;
      die.style.transform = "rotate(" + tilt + "deg)";
    }

    if (state === "landed") {
      die.classList.add("landed");
    }

    table.appendChild(die);   
  }
}

function showHistory() {
  historyList.innerHTML = "";  

  for (let i = 0; i < rollHistory.length; i++) {
    const item = document.createElement("li");   
    item.textContent = rollHistory[i];           
    historyList.appendChild(item);
  }
}
                                

function saveHistory() {
  try {
    
    localStorage.setItem("diceHistory", JSON.stringify(rollHistory));
  } catch (error) {
  }
}

function loadHistory() {
  try {
    const savedText = localStorage.getItem("diceHistory");
    if (savedText !== null) {
      rollHistory = JSON.parse(savedText);
    }
  } catch (error) {
    rollHistory = [];
  }
}


function finishRoll(howMany) {
  const result = rollManyDice(howMany);
  const total = addUp(result);

  showDice(result, "landed");

  if (howMany === 1) {
    totalText.textContent = "You rolled: " + total;
    rollHistory.unshift("" + total);
  } else {
    totalText.textContent = "Total: " + total;
    rollHistory.unshift(result.join(" + ") + " = " + total);
  }


  if (rollHistory.length > 10) {
    rollHistory.pop();  
  }

  saveHistory();
  showHistory();
  rollButton.disabled = false;
}


function rollDice() {

  const howMany = Number(diceCount.value);
  let frame = 0;

  rollButton.disabled = true; 

  const timer = setInterval(function () {
   
    showDice(rollManyDice(howMany), "rolling");

    frame = frame + 1;
    if (frame === TOTAL_FRAMES) {
      clearInterval(timer);
      finishRoll(howMany);
    }
  }, FRAME_DELAY_MS);
}


function clearHistory() {
  rollHistory = [];

  try {
    localStorage.removeItem("diceHistory");
  } catch (error) {
     
  }

  showHistory();
}



rollButton.addEventListener("click", rollDice);
clearButton.addEventListener("click", clearHistory);

loadHistory();
showDice([1, 1], "");
showHistory();
