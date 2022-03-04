import React, { useContext, useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import axios from 'axios';
import { Button, message, Spin, Modal, Switch, Input, DatePicker, Form } from 'antd';

const Users = () => {

    let { token } = useContext(GlobalSettingsContext)
    let { name } = useContext(CompanySettingsContext);
    let [userList, setUserList] = useState(null);
    let [loading, setLoading] = useState(false);
    let [userId, setUserıd] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    let [userInfo, setUserInfo] = useState({ "name": "", "email": "", "gender": "Erkek", "birthdayString": "", "password": "" });
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

    console.log(userInfo)

    function birthdayString(date, dateString) {
        setUserInfo({ ...userInfo, birthdayString: dateString || birthdayString })
        console.log(dateString)
    }

    function gender(checked) {
        setUserInfo({ ...userInfo, gender: checked === true ? "Kadın" : "Erkek" })
    }
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
        deleteUser(userId)
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const onFinish = () => {
        addUser()
        setIsUserModalVisible(false);
    };

    const onFinishFailed = ({ errorInfo }) => {
        message.error("Kullanıcı kaydı eklenemedi.!!")
    };


    let call = useMemo(() => async () => {
        setLoading(true)
        if (token) {
            await axios.get('http://localhost:3000/api/user', {
                headers: {
                    Authorization: token
                }
            })
                .then(res => {
                    setUserList(res.data);
                    setLoading(false)
                })
                .catch(e => {
                    message.info(e)
                    setLoading(false)
                })
        }

    });

    useLayoutEffect(() => {
        call();
    }, [token])


    let deleteUser = async (id) => {
        setLoading(true)
        if (id) {
            await axios.delete(`http://localhost:3000/api/user/${id}`, {
                headers: {
                    Authorization: token
                }
            })
                .then(res => {
                    message.success("Kullanıcı başarıyla silindi..")
                    call();
                    setLoading(false)
                })
                .catch(e => {
                    message.info(e)
                    setLoading(false)
                })
        }
    }

    let addUser = async () => {
        setLoading(true)
        await axios.post(`http://localhost:3000/api/register`, { ...userInfo }, {
            headers: {
                Authorization: token
            }
        })
            .then(res => {
                message.success("Kullanıcı başarıyla eklendi..")
                call();
                setUserInfo({ ...userInfo, name: "", email: "", birthdayString: "", gender: "", password: "" })
                setLoading(false)
                setIsUserModalVisible(false);
            })
            .catch(e => {
                message.info(e)
                setLoading(false)
            })
    }


    return (
        <>

            <Modal title="Uyarı!" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Kullanıcıyı silmek istediğinizden emin misiniz ?</p>
            </Modal>
            {
                isUserModalVisible && <div>
                    <div className="popup-filter"></div>
                    <div className="add-user-popup-container">
                        <div className="card">
                            <div className="card-header">
                                <h3>Kullanıcı Ekle</h3>
                                <button className="close-button" onClick={() => setIsUserModalVisible(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="card-body">

                                <Form
                                    name="basic"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <Form.Item
                                        label="İsim Soyisim"
                                        name="name"
                                        rules={[{ required: true, message: 'Lütfen adınızı girin!' }]}
                                    >
                                        <Input onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} type="text" placeholder="Enter Name" className="w-100 mb-3" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{ required: true, message: 'Lütfen Email girin!' }]}
                                        className="mb-3"
                                    >
                                        <Input onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} type="email" placeholder="Enter Email" className="w-100 mb-3" />
                                    </Form.Item>


                                    <Form.Item
                                        label="Cinsiyet"
                                        name="gender"
                                        rules={[{ required: false }]}
                                    >
                                        <Switch onChange={gender} size="default" checkedChildren="Female" unCheckedChildren="Male" className="mb-3" />
                                    </Form.Item>


                                    <Form.Item
                                        label="Doğum Tarihi"
                                        name="birthday"
                                        rules={[{ required: true, message: 'Lütfen Doğum Günü girin!' }]}
                                    >
                                        <DatePicker onChange={birthdayString} size="large" className="w-100 mb-3" format={dateFormatList} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Şifre"
                                        name="password"
                                        rules={[{ required: true, message: 'Lütfen Şifre giriniz!' }]}
                                    >
                                        <Input onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })} type="password" className="w-100 mb-3" placeholder="Enter Password" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" className="w-100" size="large" htmlType="submit">
                                            Kayıt Et
                                        </Button>
                                    </Form.Item>

                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            }



            <div className="card">
                <div className="card-body">
                    <h3>Kullanıcılar</h3>

                    <div className="d-flex justify-content-end mb-3 w-100">
                        <Button onClick={() => setIsUserModalVisible(true)}>Yeni Ekle</Button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Birthday</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userList && userList.map((data, key) => (
                                        <tr key={key}>
                                            <th scope="row">{key + 1}</th>
                                            <td>{data.name}</td>
                                            <td>{data.birthdayString}</td>
                                            <td>{data.email}</td>
                                            <td>{data.gender}</td>
                                            <td>{data.createdAt}</td>
                                            <td>
                                                <Button type="primary" onClick={() => { showModal(); setUserıd(data._id) }}>Sil</Button>
                                                <Button className="ml-4" >Düzenle</Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
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

export default Users
