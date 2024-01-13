import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="nav">
            <ul>
                <li>
                    <NavLink
                        to="/arbitrage"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Arbitrage
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/calculator"
                        className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }
                    >
                        Calculator
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;