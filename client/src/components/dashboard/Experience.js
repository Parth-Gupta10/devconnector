import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
//Redux
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
    //after getting prop from its parent element dashboard we map through all array elements and add them to DOM
    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className='hide-sm'>{exp.title}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
                {exp.to === null ? (
                    ' Now'
                ) : (
                    <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
                )}
            </td>
            <td>
                <button onClick={() => deleteExperience(exp._id)} className='btn btn-danger'>
                    <i className="far fa-trash-alt"></i> <span className="hide-sm">Delete</span>
                </button>
            </td>
            <td>
                {/* To send props via Link we use 'to' object */}
                <Link to={{ pathname: '/edit-experience', expId: exp._id }} className='btn btn-success'>
                    <i className="far fa-edit"></i> <span className="hide-sm">Edit</span>
                </Link>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className='my-2'>Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className='hide-sm'>Title</th>
                        <th className='hide-sm'>Years</th>
                        <th className="hide-sm" />
                        <th />
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    );
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);