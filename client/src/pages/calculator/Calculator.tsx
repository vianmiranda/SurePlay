import React, { useState, useEffect } from 'react'
import './calculator.css'

import dice_red from '../../assets/dice_red.png.png'
import dice_blue from '../../assets/dice_blue.png.png'
import stake_red from '../../assets/stake_red.png.png'
import stake_blue from '../../assets/stake_blue.png.png'
import budget_black from '../../assets/budget.png'

interface Bets {
    value1: number
    value2: number
    budget: number
    profit1: number
    profit2: number
    percent_profit: number
}

function Calculator() {
    const [odds1, setOdds1] = useState('');
    const [odds2, setOdds2] = useState('');
    const [stake1, setStake1] = useState('');
    const [stake2, setStake2] = useState('');
    const [budget, setBudget] = useState('');
    const [response, setResponse] = useState<Bets>({
        value1: 0,
        value2: 0,
        budget: 0,
        profit1: 0,
        profit2: 0,
        percent_profit: 0,
    });

    const [filledLabels, setFilledLabels] = useState<number>(0);
    const [error, setError] = useState<any>('');

    const URL = 'http://localhost:3000/calc/'

    useEffect(() => {
        console.log(response);
    }, [response]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Odds 1:', odds1);
        console.log('Odds 2:', odds2);
        console.log('Stake 1:', stake1);
        console.log('Stake 2:', stake2);
        console.log('Budget:', budget);

        // handle invalid input
        if (stake1 == "" && stake2 == "" && budget == "") {
            console.log("Invalid input -- please enter either at least a stake or a budget")
        }

        // if no budget was entered
        if (budget == "") {
            if (stake1 == "" && stake2 == "") {
                var err = "Please enter at least one stake/budget"
                setError(err)
                console.log(err)
            }
            else if (stake1 != "") {
                try {
                    const fetchURL = URL + "betAmountO1/" + odds1 + "&" + odds2 + "&" + stake1
                    const response = await fetch(fetchURL, {method: 'POST'})
                    if (!response.ok) {
                        throw new Error('Could not fetch data')
                    }

                    const data = await response.json() as Bets
                    setResponse(data)
                }
                catch (error) {
                    console.error("Error fetching data:", error)
                    setError(error)
                }
            }
            else {
                try {
                    const fetchURL = URL + "betAmountO2/" + odds1 + "&" + odds2 + "&" + stake2
                    const response = await fetch(fetchURL, {method: 'POST'})
                    if (!response.ok) {
                        throw new Error('Could not fetch data')
                    }

                    const data = await response.json() as Bets
                    setResponse(data)
                }
                catch (error) {
                    console.error("Error fetching data:", error)
                    setError(error)
                }
            }
        }

        // budget was entered
        else {
            try {
                const fetchURL = URL + "budget/" + odds1 + "&" + odds2 + "&" + budget
                const response = await fetch(fetchURL, {method: 'POST'})
                if (!response.ok) {
                    throw new Error('Could not fetch data')
                }

                const data = await response.json() as Bets
                setResponse(data)
            }
            catch (error) {
                console.error("Error fetching data:", error)
                setError(error)
            }
        }
    };

    function isValidForm(original: string, value: string) {
        if (original.length > 0 && value.length == 0) return -1;
        else if (original.length == 0 && value.length > 0) return 1;
        else return 0;
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label>
                <img src={dice_blue} height="50" width="50" />
                Odds 1:
                <input 
                    type="number" 
                    value={odds1} 
                    onChange={(e) => {
                        setOdds1(e.target.value)
                        setFilledLabels(filledLabels + isValidForm(odds1, e.target.value))
                    }} 
                    placeholder = "+/-" 
                    required />
            </label>
            <br />

            <label>
                <img src={dice_red} height="50" width="50" />
                Odds 2:
                <input 
                    type="number" 
                    value={odds2} 
                    onChange={(e) => {
                        setOdds2(e.target.value)
                        setFilledLabels(filledLabels + isValidForm(odds2, e.target.value))
                    }} 
                    placeholder = "+/-" 
                    required />
            </label>
            <br />

            <label>
                <img src={stake_blue} height="50" width="50" />
                Stake 1:
                <input
                    type="number"
                    placeholder = "$"
                    value={stake1}
                    onChange={(e) => {
                        setStake1(e.target.value)
                        setFilledLabels(filledLabels + isValidForm(stake1, e.target.value))
                    }}
                    disabled={!!budget || !!stake2}
                />
            </label>
            <br />

            <label>
                <img src={stake_red} height="50" width="50" />
                Stake 2:
                <input
                    type="number"
                    placeholder="$"
                    value={stake2}
                    onChange={(e) => {
                        setStake2(e.target.value)
                        setFilledLabels(filledLabels + isValidForm(stake2, e.target.value))
                    }}
                    disabled={!!budget || !!stake1}
                />
            </label>
            <br />

            <label>
                <img src={budget_black} height="50" width="50" />
                Budget:
                <input
                    type="number"
                    placeholder="$"
                    value={budget}
                    onChange={(e) => {
                        setBudget(e.target.value)
                        setFilledLabels(filledLabels + isValidForm(budget, e.target.value))
                    }}
                    disabled={!!stake1 || !!stake2}
                />
            </label>
            <br />
            <button type="submit" disabled={filledLabels < 3}>Submit</button>
        </form>

        <h2>{error}</h2>

        {response && (
            <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
                <h3>Fetched Response</h3>
                <p>Value 1: {response.value1}</p>
                <p>Value 2: {response.value2}</p>
                <p>Budget: {response.budget}</p>
                <p>Profit 1: {response.profit1}</p>
                <p>Profit 2: {response.profit2}</p>
                <p>Percent Profit: {response.percent_profit}</p>
            </div>
        )}
        </div>
    )
}

export default Calculator;