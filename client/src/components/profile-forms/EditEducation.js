import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Redux
import { connect } from 'react-redux';
import { getCurrentProfile, updateEducation } from '../../actions/profile';

const EditEducation = ({ profile: { profile, loading }, getCurrentProfile, history, location, updateEducation }) => {

    //function to add 0 if date/month is single digit
    function formatting(target) {
        return target < 10 ? '0' + target : target;
    }


    useEffect(() => {
        getCurrentProfile();
        const eduToEdit = profile.education.filter(edu => edu._id === location.eduId);

        let fromDate = new Date(eduToEdit[0].from);
        let toDate = new Date(eduToEdit[0].to);
        const toDateString = `${toDate.getFullYear()}-${formatting(toDate.getMonth())}-${formatting(toDate.getDate())}`;
        const fromDateString = `${fromDate.getFullYear()}-${formatting(fromDate.getMonth())}-${formatting(fromDate.getDate())}`;
        // console.log(eduToEdit);
        setFormData({
            school: loading || !eduToEdit[0].school ? '' : eduToEdit[0].school,
            degree: loading || !eduToEdit[0].degree ? '' : eduToEdit[0].degree,
            fieldofstudy: loading || !eduToEdit[0].fieldofstudy ? '' : eduToEdit[0].fieldofstudy,
            from: loading || !eduToEdit[0].from ? '' : fromDateString,
            to: loading || !eduToEdit[0].to ? '' : toDateString,
            current: loading || !eduToEdit[0].current ? false : eduToEdit[0].current,
            description: loading || !eduToEdit[0].description ? '' : eduToEdit[0].description
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentProfile, loading])

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        description,
        current
    } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Add Your Education</h1>
            <p className="lead">
                <i className="fas fa-code-branch" /> Add any school or bootcamp that you
                have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={e => { e.preventDefault(); updateEducation(location.eduId, formData, history); }}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* School or Bootcamp"
                        name="school"
                        value={school}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Degree or Certificate"
                        name="degree"
                        value={degree}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Field of Study"
                        name="fieldofstudy"
                        value={fieldofstudy}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input
                        type="date"
                        name="from"
                        value={from}
                        onChange={e => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <p>
                        <input
                            type="checkbox"
                            name="current"
                            checked={current}
                            value={current}
                            onChange={() => setFormData({ ...formData, current: !current })}
                        /> {' '}
                        Current School
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input
                        type="date"
                        name="to"
                        value={to}
                        onChange={e => onChange(e)}
                        disabled={current}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Program Description"
                        value={description}
                        onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">
                    Go Back
                </Link>
            </form>
        </Fragment>
    );
};

EditEducation.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    updateEducation: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, updateEducation })(EditEducation);