import './Kanban.css';
import InitialsAvatar from "react-initials-avatar";
import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useCallback, useEffect, useState} from "react";
import {isEmpty, isNil} from "lodash/fp";
import {getAllIssuesByProjectId, getAllProjectsWithJustNameAndId, getProject} from "../apiRequests";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {avatarBgColors} from "./constants/avatarBgColors";
import {issuePriorityColor, issuePriorityIcons, issueTypeColor, issueTypeIcons} from "./constants/issues";
export const Kanban = () => {
    const {data: {data: {projects} = {}} = {}, isSuccess, isFetching} = useQuery({queryKey: ["projects"], queryFn: getAllProjectsWithJustNameAndId});
    const {mutate: getProjectByIdMutate, data: projectData = {}} = useMutation({mutationFn: getProject, enabled: false});
    const {data: {data: {issues} = {}} = {}, isSuccess: issuesFetched, isPending: isFetchingIssues, mutate: getIssues} = useMutation({mutationFn: getAllIssuesByProjectId, enabled: false});
    const [selectedProject, setSelectedProject] = useState(null);
    const [issuesByGroup, setIssuesByGroup] = useState(null);
    const groupIssuesByStatus = useCallback((issues) => {
        const issuesByGroup = Object.groupBy(issues, ({ status }) => status);
        setIssuesByGroup(issuesByGroup);
    }, []);

    useEffect(() => {
        if (isNil(selectedProject) && !isEmpty(projects)) {
            getProjectByIdMutate({projectId: projects[0]._id});
            getIssues({projectId: projects[0]._id})
        }
    },[getIssues, getProjectByIdMutate, projects, selectedProject]);

    useEffect(() => {
        if (projectData?.data?.project) {
            setSelectedProject(projectData?.data?.project);
        }
    }, [projectData?.data?.project]);

    useEffect(() => {
        if (issues) {
            groupIssuesByStatus(issues);
        }
    }, [groupIssuesByStatus, issues]);

    function getIssueElement(issue) {
        return <a className='issue d-block mb-1.5' href='/kanban' key={issue.title}>
            <div className='issue-detail'>
                <p>{issue.title}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <FontAwesomeIcon icon={issueTypeIcons[issue.type]} className='d-inline-block'
                                         size='md' color={issueTypeColor[issue.type]}/>
                        <FontAwesomeIcon icon={issuePriorityIcons[issue.priority]} className='d-inline-block  pl-2'
                                         size='md' color={issuePriorityColor[issue.priority]}/>
                    </div>
                    <div className="d-flex ml-0.5">

                    </div>
                </div>
            </div>
        </a>
    }

    return (
        <div className='p-3 d-flex flex-column'>
            <div className='d-flex justify-content-between'>
                <div><h1
                    className="text-gray-700 text-2xl">{selectedProject?.name ? selectedProject.name : 'Kanban Board'}</h1>
                </div>
                <div>
                    <DropdownButton
                        title='Switch Project'
                        id='dropdown-menu'
                        size='sm'
                        variant='outline-info'
                        drop='start'
                    >
                        {
                            isFetching &&
                            <Dropdown.Item>
                                Fetching Projects<span className="spinner-border spinner-border-sm mx-1" role="status"></span>
                            </Dropdown.Item>
                        }
                        {
                            isSuccess && projects &&
                            projects?.map(project => (
                                <Dropdown.Item key={project.name}
                                               eventKey={project.name}>{project.name}</Dropdown.Item>
                            ))
                        }

                    </DropdownButton>
                </div>
            </div>
            <div className='d-flex align-items-center mt-6'>
                <div className="search-box mr-4 w-40">
                    <i className="fa fa-search"></i>
                    <input type="text"
                           className="form-control font-circular-book h-8 !bg-gray-100"/>
                </div>
                <div className='members-div d-flex'>
                    <span className="flex -space-x-2 overflow-hidden">
                        {
                            selectedProject?.members?.map(member => (
                                <InitialsAvatar
                                    className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold font-circular-book ${avatarBgColors[member.avatarBgColor]}`}
                                    key={member.name}
                                    name={member.name}/>
                            ))
                        }
                    </span>
                </div>
                <button className="filter-button ml-1.5">
                    <span>Only My Issues</span>
                </button>
                <button className="filter-button ml-1.5">
                    <span>Recently Updated</span>
                </button>
            </div>

            <div className="kanban-div d-flex font-circular-book">
                <div className="categories d-flex flex-column">
                    <div className="title">
                        Backlog
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                        {
                            issuesFetched && issuesByGroup &&
                            issuesByGroup['backlog']?.map(issue => (
                                getIssueElement(issue)
                            ))
                        }
                    </div>
                </div>
                <div className="categories d-flex flex-column">
                    <div className="title">
                        Selected For Development
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                    </div>
                </div>
                <div className="categories d-flex flex-column">
                    <div className="title">
                        In Progress
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                    </div>
                </div>
                <div className="categories d-flex flex-column">
                    <div className="title">
                        Done
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
