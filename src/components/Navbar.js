import "../styles/App.css"
import logo1 from './logo1.png';
import {FaHamburger} from "react-icons/fa";
import { Link } from "react-router-dom";
import {BiHomeAlt} from "react-icons/bi";
const Navbar =({visible})=>{


    return (

        <div className={visible? 'sidenav active' : 'sidenav'}>
            <ul>
                <li>
                <BiHomeAlt></BiHomeAlt>
 <Link to="/"> Dashboard </Link>
                </li>
            </ul>

            <ul>
                <li>
                <Link to="/chat"> Chat </Link>
                </li>
            </ul>

            <ul>
                <li>
                <Link to="/about"> About </Link>
                </li>
            </ul>

            <ul className="logout"> 
                <li>
                <Link to="/Auth"> Logout </Link>
                </li>
            </ul>

          
        </div>
    );
}

export default Navbar;