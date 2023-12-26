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

# print(american_to_decimal(-250))
