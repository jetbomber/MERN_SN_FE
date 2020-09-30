import React, { Component } from "react";
import { findPeople, follow } from "./apiUser";
import DefaultProfile from "../images/user_avatar.jpg";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Pagination from "react-js-pagination";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      page: 1,
      totalItems: 1,
      itemsPerPage: 1,
      itemClass: "page-item",
      linkClass: "page-link",
      error: "",
      open: false,
    };
  }

  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token, this.state.page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          totalItems: data.totalItems,
          itemsPerPage: data.perPage,
          users: data.users,
        });
      }
    });
  }

  handlePageChange(pageNumber) {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    console.log(`active page is ${pageNumber}`);
    this.setState({ page: pageNumber });
    findPeople(userId, token, pageNumber).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          totalItems: data.totalItems,
          itemsPerPage: data.perPage,
          users: data.users,
        });
      }
    });
  }

  clickFollow = (person, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    follow(userId, token, person._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(i, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${person.name}`,
        });
      }
    });
  };

  renderUsers = (users) => (
    <div className="my-3 p-3 bg-white rounded box-shadow">
      {users.map((user, i) => (
        <div className="media text-muted pt-3" key={i}>
          <img
            style={{ height: "55px", width: "55px" }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray pl-1">
            <Link to={`/user/${user._id}`} className="d-block text-gray-dark">
              {user.name}
            </Link>
            {user.email}
          </p>
          <button
            onClick={() => this.clickFollow(user, i)}
            className="btn btn-raised btn-primary float-right btn-sm"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );

  renderUsersOld = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-secondary btn-sm"
            >
              View Profile
            </Link>
            <button
              onClick={() => this.clickFollow(user, i)}
              className="btn btn-raised btn-primary float-right btn-sm"
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const {
      users,
      page,
      itemsPerPage,
      totalItems,
      open,
      followMessage,
    } = this.state;
    return (
      <main className="container">
        <h2 className="mt-5 mb-5 lh-125 border-bottom border-gray">
          Find People
        </h2>
        {open && (
          <div className="alert alert-success">
            <p>{followMessage}</p>
          </div>
        )}
        {this.renderUsers(users)}
        {totalItems > itemsPerPage && (
          <div>
            <Pagination
              activePage={page}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={totalItems}
              itemClass={this.state.itemClass}
              linkClass={this.state.linkClass}
              onChange={this.handlePageChange.bind(this)}
            />
          </div>
        )}
      </main>
    );
  }
}

export default FindPeople;
