import './CreateProject.css';
import Quill from "quill";
import {useEffect, useRef, useState} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";
import {isEmpty} from "lodash/fp";
export const CreateProject = () => {
    const ref = useRef(null);
    const isMounted = useRef(false);
    const [name, setName] = useState('');
    const projectCategories = ['Software', 'Business', 'Marketing'];
    const [selectedCategory, setSelectedCategory] = useState(projectCategories[0]);
    const [description, setDescription] = useState('');

    const setProjectName = (name) => setName(name);
    const setCategory = (option) => setSelectedCategory(option);

    function shouldDisableSubmit() {
        return ([name, selectedCategory].some(field => isEmpty(field)));
    }

    function createProject() {

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
                    <h1 className="heading">Create Project</h1>
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
                                onClick={createProject}
                                className="btn btn-primary btn-md" type="submit">
                            Create Project
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}
