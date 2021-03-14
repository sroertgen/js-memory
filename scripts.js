import {
  cardDeck
} from "./decks.js";

document.addEventListener("DOMContentLoaded", () => {
  const decks = {
    leniEden: "Leni & Eden",
    fastFood: "Fast Food",
    lica: "Lica",
    eden: "Eden"
  };


  // shuffle the cards
  function shuffleDeck() {
    cardArray.sort(() => Math.random() - 0.5);
  }

  const choose = document.querySelector(".choose");
  const chooseGrid = document.querySelector(".choose-grid");
  const game = document.querySelector(".game");
  const memoryGame = document.querySelector(".memory-game");
  const root = document.documentElement;
  const scoreDisplay = document.querySelector("#score");
  const triesDisplay = document.querySelector("#tries");
  const resetButton = document.querySelector("#reset");

  // create won image animation
  const wonImg = document.createElement("img");
  wonImg.setAttribute("src", "./images/eden_won.png");
  wonImg.classList.add("won-img");
  const wonLeft = wonImg.cloneNode();
  const wonRight = wonImg.cloneNode();
  wonLeft.classList.add("won-img-left");
  wonRight.classList.add("won-img-right");

  resetButton.addEventListener("click", reset);
  let cardArray = [];
  let chosenDeck = "";
  let cardsChosen = [];
  let cardsWon = [];
  let tries = 0;
  let level = 0;

  game.style.display = "none";

  // choose deck
  function chooseDeck() {
    // set display props
    game.style.display = "none";
    choose.style.display = "block";

    const whichDeck = document.createElement("h3");
    whichDeck.classList.add("which-deck");
    whichDeck.textContent = "Welches Deck möchtest du spielen?";
    choose.insertBefore(whichDeck, choose.firstChild);

    Object.keys(decks).forEach(key => {
      // check if the key is present in cardDeck
      if (Object.keys(cardDeck).includes(key)) {
        const deckButton = document.createElement("button");
        deckButton.textContent = decks[key];
        deckButton.setAttribute("data-id", key.toString());
        deckButton.classList.add("deck-button");
        deckButton.addEventListener("click", setDeck);
        chooseGrid.appendChild(deckButton);
      }
    });
  }

  function setDeck() {
    chosenDeck = this.getAttribute("data-id");
    document.querySelectorAll(".deck-button").forEach(button => button.remove());
    document.querySelector(".which-deck").remove();
    chooseLevel();
  }

  // choose difficulty
  function chooseLevel() {
    game.style.display = "none";
    choose.style.display = "block";

    // create h3
    const whichDifficulty = document.createElement("h3");
    whichDifficulty.classList.add("which-difficulty");
    whichDifficulty.textContent = "Wie viele Karten möchtest du spielen?";
    choose.insertBefore(whichDifficulty, choose.firstChild);

    // create buttons to choose level (depending on length of chosen deck)
    for (let i = 4; i <= cardDeck[chosenDeck].length; i += 2) {
      const levelButton = document.createElement("button");
      levelButton.textContent = i.toString();
      levelButton.setAttribute("class", "level-button");
      levelButton.setAttribute("data-id", i.toString());
      levelButton.addEventListener("click", setLevel);
      chooseGrid.appendChild(levelButton);
    }
  }

  function setLevel() {
    level = this.getAttribute("data-id");
    const levelButtons = document.querySelectorAll(".level-button");
    choose.style.display = "none";
    levelButtons.forEach((button) => button.remove());
    document.querySelector(".which-difficulty").remove();
    // if level is > 10 adjust grid columns
    if (level >= 10) {
      root.style.setProperty("--columns", "5");
    }
    createBoard();
  }

  function createBoard() {
    // set info board
    triesDisplay.textContent = tries.toString();
    scoreDisplay.textContent = cardsWon.length.toString();

    // create deck corresponding to current level
    // TODO cardDeck has to be an object of arrays with corresponding keys to decks
    cardArray = cardDeck[chosenDeck].slice(0, level);

    // shuffle the deck
    shuffleDeck();

    //
    for (let i = 0; i < level; i++) {
      const card = document.createElement("img");
      card.setAttribute("src", "./images/blank.png");
      card.setAttribute("class", "card");
      card.setAttribute("data-id", i.toString());
      card.addEventListener("click", flipCard);
      memoryGame.appendChild(card);
    }
    game.style.display = "grid";
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // check for match
  async function checkForMatch() {
    const cards = document.querySelectorAll("img");
    const optionOneId = cardsChosen[0];
    const optionTwoId = cardsChosen[1];
    const match = cardArray[optionOneId].img === cardArray[optionTwoId].img;
    if (match) {
      cardsWon.push(optionOneId, optionTwoId);
      scoreDisplay.textContent = cardsWon.length.toString();
    } else {
      await sleep(1000);
      cards[optionOneId].setAttribute("src", "./images/blank.png");
      cards[optionOneId].classList.remove("flip");
      cards[optionTwoId].setAttribute("src", "./images/blank.png");
      cards[optionTwoId].classList.remove("flip");
    }
    addClickEvents();
    cardsChosen = [];
    tries++;
    triesDisplay.textContent = tries.toString();

    // check if all matches found
    if (cardsWon.length === cardArray.length) {
      removeAllClickEvents();
      document.querySelector(".container").appendChild(wonLeft);
      document.querySelector(".container").appendChild(wonRight);
      // setTimeout(alert(`Super, alle gefunden mit ${tries} Versuchen!`), 500);
    }
  }

  // flipcard
  function flipCard() {
    const cardId = this.getAttribute("data-id");
    this.classList.add("flip");
    this.setAttribute("src", cardArray[cardId].img);
    this.removeEventListener("click", flipCard);
    cardsChosen.push(cardId);
    if (cardsChosen.length === 2) {
      // remove all click event listeners 
      removeAllClickEvents();
      // check if they are matches
      // setTimeout(checkForMatch, 1000);
      checkForMatch();
    }
  }

  function removeAllClickEvents() {
    const cards = document.querySelectorAll("img");
    cards.forEach(card => card.removeEventListener("click", flipCard));
  }

  // adds click events to not chosen cards
  function addClickEvents() {
    const cards = document.querySelectorAll("img");
    [...cards]
      .filter(card => !cardsWon.includes(card))
      .forEach(card => card.addEventListener("click", flipCard));
  }

  function removeBoard() {
    const cardBoard = document.querySelectorAll(".card");
    cardBoard.forEach(card => card.remove());
    document.querySelectorAll(".won-img").forEach(el => el.remove());
  }

  function reset() {
    // TODO add reset function
    cardArray = [];
    cardsChosen = [];
    cardsWon = [];
    tries = 0;
    triesDisplay.textContent = tries.toString();
    scoreDisplay.textContent = cardsWon.length.toString();
    removeBoard();
    chooseDeck();
  }

  chooseDeck();
});