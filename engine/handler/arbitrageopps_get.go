package handler

import (
	"encoding/json"
	"engine/arbitrage"
	"net/http"
)

type arbOpp struct {
	Key   arbitrage.Book_Odds   `json:"key"`
	Value []arbitrage.Book_Odds `json:"value"`
}

func ArbOppsGet(opps []map[arbitrage.Book_Odds][]arbitrage.Book_Odds) http.HandlerFunc {
	result := []arbOpp{}
	for _, opp := range opps {
		for key, value := range opp {
			result = append(result, arbOpp{key, value})
		}
	}

	return func(w http.ResponseWriter, r *http.Request) {
		// Set the content type header to application/json
		w.Header().Set("Content-Type", "application/json")

		// Encode the result to JSON and handle any potential errors
		err := json.NewEncoder(w).Encode(result)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
