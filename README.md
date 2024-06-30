# SurePlay: Arbitrage Betting Made Easy

SurePlay is an arbitrage betting tool that helps identify profitable betting opportunities across 14 bookmakers. With the rapid growth of legalized sports betting and mobile betting platforms, sports betting has become similar to a financial market, where bookmakers price outcomes as assets. Arbitrage betting allows users to exploit inefficiencies in these prices, guaranteeing a return on investment (ROI).

SurePlay works by analyzing odds from multiple sportsbooks across several markets:
- American Football (NCAAF, NFL)
- Baseball (MLB)
- Basketball (NBA)
- Ice Hockey (NHL)
- Mixed Martial Arts (MMA). 

The backend, built with Go, processes data concurrently to detect arbitrage opportunities, while the frontend is developed with React and TypeScript.

In sports betting, odds reflect implied probabilities, and just like in financial markets, these can be exploited for profit. Normally, the implied probabilities of all outcomes in an event should add up to 1. However, sportsbooks often set odds that result in probabilities exceeding 1, creating an advantage for them (aka the "juice" or "vig"). Since odds vary across bookmakers, opportunities arise where the implied probabilities of all outcomes sum to less than 1, ensuring a guaranteed profit for the bettor.

## Arbitrage Opportunity Example

Let's say we're back in time to watch the 2024 NBA Finals between the **Boston Celtics** and the **Dallas Mavericks (Mavs)**. Two different bookmakers provide the following odds:

- **Sportsbook A**: Celtics Moneyline at **-250** (Implied Probability: 71.43%)
- **Sportsbook B**: Mavs Moneyline at **+180** (Implied Probability: 35.71%)

To calculate whether this is an arbitrage opportunity, we sum the implied probabilities:

- **Celtics**: 71.43% (from Sportsbook A)
- **Mavs**: 35.71% (from Sportsbook B)

Total: 71.43% + 35.71% = **107.14%**

Since the implied probabilities exceed 100%, this scenario doesn't present an arbitrage opportunity.

Now, let's look at a second scenario with updated odds:

- **Sportsbook A**: Celtics Moneyline at **-220** (Implied Probability: 68.75%)
- **Sportsbook B**: Mavs Moneyline at **+260** (Implied Probability: 27.78%)

Now, summing the implied probabilities:

- **Celtics**: 68.75% (from Sportsbook A)
- **Mavs**: 27.78% (from Sportsbook B)

Total: 68.75% + 27.78% = **96.53%**

Since the total implied probability is less than 100%, this is a guaranteed arbitrage opportunity. By placing the right amount of money on both outcomes, a profit can be made, regardless of the game's result.

For example, let's say you have $100 to bet:
- If you bet **$71.22** on the Celtics at **-220**, your payout will be **$103.59** if the Celtics win.
- If you bet **$28.78** on the Mavs at **+260**, your payout will be **$103.61** if the Mavs win.

<details>  
    <summary><i>See how we obtained the bet amounts</i></summary>  

To calculate the bet amounts, we use the following system of equations:  


1. The total amount wagered equals the budget ($100):

    $$x + y = 100$$

    Where:  
    - $x$ is the amount bet on the Celtics at odds of -220.  
    - $y$ is the amount bet on the Mavs at odds of +260.  

2. The payouts for both bets must be equal to guarantee an arbitrage profit:

    $$x \cdot (\text{decimal odds of Celtics}) = y \cdot (\text{decimal odds of Mavs})$$

    For decimal odds:
    - -220 corresponds to $1 + \frac{100}{220} = 1.4545$
    - +260 corresponds to $1 + \frac{260}{100} = 3.6$

    So, the equation becomes:

    $$x \cdot 1.4545 = y \cdot 3.6$$

Thus, we have our two equations (a system of equations), for which we want to solve $x$ and $y$:

$$x + y = 100$$

(1)

$$1.4545 x = 3.6 y$$

(2)

<details>
    <summary><b>Algebra (Substitution)</b></summary>

Express $y$ in terms of $x$ and substitute into our second equation:

$$y = 100 - x \\ 1.4545x = 3.6 \cdot (100 - x)$$

Simplify:  

$$1.4545x = 360 - 3.6x\\ 1.4545x + 3.6x = 360\\ 5.0545x = 360$$

Solve for $x$:  

$$x = \frac{360}{5.0545} \approx 71.22$$

Solve for $y$:  

$$y = 100 - x = 100 - 71.22 = 28.78$$ 

**Final Bets**:  
- Bet **$71.22** on the Celtics at odds of **-220**.  
- Bet **$28.78** on the Mavs at odds of **+260**.  

</details>
<details>
    <summary><b>Linear Algebra (Gaussian Elimination)</b></summary>
    
![Gaussian Elimination](https://i.imgur.com/EPDvK9l.png)

</details>
</details>

In this case, regardless of the outcome, your payout will be higher than your bet:

- If Celtics win: You win **$103.59**, netting a profit of **$3.59** ($103.59 - $100.00). 
- If Mavs win: You win **$103.61**, netting a profit of **$3.61** ($103.61 - $100.00).

Now, this may not appear to be a significant profit at first glance, but over the long term, consistently exploiting such opportunities can lead to substantial returns.

SurePlay helps users spot these types of opportunities by calculating the implied probabilities across bookmakers and identifying profitable betting scenarios.

## Key Features
- **Arbitrage Opportunity Detection**: Analyzes odds from 14+ bookmakers across a variety of sports to spot profitable betting opportunities. 
  - We use https://the-odds-api.com/ to fetch bookmakers' odds.
- **Implied Probability Calculation**: Automatically calculates the implied probabilities of various outcomes to help users assess risk and returns.
- **Backend Powered by Go**: The concurrent Go-based API handles the calculations required to detect arbitrage opportunities with minimal latency.
- **Frontend with React and TypeScript**: An intuitive interface where users can explore detected arbitrage opportunities and visualize potential ROI.

## Acknowledgements
[Vian Miranda](https://github.com/vianmiranda) and [Yash Sakharkar](https://github.com/ysakharkar) are the authors of this project.