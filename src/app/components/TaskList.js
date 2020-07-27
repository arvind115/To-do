/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { connect } from "react-redux";
import React from "react";
import { requestTaskCreation } from "../store/mutations";
import { ConnectedTaskListItem } from "./TaskListItem";

const imgSrc = {
  todo:
    "https://i.pinimg.com/originals/52/6a/bf/526abf16cc3e74882fa7304abc0f841c.png",
  inprogress:
    "https://cdn1.iconfinder.com/data/icons/business-colored-icons-vol-2/128/085-512.png",
  finished:
    "https://to-do-cdn.microsoft.com/static-assets/c87265a87f887380a04cf21925a56539b29364b51ae53e089c3ee2b2180148c6/icons/logo.png",
};

const styles = {
  height: "160px",
  width: "160px",
  padding: "3px 0px 3px 3px",
};

export const TaskList = ({ tasks, name, createNewTask, id }) => (
  <div className="card" style={{ width: "18rem" }}>
    <img
      className="card-img-top"
      src={imgSrc[name.split(" ").join("").toLowerCase()]}
      alt="Card image cap"
      style={styles}
    />
    <div className="card-body">
      <h5 className="card-title">{name}</h5>
    </div>
    <ul className="list-group list-group-flush">
      {tasks.map((task) => (
        <ConnectedTaskListItem {...task} key={task.id} />
      ))}
    </ul>
    <div className="card-body">
      <button
        className="btn-sm btn-block btn-success mt-2"
        onClick={() => createNewTask(id)}
      >
        {" "}
        Add New{" "}
      </button>
    </div>
  </div>
);

const mapStateToProps = (state, { name, id }) => {
  return {
    name: name,
    tasks: state.tasks.filter((task) => task.group === id),
    id,
  };
};

const mapDispatchToProps = (dispatch, { id }) => ({
  createNewTask() {
    dispatch(requestTaskCreation(id));
  },
});

export const ConnectedTaskList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
