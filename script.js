const cardContainer = document.getElementById('player-container');
const cardSprite = 'assets/images/2560px-english-pattern-playing-cards-deck.png';
const cardBackImage = 'assets/images/card-back-2.png';

// Function to create a card element
function createCard(index, faceUp = true) {
    const card = document.createElement('div');
    card.className = faceUp ? 'card face-up' : 'card face-down';

    if (faceUp) {
        const cardWidth = 181;
        const cardHeight = 272;
        const marginX = 16;
        const marginY = 16;
        const spriteSheetWidth = 2560;
        const spriteSheetHeight = 1160;

        // Calculate the position of the card in the sprite sheet
        const column = index % 13;
        const row = Math.floor(index / 13);

        // Use fixed offset values for initial positioning
        const fixedOffsetX = 14; /* background needed to be moved to the right 14px */
        const fixedOffsetY = 8; /* background needed to be moved down 8px */
        const backgroundX = -(column * (cardWidth + marginX) + marginX / 2) + fixedOffsetX;
        const backgroundY = -(row * (cardHeight + marginY) + marginY / 2) + fixedOffsetY;

        card.style.backgroundImage = `url('${cardSprite}')`;
        card.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;

        // Set initial background size
        card.style.backgroundSize = `${spriteSheetWidth}px ${spriteSheetHeight}px`;

        // Adjust background size after the card is added to the DOM
        requestAnimationFrame(() => {
            const cardHeightVh = 9.09;
            const cardWidthVh = cardHeightVh / 1.5;

            const cardHeightPx = (cardHeightVh / 100) * window.innerHeight;
            const cardWidthPx = (cardWidthVh / 100) * window.innerHeight;

            const scaleX = cardWidthPx / cardWidth;
            const scaleY = cardHeightPx / cardHeight;
            const scale = Math.min(scaleX, scaleY);

            card.style.backgroundSize = `${spriteSheetWidth * scale}px ${spriteSheetHeight * scale}px`;

            // Recalculate offsets based on actual card size
            const offsetX = cardWidthPx * (fixedOffsetX / cardWidth);
            const offsetY = cardHeightPx * (fixedOffsetY / cardHeight);

            const adjustedBackgroundX = backgroundX + offsetX - fixedOffsetX;
            const adjustedBackgroundY = backgroundY + offsetY - fixedOffsetY;

            card.style.backgroundPosition = `${adjustedBackgroundX}px ${adjustedBackgroundY}px`;

            console.log('Card dimensions:', cardWidthPx, cardHeightPx);
            console.log('Scale:', scale);
            console.log('Adjusted offsets:', offsetX, offsetY);
            console.log('Final background position:', adjustedBackgroundX, adjustedBackgroundY);
        }, 0);
    } else {
        card.style.backgroundImage = `url('${cardBackImage}')`;
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