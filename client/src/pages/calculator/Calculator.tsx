import React, { useState, useEffect } from 'react'
import './Calculator.css'

import dice_red from '../../assets/dice_red.png.png'
import dice_blue from '../../assets/dice_blue.png.png'
import stake_red from '../../assets/stake_red.png.png'
import stake_blue from '../../assets/stake_blue.png.png'
// import budget_black from '../../assets/budget.png'

// JSON structure to be returned from backend. 
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

/**
 * Since the calculator can be accessed from the arbitrage page with prefilled
 * odds, we need to parse the URL for the odds.
 * 
 * Example of a URL with prefilled odds:
 * http://localhost:5173/calculator/?odds1=+190&odds2=-110
 * 
 * @returns an array of two strings, the first being the first odds and the 
 * second being the second odds.
 */
function parseURLforOdds(): (string | undefined)[] {
    const searchParams = new URLSearchParams(window.location.search);

    var odds1 = searchParams.get('odds1')?.trim();
    var odds2 = searchParams.get('odds2')?.trim();

    return [odds1, odds2];
}

/**
 * Main function for Calculator page.
 * 
 * @returns Calculator page.
 */
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

    // If the calculator is being accessed from the arbitrage page, then we need
    // to parse the URL for the odds and prefill them. This is optional and will
    // still function without the odds being prefilled in the URL.
    var presetOdds : (string | undefined)[] = parseURLforOdds();
    useEffect(() => {
        if (presetOdds[0] !== undefined) {
            setOdds1(presetOdds[0]);
            setFilledLabels(1);
        } if (presetOdds[1] !== undefined) {
            setOdds2(presetOdds[1]);
            setFilledLabels(2);
        }
    }, []);

    // Where backend is hosted.
    const URL = import.meta.env.VITE_CALC_URL || 'http://localhost:3000/calc/'

    // Handles form submission.
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Odds 1:', odds1);
        console.log('Odds 2:', odds2);
        console.log('Stake 1:', stake1);
        console.log('Stake 2:', stake2);
        console.log('Budget:', budget);

        // Handle invalid input.
        if (stake1 == "" && stake2 == "" && budget == "") {
            console.log("Invalid input -- please enter either at least a stake or a budget")
        }

        // Handle if no budget was entered.
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

        // Handle if budget was entered.
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

    // Handles the counting of the number of filled labels.
    function isValidForm(original: string, value: string) {
        if (original.length > 0 && value.length == 0) return -1;
        else if (original.length == 0 && value.length > 0) return 1;
        else return 0;
    }

    // Assembles the calculator with the form and the response.
    return (
        <div className="entireCalculator">
            <h1>Arbitrage Calculator</h1>
            <form onSubmit={handleSubmit}>
                <div className="odds">
                    <label>
                        <img src={dice_blue} height="50" width="50" className="blue_dice form_image"/>
                        <input 
                            type="number" 
                            value={odds1} 
                            onChange={(e) => {
                                setFilledLabels(filledLabels + isValidForm(odds1, e.target.value))
                                setOdds1(e.target.value)
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
                            placeholder = "(+/-) Odds 1" 
                            required />
                    </label>
                    <br />

                    <label>
                        <input 
                            type="number" 
                            value={odds2} 
                            onChange={(e) => {
                                setFilledLabels(filledLabels + isValidForm(odds2, e.target.value))
                                setOdds2(e.target.value)
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
                            placeholder = "(+/-) Odds 2" 
                            required />
                        <img src={dice_red} height="50" width="50" className="red_dice form_image"/>
                    </label>
                    <br />
                </div>

                <div className="stakes">
                    <label>
                        <img src={stake_blue} height="50" width="50" className="blue_stake form_image"/>
                        <input
                            type="number"
                            placeholder = "($) Stake 1"
                            value={stake1 || (response.value1 == 0 ? "" : response.value1.toFixed(2))}
                            onChange={(e) => {
                                setFilledLabels(filledLabels + isValidForm(stake1, e.target.value))
                                setStake1(e.target.value)
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
                            placeholder="($) Stake 2"
                            value={stake2 || (response.value2 == 0 ? "" : response.value2.toFixed(2))}
                            onChange={(e) => {
                                setFilledLabels(filledLabels + isValidForm(stake2, e.target.value))
                                setStake2(e.target.value)
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
                        <img src={stake_red} height="50" width="50" className = "red_stake form_image" />
                    </label>
                    <br />
                </div>
                
                <div className="budget">
                    <label>
                        <input
                            type="number" 
                            placeholder="($) Budget"
                            value={budget || (response.budget == 0 ? "" : response.budget.toFixed(2))}
                            onChange={(e) => {
                                setFilledLabels(filledLabels + isValidForm(budget, e.target.value))
                                setBudget(e.target.value)
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

                {/* <div className="budget_image form_image">
                    <img src={budget_black} height="50" width="50" />
                </div> */}
                <button type="submit" disabled={filledLabels < 3}>Calculate</button>
            </form>

            <h2>{error}</h2>

            {response && (
                <div className={"summary " + (response.percent_profit == 0 ? "" : (response.percent_profit < 0 ? "arb_no" : "arb_yes"))}>
                    <h3>{(response.percent_profit <= 0 ? "No Arbitrage Opportunity" : "Arbitrage Opportunity Present")}</h3>
                    <p>${response.value1.toFixed(2)} at {parseFloat(odds1) >= 0 ? "+" + (odds1 || "0") : (odds1 || "0")}</p>
                    <p>${response.value2.toFixed(2)} at {parseFloat(odds2) >= 0 ? "+" + (odds2 || "0") : (odds2 || "0")}</p>
                    <p>Budget: ${response.budget.toFixed(2)}</p>
                    <hr className="spacing"></hr>
                    <p><b>Profit: </b>${response.profit1.toFixed(2)}</p>
                    <p><b>Profit Margin: </b>{response.percent_profit.toFixed(2) + "%"}</p>
                </div>
            )}
        </div>
    )
}

export default Calculator;