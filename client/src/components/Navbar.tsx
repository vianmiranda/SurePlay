import { NavLink } from "react-router-dom";

/**
 * Main function for Navbar. 
 * Proivdes navigation links to Arbitrage and Calculator pages.
 * 
 * @returns Navbar component.
 */
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