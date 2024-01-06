package main

import (
	"engine/arbitrage"
	"engine/handler"
	"engine/oddsdata"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
)

func main() {
	const port = ":3000"
	api_inputs := oddsdata.Input{API_FILE: "api_key.txt", LINE_NUMBER: 1, SPORT: "basketball_nba", MARKETS: "h2h", REGIONS: "us", ODDS_FORMAT: "american"}
	odds_data, err := oddsdata.Fetch_Odds(api_inputs)
	if err != nil {
		panic(err)
	}

	var arbopps []map[arbitrage.Book_Odds][]arbitrage.Book_Odds
	for index, game := range odds_data {
		fmt.Printf("Game #%d %s @ %s at %s\n", index, game.Away_Team, game.Home_Team, game.Start_Time)
		arbopps = append(arbopps, arbitrage.Arbitrage_Detection(game))
		fmt.Println(arbopps[index])
		fmt.Println()
	}

	r := chi.NewRouter()

	r.Get("/odds", handler.ArbOppsGet(arbopps))

	fmt.Printf("Serving on %s ", port)
	http.ListenAndServe(port, r)
}

// // concurrent implementation
// func main() {
// 	var sport_keys []string = []string{"americanfootball_ncaaf", "americanfootball_nfl", "baseball_mlb", "basketball_nba", "icehockey_nhl", "mma_mixed_martial_arts"}
// 	var wg sync.WaitGroup
// 	dict := make(map[string][]map[arbitrage.Book_Odds][]arbitrage.Book_Odds)

// 	for _, sport := range sport_keys {
// 		wg.Add(1)
// 		go getResponse(&wg, sport, dict)
// 	}

// 	wg.Wait()

// 	for _, sport := range sport_keys {
// 		fmt.Printf("Printing arbitrage for %s\n", sport)
// 		fmt.Println(dict[sport])
// 		fmt.Println()
// 	}
// }

// func getResponse(wg *sync.WaitGroup, sport_key string, dict map[string][]map[arbitrage.Book_Odds][]arbitrage.Book_Odds) {
// 	defer wg.Done()
// 	api_inputs := oddsdata.Input{API_FILE: "api_key.txt", LINE_NUMBER: 1, SPORT: sport_key, MARKETS: "h2h", REGIONS: "us", ODDS_FORMAT: "american"}
// 	odds_data, err := oddsdata.Fetch_Odds(api_inputs)
// 	if err != nil {
// 		panic(err)
// 	}

// 	var arbopps []map[arbitrage.Book_Odds][]arbitrage.Book_Odds
// 	for _, game := range odds_data {
// 		arbopps = append(arbopps, arbitrage.Arbitrage_Detection(game))
// 	}
// 	dict[sport_key] = arbopps
// }

func UNUSED(x ...interface{}) {} // for testing purposes
