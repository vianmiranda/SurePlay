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
	"time"
)

type Input struct {
	API_FILE    string
	LINE_NUMBER int8
	BACKUPS     int8
	SPORT       string
	MARKETS     string
	REGIONS     string
	ODDS_FORMAT string
}

type api_params struct {
	API_KEY     []string
	SPORT       string
	MARKETS     string
	REGIONS     string
	ODDS_FORMAT string
}

/*
Fetch_Odds fetches odds data from the-odds-api.com based on the provided input parameters.
It retrieves the API key, builds the URLs, and makes HTTP requests to fetch the JSON data.
The function returns the fetched odds data and any error encountered during the process.
*/
func Fetch_Odds(in Input) (Response, error) {
	var odds_data Response
	API_KEY, err := fetch_key(in.API_FILE, in.LINE_NUMBER, in.BACKUPS)
	if err != nil {
		return odds_data, err
	}

	settings := api_params{API_KEY, in.SPORT, in.MARKETS, in.REGIONS, in.ODDS_FORMAT}
	URLs := url_builder(settings)

	odds_data, err = get_json(URLs)
	if err != nil {
		return odds_data, err
	}

	return odds_data, err
	// fmt.Println(odds_data)

}

/*
fetch_key reads the API keys from a file and returns them as a slice of strings.
It takes the file name, line number, and number of backups as input parameters.
If the line number is negative, it reads the first instance of a key that has
remaining requests, plus the number of backup keys specified.
If the line number is positive, it reads the API key from the specified line.
If the line number is greater than the number of lines in the file, it returns an error.
*/
func fetch_key(file_name string, line int8, backups int8) ([]string, error) {
	f, err := os.Open(file_name)

	if err != nil {
		return []string{}, err
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	var api_key string
	var index int8 = 1
	var keys []string
	for scanner.Scan() {
		if line <= -1 {
			api_key = scanner.Text()
			remaining, err := numOfRequestsRemaining(api_key)
			if err != nil {
				continue
			}
			if remaining > 0 {
				keys = append(keys, api_key)
				if line < -backups {
					break
				}
				line--
			}
		} else if index == line {
			api_key = scanner.Text()
			keys = append(keys, api_key)
			break
		}
		index++
	}

	err = nil
	if index < line {
		err = errors.New("index out of bounds: line number provided is greater than number of lines in file provided")
		return []string{}, err
	}

	return keys, err
}

/*
numOfRequestsRemaining retrieves the number of remaining requests for the given API key.
It takes the API key as input and returns the number of remaining requests as a float32.
If an error occurs during the HTTP request or parsing the response, it returns an error.
*/
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

/*
url_builder constructs the URLs for fetching odds data based on the provided API parameters.
It takes an `api_params` struct as input, which contains the API key, sport, markets, regions, and odds format.
The function returns a slice of strings, where each string represents a constructed URL for fetching odds data.
*/
func url_builder(settings api_params) []string {
	var sportodds []string
	for _, key := range settings.API_KEY {
		sportodds = append(sportodds,
			fmt.Sprintf("https://api.the-odds-api.com/v4/sports/%s/odds/?apiKey=%s&markets=%s&regions=%s&oddsFormat=%s",
				settings.SPORT, key, settings.MARKETS, settings.REGIONS, settings.ODDS_FORMAT))
	}

	return sportodds
}

/*
get_json makes HTTP requests to fetch the JSON data from the provided URLs.
It retries the request up to 60 times if the status code is 429 (Too Many Requests),
or uses the backupo API keys if the status code is not 200 (OK).
The function returns the fetched odds data and any error encountered during the process.
*/
func get_json(URLs []string) (Response, error) {
	var data Response
	var global_err error

	for _, URL := range URLs {
		resp, err := http.Get(URL)
		if err != nil {
			return data, err
		}

		var status_code int = resp.StatusCode
		for i := 0; i < 60 && status_code == 429; i++ {
			time.Sleep(time.Second)
			fmt.Printf("Got %d, trying again", status_code)
			resp, err = http.Get(URL)
			if err != nil {
				return data, err
			}
			status_code = resp.StatusCode
		}

		fmt.Printf("Status code: [%d]\n", status_code)
		fmt.Println(resp.Header)
		fmt.Println()
		if status_code != 200 {
			global_err = fmt.Errorf("odds-api: Status code not 200! Got %d instead", status_code)
			continue
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return data, err
		}

		// fmt.Println(string(body))

		json.Unmarshal(body, &data)

		return data, err
	}

	return data, global_err
}
