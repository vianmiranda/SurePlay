package handler

import (
	"encoding/json"
	"engine/arbitrage"
	"net/http"
)

func ArbOppsGet(opps map[string]arbitrage.SportOpps) http.HandlerFunc {
	result := []arbitrage.SportOpps{}
	for _, value := range opps {
		result = append(result, value)
	}

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		err := json.NewEncoder(w).Encode(result)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
