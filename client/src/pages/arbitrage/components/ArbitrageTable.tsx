import { MouseEventHandler, useCallback, useState } from "react";
import calculator from '../../../assets/calculator.png'
import { Link } from 'react-router-dom';

// Information to be displayed in the table.
interface ArbitrageOpportunities {
    id: number
    profit_margin: number;
    time: number;
    event: string;
    event_sport: string | undefined;
    bets: string;
    books: string;
    odd1: string;
    odd2: string;
}

/**
 * Generates a sortable table component provided data.
 * 
 * @param param0 data to be sorted.
 * @returns sortable table component.
 */
function ArbitrageTable ({data}:{data:ArbitrageOpportunities[]} ) {
    const [sortColumn, setSortColumn] = useState<string>("profit_margin");
    const [descending, setDescending] = useState<boolean>(true);

    // Sort the data based on the sortColumn and descending state.
    const sortedData = useCallback(
        () => sortData({data: data, sortColumn, descending: descending}),
        [data, sortColumn, descending]
    );

    function changeSort(column: string) {
        setDescending(!descending);
        setSortColumn(column)
    }

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: '1%' }}></th>
                    <th style={{ width: '14%' }} key='profit_margin'>Profit Margin <SortButton column='profit_margin' onClick={() => changeSort('profit_margin')} {...{descending, sortColumn}}/></th>
                    <th style={{ width: '17%' }} key='time'>Time <SortButton column='time' onClick={() => changeSort('time')} {...{descending, sortColumn}}/></th>
                    <th style={{ width: '28%' }}>Event</th>
                    <th style={{ width: '20%' }}>Bets</th>
                    <th style={{ width: '20%' }}>Books</th>
                </tr>
            </thead>
            <tbody>
                {sortedData().map((datum: ArbitrageOpportunities) => {
                    return (
                        <tr key={datum.id}>
                            <td>
                                <Link 
                                to={"/calculator/?odds1=" + datum.odd1 + "&odds2=" + datum.odd2}>
                                    <button className="calculatorButton">
                                        <img src={calculator} height="40" width="40"/>
                                    </button>
                                </Link>
                            </td>
                            <td>{datum.profit_margin.toFixed(2)}%</td>
                            <td>{new Date(datum.time).toLocaleString()}</td>
                            <td><strong>{datum.event}</strong><br />{datum.event_sport}</td>
                            <td>{datum.bets} </td>
                            <td>{datum.books}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

// Sort the data based on the sortColumn and descending state.
function sortData({
    data,
    sortColumn,
    descending
}: {
    data: any;
    sortColumn: string;
    descending: boolean;
}) {
        const sortedData = data.sort((a: any, b: any) => {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
        });

        if (descending) {
            sortedData.reverse();
        }

        return sortedData;
}

// Button functionality for sorting the table.
function SortButton({
    descending,
    column,
    sortColumn,
    onClick,
}: {
    descending: boolean;
    column: string;
    sortColumn: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
}) {  
    return (
        <button
            onClick={onClick}
            className={`${
                sortColumn === column && descending
                    ? "sort-button sort-reverse"
                    : "sort-button"
            }`}
        >
        ▲
        </button>
    );
}


export { ArbitrageTable };
export type { ArbitrageOpportunities };
