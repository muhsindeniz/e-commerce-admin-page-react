import React, { useContext } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import { Link } from 'react-router-dom'

const Home = () => {

    let { mobile } = useContext(GlobalSettingsContext)
    let { name } = useContext(CompanySettingsContext);

    return (
        <>
            <h1>Selam</h1>
        </>
    )
}

export default Home
