import React, { useContext, useState } from 'react'
import HeaderBanner from '../../Components/HeaderBanner/HeaderBanner'
import axios from 'axios'
import { message, Spin } from 'antd'
import { useHistory } from "react-router-dom";
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext'

const Login = () => {

    let history = useHistory();
    let { setUser } = useContext(CompanySettingsContext);
    let { setToken } = useContext(GlobalSettingsContext);
    let [loading, setLoading] = useState(false);
    let [loginInfo, setLoginInfo] = useState({ "email": "", "password": "" })

    let loginSubmit = () => {
        if (loginInfo.email == "" || loginInfo.password == "") {
            message.info("Lütfen tüm alanları doldurun!!.");
        } else {
            setLoading(true)
            axios.post("http://localhost:3000/api/adminLogin", {
                email: loginInfo.email,
                password: loginInfo.password
            }, {
                headers: { "Content-Type": "application/json" }
            }).then(({ data: { result, result_message } }) => {

                if(result_message.type == "success"){
                    message.success("Login successful..")
                    localStorage.setItem("admin", JSON.stringify(result))
                    localStorage.setItem("adminToken", result.token)
                    setToken(result.token)
                    setUser(result);
                    setLoading(false)
                    history.push('/')
                } else {
                    message.error(result.message, 3)
                    setLoading(false)
                }
                setLoading(false)
            })
        }
    }
  
    return (
        <>

            <HeaderBanner page="Login" targetPage="Login" />

            <div className="customer_login">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="account_form">
                                <form>
                                    <p>
                                        <label>Username or email <span>*</span></label>
                                        <input onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })} type="text" />
                                    </p>
                                    <p>
                                        <label>Passwords <span>*</span></label>
                                        <input onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })} type="password" />
                                    </p>
                                    <div className="login_submit">
                                        <a href="#">Lost your password?</a>
                                        <label htmlFor="remember">
                                            <input id="remember" type="checkbox" />
                                            Remember me
                                        </label>
                                        <button type="submit" onClick={() => loginSubmit()}>login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                loading && <div className="loading__container">
                    <Spin size="large" />
                </div>
            }
        </>
    )
}

export default Login
