package arbitrage

import (
	"container/heap"
	"engine/oddsdata"
)

func Arbitrage_Detection(game oddsdata.Game) map[Book_Odds][]Book_Odds {
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
	var arbitrage_opps map[Book_Odds][]Book_Odds = make(map[Book_Odds][]Book_Odds)
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

	/*
		var book1 Book_Odds = Book_Odds{Probabilities{20, 0.2, 50.4}, "Book1"}
		var book2 Book_Odds = Book_Odds{Probabilities{20, 0.2, 42.1}, "Book2"}
		var book3 Book_Odds = Book_Odds{Probabilities{20, 0.2, 69.7}, "Book3"}
		var book4 Book_Odds = Book_Odds{Probabilities{20, 0.2, 98.2}, "Book4"}
		var book5 Book_Odds = Book_Odds{Probabilities{20, 0.2, 12.3}, "Book5"}
		var book6 Book_Odds = Book_Odds{Probabilities{20, 0.2, 2.2}, "Book6"}
		var book7 Book_Odds = Book_Odds{Probabilities{20, 0.2, 79.8}, "Book7"}

		var books = MinHeap{&book1, &book2, &book3, &book4, &book5, &book6, &book7}
		heap.Init(&books)

		var book8 Book_Odds = Book_Odds{Probabilities{20, 0.3, 1.1}, "Book8"}
		heap.Push(&books, &book8)
		for books.Len() > 0 {
			item := *heap.Pop(&books).(*Book_Odds)
			fmt.Printf("%+v", item)
		}
	*/
}
