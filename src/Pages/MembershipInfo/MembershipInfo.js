import React, { useEffect, useState, useContext, useCallback } from 'react';
import { DatePicker, Tabs, Input, Switch, Button, Spin, message } from 'antd';
import moment from 'moment';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext'
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useGetData, usePatchData, usePostData } from '../../hooks/ServiceGetways';
import AddressList from '../../Components/AddressList/AddressList';
import AddUserAddress from '../../Components/AddUserAddress/AddUserAddress';
import { useLayoutEffect } from 'react';
const { TabPane } = Tabs;

const MembershipInfo = () => {

    let { token } = useContext(GlobalSettingsContext)
    let { user, setUser } = useContext(CompanySettingsContext);
    let history = useHistory();
    let postData = usePostData()
    let patchData = usePatchData()
    let [userInfo, setUserInfo] = useState({ "name": "", "email": "", "gender": "", "birthdayString": "" });
    let [loading, setLoading] = useState(false);
    let [genderChecked, setGenderChecked] = useState(null);
    let [userPassword, setUserPassword] = useState({ "password": "", "newPassword": "" })
    let [showAddressPopup, setShowAddressPopup] = useState(false);
    let [addressInfo, setAddressInfo] = useState({ "name": "", "province": "", "district": "", "address": "", "addressTitle": "", "phone": "" })
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
    let [storageAddress, setStorageAdress] = useState(JSON.parse(localStorage.getItem("address")))

    function birthdayString(date, dateString) {
        setUserInfo({ ...userInfo, birthdayString: dateString })
    }

    function gender(checked) {
        setUserInfo({ ...userInfo, gender: checked === true ? "Kadın" : "Erkek" })
    }

    useEffect(() => {
        setUserInfo({ ...userInfo, name: user.name, email: user.email, birthdayString: user.birthdayString, gender: user.gender })
        get();
    }, [user])

    useEffect(() => {
        setGenderChecked(userInfo.gender == "Erkek" ? false : true)
    }, [userInfo])

    let get = useCallback(() => {
        postData(`user/${user._id}`, {}).then(({ result, result_message }) => {
            if (result_message.type === "error") console.log(result_message.message);
            setUser(result)
        });
    }, [])

    let updateMembershipInfo = () => {
        setLoading(true)
        patchData(`user/${user._id}`, { ...userInfo }).then(({ result_message }) => {
            if (result_message.type == "success") {
                const profile = {
                    ...JSON.parse(localStorage.getItem('user')),
                    ...userInfo
                };
                localStorage.setItem('user', JSON.stringify(profile));
                message.success("Your information has been successfully updated.", 3)
                get()
                history.push('/membership-infos')
                setLoading(false)

            }
            else message.error("Your information could not be updated!!", 3)
            setLoading(false)
        })
    }


    let updatePassword = () => {
        if (userPassword.password == "" || userPassword.newPassword == "") {
            message.info("Lütfen tüm alanları doldurun!!")
        } else {
            setLoading(true)
            axios.post('http://localhost:3000/api/updatePassword', {
                ...userPassword
            }, {
                headers: { "Content-Type": "application/json", authorization: `${token}` }
            }).then(({ data: { result, result_message } }) => {
                if (result_message.type == "success") {
                    message.success("Your password has been successfully updated..")
                    setLoading(false)
                } else {
                    message.error(result_message.message)
                    setLoading(false)
                }
            });
        }
    }


    return (
        <>

            {
                showAddressPopup && <AddUserAddress setStorageAdress={setStorageAdress} setAddressInfo={setAddressInfo} addressInfo={addressInfo} setShowAddressPopup={setShowAddressPopup} />
            }

            <div className="product_details mt-70 mb-70">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-12 col-lg-10">
                            <div className="membershipInfo_header_title">
                                <h3>My User Information</h3>
                            </div>

                            <section className="membershipInfo_tabs">
                                <form id="update-user-info">
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="My membership information" key="1" className="mt-5">
                                            <div className="row d-flex justify-content-center">
                                                <div className="col-sm-12 col-lg-8">
                                                    <div className="membershipInfo_main_title">
                                                        <h4>Information Profile</h4>
                                                    </div>

                                                    <p>
                                                        You can edit the information you need to keep your experience in Health Path at the best level.
                                                    </p>

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-6 col-lg-6">
                                                            <div className="mb-2">Name Surname</div>
                                                            <div><Input onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} size="large" type="text" placeholder="Name Surname" value={userInfo.name || ""} className="w-100" /></div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                                            <div className="mb-2">Email</div>
                                                            <div><Input onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} size="large" type="email" placeholder="E-mail" value={userInfo.email || ""} className="w-100" /></div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                                            <div className="mb-2">Date of birth</div>
                                                            <div>
                                                                <DatePicker onChange={birthdayString} size="large" className="w-100" value={moment(userInfo.birthdayString || '01/01/2015', dateFormatList[0])} format={dateFormatList} />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-6 mb-4">
                                                            <div className="mb-2">Gender</div>
                                                            <div>
                                                                <Switch onChange={gender} size="default" checked={genderChecked} checkedChildren="Female" unCheckedChildren="Male" />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12">
                                                            <Button onClick={() => updateMembershipInfo()} className="w-100" size="large">Update</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Password change" key="2" className="mt-5">
                                            <div className="row d-flex justify-content-center">
                                                <div className="col-sm-12 col-lg-8">
                                                    <p>
                                                        Your password must contain at least one letter, number or special character. Also, your password must be at least 8 characters long.
                                                    </p>

                                                    <div className="col-sm-12 mb-3">
                                                        <div className="mb-2">
                                                            Current Password
                                                        </div>

                                                        <Input.Password
                                                            onChange={(e) => setUserPassword({ ...userPassword, password: e.target.value })}
                                                            size="large"
                                                            placeholder="Current Password"
                                                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                        />
                                                    </div>

                                                    <div className="col-sm-12 mb-3">
                                                        <div className="mb-2">
                                                            New Password
                                                        </div>

                                                        <Input.Password
                                                            onChange={(e) => setUserPassword({ ...userPassword, newPassword: e.target.value })}
                                                            size="large"
                                                            placeholder="New Password"
                                                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                        />
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center">
                                                        <span className="mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                            </svg>
                                                        </span>
                                                        <small>Güvenliğiniz için adınız, soyadınız ve doğum tarihinizi içermeyen bir şifre belirleyin.</small>
                                                    </div>

                                                    <div className="col-sm-12">
                                                        <Button onClick={() => updatePassword()} className="w-100" size="large">Update</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Communication preferences" key="3" className="mt-5">
                                            <div className="row d-flex justify-content-center">
                                                <div className="col-sm-12 col-lg-8">
                                                    <div className="membershipInfo_main_title">
                                                        <h4>My Delivery Addresses</h4>
                                                    </div>

                                                    <p>
                                                        You have 3 delivery addresses. From this page, you can create a new address, edit or delete your existing addresses.
                                                        Address changes you make on this page will not affect your previous orders. You can change the address of the order you have placed in the My Orders field.
                                                    </p>

                                                    {
                                                        storageAddress == null ? <section className="card cursor-pointer" onClick={() => {setShowAddressPopup(true);}}>
                                                            <div className="card-body d-flex justify-content-center align-items-center flex-column">
                                                                <div>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-cloud-plus" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z" />
                                                                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                                                                    </svg>
                                                                </div>
                                                                <div>Add new address</div>
                                                            </div>
                                                        </section> : <AddressList
                                                            storageAddress={storageAddress}
                                                            setStorageAdress={setStorageAdress}
                                                        />
                                                    }

                                                </div>
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </form>
                            </section>
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
};

export default MembershipInfo;
