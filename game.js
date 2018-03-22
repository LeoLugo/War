import {War, Player, Deck} from './war'
import $ from 'jquery'
import moment from 'moment'

var deck = new Deck()
var player = new Player()
var computer = new Player()
var game

function startGame() {
  console.log(moment())
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
