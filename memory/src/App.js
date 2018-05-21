// React
import React, { Component } from "react";
import shuffle from "lodash.shuffle";

// CSS
import "./App.css";

// Components
import Card from "./Card";
import GuessCount from "./GuessCount";
import HallOfFame, { FAKE_HOF } from "./HallOfFame";
import HighScoreInput from "./HighScoreInput";

const SIDE = 6;
const SYMBOLS = "😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿";
const VISUAL_PAUSE_MSEC = 800;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: this.generateCards(),
      currentPair: [],
      guesses: 0,
      hallOfFame: null,
      matchedCardIndices: []
    };
  }

  /*
======== Mes FONCTIONS =======
*/
  generateCards() {
    const result = [];
    const size = SIDE * SIDE;
    const candidates = shuffle(SYMBOLS);
    while (result.length < size) {
      const card = candidates.pop();
      result.push(card, card);
    }
    return shuffle(result);
  }

  handleCardClick = index => {
    const { currentPair } = this.state;
    if (currentPair.length === 2) {
      return;
    }
    if (currentPair.length === 0) {
      this.setState({
        currentPair: [index]
      });
      return;
    }
    this.handleNewPairClosedBy(index);
  };

  // Ci-dessous pas debsoin d'une fonction fléché car pas besoin de bind le this
  getFeedBackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state;
    const indexMatched = matchedCardIndices.includes(index);

    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? "visible" : "hidden";
    }
    if (currentPair.includes(index)) {
      return indexMatched ? "justMatched" : "justMismatched";
    }
    return indexMatched ? "visible" : "hidden";
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state;
    const newPair = [currentPair[0], index];
    const newGuesses = guesses + 1;
    const matched = cards[newPair[0]] === cards[newPair[1]];
    this.setState({
      currentPair: newPair,
      guesses: newGuesses
    });
    if (matched) {
      this.setState({
        matchedCardIndices: [...matchedCardIndices, ...newPair]
      });
    }
    setTimeout(
      () =>
        this.setState({
          currentPair: []
        }),
      VISUAL_PAUSE_MSEC
    );
  }
  displayHallOfFame = hallOfFame => {
    this.setState({
      hallOfFame
    });
  };

  /*
Les compansants situés dans le render() sont les composants enfants du composant 
qui fournit le render(). Ici App est le parent de GuessCount, Card te HallOfFame. Vrai?
*/
  render() {
    const { cards, guesses, matchedCardIndices, hallOfFame } = this.state;
/*     const won = matchedCardIndices.length === cards.length;
 */    const won = matchedCardIndices.length === 2;

    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
          <Card
            card={card}
            feedback={this.getFeedBackForCard(index)}
            index={index}
            key={index}
            onClick={this.handleCardClick}
          />
        ))}
        {won &&
          (hallOfFame ? (
            <HallOfFame entries={hallOfFame} />
          ) : (
            <HighScoreInput
              guesses={guesses}
              onStored={this.displayHallOfFame}
            />
          ))}
      </div>
    );
  }
}

export default App;
