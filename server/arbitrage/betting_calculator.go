package arbitrage

import (
	"gonum.org/v1/gonum/mat"
)

// given a amount to bet on a line, returns amount to bet on other line to ensure a profit
func Ensure_Profit(odds1 float32, odds2 float32, amt float32) float32 {
	return (odds1 * amt) / odds2
}

// given a total budget the user wants to bet, returns the ideal way to split up the bet
func Split_Budget(odds1 float32, odds2 float32, budget float32) (float32, float32) {

	A := mat.NewDense(2, 2, []float64{1, 1, float64(odds1), float64(-odds2)})
	b := mat.NewVecDense(2, []float64{float64(budget), 0})

	// Solve the equations using the Solve function.
	var x mat.VecDense
	err := x.SolveVec(A, b)
	if err != nil {
		return 0, 0
	}

	return float32(x.At(0, 0)), float32(x.At(1, 0))
}

func Calculate_Profit(odds1 float32, odds2 float32, amt1 float32, amt2 float32) (float32, float32) {
	return (odds1 * amt1) - (amt1 + amt2), (odds2 * amt2) - (amt1 + amt2)
}

func Profit_Percentage(odds1 float32, odds2 float32) float32 {
	var budget float32 = 100
	amt1, amt2 := Split_Budget(odds1, odds2, budget)
	profit1, profit2 := Calculate_Profit(odds1, odds2, amt1, amt2)
	return min((profit1/budget)*100, (profit2/budget)*100)
}
