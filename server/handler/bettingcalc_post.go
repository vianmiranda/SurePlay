package handler

import (
	"encoding/json"
	"engine/arbitrage"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
)

/*
BetCalcPost is the handler for POST requests to /calc/{valueType}/{odds1}&{odds2}&{value1}. Depending on the value of valueType, it will calculate some values
and return a JSON object containing the odds, optimal stakes on those odds, the profit on each bet, the budget, and the possible percentage profit if ideal stakes are used.
*/
func BetCalcPost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Parse all of the parameters from the URL
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
		param3, err := strconv.ParseFloat(chi.URLParam(r, "value1"), 32)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		value := float32(param3)

		var ret arbitrage.BetValues = arbitrage.BetValues{} // Initialize the return struct

		switch {
		case valueType == "budget":
			// Where value is the total budget allocated (find value1 and value2)
			ret.Value1, ret.Value2 = arbitrage.Split_Budget(odds1, odds2, value)
			ret.Budget = value
		case valueType == "betAmountO1":
			// Where value is the amount bet on odds1 (find value2 and budget)
			ret.Value1 = value
			ret.Value2 = arbitrage.Ensure_Profit(odds1, odds2, value)
			ret.Budget = ret.Value1 + ret.Value2
		case valueType == "betAmountO2":
			// Where value is the amount bet on odds2 (find value1 and budget)
			ret.Value2 = value
			ret.Value1 = arbitrage.Ensure_Profit(odds2, odds1, value)
			ret.Budget = ret.Value1 + ret.Value2
		default:
			http.Error(w, "valueType must be either 'budget' or 'betAmount'", http.StatusInternalServerError)
			return
		}

		// Calculate the profit and percentage profit
		ret.Profit1, ret.Profit2 = arbitrage.Calculate_Profit(odds1, odds2, ret.Value1, ret.Value2)
		ret.Percent_Profit = arbitrage.Profit_Percentage(odds1, odds2)

		responseJSON, err := json.Marshal(ret)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	}

}
