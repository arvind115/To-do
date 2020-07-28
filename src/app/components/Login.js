/* eslint-disable react/prop-types */
/**
 * The login route component contains a simple form that checks authentication data via the server.
 */

import React from "react";
import * as mutations from "../store/mutations";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const LoginComponent = ({ authenticateUser, authenticated }) => (
  <div className="card p-3 col-md-3 col-sm-12 loginformdiv">
    <h5>User login</h5>
    <form onSubmit={authenticateUser} className="loginform">
      <input
        type="text"
        placeholder="username"
        name="username"
        defaultValue="Arvind"
        className="form-control"
      />
      <input
        type="password"
        placeholder="password"
        name="password"
        defaultValue="Singh"
        className="form-control mt-2"
      />
      {authenticated === mutations.NOT_AUTHENTICATED ? (
        <p>Login incorrect.</p>
      ) : null}
      <button
        type="submit"
        disabled={authenticated === `AUTHENTICATING`}
        className="mt-2 btn btn-primary"
      >
        {authenticated === `AUTHENTICATING` ? <Spinner /> : null}
        Login
      </button>
    </form>
    <h6>
      <Link to="signup">Do not have an account? Sign up.</Link>
    </h6>
  </div>
);

const mapStateToProps = ({ session }) => ({
  authenticated: session.authenticated,
});

const mapDispatchToProps = (dispatch) => ({
  authenticateUser(e) {
    e.preventDefault();
    let username = e.target[`username`].value;
    let password = e.target[`password`].value;
    dispatch(mutations.requestAuthenticateUser(username, password));
  },
});

export const ConnectedLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);
