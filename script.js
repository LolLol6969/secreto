document.addEventListener('DOMContentLoaded', () => {
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const resetBtn = document.getElementById('reset-btn');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    const playerCardsDiv = document.getElementById('your-cards');
    const dealerScoreSpan = document.getElementById('dealer-score');
    const playerScoreSpan = document.getElementById('your-score');
    const messageP = document.getElementById('message');

    let deck = [];
    let dealerHand = [];
    let playerHand = [];
    let isGameActive = false;
    let dealerHiddenCard = null;

    // Crea un mazzo di carte
    function createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        // Mischia il mazzo
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    // Calcola il valore di una mano
    function getHandValue(hand) {
        let value = 0;
        let aceCount = 0;
        for (let card of hand) {
            if (card.value === 'A') {
                aceCount++;
                value += 11;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount--;
        }
        return value;
    }

    // Mostra le carte
    function renderCards() {
        dealerCardsDiv.innerHTML = '';
        playerCardsDiv.innerHTML = '';

        dealerHand.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            if (isGameActive && index === 0 && dealerHand.length > 1) {
                cardDiv.classList.add('hidden-card');
                cardDiv.textContent = '?';
            } else {
                cardDiv.textContent = `${card.value}${card.suit}`;
            }
            dealerCardsDiv.appendChild(cardDiv);
        });

        playerHand.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.textContent = `${card.value}${card.suit}`;
            playerCardsDiv.appendChild(cardDiv);
        });

        dealerScoreSpan.textContent = isGameActive ? '??' : getHandValue(dealerHand);
        playerScoreSpan.textContent = getHandValue(playerHand);
    }

    // Inizia un nuovo gioco
    function startGame() {
        createDeck();
        dealerHand = [deck.pop(), deck.pop()];
        playerHand = [deck.pop(), deck.pop()];
        isGameActive = true;
        messageP.textContent = 'Premi "Pesca" per un\'altra carta o "Stai" per finire.';
        hitBtn.disabled = false;
        standBtn.disabled = false;
        resetBtn.style.display = 'none';

        renderCards();
    }

    // Controlla la fine del gioco
    function checkGameEnd() {
        const playerScore = getHandValue(playerHand);
        if (playerScore > 21) {
            endGame('Hai sballato! Hai perso. 😭');
        }
    }

    // Gestisce l'azione 'Pesca'
    hitBtn.addEventListener('click', () => {
        if (!isGameActive) return;
        playerHand.push(deck.pop());
        renderCards();
        checkGameEnd();
    });

    // Gestisce l'azione 'Stai'
    standBtn.addEventListener('click', () => {
        if (!isGameActive) return;
        isGameActive = false;
        hitBtn.disabled = true;
        standBtn.disabled = true;

        // Il banco pesca finché non ha 17 o più
        while (getHandValue(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }

        renderCards();
        determineWinner();
    });

    // Determina il vincitore
    function determineWinner() {
        const playerScore = getHandValue(playerHand);
        const dealerScore = getHandValue(dealerHand);
        let message = '';

        if (playerScore > 21) {
            message = 'Hai sballato! Hai perso. 😭';
        } else if (dealerScore > 21) {
            message = 'Il banco ha sballato! Hai vinto! 🎉';
        } else if (playerScore > dealerScore) {
            message = 'Hai vinto! 🎉';
        } else if (playerScore < dealerScore) {
            message = 'Hai perso. Il banco ha vinto. 😢';
        } else {
            message = 'Parità! 🤝';
        }
        endGame(message);
    }

    function endGame(message) {
        messageP.textContent = message;
        isGameActive = false;
        hitBtn.disabled = true;
        standBtn.disabled = true;
        resetBtn.style.display = 'block';
    }

    // Ripristina il gioco
    resetBtn.addEventListener('click', startGame);

    // Inizia il gioco all'avvio
    startGame();
});
