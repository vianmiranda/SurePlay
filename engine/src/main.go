package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
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
	API_KEY := fetch_key(3)
	settings := api_params{API_KEY, "basketball_nba", "h2h", "us", "american"}
	URL := url_builder(settings)

	resp, err := http.Get(URL)
	if err != nil {
		fmt.Print(err.Error())
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Print(err.Error())
	}

	fmt.Println(resp.Header)
	// fmt.Println(string(body))

	var data []Game
	json.Unmarshal(body, &data)

	fmt.Println(data[0])

}

func fetch_key(line int8) string {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	file := wd + "\\" + "api_key.txt"
	f, err := os.Open(file)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	var api_key string
	var index int8 = 1
	for scanner.Scan() {
		if index == line {
			api_key = scanner.Text()
		}
		index++
	}

	return api_key
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

func UNUSED(x ...interface{}) {} // for testing purposes
