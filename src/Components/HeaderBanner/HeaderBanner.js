import React from 'react'
import {Link} from 'react-router-dom'

const HeaderBanner = (props) => {

    let {page, targetPage} = props;

    return (
        <div className="breadcrumbs_area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="breadcrumb_content">
                            <h3>{page}</h3>
                            <ul>
                                <li><Link to="/">home</Link></li>
                                <li>{targetPage}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderBanner
