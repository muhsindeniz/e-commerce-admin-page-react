import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Sidebar from '../../Components/Layout/Sidebar/Sidebar';
import AdminSetting from '../AdminSetting/AdminSetting';
import FarmerSetting from '../FarmerSetting/FarmerSetting';
import FooterSetting from '../FooterSetting/FooterSetting';
import FruitsSetting from '../FruitsSetting/FruitsSetting';
import HeaderSetting from '../HeaderSetting/HeaderSetting';
import Home from '../Home/Home';
import NaturalTeas from '../NaturalTeas/NaturalTeas';
import Users from '../Users/Users';
import VegetablesSetting from '../VegetablesSetting/VegetablesSetting';
import UsefulPlantsSetting from '../UsefulPlantsSetting/UsefulPlantsSetting.js'
import CuponCodes from '../CuponCodes/CuponCodes';
import DietList from '../DietList/DietList';
import AddDietList from '../DietList/AddDietList';
import SubscriberSetting from '../SubscriberSetting/SubscriberSetting';

const MasterPage = () => {

    let [token, setToken] = useState(localStorage.getItem("adminToken"))
    let [user, setUser] = useState(JSON.parse(localStorage.getItem("admin")))
    let history = useHistory()

    useEffect(() => {
        if (!token || !user) {
            history.push('/login')
        }
    }, [])

    return (
        <Switch>
            <Sidebar>
                <Route exact path="/" component={Home} />
                <Route exact path="/admin-setting" component={AdminSetting} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/header-setting" component={HeaderSetting} />
                <Route exact path="/footer-setting" component={FooterSetting} />
                <Route exact path="/vegatables-setting" component={VegetablesSetting} />
                <Route exact path="/fruits-setting" component={FruitsSetting} />
                <Route exact path="/natural-teas-setting" component={NaturalTeas} />
                <Route exact path="/useful-plants-setting" component={UsefulPlantsSetting} />
                <Route exact path="/farmer-setting" component={FarmerSetting} />
                <Route exact path="/cupon-codes" component={CuponCodes} />

                <Route exact path="/diet-list" component={DietList} />
                <Route exact path="/diet-list-add" component={AddDietList} />
                <Route exact path="/diet-list-add/:id" component={AddDietList} />
                <Route exact path="/subscriber-setting" component={SubscriberSetting} />
            </Sidebar>
        </Switch>
    )
}

export default MasterPage