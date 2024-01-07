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
            <ul>
                {data.map((datum) => {
                    return <div><li> {datum.sport} </li> 
                    <ul>{datum.games.map((game) => {
                        return <li>{game.away_team} @ {game.home_team}</li>
                    })}</ul></div>
                })}
            </ul>
        </div>
    );
}

export default Arbitrage;