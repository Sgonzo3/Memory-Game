let moves = 0;
let movesHTML = document.getElementById('moves');
const stars = document.querySelector('.stars');
let clock;
let timerHTML;
const modal = document.querySelector('.modal');
const prompt = document.querySelector('.prompt');
let matchedPairs;
let openCards;


// list containing all potential cards
const cards = [
  'fa-diamond', 'fa-diamond',
  'fa-paper-plane-o','fa-paper-plane-o',
  'fa-anchor', 'fa-anchor',
  'fa-bolt','fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-bomb', 'fa-bomb'
]

const deck = document.querySelector('.deck');

//creates cardHTML
function makeCards(card) {
  return `<li class="card"><i class="fa ${card}"></i></li>`;
}


function makeGame() {
  // setInterval for timer
  // shuffles the list, adds HTML to each card
  let cardHTML  = shuffle(cards).map(function(card) {
    return makeCards(card);
  });
  // adds each card to the page
  deck.innerHTML = cardHTML.join('');
  // sets moves and text to zero
  movesHTML.innerHTML = 0;
  moves = 0;
  openCards = [];
  matchedPairs = 0;
  cardEvents();
  stopTimer();
  startTimer();
  // timerHTML.innerHTML = `0:00`;
  restart();
}

// * Create button and event listener to start game
  function start() {
    let startButton = document.getElementById('start');
    deck.classList.add('hidden');
    startButton.addEventListener('click', function(e) {
         makeGame();
         startButton.classList.add('hidden');
         deck.classList.remove('hidden');
       });
  }

start();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = cards.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return cards;
}

/*
 If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


function matching() {
  if (openCards[0].firstElementChild.className == openCards[1].firstElementChild.className) {
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');
    openCards = [];
    matchedPairs++;
    //for testing modal
    // matchedPairs = 8;
    victoryCondition();
  } else {
    // If not matched
    setTimeout(function() {
      openCards.forEach(function(card) {
        card.classList.remove('open', 'show');
      });

      openCards = [];
    }, 500 );

  }
}

// function cardClicks() {
// }
function cardEvents() {
  const pageCards = document.querySelectorAll('.card');
  pageCards.forEach(function(card){
      // adds eventlistener to each .card
      card.addEventListener('click', function cardClicks(){
        // prevents selecting more than 2 cards or selecting open cards
        if (openCards.length <= 1 && !card.classList.contains('open')) {
          // adds each chosen card to an array
          openCards.push(card);
          moveCount();
          scoreCount();
          // flips each chosen card
          card.classList.add('open', 'show');
        }
        if (openCards.length === 2) {
          matching();
        }
        // else if (openCards.length > 2) {
        //   card.classList.remove('open', 'show');
        // }
    });
  });
}

// cardEvents();

function restart() {
  const restart = document.querySelector('.restart');
  restart.addEventListener('click', function(e) {
    //create functionreset stars?, call here
    //maybe use hidden class or toggle instead?
    stars.firstElementChild.style.display = "inline";
    stars.lastElementChild.style.display = "inline";
    makeGame();
  });
}

function moveCount() {
  moves++;
  movesHTML.innerHTML = moves;
}

function scoreCount() {
  if (moves == 25) {
    stars.firstElementChild.style.display = 'none';
  } else if (moves == 33) {
    stars.lastElementChild.style.display = 'none';
  }
}

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

function showTime() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    timerHTML.innerHTML = `${minutes}:0${seconds}`;
  } else {
    timerHTML.innerHTML = `${minutes}:${seconds}`;
  }
}

function modalPrompt() {
  yourTime = document.querySelector('.your-time');
  yourMoves = document.querySelector('.your-moves');
  yourStars = document.querySelector('.your-stars');
  modal.classList.remove('hidden');
  yourTime.innerHTML = `TIME: ${timerHTML.innerHTML}`;
  yourMoves.innerHTML = `SCORE: ${moves}`;
  yourStars.appendChild(stars);
  replay();

}

function victoryCondition() {
  if (matchedPairs === 8) {
    stopTimer();
    modalPrompt();
  }
}

function replay() {
  const replay = document.querySelector('.play-again');
  replay.addEventListener('click', function(e) {
    //create functionreset stars?, call here
    //use .hidden or toggle instead?
    stars.firstElementChild.style.display = "inline";
    stars.lastElementChild.style.display = "inline";
    modal.classList.add('hidden');
    makeGame();
  });
}
