// UI elements
const word = document.getElementById("word"),
  text = document.getElementById("text"),
  scoreEl = document.getElementById("score"),
  timeEl = document.getElementById("time"),
  endgameEl = document.getElementById("end-game-container"),
  settingsBtn = document.getElementById("settings-btn"),
  settings = document.getElementById("settings"),
  settingsForm = document.getElementById("settings-form"),
  difficultySelect = document.getElementById("difficulty");

// variables
let words = [],
  randomWord,
  score = 0,
  time = 10,
  difficulty =
    localStorage.getItem("difficulty") !== null
      ? localStorage.getItem("difficulty")
      : "medium";
const timeInterval = setInterval(updateTime, 1000);

difficultySelect.value =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

text.focus();

async function getWords() {
  await fetch("https://random-word-api.herokuapp.com/all")
    .then((res) => res.json())
    .then((data) => {
      words = [...data];
      init();
    });
}

function init() {
  randomWord = getRandomWord();
  word.innerHTML = randomWord;
}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function addWordToDOM() {
  randomWord = getRandomWord();
  word.innerHTML = randomWord;
}

function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

function updateTime() {
  time--;
  timeEl.innerHTML = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function gameOver() {
  endgameEl.innerHTML = `
  <h1>Time ran out</h1>
  <p>Your final score is ${score}</p>
  <button onclick="location.reload()">Reload</button>
  `;
  endgameEl.style.display = "flex";
}

// Event listeners
window.addEventListener("load", getWords);
text.addEventListener("input", (e) => {
  const insertedText = e.target.value;

  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();
    e.target.value = "";

    if (difficulty === "hard") {
      time += 3;
    } else if (difficulty === "medium") {
      time += 4;
    } else {
      time += 6;
    }

    updateTime();
  }
});

settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});

settingsBtn.addEventListener("click", () => settings.classList.toggle("hide"));
