import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/post.jpg";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1,
      totalItems: 1,
      itemsPerPage: 1,
      itemClass: "page-item",
      linkClass: "page-link",
    };
  }

  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          totalItems: data.totalItems,
          itemsPerPage: data.perPage,
          posts: data.posts,
        });
        console.log(this.state.posts.length);
      }
    });
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ page: pageNumber });
    this.loadPosts(pageNumber);
  }

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";

          return (
            <div className="col-md-4" key={i}>
              <div className="card mb-4 box-shadow" style={{ height: "520px" }}>
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(i) => (i.target.src = `${DefaultPost}`)}
                  className="card-img-top"
                  style={{ height: "200px", width: "100%" }}
                />

                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body.substring(0, 100)}</p>
                  <small className="text-muted mark">
                    {" "}
                    Posted by{" "}
                    <Link to={`${posterId}`}>
                      {posterName} {""}{" "}
                    </Link>
                    on {new Date(post.created).toDateString()}
                  </small>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="btn-group">
                      <Link
                        to={`/post/${post._id}`}
                        className="btn btn-raised btn-secondary btn-sm"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page, totalItems, itemsPerPage } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 lh-125 border-bottom border-gray">
          {!posts.length ? "Loading..." : "Posts"}
        </h2>
        {this.renderPosts(posts)}
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
      </div>
    );
  }
}

export default Posts;
