package arbitrage

import (
	"gonum.org/v1/gonum/mat"
)

/*
Given an amount to bet on odds1, Ensure_Profit returns amount to bet on odds2 line to ensure a profit, assuming this is a valid arbitrage opportunity
*/
func Ensure_Profit(odds1 float32, odds2 float32, amt float32) float32 {
	return (odds1 * amt) / odds2
}

/*
Given a total budget the user wants to bet, Split_Budget returns the ideal way to split up the bet, assuming this is a valid arbitrage opportunity
*/
func Split_Budget(odds1 float32, odds2 float32, budget float32) (float32, float32) {

	// Set up a system of equations as the matrix equation Ax = b
	A := mat.NewDense(2, 2, []float64{1, 1, float64(odds1), float64(-odds2)})
	b := mat.NewVecDense(2, []float64{float64(budget), 0})

	// Solve the equation using the Solve function.
	var x mat.VecDense
	err := x.SolveVec(A, b)
	if err != nil {
		return 0, 0
	}

	// Return the solution as (amount to bet on odds1, amount to bet on odds2)
	return float32(x.At(0, 0)), float32(x.At(1, 0))
}

/*
Given the odds and the amount bet on each line, Calculate_Profit returns the profit on each line where the cost is assumed to be the total budget
*/
func Calculate_Profit(odds1 float32, odds2 float32, amt1 float32, amt2 float32) (float32, float32) {
	return (odds1 * amt1) - (amt1 + amt2), (odds2 * amt2) - (amt1 + amt2)
}

/*
Given the odds on each line, Profit_Percentage returns the max possible profit percentage
*/
func Profit_Percentage(odds1 float32, odds2 float32) float32 {
	var budget float32 = 100

	// Ideal way to split up the bet is used to calculate the profit percentage
	amt1, amt2 := Split_Budget(odds1, odds2, budget)

	profit1, profit2 := Calculate_Profit(odds1, odds2, amt1, amt2)
	return min((profit1/budget)*100, (profit2/budget)*100)
}
