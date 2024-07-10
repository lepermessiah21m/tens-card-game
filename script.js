const cardContainer = document.getElementById('card-container');
const cardSprite = 'assets/images/card-sprite-sheet.png';
const cardBackImage = 'assets/images/card-back.png';

// Function to create a card element
function createCard(index, faceUp = true) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = index % 13;
    if (faceUp) {
        card.style.backgroundImage = `url('${cardSprite}')`;
        card.style.backgroundPosition = `${(index % 13) * -79}px ${Math.floor(index / 13) * -109}px`;
        card.style.backgroundRepeat = 'no-repeat';
        card.style.backgroundSize = '1027px 436px';
    } else {
        card.style.backgroundImage = `url('${cardBackImage}')`;
        card.style.backgroundSize = 'cover';
    }
    return card;
}

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Function to prompt the user for the number of players
function promptNumPlayers() {
    let numPlayers = parseInt(prompt("Enter the number of players (2-8):"));
    while (isNaN(numPlayers) || numPlayers < 2 || numPlayers > 8) {
        numPlayers = parseInt(prompt("Invalid input. Please enter a number between 2 and 8:"));
    }
    return numPlayers;
}

// Function to calculate the number of decks needed based on the number of players
function getNumDecks(numPlayers) {
    const cardsPerPlayer = 19; // Each player gets 19 cards
    const totalCardsRequired = numPlayers * cardsPerPlayer;
    const numDecks = Math.ceil(totalCardsRequired / 52);
    return numDecks;
}

// Function to create a combined deck of cards based on the number of decks
function createCombinedDeck(numDecks) {
    const combinedDeck = [];
    for (let i = 0; i < numDecks; i++) {
        for (let j = 0; j < 52; j++) {
            combinedDeck.push(j);
        }
    }
    return combinedDeck;
}

// Function to randomly select the dealer
function selectDealer(numPlayers) {
    return Math.floor(Math.random() * numPlayers) + 1;
}

// Function to deal cards to players
function dealCards(players, shuffledDeck, dealerIndex) {
    const numPlayers = players.length;
    let currentPlayerIndex = (dealerIndex + 1) % numPlayers;
    let cardIndex = 0;

    // Deal 11 cards to each player's hand
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < numPlayers; j++) {
            const player = players[currentPlayerIndex];
            const card = shuffledDeck[cardIndex];
            player.hand.push(card);
            cardIndex++;
            currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
        }
    }

    // Deal 4 face-down cards to each player's piles
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < numPlayers; j++) {
            const player = players[currentPlayerIndex];
            const card = shuffledDeck[cardIndex];
            player.piles[i].push(card);
            cardIndex++;
            currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
        }
    }

    // Deal 4 face-up cards to each player's piles
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < numPlayers; j++) {
            const player = players[currentPlayerIndex];
            const card = shuffledDeck[cardIndex];
            player.piles[i].push(card);
            cardIndex++;
            currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
        }
    }
}

// Function to create player cards
function createPlayerCards(playerDeck, containerId, isCPU) {
    const container = document.getElementById(containerId);

    const faceUpRow = document.createElement('div');
    faceUpRow.id = isCPU ? 'cpu-face-up-row' : 'face-up-row';
    faceUpRow.className = 'card-row';

    // Create face-up cards
    const faceUpCards = [];
    for (let i = 0; i < 11; i++) {
        const faceUpCard = createCard(playerDeck[i], true);
        faceUpCards.push(faceUpCard);
    }

    // Sort the face-up cards based on their values
    faceUpCards.sort((a, b) => {
        const valueA = parseInt(a.dataset.value);
        const valueB = parseInt(b.dataset.value);

        // Place 10's on the right side
        if (valueA === 9) return 1;
        if (valueB === 9) return -1;

        // Sort other cards normally
        return valueA - valueB;
    });

    // Append the sorted face-up cards to the row
    faceUpCards.forEach((card, index) => {
        card.style.zIndex = index;
        faceUpRow.appendChild(card);
    });

    const faceDownRow = document.createElement('div');
    faceDownRow.id = isCPU ? 'cpu-face-down-row' : 'face-down-row';
    faceDownRow.className = 'card-row';

    // Create face-down cards
    for (let i = 0; i < 4; i++) {
        const faceDownCard = createCard(0, false);
        faceDownRow.appendChild(faceDownCard);
    }

    if (isCPU) {
        container.appendChild(faceUpRow);
        container.appendChild(faceDownRow);

        // Create offset face-up cards for CPU 1
        for (let i = 0; i < 4; i++) {
            const offsetFaceUpCard = createCard(playerDeck[i + 11], true);
            offsetFaceUpCard.style.position = 'absolute';
            offsetFaceUpCard.style.top = '159px';
            offsetFaceUpCard.style.left = `calc(50% - 138px + ${i * (79 + 20) - 40}px)`;
            offsetFaceUpCard.style.zIndex = 11 + i;
            container.appendChild(offsetFaceUpCard);
        }
    } else {
        // Create offset face-up cards for Player 1
        for (let i = 0; i < 4; i++) {
            const offsetFaceUpCard = createCard(playerDeck[i + 11], true);
            offsetFaceUpCard.style.position = 'absolute';
            offsetFaceUpCard.style.top = `${109 + 30 - 10}px`;
            offsetFaceUpCard.style.left = `calc(50% - 138px + ${i * (79 + 20) - 40}px)`;
            offsetFaceUpCard.style.zIndex = 11 + i;
            container.appendChild(offsetFaceUpCard);
        }

        container.appendChild(faceUpRow);
        container.appendChild(faceDownRow);
    }
}

