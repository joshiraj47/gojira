import {Link, NavLink} from "react-router-dom";
import './StaticSidebar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";

export const StaticSidebar = () => {
    return (
        <>
            <div className="flex flex-col items-center w-4 bg-gray-100 position-relative sidebar-left">
                <div>
                    <Link className="flex items-center w-full px-5 mt-3 h-14 pe-none" to="/">
                        <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path
                                d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                        </svg>
                        <span className="ml-2 text-sm font-bold">My Organization</span>
                    </Link>
                </div>

                <div className="w-full px-3">
                    <div className="flex flex-col items-center w-full mt-3 border-t border-gray-300">
                        <Link className="flex items-center w-full h-12 px-5 mt-2 rounded hover:bg-gray-200 hover:fill-blue-600 hover:text-blue-600" to="/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" fill="currentColor"
                                 className="bi bi-kanban" viewBox="0 0 16 20">
                                <path
                                    d="M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path
                                    d="M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"/>
                            </svg>
                            <span className="ml-2 text-md-center font-medium">Kanban Board</span>
                        </Link>
                        <NavLink className="flex items-center w-full h-12 px-5 mt-2 rounded hover:bg-gray-200 hover:fill-blue-600 hover:text-blue-600" to="/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="25" fill="currentColor"
                                 className="bi bi-gear" viewBox="0 0 16 20">
                                <path
                                    d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                                <path
                                    d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                            </svg>
                            <span className="ml-2 text-md-center font-medium">Projects</span>
                        </NavLink>
                        <NavLink className="flex items-center w-full h-12 px-5 mt-2 rounded hover:bg-gray-200 hover:fill-blue-600 hover:text-blue-600"
                                 to="/create-project">
                            <FontAwesomeIcon icon={faCirclePlus} size="lg" />
                            <span className="ml-2 text-md-center font-medium">Create Project</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
