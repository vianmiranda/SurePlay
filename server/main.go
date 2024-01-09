package main

import (
	"engine/arbitrage"
	"engine/handler"
	"engine/oddsdata"
	"fmt"
	"net/http"
	"sync"

	"github.com/go-chi/chi"
)

// concurrent implementation
const port string = ":3000"

var sport_keys []string = []string{"americanfootball_ncaaf", "americanfootball_nfl", "baseball_mlb", "basketball_nba", "icehockey_nhl", "mma_mixed_martial_arts"}

var api_inputs oddsdata.Input = oddsdata.Input{
	API_FILE:    "api_key.txt",
	LINE_NUMBER: 1,
	MARKETS:     "h2h",
	REGIONS:     "us",
	ODDS_FORMAT: "american"}

func main() {
	r := chi.NewRouter()

	//r.Get("/odds", handler.ArbOppsGet(findArbitrage(r, true)))
	r.Post("/calc/{valueType}/{odds1}&{odds2}&{value1}&{value2}", handler.BetCalcPost())

	fmt.Printf("\n\nServing on %s \n\n", port)
	http.ListenAndServe(port, r)
}

func findArbitrage(r *chi.Mux, print bool) map[string]arbitrage.SportOpps {
	var wg sync.WaitGroup
	allSportArbitrageOpportunities := make(map[string]arbitrage.SportOpps)

	for _, sport := range sport_keys {
		wg.Add(1)
		inputs := api_inputs
		inputs.SPORT = sport
		go getResponse(&wg, inputs, allSportArbitrageOpportunities)
	}

	wg.Wait()

	if print {
		for sport, arbOpps := range allSportArbitrageOpportunities {
			fmt.Printf("\nPrinting arbitrage for %s\n", sport)
			for index, game := range arbOpps.Games {
				fmt.Printf("\tGame #%d %s @ %s at %s\n", index, game.Away_Team, game.Home_Team, game.Start_Time)
				for _, arbOpp := range game.ArbOpps {
					fmt.Printf("\t\tKey: %v \t Value: %v\n", arbOpp.Key, arbOpp.Value)
				}
				fmt.Println()
			}
		}
	}

	return allSportArbitrageOpportunities
}

func getResponse(wg *sync.WaitGroup, in oddsdata.Input, dict map[string]arbitrage.SportOpps) {
	defer wg.Done()
	odds_data, err := oddsdata.Fetch_Odds(in)
	if err != nil {
		panic(err)
	}

	var arbOpps arbitrage.SportOpps = arbitrage.Arbitrage_Detection(odds_data, in.SPORT)

	dict[in.SPORT] = arbOpps
}

func UNUSED(x ...interface{}) {} // for testing purposes
