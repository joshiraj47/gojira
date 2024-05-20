import './LandingPage.css';
import {ExpandableSidebar} from "./expandableSidebar";
import {StaticSidebar} from "./StaticSidebar";
import {Outlet} from "react-router-dom";

export const LandingPage = () => {
    return (
        <>
            <div>
                <ExpandableSidebar/>
                <StaticSidebar/>
                <div className="shiftedDiv">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
