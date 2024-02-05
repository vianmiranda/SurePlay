package oddsdata

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type Input struct {
	API_FILE    string
	LINE_NUMBER int8
	SPORT       string
	MARKETS     string
	REGIONS     string
	ODDS_FORMAT string
}

type api_params struct {
	API_KEY     string
	SPORT       string
	MARKETS     string
	REGIONS     string
	ODDS_FORMAT string
}

func Fetch_Odds(in Input) (Response, error) {
	var odds_data Response
	API_KEY, err := fetch_key(in.API_FILE, in.LINE_NUMBER)
	if err != nil {
		return odds_data, err
	}

	settings := api_params{API_KEY, in.SPORT, in.MARKETS, in.REGIONS, in.ODDS_FORMAT}
	URL := url_builder(settings)

	odds_data, err = get_json(URL)
	if err != nil {
		return odds_data, err
	}

	return odds_data, err
	// fmt.Println(odds_data)

}

func fetch_key(file_name string, line int8) (string, error) {
	f, err := os.Open(file_name)
	if err != nil {
		return "", err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	var api_key string
	var index int8 = 1
	for scanner.Scan() {
		if line == -1 {
			api_key = scanner.Text()
			remaining, err := numOfRequestsRemaining(api_key)
			if err != nil {
				continue
			}
			if remaining > 0 {
				break
			}
		} else if index == line {
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

func numOfRequestsRemaining(api_key string) (float32, error) {
	var URL strings.Builder
	var err error

	URL.WriteString("https://api.the-odds-api.com/v4/sports/?apiKey=")
	URL.WriteString(api_key)
	resp, err := http.Get(URL.String())
	if err != nil {
		return 0, err
	}
	remaining_requestsF64, err := strconv.ParseFloat(resp.Header.Get("X-Requests-Remaining"), 32)
	if err != nil {
		return 0, err
	}
	remaining_requests := float32(remaining_requestsF64)

	return remaining_requests, err
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

	return sportodds.String()
}

func get_json(URL string) (Response, error) {
	var data Response
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
		err = errors.New(fmt.Sprintf("odds-api: Status code not 200! Got %d instead.", status_code))
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
