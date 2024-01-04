package main

import (
	"engine/arbitrage"
	"engine/json"
	"fmt"
)

func main() {
	api_inputs := json.Input{API_FILE: "api_key.txt", LINE_NUMBER: 1, SPORT: "basketball_nba", MARKETS: "h2h", REGIONS: "us", ODDS_FORMAT: "american"}
	odds_data, err := json.Fetch_Odds(api_inputs)
	if err != nil {
		panic(err)
	}

	for index, game := range odds_data {
		fmt.Printf("Game #%d %s @ %s at %s\n", index, game.Away_Team, game.Home_Team, game.Start_Time)
		arbopps := arbitrage.Arbitrage_Detection(game)
		fmt.Println(arbopps)
		fmt.Println()
	}
}

func UNUSED(x ...interface{}) {} // for testing purposes
