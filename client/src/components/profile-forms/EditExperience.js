import React, { Fragment, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
//Redux
import { connect } from 'react-redux';
import { getCurrentProfile, updateExperience } from '../../actions/profile';

const EditExperience = ({ profile: { profile, loading }, getCurrentProfile, history, updateExperience }) => {

    //used useLocation hook here instead of location as prop because location variable was already defined
    const loc = useLocation();
    //function to add 0 if date/month is single digit
    function formatting(target) {
        return target < 10 ? '0' + target : target;
    }

    useEffect(() => {
        getCurrentProfile();
        const expToEdit = profile.experience.filter(exp => exp._id === loc.expId);
        let fromDate = new Date(expToEdit[0].from);
        let toDate = new Date(expToEdit[0].to);
        const toDateString = `${toDate.getFullYear()}-${formatting(toDate.getMonth())}-${formatting(toDate.getDate())}`;
        const fromDateString = `${fromDate.getFullYear()}-${formatting(fromDate.getMonth())}-${formatting(fromDate.getDate())}`;

        // console.log(expToEdit);
        setFormData({
            company: loading || !expToEdit[0].company ? '' : expToEdit[0].company,
            title: loading || !expToEdit[0].title ? '' : expToEdit[0].title,
            location: loading || !expToEdit[0].location ? '' : expToEdit[0].location,
            from: loading || !expToEdit[0].from ? '' : fromDateString,
            to: loading || !expToEdit[0].to ? '' : toDateString,
            current: loading || !expToEdit[0].current ? false : expToEdit[0].current,
            description: loading || !expToEdit[0].description ? '' : expToEdit[0].description
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentProfile, loading])

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    const { company, title, location, from, to, current, description } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Add An Experience</h1>
            <p className="lead">
                <i className="fas fa-code-branch" /> Add any developer/programming
                positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={e => { e.preventDefault(); updateExperience(loc.expId, formData, history); }}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Job Title"
                        name="title"
                        value={title}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Company"
                        name="company"
                        value={company}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={location}
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
                            onChange={() => { setFormData({ ...formData, current: !current }); }}
                        /> {' '}
                        Current Job
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
                        placeholder="Job Description"
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
    )
}

EditExperience.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    updateExperience: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, updateExperience })(EditExperience);
