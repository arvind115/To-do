/* eslint-disable react/prop-types */
/**
 * The task detail component route is a more sophisticated form that has many different fields.
 * The component automatically calls the REST API [via a mutation] to update the server on every change.
 */
import React from "react";
const { v4: uuidv4 } = require("uuid");
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ConnectedUsernameDisplay } from "./UsernameDisplay";
import {
  setTaskCompletion,
  addTaskComment,
  setTaskGroup,
  setTaskName,
} from "../store/mutations";

const TaskDetail = ({
  id,
  comments,
  task,
  isOwner,
  isComplete,
  sessionID,
  groups,
  selectedGroupId,

  setTaskCompletion,
  addTaskComment,
  setTaskGroup,
  setTaskName,
}) => {
  return (
    <div className="cardf p-3">
      {isOwner ? (
        <div>
          <input
            type="text"
            value={task.name}
            onChange={setTaskName}
            className="form-control"
          />
        </div>
      ) : (
        <h3>
          {task.name} {isComplete ? `✓` : null}
        </h3>
      )}
      <hr />
      <div className="mt-3">
        {isOwner ? (
          <div>
            <div>
              You own this task.
              <button
                className="btn btn-primary ml-2 btn-sm"
                onClick={() => setTaskCompletion(id, !isComplete)}
              >
                {isComplete ? `Reopen` : `Complete`} this Task
              </button>
            </div>
          </div>
        ) : (
          <div>
            <ConnectedUsernameDisplay id={task.owner} /> is the owner of this
            task.
          </div>
        )}
      </div>
      <div className="mt-2">
        {comments.map((comment) => (
          <div key={comment.id}>
            <ConnectedUsernameDisplay id={comment.owner} /> : {comment.content}
          </div>
        ))}
      </div>
      <hr />
      <form className="form-inline">
        <span className="mr-4">Change Group</span>
        <select
          onChange={setTaskGroup}
          className="form-control"
          defaultValue={selectedGroupId}
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </form>
      <hr />
      <div className="mt-2">
        <form
          className="form-inline"
          onSubmit={(e) => addTaskComment(id, sessionID, e)}
        >
          <input
            type="text"
            name="commentContents"
            autoComplete="off"
            placeholder="Add a comment"
            className="form-control"
          />
          <button type="submit" className="btn btn-primary btn-sm mt-2">
            Submit
          </button>
        </form>
      </div>
      <div>
        <hr />
        <Link to="/dashboard">
          <button className="btn btn-info btn-sm mt-2 round">Done</button>
        </Link>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  let id = ownProps.match.params.id;
  let task = state.tasks.find((task) => task.id === id);
  let comments = state.comments.filter((comment) => comment.task === id);
  let isOwner = state.session.id === task.owner;
  let groups = state.groups;

  const selectedGroupId = state.groups.filter(
    (group) => group.id === task.group
  )[0].id;
  return {
    id,
    task,
    comments,
    isOwner,
    sessionID: state.session.id,
    isComplete: task.isComplete,
    groups,
    selectedGroupId,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  let id = ownProps.match.params.id;
  return {
    setTaskCompletion(id, isComplete) {
      dispatch(setTaskCompletion(id, isComplete));
    },
    setTaskGroup(e) {
      dispatch(setTaskGroup(id, e.target.value));
    },
    setTaskName(e) {
      dispatch(setTaskName(id, e.target.value));
    },
    addTaskComment(taskID, ownerID, e) {
      let input = e.target[`commentContents`];
      let commentID = uuidv4();
      let content = input.value;
      e.preventDefault();
      if (content !== ``) {
        input.value = ``;
        dispatch(addTaskComment(commentID, taskID, ownerID, content));
      }
    },
  };
}

export const ConnectedTaskDetail = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskDetail);
