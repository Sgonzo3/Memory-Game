//Globals
let moves = 0;
let movesHTML = document.getElementById('moves');
const stars = document.querySelector('.stars');
let clock;
let timerHTML;
const modal = document.querySelector('.modal');
const prompt = document.querySelector('.prompt');
let matchedPairs;
let openCards;
const deck = document.querySelector('.deck');

// list containing all potential card class names
const cards = [
  'fa-diamond', 'fa-diamond',
  'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor',
  'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-bomb', 'fa-bomb'
]

start();

// Hides deck, creates button prompt and event listener to start game
function start() {
  let startButton = document.getElementById('start');
  // hides deck before prompt
  deck.classList.add('hidden');
  startButton.addEventListener('click', function(e) {
    makeGame();
    // Hides start prompt
    startButton.classList.add('hidden');
    // shows deck with cards
    deck.classList.remove('hidden');
  });
}

//creates cardHTML
function makeCards(card) {
  return `<li class="card"><i class="fa ${card}"></i></li>`;
}


function makeGame() {
  // shuffles the list, adds HTML to each card
  let cardHTML = shuffle(cards).map(function(card) {
    return makeCards(card);
  });
  // adds each card to the page
  deck.innerHTML = cardHTML.join('');
  defaults();
  cardEvents();
  restartButton();
  startTimer();
}

//sets defaults for game
function defaults() {
  // sets moves stars and timer to defaults
  movesHTML.innerHTML = 0;
  moves = 0;
  stars.firstElementChild.style.display = "inline";
  stars.lastElementChild.style.display = "inline";
  stopTimer();
  // sets matching array to empty and match count to 0
  openCards = [];
  matchedPairs = 0;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = cards.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return cards;
}

//sets logic for comparing selected cards
function matching() {
  if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
    match();
    victoryCondition();
  } else {
    noMatch();
  }
}

function match() {
  //show cards as matched
  openCards[0].classList.add('match');
  openCards[1].classList.add('match');
  //reset array
  openCards = [];
  //inscrese match count
  matchedPairs++;
}

function noMatch() {
  // If not matched, sets time to flip back cards
  setTimeout(function() {
    openCards.forEach(function(card) {
      card.classList.remove('open', 'show');
    });
    //reset array
    openCards = [];
  }, 500);
}

//sets functionality for clicking on cards
function cardEvents() {
  const pageCards = document.querySelectorAll('.card');
  pageCards.forEach(function(card) {
    // adds eventlistener to each .card
    card.addEventListener('click', function cardClicks() {
      // prevents selecting more than 2 cards or selecting open cards
      if (openCards.length <= 1 && !card.classList.contains('open')) {
        // adds each chosen card to array
        openCards.push(card);
        moveCount();
        scoreCount();
        // flips each chosen card
        card.classList.add('open', 'show');
      }
      if (openCards.length === 2) {
        matching();
      }
    });
  });
}

//sets functionality for restart button
function restartButton() {
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', function(e) {
    makeGame();
  });
}

//updates moves count and HTML
function moveCount() {
  moves++;
  movesHTML.innerHTML = moves;
}

//sets stars displayed according to move score
function scoreCount() {
  if (moves === 25) {
    stars.firstElementChild.style.display = 'none';
  } else if (moves === 33) {
    stars.lastElementChild.style.display = 'none';
  }
}

//creates time interval that itterates each second
//with guidance from https://matthewcranford.com/memory-game-walkthrough-part-6-the-clock/
function startTimer() {
  time = 0;
  timerHTML = document.getElementById('timer')
  clock = setInterval(function() {
    time++;
    showTime();
  }, 1000);
}

function stopTimer() {
  clearInterval(clock);
}

//sets display format of time
function showTime() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    timerHTML.innerHTML = `${minutes}:0${seconds}`;
  } else {
    timerHTML.innerHTML = `${minutes}:${seconds}`;
  }
}

//Checks if game is won
function victoryCondition() {
  if (matchedPairs === 8) {
    stopTimer();
    modalPrompt();
  }
}

//sets functionality for modal
function modalPrompt() {
  let yourTime = document.querySelector('.your-time');
  let yourMoves = document.querySelector('.your-moves');
  let yourStars = document.querySelector('.your-stars');

  //show modal
  modal.classList.remove('hidden');

  //display stats for time, moves, stars
  yourTime.innerHTML = `TIME: ${timerHTML.innerHTML}`;
  yourMoves.innerHTML = `SCORE: ${moves}`;
  yourStars.innerHTML = `Rating: `;
  yourStars.appendChild(stars.cloneNode(true));

  replay();
}

//sets functionality for replay button in modal
function replay() {
  const replay = document.querySelector('.play-again');
  replay.addEventListener('click', function(e) {
    //hide modal before next match
    modal.classList.add('hidden');
    makeGame();
  });
}
