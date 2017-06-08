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
    this.state = this.initGame()

    //bind the event listeners the the App class
    this.newGame = this.newGame.bind(this)
    this.userGuess = this.userGuess.bind(this)
  }

  //needed to style the svg element initially
  componentDidMount() {
    this.newGame()
  }

  //sets up the initial state
  initGame() {
    let newWord = randomWord().toUpperCase().split('')

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

  //resets the game
  newGame() {
    this.setState(this.initGame())
  }

  //handles user input in the input box
  userGuess(event) {
    let letter = event.target.value.toUpperCase()
    event.target.value = ""

    if (this.state.guessesLeft <= 0) {
      this.setState({info: "No more guesses, you lose..."})
    } else if (this.state.isSolved) {
      this.setState({info: "You already won! Click new game button."})
    } else {
      if (letter.match(/[A-Z]/)) {
        if (this.state.alphabet.includes(letter)) {
          let guessesLeft = this.state.word.includes(letter) ? this.state.guessesLeft:this.state.guessesLeft-1
          this.setState({
            alphabet: this.state.alphabet.filter((alpha) => alpha !== letter),
            guesses: this.state.guesses.map(
              (guess, i) => guess !== '_' ? guess : (this.state.word[i] === letter ? letter : '_')),
            guessesLeft: guessesLeft,
            info: `You guessed ${letter}.`,
            hangmanStyle: this.renderHangman(guessesLeft)
          })
        } else {
          this.setState({info: "You already guessed that!"})
        }
      } else {
        this.setState({info: "Not a letter. Enter somthing between a and z."})
      }
    }

    // if (!this.alphabet.includes(letter.toUpperCase())) {
    //   if (letter !== "") {
    //     // Do nothing (no penalty).
    //     console.log("You already guessed that!")
    //     event.target.value = ""
    //     return
    //   }
    // } else if (this.guessesLeft >= 1) {
    //   this.setState({guessesLeft: this.guessesLeft--})
    //   if (this.word.includes(letter)) {
    //     for (let i = 0; i < this.word.length; i++)
    //       if (this.hint[i] === "_" && this.word[i] === letter)
    //         this.hint[i] = letter.toUpperCase()
    //   this.setState({hintDisplay: this.hint.join(" ")})
    //   } else {}
    //   // addToHangman()
    //   this.alphabet.splice(this.alphabet.indexOf(letter.toUpperCase()), 1)
    //   this.setState({alphabet: this.alphabet})
    // }
    // if (JSON.stringify(this.hint) == JSON.stringify(this.word.map(letter => letter.toUpperCase())))
    //   console.log("You got it! Good job.")
  }

  //update the hangman svg sytle
  //returns a new hangman style using react svg style props
  renderHangman(guessesLeft) {
    let headStyleShow = {
      ...this.headStyle,
      "fillOpacity": "1",
      "strokeOpacity": "1"
    }
    let pathStyleShow = {
      ...this.pathStyle,
      "strokeOpacity": "1"
    }

    let hangmanStyle = this.state.hangmanStyle

    for (let partsToShow = 8 - guessesLeft; partsToShow > 0; partsToShow--) {
      switch (partsToShow) {
        case 1:
          hangmanStyle.post = pathStyleShow
          break
        case 2:
          hangmanStyle.head = headStyleShow
          break
        case 3:
          hangmanStyle.body = pathStyleShow
          break
        case 4:
          hangmanStyle.leftArm = pathStyleShow
          break
        case 5:
          hangmanStyle.rightArm = pathStyleShow
          break
        case 6:
          hangmanStyle.leftLeg = pathStyleShow
          break
        case 7:
          hangmanStyle.rightLeg = pathStyleShow
          break
        case 8:
          hangmanStyle.noose = pathStyleShow
          break
        default:
      }
    }
    return hangmanStyle
  }

  componentDidUpdate() {
    if (!this.state.isSolved && this.state.word.every((word, i) => word === this.state.guesses[i])) {
      this.setState({isSolved: true, info: "You got it! Good job."})
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
            <button onClick={this.newGame}>New Game</button>
            <div style={{
              textAlign: "center"
            }}>
              <h4>Remaining Letters:</h4>
              <div className="remaining-alphabet">
                {this.state.alphabet.map((alpha) => " " + alpha + " ")}
              </div>
            </div>
            <input type="text" style={{
              width: "100px"
            }} onChange={this.userGuess} placeholder="Guess a letter..."/>
            <div style={{
              textAlign: "center"
            }}>
              <h4>Guesses:</h4>
              <div className="puzzle-word">
                {this.state.guesses.map((guess) => " " + guess + " ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
