import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
//Redux
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post'

const PostItem = ({
    auth,
    addLike,
    removeLike,
    deletePost,
    post: { _id, text, name, avatar, user, likes, comments, date }
}) => (
    <div className='post bg-white p-1 my-1'>
        <div>
            <Link to={`/profile/${user}`}>
                <img className='round-img' src={avatar} alt='' />
                <h4>{name}</h4>
            </Link>
        </div>
        <div>
            <p className='my-1'>{text}</p>
            <p className='post-date'>
                Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
            </p>
            <button type='button' className='btn btn-light' onClick={() => addLike(_id)}>
                <i className='fas fa-thumbs-up' />{' '}
                <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>
            <button type='button' className='btn btn-light' onClick={() => removeLike(_id)}>
                <i className='fas fa-thumbs-down' />
            </button>
            <Link to={`/post/${_id}`} className='btn btn-primary'>
                Discussion{' '}
                {comments.length > 0 && (
                    <span className='comment-count'>{comments.length}</span>
                )}
            </Link>
            {/* show delete post button only when logged in user is the same person who posted that post */}
            {!auth.loading && user === auth.user._id && (
                <button type='button' className='btn btn-danger' onClick={() => deletePost(_id)}>
                    <i className="fas fa-trash-alt" />
                </button>
            )}
        </div>
    </div>
);

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);