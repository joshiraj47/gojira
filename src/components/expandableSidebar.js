import './expandableSidebar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
export const ExpandableSidebar = () => {
    return (
        <>
            <div className="sidebar jiraBlue z-1">
                <ul>
                    <li>
                        <Link>
                            <FontAwesomeIcon icon={faPlus} fontSize="25px"/>
                            <span className="text-uppercase mx-4 ps-1 create-font">Create Task</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}
