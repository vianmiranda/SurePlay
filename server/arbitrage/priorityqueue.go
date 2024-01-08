package arbitrage

type MinHeap []*Book_Odds

func (pq MinHeap) Len() int {
	return len(pq)
}

func (pq MinHeap) Less(i, j int) bool {
	return pq[i].Implied_Odds < pq[j].Implied_Odds
}

func (pq MinHeap) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}

func (pq *MinHeap) Push(x any) {
	item := x.(*Book_Odds)
	*pq = append(*pq, item)
}

func (pq *MinHeap) Pop() any {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil
	*pq = old[0 : n-1]
	return item
}
