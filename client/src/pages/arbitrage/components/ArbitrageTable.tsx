import { MouseEventHandler, useCallback, useState } from "react";

interface ArbitrageOpportunities {
    id: number
    profit_margin: number;
    time: string;
    event: string;
    bets: string;
    books: string;
}

function ArbitrageTable ({data}:{data:ArbitrageOpportunities[]} ) {
    const [sortColumn, setSortColumn] = useState<string>("profit_margin");
    const [descending, setDescending] = useState<boolean>(true);

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
                    <th style={{ width: '15%' }} key='profit_margin'>Profit Margin <SortButton column='profit_margin' onClick={() => changeSort('profit_margin')} {...{descending, sortColumn}}/></th>
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
                            <td>{datum.profit_margin.toFixed(2)}%</td>
                            <td>{datum.time}</td>
                            <td>{datum.event}</td>
                            <td>{datum.bets} </td>
                            <td>{datum.books}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

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
