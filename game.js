class Card {
  constructor(value, suit, display) {
    this._value = value
    this._suit = suit
    this._display = display
  }

  get value() {
    return this._value
  }

  get suit() {
    return this._suit
  }

  get display() {
    return this._display
  }
}

class Deck {
  constructor() {
    this._cards = []

    for (let s = 1; s <= 4; s++) {
      for (let v = 1; v <= 13; v++) {
        let value = v, suit, display = v

        if (v === 1) {
          display = 'A'
          value = 14
        }
        if (v === 11) {
          display = 'J'
        }
        if (v === 12) {
          display = 'Q'
        }
        if (v === 13) {
          display = 'K'
        }

        if (s === 1) {
          suit = 'spades'
        }

        if (s === 2) {
          suit = 'clubs'
        }

        if (s === 3) {
          suit = 'diams'
        }

        if (s === 4) {
          suit = 'hearts'
        }

        this._cards.push(new Card(value, suit, display))
      }
    }
  }

  shuffle() {
    for (let i = this._cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let x = this._cards[i]
        this._cards[i] = this._cards[j]
        this._cards[j] = x
    }
  }

  deal(player1, player2) {
    player1.removeCardsFromHand('all')
    player2.removeCardsFromHand('all')
    for (let i = 0; i < this._cards.length; i++) {
      if (i % 2 === 0) {
        player1.addCardsToHand(this._cards[i])
      } else {
        player2.addCardsToHand(this._cards[i])
      }
    }
  }
}

class Player {
  constructor() {
    this._hand = []
  }

  addCardsToHand(cardsToPush) {
    if (!Array.isArray(cardsToPush)) {
      cardsToPush = [cardsToPush]
    }
    cardsToPush.forEach(card => {
      this._hand.push(card)
    })
  }

  removeCardsFromHand(howMany = 1) {
    if (howMany === 'all') {
      this._hand = []
    } else {
      var tempArr = []
      for (var i = 0; i < howMany; i++) {
        tempArr.push(this._hand.shift())
      }
      return tempArr
    }
  }

  get hand() {
    return this._hand
  }

  get cardCount() {
    return this._hand.length
  }

  get handhtml() {
    return this._hand.map(card => `<div class="card ${card.suit}">${card.display}&${card.suit};</div>`).join('')
  }
}

class War {
  constructor(player1, player2) {
    this.player1 = player1
    this.player2 = player2
    this._status = 'playing'

    this.player1div = $("#player1")
    this.player2div = $("#player2")

    this.player1cardsleft = $(".player .cardsleft")
    this.player2cardsleft = $(".computer .cardsleft")

    this.message = $(".message")

    this.warCards = 3
  }

  get status() {
    return this._status
  }

  turn(cards = []) {
    if (cards.length === 0) {
      this.player1div.empty()
      this.player2div.empty()
    }

    let card1 = this.player1.removeCardsFromHand()[0]
    let card2 = this.player2.removeCardsFromHand()[0]

    this.player1div.append(`<div class="card ${card1.suit}">${card1.display}&${card1.suit};</div>`)
    this.player2div.append(`<div class="card ${card2.suit}">${card2.display}&${card2.suit};</div>`)

    if (card1.value > card2.value) {
      this.message.html('Player won hand')
      this.player1.addCardsToHand([card1, card2, ...cards])
    } else if (card1.value < card2.value) {
      this.message.html('Computer won hand')
      this.player2.addCardsToHand([card1, card2, ...cards])
    } else {
      // console.log('War!')
      
      this.message.html('War!!')
      $("#play").attr('disabled', true)
      setTimeout(() => {
        $("#play").attr('disabled', false)
        if (this.player1.cardCount <= this.warCards) {
          this.message.html('Computer wins!!')
          this._status = 'finished'
          return;
        } else if (this.player2.cardCount <= this.warCards) {
          this.message.html('Player Wins!!')
          this._status = 'finished'
          return;
        } else {
          let stack1 = this.player1.removeCardsFromHand(this.warCards)
          let stack2 = this.player2.removeCardsFromHand(this.warCards)

          this.player1div.append(`<div class="stack"><div>X</div><div>X</div><div>X</div></div>`)
          this.player2div.append(`<div class="stack"><div>X</div><div>X</div><div>X</div></div>`)

          this.turn([card1, card2, ...stack1, ...stack2, ...cards])
        }
      }, 500)
    }

    // console.log(`Player 1 has ${this.player1.cardCount} cards left`)
    this.player1cardsleft.html(this.player1.cardCount)
    // console.log(`Player 2 has ${this.player2.cardCount} cards left`)
    this.player2cardsleft.html(this.player2.cardCount)

    if (this.player1.cardCount === 0) {
      // console.log('Player 2 Wins!')
      this.message.html('Computer wins!!')
      this._status = 'finished'
      return;
    } else if (this.player2.cardCount === 0) {
      // console.log('Player 1 Wins!')
      this.message.html('Player Wins!!')
      this._status = 'finished'
      return;
    }
  }
}

var deck = new Deck()
var player = new Player()
var computer = new Player()
var game

function startGame() {
  deck.shuffle()
  deck.deal(player, computer)

  game = new War(player, computer)
  game.turn()
}

$(document).ready(function(){
  $("#play").on('click', function(){
    if (game && game.status === 'playing') {
      console.log('playing')
      game.turn()
    } else {
      console.log('starting')
      startGame()
    }
  })
})
