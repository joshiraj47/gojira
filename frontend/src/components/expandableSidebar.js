import './expandableSidebar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {useEffect, useRef, useState} from "react";
import {DropdownButton} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import {
    issuePriorities,
    issuePriorityColor,
    issuePriorityIcons,
    issuePriorityTypes,
    issueTypeColor,
    issueTypeIcons,
    issueTypes
} from "./constants/issues";
import Quill from "quill";
import InitialsAvatar from "react-initials-avatar";
import {avatarBgColors} from "./constants/avatarBgColors";
import {useAuth} from "./AuthProvider";
import {useMutation} from "@tanstack/react-query";
import {createIssue, searchProject, searchUsers} from "../apiRequests";
import {isEmpty} from "lodash/fp";
export const ExpandableSidebar = () => {
    const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();
    let {mutate: searchAssigneesMutate} = useMutation({mutationKey: 'searchAssignee', mutationFn: searchUsers, enabled: false, onSuccess: (data) => handleSearchAssignees(data)});
    let {mutate: searchProjectMutate} = useMutation({mutationKey: 'searchProject', mutationFn: searchProject, enabled: false, onSuccess: (data) => handleSearchProject(data)});
    const {mutate: createIsssueMutate, isPending} = useMutation({
        mutationFn: createIssue,
        onSuccess: () => {
            handleCloseCreateIssueModal();
            navigate('/kanban', { state: {projectId: selectedProject.id} });
        }
    });
    const [selectedProject, setSelectedProject] = useState(null);
    const [issueType, setIssueType] = useState(issueTypes[0]);
    const [issueTitle, setIssueTitle] = useState('');
    const [issueEstimate, setIssueEstimate] = useState(null);
    const [issueDescription, setIssueDescription] = useState('');
    const [issuePriority, setIssuePriority] = useState(issuePriorityTypes['low']);
    const [issueAssignee, setIssueAssignee] = useState(user ? {
        ...user,
        _id: user?.id
    } : null);
    const [searchAssigneesData, setSearchAssigneesData] = useState(null);
    const [searchProjectData, setSearchProjectData] = useState(null);

    const ref = useRef(null);
    const isMounted = useRef(false);

    const handleCloseCreateIssueModal = () => {
        setShowCreateIssueModal(false);
        resetSearchResults();
    };

    const handleSearchAssignees = (data) => {
        setSearchAssigneesData(data?.data?.users);
    }

    const handleSearchProject = (data) => {
        setSearchProjectData(data?.data?.projects);
    }

    const handleSetIssueAssignee = (assignee) => {
        setIssueAssignee(assignee);
        resetSearchResults();
        document.body.click();
    };

    const handleSetIssueProject = (project) => {
        setSelectedProject(JSON.parse(project));
        resetSearchResults();
        document.body.click();
    };

    const onSearchUser = (e) => {
        const searchTerm = e.target.value;
        const project = selectedProject;
        project.members = [];
        searchAssigneesMutate({searchTerm, project});
    }

    const onSearchProject = (e) => {
        const searchTerm = e.target.value;
        searchProjectMutate({searchTerm});
    }

    const handleCreateIssue = () => {
        createIsssueMutate({
            title: issueTitle,
            description: issueDescription,
            projectId: selectedProject.id,
            type: issueType,
            assigneeId: issueAssignee._id,
            priority: issuePriority,
            estimate: issueEstimate || 0
        });
    }

    function resetSearchResults() {
        setSearchAssigneesData([]);
        setSearchProjectData([]);
    }

    function shouldDisableSubmit() {
        return isEmpty(issueTitle) || isPending;
    }

    useEffect(() => {
        if (showCreateIssueModal) {
            ref.current = new Quill(ref.current, {
                placeholder: 'Describe the issue in as much detail as you\'d like...',
                theme: 'snow',
            });
            ref.current.on('text-change', function() {
                const formattedText = ref.current?.root?.innerHTML;
                setIssueDescription(formattedText);
            });
            isMounted.current = true;
        }
    }, [showCreateIssueModal]);


    function getModalElement() {
        return <Modal size='lg' fullscreen='xl-down' show={showCreateIssueModal} onHide={handleCloseCreateIssueModal}>
            <Modal.Header className='!border-b-0 p-4 pb-1'>
                <div className='title'>
                    <span>Create Issue</span>
                </div>
            </Modal.Header>
            <Modal.Body className='p-4 pt-0'>
                <div>
                    <label className='label' htmlFor='issue-type-field'>Issue Type</label>
                    <div className="form-input-div">
                        <DropdownButton
                            title={<div>
                                <FontAwesomeIcon icon={issueTypeIcons[issueType]} className='d-inline-block'
                                                 fontSize='16px' color={issueTypeColor[issueType]}/>
                                <span className="text-sm capitalize pl-2">{issueType}</span></div>}
                            id="dropdown-menu"
                            className=''
                            onSelect={setIssueType}
                        >
                            {
                                issueTypes.filter(type => type !== issueType)?.map(type => (
                                    <Dropdown.Item
                                        key={type}
                                        eventKey={type}
                                        className='capitalize p-2.5'>
                                        <div className=''>{
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

                    <label className='label mt-3.5' htmlFor='issue-type-field'>Short Summary</label>
                    <div className="form-input-div">
                        <input id="form-field-5" name="name" className="form-input" value={issueTitle}
                               onChange={(e) => setIssueTitle(e.target.value)}/>
                    </div>

                    <label className='label mt-3.5' htmlFor='issue-type-field'>Description</label>
                    <div ref={ref} id="editor"></div>

                    <label className='label mt-3.5' htmlFor='issue-type-field'>Project</label>
                    <div className="form-input-div">
                        <DropdownButton
                            title={selectedProject?.name || 'Select'}
                            id="dropdown-menu"
                            className='text-sm'
                            onSelect={handleSetIssueProject}
                        >
                            {
                                <div className='p-2'>
                                    <div className="inputs">
                                        <i className="fa fa-search"></i>
                                        <input type="text"
                                               className="form-control font-circular-book"
                                               onChange={onSearchProject}
                                               placeholder="Search Projects..."/>
                                    </div>
                                    {
                                        searchProjectData &&
                                        <div style={{
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}>
                                            <ul className="m-0 pl-0 !pt-1.5">
                                                {
                                                    searchProjectData?.map((project) => (
                                                        <Dropdown.Item className="list-group-item border-0 font-circular-book p-1 cursor"
                                                            key={JSON.stringify(project)}
                                                            eventKey={JSON.stringify(project)}>
                                                            <span className='pl-1.5 text-md'>{project.name}</span>
                                                        </Dropdown.Item>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    }
                                </div>
                            }
                        </DropdownButton>
                    </div>

                    <label className='label mt-3.5' htmlFor='issue-type-field'>Estimate</label>
                    <div className="form-input-div">
                        <input id="form-field-5" name="name" className="form-input" type={'number'} placeholder={'0'} value={issueEstimate || ''}
                               onChange={(e) => setIssueEstimate(e.target.value)}/>
                    </div>

                    <label className='label mt-3.5' htmlFor='issue-type-field'>Assignee</label>
                    <DropdownButton
                        className='status-btn'
                        title={<div>
                            <InitialsAvatar
                                className={`initials-avatar !w-7 !h-7 !rounded-full !ring-1 !ring-white font-semibold ${avatarBgColors[issueAssignee?.defaultAvatarBgColor]}`}
                                key={issueAssignee?.name}
                                name={issueAssignee?.name}/>
                            <span className='text-sm capitalize pl-2'>{issueAssignee?.name}</span>
                        </div>}
                        id="dropdown-menu"
                    >
                        {
                            <div className='p-2'>
                                <div className="inputs">
                                    <i className="fa fa-search"></i>
                                    <input type="text"
                                           className="form-control font-circular-book"
                                           onChange={onSearchUser}
                                           placeholder="Search Users..."/>
                                </div>
                                {
                                    searchAssigneesData &&
                                    <div style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}>
                                        <ul className="list-group pt-1.5">
                                            {
                                                searchAssigneesData?.map((user) => (
                                                    <li className="list-group-item border-0 font-circular-book p-1 cursor"
                                                        key={user._id} onClick={() => handleSetIssueAssignee(user)}>
                                                        <InitialsAvatar
                                                            className={`initials-avatar !w-8 !h-8 !rounded-full !ring-1 !ring-white font-semibold ${avatarBgColors[user.defaultAvatarBgColor]}`}
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
                            </div>
                        }
                    </DropdownButton>

                    <label className='label mt-3.5' htmlFor='issue-type-field'>Priority</label>
                    <div className="form-input-div">
                        <DropdownButton
                            title={<div>
                                <FontAwesomeIcon icon={issuePriorityIcons[issuePriority]} className='d-inline-block'
                                                 fontSize='16px' color={issuePriorityColor[issuePriority]}/>
                                <span className="text-sm capitalize pl-2">{issuePriority}</span></div>}
                            id="dropdown-menu"
                            className=''
                            onSelect={setIssuePriority}
                        >
                            {
                                issuePriorities.filter(priority => priority !== issuePriority)?.map(priority => (
                                    <Dropdown.Item
                                        key={priority}
                                        eventKey={priority}
                                        className='capitalize p-2.5'>
                                        <div className=''>{
                                            <>
                                                <FontAwesomeIcon icon={issuePriorityIcons[priority]}
                                                                 className='d-inline-block'
                                                                 fontSize='16px' color={issuePriorityColor[priority]}/>
                                                <span className="pl-2 text-sm">{priority}</span></>
                                        }</div>
                                    </Dropdown.Item>
                                ))
                            }
                        </DropdownButton>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={handleCreateIssue}
                    disabled={shouldDisableSubmit()}
                    className="btn btn-primary btn-sm jiraBlue" type="submit">
                    <span>{!isPending && <span>Create</span>}{isPending && <span>Creating</span>} Issue</span>
                    {isPending && <span className="spinner-border spinner-border-sm mx-1" role="status"></span>}
                </button>
                <button
                    onClick={handleCloseCreateIssueModal}
                    className="btn btn-tertiary btn-sm" type="submit">
                    <span>Cancel</span>
                </button>
            </Modal.Footer>
        </Modal>
    }

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
            {getModalElement()}
            <div className="sidebar jiraBlue z-1">
            <ul>
                    <li>
                        <Link onClick={() => setShowCreateIssueModal(true)}>
                            <FontAwesomeIcon icon={faPlus} fontSize="20px"/>
                            <span
                                className="text-uppercase mx-4 ps-1 create-font font-circular-bold">Create Issue</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}
