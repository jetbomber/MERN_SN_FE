import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#f79e02" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-primary">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarCollapse"
      aria-controls="navbarCollapse"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarCollapse">
      <ul className="navbar-nav  mr-auto">
        <li className="nav-item active">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/users")}
            to="/users"
          >
            Users
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to={`/post/create`}
            style={isActive(history, `/post/create`)}
            className="nav-link"
          >
            Create Post
          </Link>
        </li>

        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Sign up
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                to={`/findpeople`}
                style={isActive(history, `/findpeople`)}
                className="nav-link"
              >
                Find People
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/user/${isAuthenticated().user._id}`}
                style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              >
                {`${isAuthenticated().user.name}'s profile`}
              </Link>
            </li>

            {isAuthenticated() && isAuthenticated().user.role === "admin" && (
              <li className="nav-item">
                <Link
                  to={`/admin`}
                  style={isActive(history, `/admin`)}
                  className="nav-link"
                >
                  Admin
                </Link>
              </li>
            )}

            <li className="nav-item">
              <span
                className="nav-link"
                style={
                  (isActive(history, "/signin"),
                  { cursor: "pointer", color: "#fff" })
                }
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  </nav>
);

export default withRouter(Menu);