// Function to create player card arrays based on the dealt cards
function createPlayerCardArrays(players) {
    const playerCardArrays = [];

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const isHumanPlayer = player.id === 1;

        const faceUpRow = document.createElement('div');
        faceUpRow.className = 'card-row';

        // Create face-up cards for the player's hand
        const faceUpCards = [];
        for (let j = 0; j < player.hand.length; j++) {
            const card = player.hand[j];
            const faceUpCard = createCard(card, isHumanPlayer);
            faceUpCards.push(faceUpCard);
        }

        // Sort the face-up cards based on their values
        faceUpCards.sort((a, b) => {
            const valueA = parseInt(a.dataset.value);
            const valueB = parseInt(b.dataset.value);

            // Place 10's on the right side
            if (valueA === 9) return 1;
            if (valueB === 9) return -1;

            // Sort other cards normally
            return valueA - valueB;
        });

        // Append the sorted face-up cards to the row
        faceUpCards.forEach((card, index) => {
            card.style.zIndex = index;
            faceUpRow.appendChild(card);
        });

        const pileRows = [];
        for (let j = 0; j < player.piles.length; j++) {
            const pileRow = document.createElement('div');
            pileRow.className = 'card-row';

            // Create face-down card for the pile
            const faceDownCard = createCard(player.piles[j][0], false);
            pileRow.appendChild(faceDownCard);

            // Create face-up card for the pile
            const faceUpCard = createCard(player.piles[j][1], isHumanPlayer);
            pileRow.appendChild(faceUpCard);

            pileRows.push(pileRow);
        }

        playerCardArrays.push({
            playerId: player.id,
            faceUpRow,
            pileRow: pileRows
        });
    }

    return playerCardArrays;
}

// Function to initialize the game
function initGame() {
    const numPlayers = promptNumPlayers();
    console.log("Number of players:", numPlayers);

    const numDecks = getNumDecks(numPlayers);
    console.log("Number of decks needed:", numDecks);

    const combinedDeck = createCombinedDeck(numDecks);
    console.log("Combined deck of cards:", combinedDeck);

    const shuffledDeck = shuffleDeck(combinedDeck);
    console.log("Shuffled deck of cards:", shuffledDeck);

    const dealerId = selectDealer(numPlayers);
    console.log("Dealer ID:", dealerId);

    // Create an array to store player objects
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push({
            id: i + 1,
            hand: [],
            piles: [[], [], [], []]
        });
    }

    // Convert dealerId to dealerIndex
    const dealerIndex = dealerId - 1;

    // Deal cards to players
    dealCards(players, shuffledDeck, dealerIndex);

    // Create player card arrays based on the dealt cards
    const playerCardArrays = createPlayerCardArrays(players);

    // Render the player card arrays on the game board
playerCardArrays.forEach(cardArray => {
    const playerContainer = document.getElementById(`player${cardArray.playerId}-container`);
    playerContainer.appendChild(cardArray.faceUpRow);
    const pileRow = document.createElement('div');
    pileRow.className = 'pile-row';
    cardArray.pileRow.forEach(pile => {
        pileRow.appendChild(pile);
    });
    playerContainer.appendChild(pileRow);
});
}

// Start the game
initGame();