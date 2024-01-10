import React from 'react'
import './calculator.css'

import dice_red from '../../assets/dice_red.png.png'
import dice_blue from '../../assets/dice_blue.png.png'
import stake_red from '../../assets/stake_red.png.png'
import stake_blue from '../../assets/stake_blue.png.png'
import budget from '../../assets/budget.png'

function Calculator() {
    return (
        <div className="container">
            <div className="header">
                <div className="text">Betting Calculator</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={dice_red} width="50" height="50" />
                    <input type="text" />
                </div>
                <div className="input">
                    <img src={dice_blue} width="50" height="50" />
                    <input type="text" />
                </div>
                <div className="input">
                    <img src={stake_red} width="50" height="50" />
                    <input type="text" />
                </div>
                <div className="input">
                    <img src={stake_blue} width="50" height="50" />
                    <input type="text" />
                </div>
                <div className="input">
                    <img src={budget} width="50" height="50" />
                    <input type="text" />
                </div>
            </div>
        </div>
    )
}

export default Calculator;