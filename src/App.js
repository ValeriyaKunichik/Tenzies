import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [countTries, setCountTries] = React.useState(1)
    
    const [bingo, setBingo] = React.useState(false)
    if(!localStorage.getItem('minScore')){     
             localStorage.setItem('minScore', JSON.stringify(100)) 
    }
    
    const [minScore, setMinScore]=React.useState(JSON.parse(localStorage.getItem('minScore')));

    React.useEffect(() => {
    
      if(tenzies&&countTries<minScore) {
        localStorage.setItem('minScore', JSON.stringify(countTries))
        setMinScore(countTries)
        setBingo(true)         
      }
  }, [tenzies, countTries, minScore])
  
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)        
        }
    }, [dice])

    

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
      setBingo(false)
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setCountTries(oldCount=>oldCount+1)
        } else {         
            setTenzies(false)
            setDice(allNewDice())
            setCountTries(1)
            setBingo(false)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            {tenzies? <h1 className="title">Congratz! You won!</h1>:<h1 className="title">Tenzies</h1>}
            {bingo?<div>THIS IS THE BEST SCORE SO FAR!</div>:tenzies ? <p className="instructions">Click "New Game" to start over</p>:<p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls. Best score: {minScore} </p>}           
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div>{countTries}</div>
            
        </main>
    )
}