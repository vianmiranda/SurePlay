from queue import PriorityQueue

def american_to_decimal(american_odds):
    american_odds = float(american_odds)
    decimal_odds = 0

    if american_odds > 0:
        decimal_odds = (american_odds/100) + 1
    else:
        american_odds = -american_odds
        decimal_odds = (100/american_odds) + 1

    return decimal_odds

def decimal_to_implied(decimal_odds):
    decimal_odds = float(decimal_odds)

    return (1/decimal_odds)*100

def american_to_implied(american_odds):
    return decimal_to_implied(american_to_decimal(american_odds))

def detect_arbitrage(game):
    t1_minHeap, t2_minHeap = PriorityQueue(), PriorityQueue()
    for bookmaker in game['bookmakers']:
        outcomes = bookmaker['markets'][0]['outcomes']
        team1, team2 = outcomes[0], outcomes[1]
        implied_odds_t1, implied_odds_t2 = american_to_implied(team1['price']), american_to_implied(team2['price'])
        t1_minHeap.put((implied_odds_t1, bookmaker['title'], team1['price']))
        t2_minHeap.put((implied_odds_t2, bookmaker['title'], team2['price']))

    arb_opps = {} # key: t1 odds; value t2 odds that satisfy requirement
    while not t2_minHeap.empty():
        t1_tup = t1_minHeap.get()
        temp_list = []
        temp_minHeap = PriorityQueue()
        while not t2_minHeap.empty() and t1_tup[0] + t2_minHeap.queue[0][0] < 100:
            t2_tup = t2_minHeap.get()
            temp_list.append(t2_tup)
            temp_minHeap.put(t2_tup)
        if temp_list:
            arb_opps[t1_tup] = temp_list
        t2_minHeap = temp_minHeap

    return arb_opps


# print(american_to_decimal(-250))
