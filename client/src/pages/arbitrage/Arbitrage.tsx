import { useState, useEffect } from 'react';
import {ArbitrageOpportunities, ArbitrageTable} from './components/ArbitrageTable';
import Timer from './components/Timer';
import './Arbitrage.css';
// import jsonData from './sample.json';

// JSON structure to be returned from backend. 
// This is the same structure as the sample.json file.
interface Response {
    response_time: number;
    next_response_time: number;
    sports: {
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
    }[]
}

// Map for sport names.
const formattedSportMap = new Map<string, string>([
    ['mma_mixed_martial_arts', 'Mixed Martial Arts | MMA'],
    ['basketball_nba', 'Basketball | NBA'],
    ['americanfootball_ncaaf', 'Football | NCAAF'],
    ['americanfootball_nfl', 'Football | NFL'],
    ['baseball_mlb', 'Baseball | MLB'],
    ['icehockey_nhl', 'Ice Hockey | NHL']
]);

/**
 * Main function for Arbitrage page. Constructs the table and timer.
 * 
 * @returns Arbitrage page.
 */
function Arbitrage() {
    const [data, setData] = useState<Response | null>(null);
    const [input, setInput] = useState<ArbitrageOpportunities[]>([]);
    const [error, setError] = useState<string>('');

    // Where backend is hosted.
    const URL = 'http://localhost:3000/odds';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const data = (await response.json()) as Response;

                // local json file
                // const data = () => JSON.parse(JSON.stringify(jsonData));

                setData(data);
            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching data:', error);
            }
        };

        function nextInterval() {  
            if (data === null) {
                return 600;
            } 

            const nextUpdate = ((data.response_time + data.next_response_time) - Math.floor(Date.now()/1000)) * 1000; // in milliseconds
            if (nextUpdate < 6000) {
                return 600;
            } else {
                return nextUpdate - 3000;
            }
        }

        const interval = setInterval(() => {
            fetchData();
        }, nextInterval());
        return () => clearInterval(interval);
    }, [data]);
    
    // Everytime there is a change to data, assemble the data into a format 
    // that can be used by the table. See ArbitrageOpportunities interface in 
    // ArbitrageTable.tsx for format.
    useEffect(() => {
        const assembleData = async () => {
            var arb: ArbitrageOpportunities[] = new Array();
            var i = 0;
            if (data !== null) {
                data.sports.map((datum) => {
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
                                    event_sport: formattedSportMap.get(datum.sport),
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
            }

            setInput(arb)
        };
        assembleData();
    }, [data]);

    if (error) {
        return <h2>Error: {error}</h2>;
    }

    return (
        <div>
            <h1>Current Arbitrage Opportunities</h1>
            <ArbitrageTable data={input} />
            <h3>Next Update in: <Timer unixTime={data !== null ? data.response_time + data.next_response_time : 0}></Timer></h3>
        </div>
    );
}

export default Arbitrage;