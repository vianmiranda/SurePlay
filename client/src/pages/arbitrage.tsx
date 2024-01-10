import { useState, useEffect } from 'react';
import ArbitrageData from './components/arbitrageData';
import './arbitrage.css';

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
                setData(data);
                setError('');
            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    console.log(data);
    console.log(error);

    if (error) {
        return <h2>Error: {error}</h2>;
    }

    return (
        <div>
            <h1>Current Arbitrage Opportunities</h1>
            {/* <table class="sortable" > */}
            <table>
                <thead>
                    <tr>

                        <th style={{ width: '15%' }}>Profit Margin</th>
                        <th style={{ width: '17%' }}>Time</th>
                        <th style={{ width: '28%' }}>Event</th>
                        {/* <th style={{ width: '15%' }}>Market</th> */}
                        <th style={{ width: '20%' }}>Bets</th>
                        <th style={{ width: '20%' }}>Books</th>
                    </tr>
                </thead>
                <tbody>
                    <ArbitrageData data={data} />
                </tbody>
            </table>

            {/* <ul>{data.map((datum: Sports) => {
                return <div>
                    <li>{datum.sport}</li> 
                    <ul>{datum.games.map((game) => {
                        return <div>
                            <li>{game.away_team} @ {game.home_team} at {game.start_time}</li>
                            <ul>{game.arbitrage_opportunities.map((opportunity) => {
                                return <div>
                                    {opportunity.value.map((value) => {
                                        return <div>
                                            <li>{opportunity.key.bookmaker} {opportunity.key.probabilities.american_odds} @ {value.book_odds.bookmaker} {value.book_odds.probabilities.american_odds}</li>
                                            <ul>
                                                <li>{value.percent_profit}%</li>
                                            </ul>
                                        </div>
                                    })}
                                </div>
                            })}</ul>
                        </div>
                    })}</ul>
                </div>
            })}</ul> */}
        </div>
    );
}

export default Arbitrage;