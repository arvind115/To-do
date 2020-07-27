/* eslint-disable react/prop-types */
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";

export const TaskListItem = ({ id, name, commentCount, isComplete }) => (
  <Link to={`/task/${id}`}>
    <div className="list-group-item">
      <span>
        {name} ({commentCount}) {isComplete ? `✓` : null}
      </span>
    </div>
  </Link>
);

export const ConnectedTaskListItem = connect((state, ownProps) => {
  return {
    ...state.tasks.find((task) => task.id === ownProps.id),
    commentCount: state.comments.filter(
      (comment) => comment.task === ownProps.id
    ).length,
  };
})(TaskListItem);
