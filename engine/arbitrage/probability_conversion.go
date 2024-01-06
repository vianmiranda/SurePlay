package arbitrage

type Book_Odds struct {
	Bookmaker     string `json:"bookmaker"`
	Probabilities `json:"probabilities"`
}

type Probabilities struct {
	American_Odds int32   `json:"american_odds"`
	Decimal_Odds  float64 `json:"decimal_odds"`
	Implied_Odds  float32 `json:"implied_odds"`
}

func Convert_Odds(american_odds int32) Probabilities {
	var decimal_odds float64 = american_to_decimal(american_odds)
	var implied_odds float32 = decimal_to_implied(decimal_odds)

	var probs Probabilities = Probabilities{american_odds, decimal_odds, implied_odds}

	return probs
}

func american_to_decimal(american_odds int32) float64 {
	var ao float64 = float64(american_odds)
	var decimal_odds float64 = 0

	if american_odds > 0 {
		decimal_odds = (ao / 100) + 1
	} else {
		ao = -ao
		decimal_odds = (100 / ao) + 1
	}

	return decimal_odds
}

func decimal_to_implied(decimal_odds float64) float32 {
	return (1 / float32(decimal_odds)) * 100
}
