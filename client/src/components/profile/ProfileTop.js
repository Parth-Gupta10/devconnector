import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({
    profile: {
        status,
        company,
        location,
        website,
        social,
        user: { name, avatar }
    }
}) => {
    return (
        <div className="profile-top bg-primary p-2">
            <img className="round-img my-1" src={avatar} alt="" />
            <h1 className="large">{name}</h1>
            <p className="lead">
                {status} {company ? <span> at {company}</span> : null}
            </p>
            <p>{location ? <span>{location}</span> : null}</p>
            <div className="icons my-1">
                {website ? (
                    <a href={website} target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-globe fa-2x" />
                    </a>
                ) : null}

                {/* here we convert social (object) to array by "Object.entries" function, for eg. if object is {twitter: 'link', facebook: 'link'}
                then it will convert it to [["twitter", "link"], ["facebook", "link"]].  After that we map through the array and destructure each array element to
                get key and value then we dynamically add it in anchor tag*/}
                {social
                    ? Object.entries(social).map(([key, value]) => (
                        <a key={key} href={value} target='_blank' rel='noopener noreferrer'>
                            <i className={`fab fa-${key} fa-2x`}></i>
                        </a>
                    ))
                    : null
                }
            </div>
        </div>
    );
};

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileTop;