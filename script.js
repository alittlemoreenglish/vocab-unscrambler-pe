import {
  vocabulary
} from './vocabulary.js';

let currentWord = '';
let score = 0;
let letterCards = []; // Store original letter cards
let selectedLetters = []; // Store selected letter cards
let timeLeft = 0;
let timerInterval;
let gameStarted = false;

const letterCardsContainer = document.getElementById('letter-cards');
const selectedLettersContainer = document.getElementById('selected-letters');
const submitGuessButton = document.getElementById('submit-guess');
const messageDisplay = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('time');
const congratulationsDisplay = document.getElementById('congratulations');
const startGameButton = document.getElementById('start-game');
const finalCongratulationsDisplay = document.getElementById('finalCongratulations');
const finalMessageDisplay = document.getElementById('finalMessage');
const confettiCanvas = document.getElementById('confetti-canvas');
let confettiAnimation;
const skipWordButton = document.getElementById('skip-word'); // Add skip word button

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * vocabulary.length);
  return vocabulary[randomIndex];
}

function scrambleWord(word) {
  const wordArray = word.split('');
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }
  return wordArray;
}

function displayLetterCards(letters) {
  letterCardsContainer.innerHTML = '';
  letterCards = letters.map((letter, index) => {
    const card = document.createElement('div');
    card.classList.add('letter-card');
    card.textContent = letter;
    card.dataset.letter = letter; // Store letter
    card.addEventListener('click', moveLetter);
    letterCardsContainer.appendChild(card);
    return card;
  });
}

function moveLetter(event) {
  const card = event.target;
  const letter = card.dataset.letter;

  // Move from letter cards to selected letters
  if (card.parentNode.id === 'letter-cards') {
    selectedLettersContainer.appendChild(card);
    selectedLetters.push(card); // Track selected letters
  }
  // Move from selected letters back to letter cards
  else {
    letterCardsContainer.appendChild(card);
    selectedLetters = selectedLetters.filter(c => c !== card); // Remove from selected letters
  }
}

function startGame() {
  gameStarted = true;
  submitGuessButton.style.display = 'inline-block';
  submitGuessButton.disabled = false;
  skipWordButton.style.display = 'inline-block'; // Show skip button
  currentWord = getRandomWord();
  const scrambledLetters = scrambleWord(currentWord);
  displayLetterCards(scrambledLetters);
  letterCardsContainer.classList.add('animate__animated', 'animate__fadeIn');
  selectedLettersContainer.innerHTML = ''; // Clear selected letters
  selectedLetters = [];

  // Start timer only once
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
  startGameButton.style.display = 'none';
  messageDisplay.textContent = '';
}

function updateTimer() {
  timeLeft++;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function checkGuess() {
  const userGuess = Array.from(selectedLettersContainer.children)
    .map(card => card.dataset.letter)
    .join('')
    .toLowerCase();

  if (userGuess === currentWord.toLowerCase()) {
    messageDisplay.textContent = '👍Correct!💖';
    messageDisplay.classList.add('animate__animated', 'animate__bounce');
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    if (score >= 10) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const finalTimeMessage = `🎆Congratulations!🎇 You won the game in ${String(minutes).padStart(2, '0')} minutes and ${String(seconds).padStart(2, '0')} seconds!🥳🥳🥳`;

      // Display final congratulatory message
      finalMessageDisplay.textContent = finalTimeMessage;
      finalCongratulationsDisplay.style.display = 'block';
      startConfetti();
      submitGuessButton.disabled = true;
      startGameButton.style.display = 'none';
      skipWordButton.style.display = 'none'; // Hide skip button
      clearInterval(timerInterval); // Stop the timer

      setTimeout(() => {
        stopConfetti();
      }, 5000); // Stop confetti after 5 seconds

    } else {
      currentWord = getRandomWord();
      const scrambledLetters = scrambleWord(currentWord);
      displayLetterCards(scrambledLetters);
      letterCardsContainer.classList.add('animate__animated', 'animate__fadeIn');
      selectedLettersContainer.innerHTML = ''; // Clear selected letters
      selectedLetters = [];
    }
  } else {
    messageDisplay.textContent = '😔Incorrect. Try again.🔥🔥';
    messageDisplay.classList.add('animate__animated', 'animate__shakeX');
  }

  messageDisplay.addEventListener('animationend', () => {
    messageDisplay.classList.remove('animate__animated', 'animate__bounce', 'animate__shakeX');
  });
  letterCardsContainer.addEventListener('animationend', () => {
    letterCardsContainer.classList.remove('animate__animated', 'animate__fadeIn');
  });
}

// Skip Word Function
function skipWord() {
  currentWord = getRandomWord();
  const scrambledLetters = scrambleWord(currentWord);
  displayLetterCards(scrambledLetters);
  letterCardsContainer.classList.add('animate__animated', 'animate__fadeIn');
  selectedLettersContainer.innerHTML = ''; // Clear selected letters
  selectedLetters = [];
}

// Confetti
function startConfetti() {
  const confettiSettings = {
    target: confettiCanvas,
    respawn: true,
    "props": ["circle", "square", "triangle", "line"],
    "colors": [
      [165, 104, 246],
      [230, 61, 135],
      [0, 199, 228],
      [253, 214, 126]
    ]
  };
  confettiAnimation = new ConfettiGenerator(confettiSettings);
  confettiAnimation.render();
}

function stopConfetti() {
  if (confettiAnimation) {
    confettiAnimation.clear();
  }
  finalCongratulationsDisplay.style.display = 'none';
}

submitGuessButton.addEventListener('click', checkGuess);
startGameButton.addEventListener('click', startGame);
skipWordButton.addEventListener('click', skipWord); // Add skip word event listener

// Import confetti-js
import ConfettiGenerator from 'https://cdn.jsdelivr.net/npm/confetti-js/+esm'