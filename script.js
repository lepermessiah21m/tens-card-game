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

// Function to initialize the game
function initGame() {
    const deck = Array.from({ length: 52 }, (_, index) => index);
    const shuffledDeck = shuffleDeck(deck);

    const faceUpRow = document.createElement('div');
    faceUpRow.id = 'face-up-row';
    faceUpRow.className = 'card-row';

    // Create face-up cards
    const faceUpCards = [];
    for (let i = 0; i < 11; i++) {
        const faceUpCard = createCard(shuffledDeck[i], true);
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
    faceDownRow.id = 'face-down-row';
    faceDownRow.className = 'card-row';

    // Create face-down cards
    for (let i = 0; i < 4; i++) {
        const faceDownCard = createCard(0, false);
        faceDownRow.appendChild(faceDownCard);
    }

    // Create offset face-up cards
    for (let i = 0; i < 4; i++) {
        const offsetFaceUpCard = createCard(shuffledDeck[i + 11], true);
        offsetFaceUpCard.style.position = 'absolute';
        offsetFaceUpCard.style.top = `${109 + 30 - 10}px`;
        offsetFaceUpCard.style.left = `calc(50% - 138px + ${i * (79 + 20) - 40}px)`;
        offsetFaceUpCard.style.zIndex = 11 + i;
        cardContainer.appendChild(offsetFaceUpCard);
    }

    cardContainer.appendChild(faceUpRow);
    cardContainer.appendChild(faceDownRow);
}

// Start the game
initGame();