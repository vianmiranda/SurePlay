package main

import (
	"engine/arbitrage"
	"engine/handler"
	"engine/oddsdata"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
)

var env_err error = godotenv.Load("../env/.env")

var port string = fmt.Sprintf(":%s", os.Getenv("PORT"))

const time_to_update int64 = 600 // seconds

// Sport keys associated with the Odds API
var sport_keys []string = []string{
	"americanfootball_ncaaf",
	"americanfootball_nfl",
	"baseball_mlb",
	"basketball_nba",
	"icehockey_nhl",
	"mma_mixed_martial_arts"}

// Input to the Odds API
var api_inputs oddsdata.Input = oddsdata.Input{
	API_FILE:    os.Getenv("API_FILE"),
	LINE_NUMBER: stringToInt(os.Getenv("API_LINE_NUMBER")),
	BACKUPS:     stringToInt(os.Getenv("API_BACKUPS")),
	MARKETS:     os.Getenv("API_MARKETS"),
	REGIONS:     os.Getenv("API_REGIONS"),
	ODDS_FORMAT: os.Getenv("API_ODDS_FORMAT")}

/*
The Go backend is responsible for handling a GET request to /odds, which will return a JSON object containing all arbitrage opportunities for each sport.
It is also responsible for handling POST requests to /calc, which will return a JSON object containing optimal stakes for given odds alongside a lot of
other information useful to the client (such as the expected value of the bet, the profit, etc.)
*/
func main() {
	if env_err != nil {
		panic(env_err)
	}

	r := chi.NewRouter()

	// The /odds GET request is wrapped in a goroutine that contains an infinite loop so that the arbitrage opportunities are updated every time_to_update seconds
	go func() {
		for i := 0; ; i++ {
			fmt.Printf("\n-----------------------------\nArbitrage Update %d - %s\n\n", i, time.Now().Format("2006-01-02 15:04:05"))
			r.Get("/odds", handler.ArbOppsGet(findArbitrage(r, false), time_to_update))
			time.Sleep(time.Duration(time_to_update) * time.Second)
		}
	}()

	// valueType specifies what value1 represents (either a stake on a certain odd or the budget)
	r.Post("/calc/{valueType}/{odds1}&{odds2}&{value1}", handler.BetCalcPost())

	fmt.Printf("\n\nServing on %s \n\n", port)
	http.ListenAndServe(port, r)
}

/*
findArbitrage is responsible for concurrently fetching data from the Odds API for each sport and then detecting arbitrage opportunities for each game, which it
puts into a map. The map's key is the sport and the value is a struct containing all arbitrage opportunities for that sport. It returns the map. print is a boolean
that allows to print the arbitrage opportunities to the console for debugging purposes.
*/
func findArbitrage(r *chi.Mux, print bool) map[string]arbitrage.SportOpps {
	var wg sync.WaitGroup
	allSportArbitrageOpportunities := make(map[string]arbitrage.SportOpps)

	for _, sport := range sport_keys {
		wg.Add(1)
		inputs := api_inputs
		inputs.SPORT = sport
		go getResponse(&wg, inputs, allSportArbitrageOpportunities) // Concurrently fetch data from the Odds API
	}

	wg.Wait() // Wait for all goroutines to finish

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
	defer wg.Done() // Decrement the waitgroup counter after the function returns

	odds_data, err := oddsdata.Fetch_Odds(in)
	if err != nil {
		panic(err)
	}

	var arbOpps arbitrage.SportOpps = arbitrage.Arbitrage_Detection(odds_data, in.SPORT)

	// Add the arbitrage opportunities to the map - no need to lock because each goroutine is responsible for a different sport
	dict[in.SPORT] = arbOpps
}

func stringToInt(s string) int8 {
	i, err := strconv.ParseInt(s, 10, 8)
	if err != nil {
		panic(err)
	}
	return int8(i)
}
