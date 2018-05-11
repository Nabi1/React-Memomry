import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, { FAKE_HOF } from './HallOfFame'


const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: this.generateCards(),
            currentPair: [],
            guesses: 0,
            matchedCardIndices: []
        }
    }

/*
======== Mes FONCTIONS =======
*/
    generateCards() {
        const result = []
        const size = SIDE * SIDE
        const candidates = shuffle(SYMBOLS)
        while (result.length < size) {
            const card = candidates.pop()
            result.push(card, card)
        }
        return shuffle(result)
    }

    handleCardClick = (index) => {
        const { currentPair } = this.state
        // Ici on desctructure currentPair
        // La const ci-dessus préfixe currentPair par this.state
        // Cela évite de toujours écrire dans notre fonction
        // this.state.currentPair
        if (currentPair.length === 2) {
            return
        }
        if (currentPair.length === 0) {
            this.setState({
                currentPair: [index]
            })
            return
        }
        this.handleNewPairClosedBy(index)
    }

// Ci-dessous pas debsoin d'une fonction fléché car pas besoin de bind le this
    getFeedBackForCard(index) {
        const { currentPair,matchedCardIndices } = this.state
        const indexMatched = matchedCardIndices.includes(index)

        if (currentPair.length < 2) {
            return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
        }
        if (currentPair.includes(index)) {
            return indexMatched ? 'justMatched' : 'justMismatched'
        }
        return indexMatched ? 'visible' : 'hidden'
    }

    handleNewPairClosedBy(index) {
      const { cards, currentPair, guesses, matchedCardIndices} = this.state
        const newPair = [currentPair[0], index]
        const newGuesses = guesses + 1
        const matched = cards[newPair[0]] === cards[newPair[1]]
        this.setState({
            currentPair: newPair,
            guesses: newGuesses
        })
        if (matched) {
            this.setState({
                matchedCardIndices: [...matchedCardIndices, ...newPair]
            })
        }
        setTimeout(() => this.setState({
            currentPair: []
        }), 800)
    }

/*
Les compansants situés dans le render() sont les composants enfants du composant 
qui fournit le render(). Ici App est le parent de GuessCount, Card te HallOfFame. Vrai?
*/
    render() {
      const {cards, guesses, matchedCardIndices } = this.state;
      // La const ci-dessus permet d'écrire dans le render
      // card au lieu de this.state.card. C'est comme si je préfixé mes states
      // dès le début du render pour le rendre ensuite plus léger.
      // Code plus léger mais moins lisible à mon goût
      // Bonne pratique ? Est-ce bien de la Destructuration?
      const won = matchedCardIndices.length === cards.length
    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
      <Card 
        card= {card} 
        feedback = {this.getFeedBackForCard(index)} 
        index = {index}
        key= {index} 
        onClick={this.handleCardClick}
      />
          ))}
        
        {won &&  <HallOfFame entries={FAKE_HOF}/>}
      </div>
    )
  }
}

export default App
