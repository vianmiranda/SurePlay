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

function americanToDecimal(odd: string) {
    var floatOdds = parseFloat(odd)
    return floatOdds < 0 ? ((100 / Math.abs(floatOdds)) + 1) : ((floatOdds / 100) + 1)
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
                    const fetchURL = URL + "betAmountO1/" + americanToDecimal(odds1) + "&" + americanToDecimal(odds2) + "&" + stake1
                    console.log(fetchURL)
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
                    const fetchURL = URL + "betAmountO2/" + americanToDecimal(odds1) + "&" + americanToDecimal(odds2) + "&" + stake2
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
                const fetchURL = URL + "budget/" + americanToDecimal(odds1) + "&" + americanToDecimal(odds2) + "&" + budget
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
            <div className="odds">
                <label>
                    <img src={dice_blue} height="50" width="50" />
                    <input 
                        type="number" 
                        value={odds1} 
                        onChange={(e) => {
                            setOdds1(e.target.value)
                            setFilledLabels(filledLabels + isValidForm(odds1, e.target.value))
                            if (e.target.value.length === 0) {
                                setResponse({
                                    value1: 0,
                                    value2: 0,
                                    budget: 0,
                                    profit1: 0,
                                    profit2: 0,
                                    percent_profit: 0,
                                })
                            }
                        }} 
                        placeholder = "+/-" 
                        required />
                </label>
                <br />

                <label>
                    <input 
                        type="number" 
                        value={odds2} 
                        onChange={(e) => {
                            setOdds2(e.target.value)
                            setFilledLabels(filledLabels + isValidForm(odds2, e.target.value))
                            if (e.target.value.length === 0) {
                                setResponse({
                                    value1: 0,
                                    value2: 0,
                                    budget: 0,
                                    profit1: 0,
                                    profit2: 0,
                                    percent_profit: 0,
                                })
                            }
                        }} 
                        placeholder = "+/-" 
                        required />
                    <img src={dice_red} height="50" width="50" className="red_dice"/>
                </label>
                <br />
            </div>

            <div className="stakes">
                <label>
                    <img src={stake_blue} height="50" width="50" />
                    <input
                        type="number"
                        placeholder = "$"
                        value={stake1 || (response.value1 == 0 ? "" : response.value1.toFixed(2))}
                        onChange={(e) => {
                            setStake1(e.target.value)
                            setFilledLabels(filledLabels + isValidForm(stake1, e.target.value))
                            if (e.target.value.length === 0) {
                                setResponse({
                                    value1: 0,
                                    value2: 0,
                                    budget: 0,
                                    profit1: 0,
                                    profit2: 0,
                                    percent_profit: 0,
                                })
                            }
                        }}
                        disabled={!!budget || !!stake2}
                    />
                </label>
                <br />

                <label>
                    <input
                        type="number"
                        placeholder="$"
                        value={stake2 || (response.value2 == 0 ? "" : response.value2.toFixed(2))}
                        onChange={(e) => {
                            setStake2(e.target.value)
                            setFilledLabels(filledLabels + isValidForm(stake2, e.target.value))
                            if (e.target.value.length === 0) {
                                setResponse({
                                    value1: 0,
                                    value2: 0,
                                    budget: 0,
                                    profit1: 0,
                                    profit2: 0,
                                    percent_profit: 0,
                                })
                            }
                        }}
                        disabled={!!budget || !!stake1}
                    />
                    <img src={stake_red} height="50" width="50" className = "red_stake" />
                </label>
                <br />
            </div>
            
            <div className="budget">
                <label>
                    <input
                        type="number"
                        placeholder="$"
                        value={budget || (response.budget == 0 ? "" : response.budget.toFixed(2))}
                        onChange={(e) => {
                            setBudget(e.target.value)
                            setFilledLabels(filledLabels + isValidForm(budget, e.target.value))
                            if (e.target.value.length === 0) {
                                setResponse({
                                    value1: 0,
                                    value2: 0,
                                    budget: 0,
                                    profit1: 0,
                                    profit2: 0,
                                    percent_profit: 0,
                                })
                            }
                        }}
                        disabled={!!stake1 || !!stake2}
                    />
                </label>
                <br />
            </div>

            <div className="budget_image">
                <img src={budget_black} height="50" width="50" />
            </div>
            <button type="submit" disabled={filledLabels < 3}>Submit</button>
        </form>

        <h2>{error}</h2>

        {response && (
            <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
                <h3>Summary of your betting</h3>
                <p>With a budget of ${response.budget.toFixed(2)}, ${response.value1.toFixed(2)} on odds {parseFloat(odds1) >= 0 ? "+" + (odds1 || "0") : (odds1 || "0")}, and ${response.value2.toFixed(2)} on odds {parseFloat(odds2) >= 0 ? "+" + (odds2 || "0") : (odds2 || "0")}: </p>
                <p>You will turn a ${response.profit1.toFixed(2)} {response.profit1 < 0 ? "loss" : "profit"}</p>
                <p>Overall, these odds {response.percent_profit < 0 ? "do not have an arbitrage opportunity" : "do have an arbitrage opportunity with the chance to profit " + response.percent_profit.toFixed(2) + "%"}</p>
            </div>
        )}
        </div>
    )
}

export default Calculator;