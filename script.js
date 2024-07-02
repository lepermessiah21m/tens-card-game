const cardContainer = document.getElementById('card-container');
const cardSprite = 'assets/images/card-sprite-sheet.png';
const cardBackImage = 'assets/images/card-back.png';

// Function to create a card element
function createCard(index, faceUp = true) {
    const card = document.createElement('div');
    card.className = 'card';
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

// Function to initialize the game
function initGame() {
    const faceUpRow = document.createElement('div');
    faceUpRow.className = 'card-row';

    // Create face-up cards
    for (let i = 0; i < 11; i++) {
        const faceUpCard = createCard(i, true);
        faceUpRow.appendChild(faceUpCard);
    }

    const faceDownRow = document.createElement('div');
    faceDownRow.className = 'card-row';

    // Create face-down cards
    for (let i = 0; i < 4; i++) {
        const faceDownCard = createCard(0, false);
        faceDownRow.appendChild(faceDownCard);
    }

    cardContainer.appendChild(faceUpRow);
    cardContainer.appendChild(faceDownRow);
}

// Start the game
initGame();