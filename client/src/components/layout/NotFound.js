import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <Fragment>
            <h1 className='x-large text-primary'>
                <i className='fas fa-exclamation-triangle' /> Page Not Found
            </h1>
            <p className='large'>Whoa! You found a page that does not exist.</p>
            <Link to='/' className="btn btn-primary">
                Home
            </Link>
        </Fragment>
    );
};

export default NotFound;