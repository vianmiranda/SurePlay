function ArbitrageData(props: any) {
    const { data } = props;

    return (
        <>{data.map((datum: any) => {
            return <> {datum.games.map((game: any) => {
                return <> {game.arbitrage_opportunities.map((opportunity: any) => {
                    return <> {opportunity.value.map((value: any) => {
                        return <>
                            <tr>
                                <td>{value.percent_profit.toFixed(2)}%</td>
                                <td>{game.start_time}</td>
                                <td>{game.away_team} @ {game.home_team}</td>
                                {/* <td>{opportunity.key.market}</td> */}
                                <td>{opportunity.key.name} <br /> {value.book_odds.name} </td>
                                <td>{opportunity.key.probabilities.american_odds} {opportunity.key.bookmaker} <br /> {value.book_odds.probabilities.american_odds} {value.book_odds.bookmaker}</td>
                            </tr>
                        </>
                    })}</>
                })}</>
            })}</>
        })}</>
    );
}

export default ArbitrageData;