async function begin() {
    const gameArea = document.getElementById('gamearea');
    gameArea.style.backgroundImage = "url('../../img/gameimg/blackjack/table-no-text.png')";
    let active = true;
    const deck = new Deck();
    const player = new Player();
    const dealer = new Dealer(deck, player);
    while (active) active = await playHand(player, dealer);
}

async function playHand(player, dealer) {

    dealer.hand = [];
    player.hands = [];

    displayBetOptions(player);

    let bet = await listenForBet();
    if (bet === -1) return false;
    player.makeBet(bet);

    dealer.shuffle();
    dealer.deal();

    displayGameState(dealer);

    while (!player.done()) {
        displayGameState(dealer);
        let decision = await listenForDecision();
        dealer.handleDecision(decision);
    }

    displayGameState(dealer);

    if (player.busted()) dealer.done = true;
    while (!dealer.done) {
        dealer.playTurn();
        displayGameState(dealer);
        sleep(250);
    }

    dealer.handleOutcome();
    return true;
}

class Dealer {

    constructor(deck, player) {
        this.deck = deck;
        this.player = player;
        this.hand = [];
        this.done = false;
    }

    deal() {
        let dealerHand = new Hand(this.pullCard());
        let playerHand = new Hand(this.pullCard());
        playerHand.bet = this.player.bet
        dealerHand.push(this.pullCard());
        playerHand.push(this.pullCard());
        this.player.hands.push(playerHand);
        this.hand.push(dealerHand);
    }

    shuffle() {
        this.deck.shuffle();
    }

    pullCard() {
        return this.deck.pull();
    }

    faceUp() {
        if (!this.player.done())
            return this.hand[0].slice(0, 1);
        return this.hand[0];
    }

    playTurn() {
        if (this.hand[0].value() < 17) {
            this.hand[0].push(this.pullCard());
        } else {
            this.done = true;
        }
    }

    handleDecision(decision) {
        const card = this.deck.pull();
        const hand = this.player.currentHand();

        switch(decision) {
            case "hit":
                hand.push(card);
                break;
            case "stand":
                hand.close();
                break;
            case "double":
                hand.bet *= 2;
                hand.push(card);
                break;
            case "split":
                this.player.split();
                break;
            default:
                throw new Error(`Unknown Decision: ${decision}`);
        }
    }

    handleOutcome() {
        this.player.hands.forEach(hand => {
            if (hand.value() > 21) {
                return;
            } else if (hand.value() > this.hand[0].value() || this.hand[0].value() > 21) {
                this.player.win(hand);
            } else if (hand.value() === this.hand[0].value()) {
                this.player.tie(hand);
            }
        });
    }
}

class Player {
    constructor() {
        this.hands = [];
        this.bank = 1000;
        this.finished = false;
        this.bet = 0
    }

    split() {
        const bet = this.currentHand().bet
        const hand1 = new Hand(this.currentHand()[0]);
        const hand2 = new Hand(this.currentHand()[1]);

        hand1.bet = bet;
        hand2.bet = bet;
        this.bank -= bet;

        this.hands.pop();
        this.hands.push(hand1);
        this.hands.push(hand2);
    }

    currentHand() {
        if (this.hands.length > 1) {
            if (!this.hands[0].isClosed) return this.hands[0];
            if (this.hands[0].isClosed) return this.hands[1];
            if (this.hands[1].isClosed) return undefined;
        } else {
            return this.hands[0];
        }
    }

    busted() {
        return this.hands.every(hand => hand.value() > 21);
    }

    makeBet(bet) {
        this.bank -= bet;
        console.log(this.bank);
        this.bet = bet;
    }

    win(hand) {
        console.log(hand.bet)
        this.bank += hand.bet * 2;
    }

    tie(hand) {
        console.log(hand.bet)
        this.bank += hand.bet;
    }

    done() {
        return this.hands.every(hand => {
            return hand.isClosed || hand.value() >= 21;
        });
    }
}

class Deck extends Array {
    #suits = ["C", "H", "D", "S"];
    #values = [
        "A", "K", "Q", "J", "10", "9", "8", 
        "7", "6", "5", "4", "3", "2"
    ];

    constructor() {
        super();
        this.buildDeck();
    }

    buildDeck() {
        this.push(...this.#values.flatMap(value =>
            this.#suits.map(suit => ({ suit, value }))
        ));
    }

    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }

    pull() {
        if (this.length === 0) {
            this.buildDeck();
            this.shuffle();
        }
        return this.pop();
    }
}

class Hand extends Array {
    constructor(card) {
        super();
        this.bet = 0;
        this.push(card);
        this.isClosed = false;
    }

