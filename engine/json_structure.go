package main

type Game struct {
	Sport      string      `json:"sport_key"`
	Start_Time string      `json:"commence_time"`
	Home_Team  string      `json:"home_team"`
	Away_Team  string      `json:"away_team"`
	Bookmakers []Bookmaker `json:"bookmakers"`
}

type Bookmaker struct {
	Bookmaker   string   `json:"title"`
	Last_Update string   `json:"last_update"`
	Markets     []Market `json:"markets"`
}

type Market struct {
	Market      string    `json:"key"`
	Last_Update string    `json:"last_update"`
	Outcomes    []Outcome `json:"outcomes"`
}

type Outcome struct {
	Name string `json:"name"`
	Odds int32  `json:"price"`
}
