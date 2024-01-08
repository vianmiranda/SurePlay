package arbitrage

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
	//Percent_Profit float32     `json:"percent_profit"` // TODO: Add percent_profit to JSON and implement in rest of backend
	Key   Book_Odds   `json:"key"`
	Value []Book_Odds `json:"value"`
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
	Value1 float64 `json:"value1"`
	Value2 float64 `json:"value2"`
	Budget float64 `json:"budget"`
}
