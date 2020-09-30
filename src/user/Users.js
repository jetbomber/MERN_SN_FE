import React, { Component } from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/user_avatar.jpg";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      page: 1,
      totalItems: 1,
      itemsPerPage: 1,
      itemClass: "page-item",
      linkClass: "page-link",
    };
  }

  componentDidMount() {
    this.loadUsers(this.state.page);
  }

  loadUsers = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          totalItems: data.totalItems,
          itemsPerPage: data.perPage,
          users: data.users,
        });
        console.log(this.state.users.length);
      }
    });
  };

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ page: pageNumber });
    this.loadUsers(pageNumber);
  }

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
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray pl-1">
            <Link to={`/user/${user._id}`} className="d-block text-gray-dark">
              {user.name}
            </Link>
            {user.email}
          </p>
          <Link
            to={`/user/${user._id}`}
            className="btn btn-raised btn-secondary btn-sm"
          >
            View Profile
          </Link>
        </div>
      ))}
    </div>
  );

  render() {
    const { users, page, itemsPerPage, totalItems } = this.state;
    return (
      <main className="container">
        <h2 className="mt-5 mb-5 lh-125 border-bottom border-gray">Users</h2>
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

export default Users;
