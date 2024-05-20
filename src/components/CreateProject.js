import './CreateProject.css';
export const CreateProject = () => {
    return (
        <>
            <div className="createProject">
                <form className="project-form">
                    <h1 className="heading">Create Project</h1>
                    <div className="mt-3" data-testid="form-field:name">
                        <label htmlFor="form-field-5" className="form-label-custom">Name</label>
                        <div className="form-input-div">
                            <input id="form-field-5" name="name" className="form-input" value="singularity 1.0"/>
                        </div>
                    </div>
                    <div className="mt-3" data-testid="form-field:description">
                        <label htmlFor="form-field-5" className="form-label-custom">Description</label>
                        <div id="editor"></div>
                    </div>
                </form>
            </div>
        </>
    )
}
