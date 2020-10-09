import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/post.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignIn: false,
    like: false,
    likes: 0,
    comments: [],
  };

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments,
        });
      }
    });
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignIn: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then((data) => {
      if (data.err) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure that you want to delete this post?"
    );
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";
    const { like, likes } = this.state;
    return (
      <div className="my-3 p-3 bg-white rounded box-shadow">
        <div className="row">
          <div className="col-md-4">
            <img
              src={`${process.env.REACT_APP_API_URL}/post/photo/${
                post._id
              }?${new Date().getTime()}`}
              alt={post.title}
              onError={(i) => (i.target.src = `${DefaultPost}`)}
              className="img-fluid mb-3"
              style={{ height: "200px", width: "auto" }}
            />
          </div>
          <div className="col-md-8">
            <div className="row">
              <p className="card-text">{post.body}</p>
            </div>
            <br />
            <div className="row mark">
              <div className="col-md-8 d-flex align-items-center">
                <p className="font-italic">
                  Posted by{" "}
                  <Link to={`${posterId}`}>
                    {posterName} {""}{" "}
                  </Link>
                  on {new Date(post.created).toDateString()}
                </p>
              </div>
              <div className="col-md-4">
                {like ? (
                  <h5 onClick={this.likeToggle}>
                    <i
                      className="fa fa-thumbs-up text-success bg-dark"
                      style={{ padding: "5px", borderRadius: "50%" }}
                    />{" "}
                    {likes} Like
                  </h5>
                ) : (
                  <h5 onClick={this.likeToggle}>
                    <i
                      className="fa fa-thumbs-up red-text bg-dark"
                      style={{ padding: "5px", borderRadius: "50%" }}
                    />{" "}
                    {likes} Like
                  </h5>
                )}
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col-md-6">
                {" "}
                <Link
                  to={`/`}
                  className="btn btn-raised btn-primary btn-sm mr-2"
                >
                  Back to Posts
                </Link>
                {isAuthenticated().user &&
                  isAuthenticated().user._id === post.postedBy._id && (
                    <>
                      <Link
                        to={`/post/edit/${post._id}`}
                        className="btn btn-raised btn-secondary btn-sm mr-2"
                      >
                        Update Post
                      </Link>
                      <button
                        onClick={this.deleteConfirmed}
                        className="btn btn-raised btn-danger btn-sm"
                      >
                        Delete Post
                      </button>
                    </>
                  )}
              </div>
              <div class="col-md-6">
                {isAuthenticated().user &&
                  isAuthenticated().user.role === "admin" &&
                  isAuthenticated().user._id !== post.postedBy._id && (
                    <div>
                      <Link
                        to={`/post/edit/${post._id}`}
                        className="btn btn-raised btn-secondary btn-sm mr-2"
                      >
                        Update Post
                      </Link>
                      <button
                        onClick={this.deleteConfirmed}
                        className="btn btn-raised btn-danger btn-sm"
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignIn, comments } = this.state;
    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignIn) {
      return <Redirect to={`/signin`} />;
    }
    return (
      <main className="container">
        <h2 className="mt-5 mb-5 lh-125 border-bottom border-gray">
          {post.title}
        </h2>

        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}

        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </main>
    );
  }
}

export default SinglePost;
