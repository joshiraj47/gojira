import {OverlayTrigger, Popover, Table, Tooltip} from "react-bootstrap";
import './Dashboard.css';
import {useMutation, useQuery} from "@tanstack/react-query";
import {addMemberToProject, getAllProjects, searchUsers} from "../apiRequests";
import {useEffect, useState} from "react";
import InitialsAvatar from 'react-initials-avatar';

export const Dashboard = () => {
    const repeat = (n) => Array.from({ length: n }, (_, i) => i);
    const {data: {data: {projects} = {}} = {}, isSuccess, isFetching, refetch} = useQuery({queryKey: ["projects"], queryFn: getAllProjects, enabled: false});
    let {data: {data: {users} = {}} = {}, mutate} = useMutation({mutationFn: searchUsers, enabled: false});
    let {mutate: addMemberMutate} = useMutation({mutationFn: addMemberToProject, enabled: false, onSuccess: (data) => setRowData(prevData =>
            prevData.map(row => (row.id === data?.data?.updatedProject?.id ? { ...row, ...data?.data?.updatedProject } : row))
        )});

    const [rowData, setRowData] = useState(null);
    const [searchUserData, setSearchUserData] = useState(null);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        setRowData(projects);
    }, [projects]);

    useEffect(() => {
        setSearchUserData(users);
    }, [users]);

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

    function resetSearchResults() {
        setSearchUserData([]);
    }

    function addUserToProject(user, project) {
        addMemberMutate({userId: user._id, projectId: project.id});
    }

    return (
        <>
            <div className="p-3">
                <h1 className="heading text-gray-500">Projects</h1>
                <div>
                    <Table hover>
                        <thead>
                        <tr className="h-10">
                            <th className="!bg-gray-50  align-content-center font-circular-book">Project Name</th>
                            <th className="!bg-gray-50  align-content-center font-circular-book">Project Category</th>
                            <th className="!bg-gray-50  align-content-center font-circular-book">Creator</th>
                            <th className="!bg-gray-50  align-content-center font-circular-book">Members</th>
                            <th className="!bg-gray-50  align-content-center font-circular-book">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            isFetching &&
                            repeat(10).map((i) => (
                                <tr key={i} className="h-11">
                                    <td colSpan='5'
                                        className="loading-shimmer text-center">{i === 4 ? 'Fetching projects...' : ''}</td>
                                </tr>
                            ))
                        }
                        {
                            !isFetching && isSuccess && rowData &&
                            rowData.map(project => (
                                <tr key={project.id} className="h-12 cursor">
                                    <td className="align-content-center !font-medium !text-blue-600 font-circular-book">{project.name}</td>
                                    <td className="align-content-center !font-medium !text-gray-700 font-circular-book">{project.category}</td>
                                    <td className="align-content-center !font-medium !text-gray-700 font-circular-book">{project.creator}</td>
                                    <td className="align-content-center font-circular-book">
                                        {
                                            <div className="d-flex align-items-center">
                                                {
                                                    <OverlayTrigger
                                                        trigger='click'
                                                        placement="top"
                                                        rootClose
                                                        overlay={
                                                            <Popover id="popover-basic">
                                                                <Popover.Body className='p-2'>
                                                                    <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                                        <ul className="jira-avatars">
                                                                            {
                                                                                project.members?.length <= 9 &&
                                                                                project.members?.map((member) => (
                                                                                    <li className="jira-avatar p-0.5" key={member.id}>
                                                                                        <OverlayTrigger trigger={['click', 'hover']} placement="top"
                                                                                                        overlay={<Tooltip key={member.name} id="tooltip">{member.name}</Tooltip>}
                                                                                        >
                                                                                            <div role='button'>
                                                                                                <InitialsAvatar
                                                                                                    className={`initials-avatar !w-10 !h-10 !rounded-full !ring-1 !ring-white font-semibold font-circular-book ${bgColors[member.avatarBgColor]}`}
                                                                                                    key={member.name} name={member.name}/>
                                                                                            </div>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                            {
                                                                                project.members?.length > 9 &&
                                                                                project.members.slice(0, 9)?.map((member) => (
                                                                                    <li className="jira-avatar p-0.5"
                                                                                        key={member.id}>
                                                                                        <OverlayTrigger trigger={['click', 'hover']} placement="top"
                                                                                                        overlay={
                                                                                                            <Tooltip key={member.name} id="tooltip">{member.name}</Tooltip>}
                                                                                        >
                                                                                            <div role='button'>
                                                                                                <InitialsAvatar
                                                                                                    className={`initials-avatar !w-10 !h-10 !rounded-full !ring-1 !ring-white font-semibold font-circular-book ${bgColors[member.avatarBgColor]}`}
                                                                                                    key={member.name}
                                                                                                    name={member.name}/>
                                                                                            </div>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                            {
                                                                                project.members?.length > 9 &&
                                                                                <li className="jira-avatar" key='extra'>
                                                                                    <InitialsAvatar
                                                                                        className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold font-circular-book !bg-[#EC871D]`}
                                                                                        key='extras'
                                                                                        name={`+ ${project.members.slice(9, project.members?.length).length}`}/>
                                                                                </li>
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </Popover.Body>
                                                            </Popover>
                                                        }
                                                    >
                                                        <div role='button'>
                                                            <span className="flex -space-x-3 overflow-hidden">
                                                                {
                                                                    project.members?.length <= maxCirclesCount &&
                                                                    project.members?.map((member) => (
                                                                        <InitialsAvatar
                                                                            className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold font-circular-book ${bgColors[member.avatarBgColor]}`}
                                                                            key={member.name} name={member.name}/>
                                                                    ))
                                                                }
                                                                {
                                                                    project.members?.length > maxCirclesCount &&
                                                                    project.members.slice(0, maxCirclesCount)?.map((member) => (
                                                                        <InitialsAvatar
                                                                            className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold font-circular-book ${bgColors[member.avatarBgColor]}`}
                                                                            key={member.name} name={member.name}/>
                                                                    ))
                                                                }
                                                                {
                                                                    project.members?.length > maxCirclesCount &&
                                                                    <InitialsAvatar
                                                                        className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold font-circular-book !bg-[#EC871D]`}
                                                                        key='extras'
                                                                        name={`+ ${project.members.slice(maxCirclesCount, project.members?.length).length}`}/>
                                                                }
                                                            </span>
                                                        </div>
                                                    </OverlayTrigger>
                                                }

                                                <span className="flex -space-x-3 px-0.5 overflow-hidden">
                                                    {
                                                        <OverlayTrigger
                                                            trigger='click'
                                                            placement="right-start"
                                                            onExit={() => resetSearchResults()}
                                                            rootClose
                                                            overlay={
                                                                <Popover id="popover-basic">
                                                                    <Popover.Header>
                                                                        <span className='font-bold font-circular-book'>Add Member</span>
                                                                    </Popover.Header>
                                                                    <Popover.Body className='p-2'>
                                                                        <div className="inputs">
                                                                            <i className="fa fa-search"></i>
                                                                            <input type="text"
                                                                                   className="form-control font-circular-book"
                                                                                   onChange={(event) => onSearchUser(event, project)}
                                                                                   placeholder="Search Members..."/>
                                                                        </div>
                                                                        {
                                                                            searchUserData &&
                                                                            <div style={{
                                                                                maxHeight: '200px',
                                                                                overflowY: 'auto'
                                                                            }}>
                                                                                <ul className="list-group pt-1.5">
                                                                                    {
                                                                                        searchUserData?.map((user) => (
                                                                                            <li className="list-group-item border-0 font-circular-book p-1 cursor" key={user._id} onClick={() => addUserToProject(user, project)}>
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
                                    <td className="align-content-center !font-medium font-circular-book !text-gray-700">Nope</td>
                                </tr>
                            ))
                        }
                        {
                            !isFetching && isSuccess && !rowData &&
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
