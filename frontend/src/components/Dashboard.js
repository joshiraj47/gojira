import {OverlayTrigger, Popover, Table} from "react-bootstrap";
import './Dashboard.css';
import {useMutation, useQuery} from "@tanstack/react-query";
import {getAllProjects, searchUsers} from "../apiRequests";
import {useEffect} from "react";
import InitialsAvatar from 'react-initials-avatar';

export const Dashboard = () => {
    const repeat = (n) => Array.from({ length: n }, (_, i) => i);
    const {data: {data: {projects} = {}} = {}, isSuccess, isFetching, refetch} = useQuery({queryKey: ["projects"], queryFn: getAllProjects, enabled: false});
    let {data: {data: {users} = {}} = {}, mutate} = useMutation({mutationFn: searchUsers, enabled: false});

    useEffect(() => {
        refetch();
    }, [refetch]);

    const bgColors = {
        '#A9294F': '!bg-[#A9294F]',
        '#ED6663': '!bg-[#ED6663]',
        '#389393': '!bg-[#389393]',
        '#D82148': '!bg-[#D82148]',
        '#8C5425': '!bg-[#8C5425]',
        '#6F38C5': '!bg-[#6F38C5]',
    };

    const maxCirclesCount = 3;

    function onSearchUser(e, selectedProject) {
        const searchTerm = e.target.value;
        mutate({searchTerm, selectedProject});
    }

    function addUserToProject(user, project) {

    }

    return (
        <>
            <div className="p-3">
                <h1 className="heading text-gray-500">Projects</h1>
                <div>
                    <Table hover>
                        <thead>
                            <tr className="h-10">
                                <th className="!bg-gray-50  align-content-center">Project Name</th>
                                <th className="!bg-gray-50  align-content-center">Project Category</th>
                                <th className="!bg-gray-50  align-content-center">Creator</th>
                                <th className="!bg-gray-50  align-content-center">Members</th>
                                <th className="!bg-gray-50  align-content-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            isFetching &&
                            repeat(10).map((i) => (
                                <tr key={i} className="h-11">
                                    <td colSpan='5' className="loading-shimmer text-center">{i === 4 ? 'Fetching projects...' : ''}</td>
                                </tr>
                            ))
                        }
                        {
                            !isFetching && isSuccess && projects &&
                            projects.map(project => (
                                <tr key={project.id} className="h-12 cursor">
                                    <td className="align-content-center !text-blue-600 !font-semibold">{project.name}</td>
                                    <td className="align-content-center !font-semibold !text-gray-700">{project.category}</td>
                                    <td className="align-content-center !font-semibold !text-gray-700">{project.creator}</td>
                                    <td className="align-content-center">
                                        {
                                            <div className="d-flex align-items-center">
                                                <span className="flex -space-x-3 overflow-hidden">
                                                    {
                                                        project.members?.length <= maxCirclesCount &&
                                                        project.members?.map((member) => (
                                                            <InitialsAvatar
                                                                className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold ${bgColors[member.avatarBgColor]}`}
                                                                key={member.name} name={member.name}/>
                                                        ))
                                                    }
                                                    {
                                                        project.members?.length > maxCirclesCount &&
                                                        project.members.slice(0, maxCirclesCount)?.map((member) => (
                                                            <InitialsAvatar
                                                                className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold ${bgColors[member.avatarBgColor]}`}
                                                                key={member.name} name={member.name}/>
                                                        ))
                                                    }
                                                    {
                                                        project.members?.length > maxCirclesCount &&
                                                        <InitialsAvatar
                                                            className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold !bg-[#EC871D]`}
                                                            key='extras'
                                                            name={`+ ${project.members.slice(maxCirclesCount, project.members?.length).length}`}/>
                                                    }
                                                </span>
                                                <span className="flex -space-x-3 px-0.5 overflow-hidden">
                                                    {

                                                        <OverlayTrigger
                                                        trigger='click'
                                                        placement="right-end"
                                                        rootClose
                                                        overlay={
                                                            <Popover id="popover-basic">
                                                                <Popover.Header><span className='font-semibold'>Add Member</span></Popover.Header>
                                                            <Popover.Body className='p-2'>
                                                                <div className="inputs">
                                                                    <i className="fa fa-search"></i>
                                                                    <input type="text" className="form-control"
                                                                           onChange={(event) => onSearchUser(event, project)}
                                                                           placeholder="Search Members..."/>
                                                                </div>
                                                                {
                                                                    users &&
                                                                    <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                                        <ul className="list-group pt-1">
                                                                            {
                                                                                users?.map((user) => (
                                                                                    <li className="list-group-item border-0 p-1" onClick={() => addUserToProject(user, project)}>
                                                                                        <InitialsAvatar
                                                                                            className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold ${bgColors[user.defaultAvatarBgColor]}`}
                                                                                            key={user.name}
                                                                                            name={user.name}/>
                                                                                        <span
                                                                                            className='pl-1.5'>{user.name}</span>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                }
                                                            </Popover.Body>
                                                            </Popover>
                                                        }
                                                        >
                                                            <div role='button'>
                                                                <InitialsAvatar
                                                                    className={`initials-avatar !w-9 !h-9 !rounded-full !ring-2 !text-2xl initial-avatar-black-text !ring-transparent !bg-[#CCCCCC]`}
                                                                    key='extras' name={`+`}/>
                                                            </div>
                                                        </OverlayTrigger>
                                                    }
                                                </span>
                                            </div>
                                        }
                                    </td>
                                    <td className="align-content-center !font-semibold !text-gray-700">Nope</td>
                                </tr>
                            ))
                        }
                        {
                            !isFetching && isSuccess && !projects &&
                            <tr className="h-12 cursor">
                                <td colSpan='5' className="text-center">No projects found...</td>
                            </tr>
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}
