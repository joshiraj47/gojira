import {Table} from "react-bootstrap";
import './Dashboard.css';

export const Dashboard = () => {
    return (
        <>
            <div className="p-3">
                <h1 className="heading text-gray-500">List of projects</h1>
                <div>
                    <Table>
                        <thead>
                            <tr className="h-14">
                                <th className="!bg-gray-50  align-content-center">Project Name</th>
                                <th className="!bg-gray-50  align-content-center">Project Category</th>
                                <th className="!bg-gray-50  align-content-center">Creator</th>
                                <th className="!bg-gray-50  align-content-center">Members</th>
                                <th className="!bg-gray-50  align-content-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="h-12 cursor">
                                <td className="align-content-center !text-blue-600">test</td>
                                <td className="align-content-center">Mark</td>
                                <td className="align-content-center">Otto</td>
                                <td className="align-content-center">@mdo</td>
                                <td className="align-content-center">@fat</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}
