import './Kanban.css';
import InitialsAvatar from "react-initials-avatar";
import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {isEmpty, isNil} from "lodash/fp";
import {getAllProjectsWithJustNameAndId, getProject} from "../apiRequests";
export const Kanban = () => {
    const {data: {data: {projects} = {}} = {}, isSuccess, isFetching} = useQuery({queryKey: ["projects"], queryFn: getAllProjectsWithJustNameAndId});
    const {mutate: getProjectByIdMutate, data: projectData = {}} = useMutation({mutationFn: getProject, enabled: false});
    const [selectedProject, setSelectedProject] = useState(null);
    useEffect(() => {
        if (isNil(selectedProject) && !isEmpty(projects)) {
            getProjectByIdMutate({projectId: projects[0]._id});
        }
    },[getProjectByIdMutate, projects, selectedProject]);

    useEffect(() => {
        if (projectData?.data?.project) {
            setSelectedProject(projectData?.data?.project);
        }
    }, [projectData?.data?.project]);
    return (
        <div className='p-3 d-flex flex-column'>
            <div className='d-flex justify-content-between'>
                <div><h1 className="text-gray-700 text-2xl">{selectedProject?.name ? selectedProject.name : 'Kanban Board'}</h1></div>
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
                                    className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold font-circular-book !bg-[#EC871D]`}
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
                    <div className="tasks-div"></div>
                </div>
                <div className="categories d-flex flex-column">
                    <div className="title">
                        Selected For Development
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div"></div>
                </div>
                <div className="categories d-flex flex-column">
                    <div className="title">
                        In Progress
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div"></div>
                </div>
                <div className="categories d-flex flex-column">
                    <div className="title">
                        Done
                        <span className="count pl-1">2</span>
                    </div>
                    <div className="tasks-div"></div>
                </div>
            </div>
        </div>
    )
}
