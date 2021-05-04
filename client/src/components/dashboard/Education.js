import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom'
//Redux
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
    //after getting prop from its parent element dashboard we map through all array elements and add them to DOM
    const educations = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{' '}
                {edu.to === null ? (
                    ' Now'
                ) : (
                    <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
                )}
            </td>
            <td>
                <button onClick={() => deleteEducation(edu._id)} className='btn btn-danger'>
                    <i className="far fa-trash-alt"></i> <span className="hide-sm">Delete</span>
                </button>
            </td>
            <td>
                {/* To send props via Link we use 'to' object */}
                <Link to={{ pathname: '/edit-education', eduId: edu._id }} className='btn btn-success'>
                    <i className="far fa-edit"></i> <span className="hide-sm">Edit</span>
                </Link>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className='my-2'>Education Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Years</th>
                        <th className="hide-sm" />
                        <th />
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </Fragment>
    );
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);