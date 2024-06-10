import './Kanban.css';
import InitialsAvatar from "react-initials-avatar";
import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import {isEmpty, isNil} from "lodash/fp";
import {getAllIssuesByProjectId, getAllProjectsWithJustNameAndId, getProject, updateIssue} from "../apiRequests";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {avatarBgColors} from "./constants/avatarBgColors";
import {
    issuePriorities,
    issuePriorityColor,
    issuePriorityIcons, issuePriorityTypes,
    issueStatus,
    IssueStatusEnum,
    issueTypeColor,
    issueTypeIcons, issueTypes
} from "./constants/issues";
import Modal from "react-bootstrap/Modal";
import {faTrashCan, faXmark} from "@fortawesome/free-solid-svg-icons";
import Quill from "quill";
import moment from "moment";
export const Kanban = () => {
    const {data: {data: {projects} = {}} = {}, isSuccess, isFetching} = useQuery({queryKey: ["projects"], queryFn: getAllProjectsWithJustNameAndId});
    const {mutate: getProjectByIdMutate, data: projectData = {}} = useMutation({mutationFn: getProject, enabled: false});
    const {data: {data: {issues} = {}} = {}, isSuccess: issuesFetched, isPending: isFetchingIssues, mutate: getIssues} = useMutation({mutationFn: getAllIssuesByProjectId, enabled: false});
    const {mutate: updateIssueMutate} = useMutation({mutationFn: updateIssue, enabled: false, onSuccess: (data) => {
            const updatedIssues = issues.map(issue => (issue.id === data?.data?.updatedIssue?.id ? { ...issue, ...data?.data?.updatedIssue } : issue));
            if (data?.data?.updatedIssue) setSelectedIssueDetails(data?.data?.updatedIssue);
            groupIssuesByStatus(updatedIssues);
        }});

    const [selectedProject, setSelectedProject] = useState(null);
    const [issuesByGroup, setIssuesByGroup] = useState(null);
    const [showIssueDetailsModal, setShowIssueDetailsModal] = useState(false);
    const [selectedIssueDetails, setSelectedIssueDetails] = useState(null);
    const [selectedIssueType, setSelectedIssueType] = useState(null);
    const [selectedIssuePriority, setSelectedIssuePriority] = useState('');
    const [selectedIssueStatus, setSelectedIssueStatus] = useState(null);
    const [selectedIssueDescription, setSelectedIssueDescription] = useState('');
    const [selectedIssueEstimate, setSelectedIssueEstimate] = useState(0);
    const groupIssuesByStatus = useCallback((issues) => {
        const issuesByGroup = Object.groupBy(issues, ({ status }) => status);
        setIssuesByGroup(issuesByGroup);
    }, []);

    const ref = useRef(null);
    const isMounted = useRef(false);

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

    useEffect(() => {
        if (showIssueDetailsModal) {
            ref.current = new Quill(ref.current, {
                placeholder: 'Describe the project in as much detail as you\'d like...',
                theme: 'snow',
            });
            ref.current.on('text-change', function() {
                const formattedText = ref.current?.root?.innerHTML;
                setSelectedIssueDescription(formattedText);
            });
            isMounted.current = true;
        }
    }, [showIssueDetailsModal]);

    const handleShowIssueModal = (issue) => {
        setSelectedIssueDetails(issue);
        setSelectedIssueDescription(issue.description);
        setSelectedIssueType(issue.type);
        setSelectedIssueStatus(issue.status);
        setSelectedIssuePriority(issue.priority);
        setSelectedIssueEstimate(issue.estimate);
        setShowIssueDetailsModal(true);
        setTimeout(() => {
            ref.current.root.innerHTML = issue.description;
        }, 100);
    };

    const handleCloseIssueModal = () => setShowIssueDetailsModal(false);

    const handleOnDrag = (e, issue) => {
        e.dataTransfer.setData('draggedIssue', JSON.stringify(issue));
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
            e.target.classList.add("grabbing");
        }, 50);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleOnDrop = (e, dropIssueStatus) => {
        e.target.classList.remove('grabbing');
        const stringData = e.dataTransfer.getData("draggedIssue");
        const draggedIssue = JSON.parse(stringData);
        if (draggedIssue.status && draggedIssue.status !== dropIssueStatus) updateIssueMutate({issueId: draggedIssue.id, payload: {status: dropIssueStatus}});
    }

    const handleSetIssueType = (val) => {
        setSelectedIssueType(val);
        if (selectedIssueDetails) {
            updateIssueMutate({issueId: selectedIssueDetails?.id, payload: {type: val}});
        }
    }

    const handleSetIssueDescription = (val) => {
        if (selectedIssueDetails) {
            updateIssueMutate({issueId: selectedIssueDetails?.id, payload: {description: selectedIssueDescription}});
        }
    }

    const handleSetIssueStatus = (val) => {
        setSelectedIssueStatus(val);
        if (selectedIssueDetails) {
            updateIssueMutate({issueId: selectedIssueDetails?.id, payload: {status: val}});
        }
    }

    const handleSetIssuePriority = (val) => {
        setSelectedIssuePriority(val);
        if (selectedIssueDetails) {
            updateIssueMutate({issueId: selectedIssueDetails?.id, payload: {priority: val}});
        }
    }

    const handleSetIssueEstimate = (event) => {
        setSelectedIssueEstimate(event?.target?.value);
        if (selectedIssueDetails) {
            updateIssueMutate({issueId: selectedIssueDetails?.id, payload: {estimate: event?.target?.value}});
        }
    }

    function getIssueElement(issue) {
        return <div key={issue.title} draggable={true} onDragStart={(e) => handleOnDrag(e, issue)}>
            <div className='issue d-block mb-1.5' role='button' onClick={() => handleShowIssueModal(issue)} >
                <div className='issue-detail'>
                    <p>{issue.title}</p>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FontAwesomeIcon icon={issueTypeIcons[issue.type]} className='d-inline-block'
                                             fontSize='20px' color={issueTypeColor[issue.type]}/>
                            <FontAwesomeIcon icon={issuePriorityIcons[issue.priority]} className='d-inline-block pl-1.5'
                                             fontSize='20px' color={issuePriorityColor[issue.priority]}/>
                            <span
                                className="badge badge-pill badge-primary !ml-1.5 !bg-gray-200 !text-gray-800 align-top">{issue.estimate}</span>
                        </div>
                        <div className="d-flex ml-0.5">
                            <InitialsAvatar
                                className={`initials-avatar !w-7 !h-7 !rounded-full font-semibold font-circular-book ${avatarBgColors[issue?.assignee?.defaultAvatarBgColor]}`}
                                key={issue?.assignee?.name}
                                name={issue?.assignee?.name}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    function getModalElement() {
        return <Modal size='lg' fullscreen='xl-down' show={showIssueDetailsModal} onHide={handleCloseIssueModal}>
            <Modal.Header className='issue-detail-modal header !border-b-0'>
                <div className="issue-type" tabIndex="0">
                    <div data-testid="select:type" className="type">
                        <DropdownButton
                            title={<>
                                <FontAwesomeIcon icon={issueTypeIcons[selectedIssueType]} className='d-inline-block'
                                                 fontSize='16px' color={issueTypeColor[selectedIssueType]}/>
                                <span className="pl-2 text-sm">{selectedIssueType}</span></>}
                            variant={'tertiary'}
                            className='status-btn !uppercase !text-xs !text-[#5E6C84] !tracking-wider task-btn'
                            onSelect={handleSetIssueType}
                        >
                            {
                                issueTypes.filter(type => type !== selectedIssueType)?.map(type => (
                                    <Dropdown.Item
                                        key={type}
                                        eventKey={type}
                                        className='uppercase p-2'>
                                        <div className='status-label'>{
                                            <>
                                                <FontAwesomeIcon icon={issueTypeIcons[type]} className='d-inline-block'
                                                                 fontSize='16px' color={issueTypeColor[type]}/>
                                                <span className="pl-2 text-sm">{type}</span></>
                                        }</div>
                                    </Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <button className="filter-button">
                        <FontAwesomeIcon icon={faTrashCan} size='1x'/>
                    </button>
                    <button className="filter-button" onClick={handleCloseIssueModal}>
                        <FontAwesomeIcon icon={faXmark} size='xl'/>
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body className='issue-detail-modal body'>
                <div className='pr-12 pt-3 w-8/12'>
                    <div className='title-text h-12 text-area'>
                        {selectedIssueDetails?.title}
                    </div>
                    <div className='desc-label'>Description
                        <div ref={ref} id="editor"></div>
                        <button
                            onClick={handleSetIssueDescription}
                            className="btn btn-primary btn-sm mt-2" type="submit">
                            Save
                        </button>
                    </div>

                </div>
                <div className='pt-1.5 w-4/12'>
                    <div className='issue-label'>Status</div>
                    <DropdownButton
                        className='status-btn'
                        title={IssueStatusEnum[selectedIssueStatus] ? IssueStatusEnum[selectedIssueStatus] : 'status'}
                        id="dropdown-menu"
                        onSelect={handleSetIssueStatus}
                    >
                        {
                            issueStatus?.filter(status => status !== selectedIssueStatus)?.map((status) => (
                                <Dropdown.Item
                                    key={status}
                                    eventKey={status}
                                    className='uppercase p-2'>
                                    <div className={`status-label ${status}`}>{IssueStatusEnum[status]}</div>
                                </Dropdown.Item>
                            ))
                        }
                    </DropdownButton>

                    <div className='issue-label'>Assignee</div>
                    <DropdownButton
                        className='status-btn'
                        title={selectedIssueDetails?.assignee?.name || 'assignee'}
                        id="dropdown-menu"
                        onSelect={setSelectedIssueStatus}
                    >
                        {
                            <div className='p-2'>
                                <div className="inputs">
                                    <i className="fa fa-search"></i>
                                    <input type="text"
                                           className="form-control font-circular-book"
                                           placeholder="Search Users..."/>
                                </div>
                            </div>
                        }
                    </DropdownButton>

                    <div className='issue-label'>Reporter</div>
                    <DropdownButton
                        className='status-btn'
                        title={selectedIssueDetails?.reporter?.name || 'reporter'}
                        id="dropdown-menu"
                        disabled={true}
                    >
                    </DropdownButton>

                    <div className='issue-label'>Priority</div>
                    <DropdownButton
                        className='status-btn'
                        title={<><FontAwesomeIcon icon={issuePriorityIcons[selectedIssuePriority]}
                                                  className='d-inline-block'
                                                  fontSize='15px' color={issuePriorityColor[selectedIssuePriority]}/>
                            <span className='pl-1'>{issuePriorityTypes[selectedIssuePriority]}</span></>}
                        id="dropdown-menu"
                        onSelect={handleSetIssuePriority}
                    >
                        {
                            issuePriorities?.filter(priority => priority !== selectedIssuePriority)?.map((priority) => (
                                <Dropdown.Item
                                    key={priority}
                                    eventKey={priority}
                                    className='uppercase p-2'>
                                    <div className='status-label'>
                                        <FontAwesomeIcon icon={issuePriorityIcons[priority]}
                                                         className='d-inline-block'
                                                         fontSize='15px' color={issuePriorityColor[priority]}/>
                                        <span className='pl-1'>{issuePriorityTypes[priority]}</span>
                                    </div>
                                </Dropdown.Item>
                            ))
                        }
                    </DropdownButton>

                    <div className='issue-label'>Original Estimate (Hours)</div>
                    <input type="text" value={selectedIssueEstimate}
                           className="form-control h-8 !bg-gray-200" onChange={handleSetIssueEstimate}/>

                    <div className='issue-label'>Time Spent (Hours)</div>
                    <input type="text" value={selectedIssueDetails?.timeSpent}
                           className="form-control cursor-not-allowed h-8 !bg-gray-200 focus:border-0 focus:!shadow-none" readOnly/>

                    <div className='created-div d-flex flex-column'>
                        <span>Created {moment(Number(selectedIssueDetails?.createdAt || 0)).fromNow()}</span>
                        <span>Updated {moment(Number(selectedIssueDetails?.updatedAt || 0)).fromNow()}</span>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    }

    return (
        <div className='p-3 d-flex flex-column'>
            <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
            {
                getModalElement()
            }
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
                                Fetching Projects<span className="spinner-border spinner-border-sm mx-1"
                                                       role="status"></span>
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
                <div className="categories d-flex flex-column" onDragOver={handleDragOver} onDrop={(e) => handleOnDrop(e, 'backlog')}>
                    <div className="title">
                        Backlog
                        <span className="badge badge-pill badge-primary bg-gray-400 count ml-1">{issuesByGroup?.backlog?.length || 0}</span>
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
                <div className="categories d-flex flex-column" onDragOver={handleDragOver} onDrop={(e) => handleOnDrop(e, 'selected')}>
                    <div className="title">
                        Selected For Development
                        <span className="badge badge-pill badge-primary bg-gray-400 count ml-1">{issuesByGroup?.selected?.length || 0}</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                        {
                            issuesFetched && issuesByGroup &&
                            issuesByGroup['selected']?.map(issue => (
                                getIssueElement(issue)
                            ))
                        }
                    </div>
                </div>
                <div className="categories d-flex flex-column" onDragOver={handleDragOver} onDrop={(e) => handleOnDrop(e, 'inprogress')}>
                    <div className="title">
                        In Progress
                        <span className="badge badge-pill badge-primary bg-gray-400 count ml-1">{issuesByGroup?.inprogress?.length || 0}</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                        {
                            issuesFetched && issuesByGroup &&
                            issuesByGroup['inprogress']?.map(issue => (
                                getIssueElement(issue)
                            ))
                        }
                    </div>
                </div>
                <div className="categories d-flex flex-column" onDragOver={handleDragOver} onDrop={(e) => handleOnDrop(e, 'done')}>
                    <div className="title">
                        Done
                        <span className="badge badge-pill badge-primary bg-gray-400 count ml-1">{issuesByGroup?.done?.length || 0}</span>
                    </div>
                    <div className="tasks-div">
                        {
                            isFetchingIssues &&
                            <span className="loading-shimmer h-100 d-block"></span>
                        }
                        {
                            issuesFetched && issuesByGroup &&
                            issuesByGroup['done']?.map(issue => (
                                getIssueElement(issue)
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
