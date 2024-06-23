import React, {useRef, useEffect, forwardRef, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CommonEditor.css';
import InitialsAvatar from "react-initials-avatar";
import {avatarBgColors} from "../constants/avatarBgColors";
import moment from "moment/moment";
import {OverlayTrigger, Popover} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

const CommentEditor = forwardRef(({ value, onChange, handleSaveComment }, ref) => {
    const [showSaveCommentBtn, setShowSaveCommentBtn] = useState(false);
    const [editedComment, setEditedComment] = useState(value);
    return (
        <>
            <ReactQuill
                ref={ref}
                value={editedComment}
                onChange={(content) => setEditedComment(content)}
                onChangeSelection={(range) => {
                    if (!range) setEditedComment(value);
                    setShowSaveCommentBtn(!!range);
                }}
                modules={{
                    toolbar: false,
                }}
            />
            {
                showSaveCommentBtn &&
                <button
                    onClick={() => {
                        setShowSaveCommentBtn(false);
                        handleSaveComment(editedComment);
                    }}
                    className="btn btn-primary btn-sm my-2 jiraBlue max-w-[48px]">
                    Save
                </button>
            }
        </>
    );
});

const DynamicQuillContainer = ({issueComments, onUpdateComment, onDeleteComment}) => {
    const quillRefs = useRef([]);

    useEffect(() => {
        quillRefs.current = quillRefs.current.slice(0, issueComments.length);
    }, [issueComments]);

    return (
        <div>
            {
                issueComments?.map((comment, index) => (
                    <div className='d-flex pt-3' key={comment.id}>
                        <div>
                            <InitialsAvatar
                                className={`initials-avatar !w-7 !h-7 !rounded-full font-semibold font-circular-book ${avatarBgColors[comment?.commentor?.defaultAvatarBgColor]}`}
                                key={comment?.commentor?.name}
                                name={comment?.commentor?.name}/>
                        </div>
                        <div className='pl-2 d-flex flex-column'>
                            <div className='pb-2 d-flex'>
                                <span className='font-circular-medium'>{comment?.commentor?.name}</span>
                                <span className='pl-2.5 text-[#42526E]'>{moment(Number(comment?.updatedAt || 0)).fromNow()}</span>
                                <div className='ml-3'>
                                    <OverlayTrigger
                                        trigger='click'
                                        placement="auto"
                                        rootClose
                                        overlay={
                                            <Popover id="popover-basic">
                                                <Popover.Body className='p-3'>
                                                    <div>
                                                        <span className='font-semibold'>Are you sure?</span>
                                                    </div>
                                                    <div className='mt-2 d-flex space-x-3'>
                                                        <button className="btn btn-outline-secondary btn-xs"
                                                                type="submit"
                                                                onClick={() => document.body.click()}
                                                        >
                                                            <span>Cancel</span>
                                                        </button>
                                                        <button onClick={() => onDeleteComment(comment.id)} className="btn btn-primary btn-xs"
                                                                type="submit">
                                                            <span>Confirm</span>
                                                        </button>
                                                    </div>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <button>
                                            <FontAwesomeIcon icon={faTrashCan} className='text-gray-400 hover:text-gray-700 active:text-gray-700' size='sm'/>
                                        </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <CommentEditor
                                ref={quillRefs.current[index]}
                                value={comment?.description}
                                handleSaveComment={(val) => onUpdateComment(comment.id, val)}
                            />

                        </div>
                    </div>
                ))
            }

        </div>
    );
};

export default DynamicQuillContainer;
