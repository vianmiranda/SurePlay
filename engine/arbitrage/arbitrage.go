package arbitrage

import (
	"container/heap"
	"engine/oddsdata"
)

type bookmaker_ArbOpp map[Book_Odds][]Book_Odds

func Arbitrage_Detection(allGames oddsdata.Response, sport string) SportOpps {
	gameOpps := []GameOpps{}
	for _, game := range allGames {
		result := []ArbOpp{}
		opp := game_arbitrages(game)
		for key, value := range opp {
			result = append(result, ArbOpp{key, value})
		}
		gameOpps = append(gameOpps, GameOpps{game.Home_Team, game.Away_Team, game.Start_Time, result})
	}
	sportOpps := SportOpps{sport, gameOpps}

	return sportOpps
}

func game_arbitrages(game oddsdata.Game) bookmaker_ArbOpp {
	// Uses Priority Queue to find all arbitrage opportunities
	var t1pq, t2pq MinHeap
	for _, bookmaker := range game.Bookmakers {
		var outcomes []oddsdata.Outcome = bookmaker.Markets[0].Outcomes
		team1, team2 := outcomes[0], outcomes[1]
		prob1, prob2 := Convert_Odds(team1.Odds), Convert_Odds(team2.Odds)
		t1_bookodds, t2_bookodds := Book_Odds{bookmaker.Bookmaker, prob1}, Book_Odds{bookmaker.Bookmaker, prob2}
		t1pq = append(t1pq, &t1_bookodds)
		t2pq = append(t2pq, &t2_bookodds)
	}

	heap.Init(&t1pq)
	heap.Init(&t2pq)

	// Takes minimum odds from t1pq and finds all odds from t2pq that sum less than 100
	var arbitrage_opps bookmaker_ArbOpp = make(bookmaker_ArbOpp)
	for len(t2pq) > 0 {
		t1_bookodd := *heap.Pop(&t1pq).(*Book_Odds)
		var temp_splice []Book_Odds
		var temp_pq MinHeap
		for len(t2pq) > 0 && t1_bookodd.Implied_Odds+t2pq[0].Implied_Odds < 100.0 {
			t2_bookodd := *heap.Pop(&t2pq).(*Book_Odds)
			temp_splice = append(temp_splice, t2_bookodd)
			temp_pq = append(temp_pq, &t2_bookodd)
		}
		if len(temp_splice) > 0 {
			arbitrage_opps[t1_bookodd] = temp_splice
		}
		t2pq = temp_pq
		heap.Init(&t2pq)
	}

	return arbitrage_opps
}