    push(card) {
        super.push(card);
        if (this.value() >= 21) {
            this.isClosed = true;
        }
    }

    close() {
        this.isClosed = true;
    }

    value() {
        let total = 0;
        let aces = 0;

        for (const card of this) {
            switch (card.value) {
                case "A":
                    aces++;
                    total += 11;
                    break;
                case "K":
                case "Q":
                case "J":
                    total += 10;
                    break;
                default:
                    total += parseInt(card.value, 10);
                    break;
            }
        }

        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }

        return total;   
    }
}

function listenForBet() {
    const optionsCont = document.getElementById("options-area");

    return new Promise(resolve => {
        function handleClick(event) {
            if (event.target.tagName !== "BUTTON") return;
            cleanup(); // Remove event listener and clear options
            resolve(parseInt(event.target.textContent, 10));
        }
        function cleanup() {
            optionsCont.removeEventListener("click", handleClick);
            optionsCont.innerHTML = "";
        }

        optionsCont.addEventListener("click", handleClick);
    });
}

function listenForDecision() {
    const optionsCont = document.getElementById("options-area");

    return new Promise(resolve => {
        function handleClick(event) {
            if (event.target.tagName !== "BUTTON") return;
            cleanup(); // Remove event listener and clear options
            resolve(event.target.textContent.toLowerCase());
        }
        function cleanup() {
            optionsCont.removeEventListener("click", handleClick);
            optionsCont.innerHTML = "";
        }

        optionsCont.addEventListener("click", handleClick);
    });
}

function displayBetOptions(player) {
    const optionsCont = document.getElementById("options-area");
    optionsCont.innerHTML = "";
    const options = document.createElement("div");
    options.id = "options-list";

    options.innerHTML = `
        <button>10</button></li>
        <button>25</button></li>
        <button>50</button></li>
        <button>100</button></li>
    `;
    optionsCont.appendChild(options);
}

function displayGameState(dealer) {

    // Clear previous game state
    const playerHandCont = document.getElementById("player-cards");
    playerHandCont.innerHTML = "";
    const playerScoreCont = document.getElementById("player-score");

    const dealerHandCont = document.getElementById("dealer-cards");
    dealerHandCont.innerHTML = "";
    const dealerScoreCont = document.getElementById("dealer-score");

    const optionsCont = document.getElementById("options-area");
    optionsCont.innerHTML = "";
    const options = document.createElement("div");
    options.id = "options-list";

    const dealerHand = document.createElement("div");
    dealerHand.id = "hand";
    // Display dealer's hand
    dealerHand.innerHTML = `
        ${dealer.faceUp().map(card => {
            return `<img src="../../img/gameimg/blackjack/cards/${card.value}${card.suit}.png"/>`;
        }).join("")}
    `;
    dealerHandCont.appendChild(dealerHand);

    dealerScoreCont.innerHTML = `
        <h2>Dealer's Score</h2>
        <p>${dealer.faceUp().value()}</p>
    `;

    // Display player's hand
    if (dealer.player.hands.length === 1) {
        console.log(dealer.player.hands[0]);
        const playerHand = document.createElement("div");
        playerHand.id = "hand";
        playerHand.innerHTML = `
            ${dealer.player.hands[0].map(card => {
                return `<img src="../../img/gameimg/blackjack/cards/${card.value}${card.suit}.png"/>`;
            }).join("")}
        `;
        playerHandCont.appendChild(playerHand);
    } else {
        const playerHand1 = document.createElement("div");
        playerHand1.id = "hand";
        const playerHand2 = document.createElement("div");
        playerHand2.id = "hand";

        playerHand1.innerHTML = `
            ${dealer.player.hands[0].map(card => {
                return `<img src="../../img/gameimg/blackjack/cards/${card.value}${card.suit}.png"/>`;
            }).join("")}
        `;

        playerHand2.innerHTML = `
            ${dealer.player.hands[1].map(card => {
                return `<img src="../../img/gameimg/blackjack/cards/${card.value}${card.suit}.png"/>`;
            }).join("")}
        `;
        playerHandCont.appendChild(playerHand1);
        playerHandCont.appendChild(playerHand2);
    }

    playerScoreCont.innerHTML = `
        <h2>Your Score</h2>
        ${dealer.player.hands.map(hand => `
            <p>${hand.value()}</p>
        `).join("\n")}
    `;

    options.innerHTML = `
        <button>Hit</button>
        <button>Stand</button>
        <button>Double</button>
        <button>Split</button>
    `;
    optionsCont.appendChild(options);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
