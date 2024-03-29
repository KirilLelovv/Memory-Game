const cards = document.querySelectorAll('.card'); // Get all elements with the class 'card'
let hasFlippedCard = false; // Indicates if a card has been flipped
let lockBoard = true; // Prevents card flipping until the game starts
let firstCard, secondCard; // Store the first and second flipped cards
let moves = 0; // Count the number of moves
let highScore = 0; // Store the high score
const movesElement = document.getElementById('moves'); // Element that displays the number of moves
const highScoreElement = document.getElementById('high'); // Element that displays the high score
const resetButton = document.getElementById('resetBtn'); // Reset button element
const startButton = document.getElementById('startBtn'); // Start button element
const timer = document.getElementById('timer'); // Element that displays the timer
let intervalId; // ID for the timer interval

cards.forEach(function(card) {
  card.addEventListener('click', flipCard); // Add a click event listener to each card
});

resetButton.addEventListener('click', resetGame); // Add a click event listener to the reset button
startButton.addEventListener('click', startGame); // Add a click event listener to the start button

function flipCard() {
  if (lockBoard || this === firstCard) return; // Prevent card flipping if the board is locked or the same card is clicked again
  this.classList.add('flipped'); // Add the 'flipped' class to the clicked card

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this; // Store the first flipped card
  } else {
    secondCard = this; // Store the second flipped card
    lockBoard = true; // Lock the board to prevent further flipping
    moves++; // Increment the number of moves
    movesElement.textContent = `Moves: ${moves}`; // Update the moves display

    checkForMatch(); // Check if the two flipped cards match
  }
}

function checkForMatch() {
  const firstCardImage = firstCard.querySelector('.back-image').src; // Get the image source of the first card
  const secondCardImage = secondCard.querySelector('.back-image').src; // Get the image source of the second card

  if (firstCardImage === secondCardImage) {
    disableCards(); // Disable the cards if they match
    updateHighScore(); // Update the high score
    checkWin(); // Check if the player has won
  } else {
    unflipCards(); // Unflip the cards if they don't match
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard); // Remove the click event listener from the first card
  secondCard.removeEventListener('click', flipCard); // Remove the click event listener from the second card
  resetBoard(); // Reset the flipped cards
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flipped'); // Remove the 'flipped' class from the first card
    secondCard.classList.remove('flipped'); // Remove the 'flipped' class from the second card
    resetBoard(); // Reset the flipped cards
  }, 1000); // Wait for 1 second before unflipping the cards
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false]; // Reset the flip and lock state
  [firstCard, secondCard] = [null, null]; // Reset the flipped cards
}

function enableAllCards() {
cards.forEach(function(card) {
card.addEventListener('click', flipCard); // Add a click event listener to each card
});
}

function resetGame() {
  moves = 0; // Reset the moves counter
  movesElement.textContent = 'Moves: 0'; // Update the moves display
  highScore = 0; // Reset the high score
  highScoreElement.textContent = 'High Score: 0'; // Update the high score display
  cards.forEach(function(card) {
    card.classList.remove('flipped'); // Remove the 'flipped' class from all cards
    card.addEventListener('click', flipCard); // Add click event listeners to all cards
  });
  shuffleCards(); // Shuffle the cards
  enableAllCards(); // Enable all cards
  resetTimer(); // Reset the timer

  // Prompt the user with a confirmation dialog to start the game again
  const confirmRestart = confirm("Press 'Ok' to play again");
  if (confirmRestart) {
    startGame(); // Start the game if the user confirms
  } else {
    startBtn.disabled = false; // Enable the start button
  }
}

function updateHighScore() {
highScore += 25; // Increase the high score by 25
highScoreElement.textContent =  `High Score: ${highScore}; ` // Update the high score display
}

function checkWin() {
const matchedCards = document.querySelectorAll('.flipped'); // Get all flipped cards
if (matchedCards.length === cards.length) {    //if all of the cards match execute the following code
const finishTime = timer.textContent; // Get the finish time from the timer
const congratsMessage =  `Congratulations! You won!\n\nMoves: ${moves}\nHigh Score: ${highScore}\nFinish Time: ${finishTime}; ` // Create a congratulatory message
alert(congratsMessage); // Show the congratulatory message
resetGame(); // Reset the game
}
}

function shuffleCards() {
cards.forEach(card => {
const randomPos = Math.floor(Math.random() * cards.length); // Generate a random position
card.style.order = randomPos; // Set the order of the card using CSS flexbox
});
}

function startGame() {
if (intervalId) return; // If the timer is already running, return
startTimer(); // Start the timer
enableAllCards(); // Enable all cards
lockBoard = false; // Unlock the board to allow card flipping
}

function startTimer() {
let isRunning = true; // Variable that indicates whether the timer is running
const startTime = Date.now(); // Get the current time

function update() {
if (!isRunning) return; // If the timer is not running, return
const elapsedTime = Date.now() - startTime; // Calculate the elapsed time
let hours = Math.floor(elapsedTime / 3600000); // Calculate the number of hours
let minutes = Math.floor((elapsedTime / 60000) % 60); // Calculate the number of minutes
let seconds = Math.floor((elapsedTime / 1000) % 60); // Calculate the number of seconds
hours = String(hours).padStart(2, '0'); // Format the hours with leading zeros
minutes = String(minutes).padStart(2, '0'); // Format the minutes with leading zeros
seconds = String(seconds).padStart(2, '0'); // Format the seconds with leading zeros
timer.textContent = `${hours}:${minutes}:${seconds}`;
}

update(); // Update the timer immediately
intervalId = setInterval(update, 1000); // Update the timer every second
}

function resetTimer() {
clearInterval(intervalId); // Clear the timer interval
timer.textContent = '00:00:00'; // Reset the timer display to 00:00:00

intervalId = null; // Reset the interval ID
}