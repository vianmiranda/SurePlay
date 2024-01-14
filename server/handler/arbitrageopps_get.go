package handler

import (
	"encoding/json"
	"engine/arbitrage"
	"net/http"
	"time"
)

func ArbOppsGet(opps map[string]arbitrage.SportOpps, time_to_update int64) http.HandlerFunc {
	result := []arbitrage.SportOpps{}
	for _, value := range opps {
		result = append(result, value)
	}

	response := arbitrage.Response{Response_Time: time.Now().Unix(), Next_Response: time_to_update, Sports: result}

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
