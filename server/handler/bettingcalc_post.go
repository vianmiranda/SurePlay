package handler

import (
	"encoding/json"
	"engine/arbitrage"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
)

func BetCalcPost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		valueType := chi.URLParam(r, "valueType")
		param1, err := strconv.ParseFloat(chi.URLParam(r, "odds1"), 32)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		odds1 := float32(param1)
		param2, err := strconv.ParseFloat(chi.URLParam(r, "odds2"), 32)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		odds2 := float32(param2)
		param3, err := strconv.ParseFloat(chi.URLParam(r, "value"), 32)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		value := float32(param3)

		var ret arbitrage.BetValues = arbitrage.BetValues{}

		if valueType == "budget" {
			ret.Value1, ret.Value2 = arbitrage.Split_Budget(odds1, odds2, value)
			ret.Budget = float64(value)
		} else if valueType == "betAmount" {
			ret.Value1 = float64(value)
			ret.Value2 = float64(arbitrage.Ensure_Profit(odds1, odds2, value))
			ret.Budget = ret.Value1 + ret.Value2
		} else {
			http.Error(w, "valueType must be either 'budget' or 'betAmount'", http.StatusInternalServerError)
			return
		}

		responseJSON, err := json.Marshal(ret)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	}

}
