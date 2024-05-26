import './CreateProject.css';
import Quill from "quill";
import {useEffect, useMemo, useRef, useState} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";
import {isEmpty} from "lodash/fp";
import {useMutation} from "@tanstack/react-query";
import {createProject as createProjectRequest, getProject} from "../apiRequests";
import {useLocation, useNavigate} from "react-router-dom";
export const CreateProject = () => {
    const ref = useRef(null);
    const isMounted = useRef(false);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const {projectCategories} = useMemo(() => ({
        projectCategories: ['Software', 'Business', 'Marketing'],
    }), []);
    const [selectedCategory, setSelectedCategory] = useState(projectCategories[0]);
    const [description, setDescription] = useState('');
    const { state } = useLocation();

    const {mutate: getProjectMutate} = useMutation({mutationFn: getProject, enabled: false, onSuccess: (data) => setEditProjectDetails(data?.data?.project)});

    function setEditProjectDetails(editData) {
        setName(editData.name);
        ref.current.root.innerHTML = editData.description;
        setCategory(editData.category);
    }

    useEffect(() => {
        if (state?.projectId) {
            getProjectMutate({projectId: state.projectId});
        } else {
            setName('');
            setCategory(projectCategories[0]);
            if (ref?.current?.root?.innerHTML) ref.current.root.innerHTML = '';
        }
    }, [getProjectMutate, projectCategories, state]);

    const {mutate, isPending, isSuccess} = useMutation({
        mutationFn: createProjectRequest,
        onSuccess: () => navigate('/')
    });

    const setProjectName = (name) => setName(name);
    const setCategory = (option) => setSelectedCategory(option);

    function shouldDisableSubmit() {
        return ([name, selectedCategory].some(field => isEmpty(field)) || isPending || isSuccess);
    }

    function createProject(e) {
        e.preventDefault();
        mutate({name, category: selectedCategory, description});
    }

    function updateProject(e) {
        e.preventDefault();
        mutate({name, category: selectedCategory, description, projectId: state?.projectId});
    }


    useEffect(() => {
        if (!isMounted.current) {
            ref.current = new Quill(ref.current, {
                placeholder: 'Describe the project in as much detail as you\'d like...',
                theme: 'snow',
            });
            ref.current.on('text-change', function() {
                const formattedText = ref.current?.root?.innerHTML;
                setDescription(formattedText);
            });
            isMounted.current = true;
        }
    }, []);

    return (
        <>
            <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet"/>
            <div className="createProject">
                <form className="project-form">
                    {
                        state?.projectId ? <h1 className="heading">Edit Project</h1> :
                            <h1 className="heading">Create Project</h1>
                    }
                    <div className="mt-3" data-testid="form-field:name">
                        <label htmlFor="form-field-5" className="form-label-custom">Name</label>
                        <div className="form-input-div">
                            <input id="form-field-5" name="name" className="form-input" value={name}
                                   onChange={(e) => setProjectName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="mt-3" data-testid="form-field:description">
                        <label htmlFor="form-field-5" className="form-label-custom">Description</label>
                        <div ref={ref} id="editor"></div>
                    </div>
                    <div className="mt-3" data-testid="form-field:category">
                        <label htmlFor="form-field-5" className="form-label-custom">Project Category</label>
                        <div className="form-input-div">
                            <DropdownButton
                                title={selectedCategory}
                                id="dropdown-menu"
                                onSelect={setCategory}
                            >
                                {
                                    projectCategories?.map((projectCategory) => (
                                        <Dropdown.Item key={projectCategory}
                                                       eventKey={projectCategory}>{projectCategory}</Dropdown.Item>
                                    ))
                                }
                            </DropdownButton>
                        </div>
                    </div>
                    <div className="my-sm-4">
                        <button disabled={shouldDisableSubmit()}
                                onClick={state?.projectId ? updateProject : createProject}
                                className="btn btn-primary btn-md" type="submit">
                            {!state?.projectId && (!isSuccess || !isPending) && <span>{!isPending && <span>Create</span>}{isPending && <span>Creating</span>} Project</span>}
                            {state?.projectId && (!isSuccess || !isPending) && <span>{!isPending && <span>Save</span>}{isPending && <span>Saving</span>}</span>}
                            {isPending && <span className="spinner-border spinner-border-sm mx-1" role="status"></span>}
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}
