package main

import (
	"bufio"
	"encoding/json"
	"engine/arbitrage"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type api_params struct {
	API_KEY     string
	SPORT       string
	MARKETS     string
	REGIONS     string
	ODDS_FORMAT string
}

func main() {
	API_KEY, err := fetch_key("api_key.txt", 3)
	if err != nil {
		panic(err)
	}

	settings := api_params{API_KEY, "basketball_nba", "h2h", "us", "american"}
	URL := url_builder(settings)

	odds_data, err := get_json(URL)
	if err != nil {
		panic(err)
	}

	// fmt.Println(odds_data)

	for index, game := range odds_data {
		fmt.Printf("Game #%d %s @ %s at %s\n", index, game.Away_Team, game.Home_Team, game.Start_Time)
		arbopps := arbitrage.Arbitrage_Detection(game)
		fmt.Println(arbopps)
		fmt.Println()
	}
}

func fetch_key(file_name string, line int8) (string, error) {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	parent := filepath.Dir(wd)
	file := parent + "\\" + file_name
	f, err := os.Open(file)
	if err != nil {
		return "", err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	var api_key string
	var index int8 = 1
	for scanner.Scan() {
		if index == line {
			api_key = scanner.Text()
			break
		}
		index++
	}

	err = nil
	if index < line {
		err = errors.New("index out of bounds: line number provided is greater than number of lines in file provided")
		return "", err
	}

	return api_key, err
}

func url_builder(settings api_params) string {
	var sportodds strings.Builder
	sportodds.WriteString("https://api.the-odds-api.com/v4/sports/")
	sportodds.WriteString(settings.SPORT)
	sportodds.WriteString("/odds/?apiKey=")
	sportodds.WriteString(settings.API_KEY)
	sportodds.WriteString("&markets=")
	sportodds.WriteString(settings.MARKETS)
	sportodds.WriteString("&regions=")
	sportodds.WriteString(settings.REGIONS)
	sportodds.WriteString("&oddsFormat=")
	sportodds.WriteString(settings.ODDS_FORMAT)

	// var information strings.Builder
	// information.WriteString("https://api.the-odds-api.com/v4/sports/?apiKey=")
	// information.WriteString(settings.API_KEY)

	return sportodds.String() //, information.String()
}

func get_json(URL string) ([]arbitrage.Game, error) {
	var data []arbitrage.Game
	var err error

	resp, err := http.Get(URL)
	if err != nil {
		return data, err
	}

	var status_code int = resp.StatusCode
	fmt.Printf("Status code: [%d]\n", status_code)
	fmt.Println(resp.Header)
	fmt.Println()
	if status_code != 200 {
		err = errors.New(fmt.Sprintf("Status code not 200! Got %d instead.", status_code))
		return data, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return data, err
	}

	// fmt.Println(string(body))

	json.Unmarshal(body, &data)

	return data, err
}

func UNUSED(x ...interface{}) {} // for testing purposes
