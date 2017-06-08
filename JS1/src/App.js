import React, { Component } from 'react';
import './App.css';

import ReactSVG from 'react-svg'

class App extends Component {
  constructor(props){
    super(props)
    
    this.alphabet = [
      "A", "B", "C", "D", "E",
      "F", "G", "H", "I", "J",
      "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T",
      "U", "V", "W", "X", "Y", "Z" ]
    this.word = ["c", "a", "t"]
    this.hint = [ "_", "_", "_"]
    this.guessesLeft = 8
    this.state = {
      alphabet: this.alphabet,
      guessesLeft: this.guessesLeft,
      hintDisplay: this.hint.join(" ")
    }
    this.newGame = this.newGame.bind(this)
  }

  newGame() {
    // removeHangman()
    this.alphabet = [
      "A", "B", "C", "D", "E",
      "F", "G", "H", "I", "J",
      "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T",
      "U", "V", "W", "X", "Y", "Z" ]
    this.word = ["c", "a", "t"]
    this.hint = [ "_", "_", "_"]
    this.guessesLeft = 8
    this.setState({
      alphabet: this.alphabet,
      guessesLeft: this.guessesLeft,
      hintDisplay: this.hint.join(" ")
    })
  }

  userGuess( event ) {
    let letter = event.target.value
    event.target.value = ""
    if (this.guessesLeft <= 0) {
      console.log("No more guesses, you lose...")
    }
    if(!this.alphabet.includes(letter.toUpperCase())) {
      if (letter !== "") {
        // Do nothing (no penalty).
        console.log("You already guessed that!")
        event.target.value = ""
        return
      }
    }
    else if (this.guessesLeft >= 1) {
      this.guessesLeft--
      this.setState({
      guessesLeft: this.guessesLeft
    })
      if (this.word.includes(letter)) {
        for (let i = 0; i < this.word.length; i ++)
          if ( this.hint[i] === "_" && this.word[i] === letter)
            this.hint[i] = letter.toUpperCase()
        this.setState({
          hintDisplay: this.hint.join(" ")
        })
      }
      else {}
        // addToHangman()
      this.alphabet.splice(this.alphabet.indexOf(letter.toUpperCase()), 1)
      this.setState({
        alphabet: this.alphabet
      })
    }
    if (JSON.stringify(this.hint) == 
        JSON.stringify(this.word.map(letter => letter.toUpperCase())))
      console.log("You got it! Good job.")
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h2>Hangman Game</h2>
        </div>
        <div className="intro">
          <p>To get started, edit <code>src/App.js</code> and save to reload.</p>
          <p>There are some placeholder elements setup that need implementation.</p>
        </div>
        <div className="main">
          <ReactSVG path="hangman.svg"/>
          <div className="game-controls">
            <button onClick={this.newGame}>New Game</button>
            <div className="remaining-alphabet">{this.state.alphabet}</div>
            <div className="guess-left">{this.state.guessesLeft}</div>
            <input type="text" onChange={this.userGuess.bind(this)} placeholder="Guess a letter..."/>
            <div className="puzzle-word">{this.state.hintDisplay}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
