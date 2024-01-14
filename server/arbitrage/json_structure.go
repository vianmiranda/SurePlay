package arbitrage

type Response struct {
	Response_Time int64       `json:"response_time"`
	Next_Response int64       `json:"next_response_time"`
	Sports        []SportOpps `json:"sports"`
}

type SportOpps struct {
	Sport string     `json:"sport"`
	Games []GameOpps `json:"games"`
}

type GameOpps struct {
	Home_Team  string   `json:"home_team"`
	Away_Team  string   `json:"away_team"`
	Start_Time string   `json:"start_time"`
	ArbOpps    []ArbOpp `json:"arbitrage_opportunities"`
}

type ArbOpp struct {
	//Market string      `json:"market"` // TODO: Add market to JSON and implement in rest of backend
	Key   Book_Odds            `json:"key"`
	Value []Book_Profit_Margin `json:"value"`
}

type Book_Profit_Margin struct {
	Percent_Profit float32 `json:"percent_profit"`
	Book_Odds      `json:"book_odds"`
}

type Book_Odds struct {
	Bookmaker     string `json:"bookmaker"`
	Name          string `json:"name"`
	Probabilities `json:"probabilities"`
}

type Probabilities struct {
	American_Odds int32   `json:"american_odds"`
	Decimal_Odds  float64 `json:"decimal_odds"`
	Implied_Odds  float32 `json:"implied_odds"`
}

type BetValues struct {
	Value1         float32 `json:"value1"`
	Value2         float32 `json:"value2"`
	Budget         float32 `json:"budget"`
	Profit1        float32 `json:"profit1"`
	Profit2        float32 `json:"profit2"`
	Percent_Profit float32 `json:"percent_profit"`
}
