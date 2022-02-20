import React, {useState} from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Sidebar from '../../Components/Layout/Sidebar/Sidebar';
import AdminSetting from '../AdminSetting/AdminSetting';
import FooterSetting from '../FooterSetting/FooterSetting';
import FruitsSetting from '../FruitsSetting/FruitsSetting';
import HeaderSetting from '../HeaderSetting/HeaderSetting';
import Home from '../Home/Home';
import VegetablesSetting from '../VegetablesSetting/VegetablesSetting';

const MasterPage = () => {

    let [token, setToken] = useState(localStorage.getItem("adminToken"))
    let [user, setUser] = useState(JSON.parse(localStorage.getItem("admin")))
    let history = useHistory()

    if (!token || !user) {
        history.push('/login')
    }

    return (
        <Switch>
            <Sidebar>
                <Route exact path="/" component={Home} />
                <Route exact path="/admin-setting" component={AdminSetting} />
                <Route exact path="/header-setting" component={HeaderSetting} />
                <Route exact path="/footer-setting" component={FooterSetting} />
                <Route exact path="/vegatables-setting" component={VegetablesSetting} />
                <Route exact path="/fruits-setting" component={FruitsSetting} />
                <Route exact path="/natural-teas-setting" component={Home} />
                <Route exact path="/useful-plants-setting" component={Home} />
            </Sidebar>
        </Switch>
    )
}

export default MasterPage