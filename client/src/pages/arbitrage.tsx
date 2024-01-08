import { useState, useEffect } from 'react';

interface Sports {
    sport: string
    games: {
        home_team: string;
        away_team: string;
        start_time: string;
        arbitrage_opportunities: {
            key: {
                bookmaker: string;
                probabilities: {
                    american_odds: number;
                    decimal_odds: number;
                    implied_odds: number;
                };
            };
            value: {
                bookmaker: string;
                probabilities: {
                    american_odds: number;
                    decimal_odds: number;
                    implied_odds: number;
                };
            }[];
        }[];
    }[];
}

function Arbitrage() {
    const [data, setData] = useState<Sports[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/odds');
            const data = (await response.json()) as Sports[];
            setData(data);
        };

        fetchData();
    }, []);

    console.log(data)

    return (
        <div>
            <h1>Data Fetching</h1>
            <p>Percent</p>
            <p>Time</p>
            <p>Event</p>
            <p>Market</p>
            <p>Bets</p>
            <p>Books</p>

            <ul>{data.map((datum) => {
                return <div>
                    <li>{datum.sport}</li> 
                    <ul>{datum.games.map((game) => {
                        return <div>
                            <li>{game.away_team} @ {game.home_team} at {game.start_time}</li>
                            <ul>{game.arbitrage_opportunities.map((opportunity) => {
                                return <div>
                                    {opportunity.value.map((value) => {
                                        return <li>{opportunity.key.bookmaker} {opportunity.key.probabilities.american_odds} @ {value.bookmaker} {value.probabilities.american_odds}</li>
                                    })}
                                </div>
                            })}</ul>
                        </div>
                    })}</ul>
                </div>
            })}</ul>
        </div>
    );
}

export default Arbitrage;