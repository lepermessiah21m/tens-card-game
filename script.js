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
    const faceUpCard = createCard(0, true);
    const faceDownCard = createCard(0, false);
    
    cardContainer.appendChild(faceUpCard);
    cardContainer.appendChild(faceDownCard);
}

// Start the game
initGame();