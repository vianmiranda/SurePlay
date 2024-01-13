import { useState, useEffect } from 'react';
import {ArbitrageOpportunities, ArbitrageTable} from './components/ArbitrageTable';
import './Arbitrage.css';
import jsonData from './arbitrage_opps.json';

interface Sports {
    sport: string
    games: {
        home_team: string;
        away_team: string;
        start_time: string;
        arbitrage_opportunities: {
            key: {
                bookmaker: string;
                name: string;
                probabilities: {
                    american_odds: number;
                    decimal_odds: number;
                    implied_odds: number;
                };
            };
            value: {
                percent_profit: number;
                book_odds: {
                    bookmaker: string;
                    name: string;
                    probabilities: {
                        american_odds: number;
                        decimal_odds: number;
                        implied_odds: number;
                    };
                };
            }[];
        }[];
    }[];
}

function Arbitrage() {
    const [data, setData] = useState<Sports[]>([]);
    const [input, setInput] = useState<ArbitrageOpportunities[]>([]);
    const [error, setError] = useState<string>('');

    const URL = 'http://localhost:3000/odds';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = (await response.json()) as Sports[];

                // local json file
                // const data = () => JSON.parse(JSON.stringify(jsonData));

                setData(data);
            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const assembleData = async () => {
            var arb: ArbitrageOpportunities[] = new Array();
            var i = 0;
            data.map((datum) => {
                datum.games.map((game) => {
                    game.arbitrage_opportunities.map((opportunity) => {
                        opportunity.value.map((value) => {
                            var keyao: string, valao: string;
                            if (opportunity.key.probabilities.american_odds > 0) {
                                keyao = '+' + opportunity.key.probabilities.american_odds;
                            } else {
                                keyao = '' + opportunity.key.probabilities.american_odds;
                            }

                            if (value.book_odds.probabilities.american_odds > 0) {
                                valao = '+' + value.book_odds.probabilities.american_odds;
                            } else {
                                valao = '' + value.book_odds.probabilities.american_odds;
                            }

                            arb.push({
                                id: i,
                                profit_margin: value.percent_profit,
                                time: new Date(Date.parse(game.start_time)).toLocaleString(),
                                event: game.away_team + ' @ ' + game.home_team,
                                bets: opportunity.key.name + '\r\n' + value.book_odds.name,
                                books: keyao + ' ' + opportunity.key.bookmaker + '\r\n' + valao + ' ' + value.book_odds.bookmaker,
                                odd1: keyao,
                                odd2: valao
                            })
                            i++;
                        })
                    })
                })
            })

            setInput(arb)
        };
        assembleData();
    }, [data]);

    // console.log(data);
    // console.log(error);

    if (error) {
        return <h2>Error: {error}</h2>;
    }


    return (
        <div>
            <h1>Current Arbitrage Opportunities</h1>
            <ArbitrageTable data={input} />
            <h3>Next Update in: </h3>
        </div>
    );
}

export default Arbitrage;