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
	Key   Book_Odds   `json:"key"`
	Value []Book_Odds `json:"value"`
}

type Book_Odds struct {
	Bookmaker     string `json:"bookmaker"`
	Probabilities `json:"probabilities"`
}

type Probabilities struct {
	American_Odds int32   `json:"american_odds"`
	Decimal_Odds  float64 `json:"decimal_odds"`
	Implied_Odds  float32 `json:"implied_odds"`
}
