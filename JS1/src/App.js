import React, {Component} from 'react'
import randomWord from 'random-words'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.headStyle = {
      "fill": "none",
      "fillOpacity": "0",
      "fillRule": "nonzero",
      "stroke": "#000000",
      "strokeWidth": "2",
      "strokeLinecap": "round",
      "strokeLinejoin": "round",
      "strokeMiterlimit": "4",
      "strokeDasharray": "none",
      "strokeDashoffset": "90",
      "strokeOpacity": "0"
    }
    this.pathStyle = {
      "fill": "none",
      "fillRule": "evenodd",
      "stroke": "#000000",
      "strokeWidth": "2",
      "strokeLinecap": "round",
      "strokeLinejoin": "round",
      "strokeMiterlimit": "4",
      "strokeDasharray": "none",
      "strokeOpacity": "0"
    }

    //sets the initial game state
    //TODO right now the game is setup twice because of how the svg style
    //property is set, this could be fixed to only need to init once
    this.state = this.initialState()

    //bind the event listeners the the App class
    this.resetGame = this.resetGame.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  //needed to style the svg element initially
  componentDidMount() {
    this.resetGame()
  }

  initialState() {
    const newWord = randomWord().toUpperCase().split('')

    return {
      alphabet: [
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N",
        "O","P","Q","R","S","T","U","V","W","X","Y","Z"
      ],
      word: newWord,
      guesses: newWord.map(() => "_"),
      guessesLeft: 8,
      isSolved: false,
      info: "Guess a letter to start playing!",
      hangmanStyle: {
        post: this.pathStyle,
        head: this.headStyle,
        body: this.pathStyle,
        leftArm: this.pathStyle,
        rightArm: this.pathStyle,
        leftLeg: this.pathStyle,
        rightLeg: this.pathStyle,
        noose: this.pathStyle
      }
    }
  }

  resetGame() {
    this.setState(this.initialState())
  }

  handleInput(event) {
    const inputLetter = event.target.value.toUpperCase()

    // remove guess from input box so we never have more than one letter
    // (after recording the input value above!)
    event.target.value = ""

    // local variables to simplify code below
    const hasGuessesLeft = this.state.guessesLeft > 0
    const isSolved = this.state.isSolved

    if ( isSolved && hasGuessesLeft ) {
      this.setState( {info: "You already won! Click the [New Game] button to play again."} )
    } 
    else if ( hasGuessesLeft ) {
      // local variables to simplify code below
      const alphabet = this.state.alphabet
      const inAlphabet = alphabet.includes(inputLetter)
      const isLetter = inputLetter.match(/[A-Z]/)

      if ( isLetter && inAlphabet ) {
        // local variables to simplify code below
        const guesses = this.state.guesses
        const guessesLeft = this.state.guessesLeft
        const word = this.state.word

        // calculate updates
        const alphabetNow = alphabet.filter( char => char !== inputLetter )
        const guessesNow = guesses.map( (guess, i) => {
            const letterIfMatch = inputLetter === word[i] ? inputLetter : '_'
            return guess === '_' ? letterIfMatch : guess
          })
        const guessesLeftNow = 
            word.includes(inputLetter) ? guessesLeft : guessesLeft - 1

        this.setState({
          alphabet: alphabetNow,
          guesses: guessesNow,
          guessesLeft: guessesLeftNow,
          info: `You guessed ${inputLetter}.`,
          hangmanStyle: this.newHangman(guessesLeftNow)
          })
      } 
      else if ( isLetter ) {
        this.setState({info: "You already guessed that!"})
      }
      else {
        this.setState({info: "Not a letter. Please choose a letter."})
      }
    }
  }

  //returns a new hangman style using react svg style props
  newHangman(guessesLeft) {
    // assign local variables to simplify the code below
    let headStyle = {
      ...this.headStyle,
      "fillOpacity": "1",
      "strokeOpacity": "1"
    }
    let pathStyle = {
      ...this.pathStyle,
      "strokeOpacity": "1"
    }
    let hangmanStyle = this.state.hangmanStyle

    for (let partsToShow = 8 - guessesLeft; partsToShow > 0; partsToShow--) {
      switch (partsToShow) {
        case 1:
          hangmanStyle.post = pathStyle
          break
        case 2:
          hangmanStyle.head = headStyle
          break
        case 3:
          hangmanStyle.body = pathStyle
          break
        case 4:
          hangmanStyle.leftArm = pathStyle
          break
        case 5:
          hangmanStyle.rightArm = pathStyle
          break
        case 6:
          hangmanStyle.leftLeg = pathStyle
          break
        case 7:
          hangmanStyle.rightLeg = pathStyle
          break
        case 8:
          hangmanStyle.noose = pathStyle
          break
        default: // this is included to avoid a console warning
      }
    }
    return hangmanStyle
  }

  componentDidUpdate() {
    // assign local variables to make the code below easier to read
    const guesses = this.state.guesses
    const guessesLeft = this.state.guessesLeft
    const notSolved = !this.state.isSolved
    const word = this.state.word
    const guessMatchesWord = word.every((letter, i) => letter === guesses[i])

    if (notSolved && guessMatchesWord) {
      this.setState({isSolved: true, info: "You got it. Good job!"})
    }
    else if (guessesLeft === 0) {
      this.setState({
        info: `No more guesses. Too bad. (The word was ${word.join('')}.)`,
        guessesLeft: -1
        })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>Hangman Game</h1>
        </div>
        <div className="info">
          <h2>{this.state.info}</h2>
        </div>
        <div className="main">
          <svg width="400" height="400">
            <g transform="translate(0,-652.36216)">
              <path d="m 394.84135,1051.0482 0,-392.87205 -288.10616,0" id="path4686" style={this.state.hangmanStyle.post}/>
              <circle id="path4690" cx="106.70226" cy="743.41754" r="44.357868" style={this.state.hangmanStyle.head}/>
              <path d="m 106.73519,789.13348 0,124.40948" id="path4692" style={this.state.hangmanStyle.body}/>
              <path d="m 106.73519,815.32495 39.28721,19.6436 0,0" id="path4694" style={this.state.hangmanStyle.leftArm}/>
              <path d="m 67.44799,834.96855 39.2872,-19.6436" id="path4696" style={this.state.hangmanStyle.rightArm}/>
              <path d="m 106.73519,913.54296 39.28721,39.28721" id="path4698" style={this.state.hangmanStyle.leftLeg}/>
              <path d="m 67.44799,952.83017 39.2872,-39.28721" id="path4700" style={this.state.hangmanStyle.rightLeg}/>
              <path d="m 106.73519,658.17615 0,39.28719" id="path4702" style={this.state.hangmanStyle.noose}/>
            </g>
          </svg>
          <div className="game-controls">
            <button onClick={this.resetGame}>New Game</button>
            <div style={{
              textAlign: "center"
            }}>
              <h4>Remaining Letters:</h4>
              <div className="remaining-alphabet">
                {this.state.alphabet.map((letter) => " " + letter + " ")}
              </div>
            </div>
            <input type="text" style={{
              width: "100px"
            }} onChange={this.handleInput} placeholder="Guess a letter"/>
            <div style={{
              textAlign: "center"
            }}>
              <h4>Guesses:</h4>
              <div className="puzzle-word">
                {this.state.guesses.map((letter) => " " + letter + " ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
