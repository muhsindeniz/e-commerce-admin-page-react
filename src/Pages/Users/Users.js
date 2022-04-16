import React, { useContext, useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import axios from 'axios';
import { Button, message, Spin, Modal, Switch, Input, DatePicker, Form } from 'antd';

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
        message.error('Yalnızca JPG/PNG dosyası yükleyebilirsiniz!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Resim 2MB den küçük olmalıdır!');
    }
    return isJpgOrPng && isLt2M;
}

const Users = () => {

    let { token } = useContext(GlobalSettingsContext)
    let { name } = useContext(CompanySettingsContext);
    let [userList, setUserList] = useState(null);
    let [loading, setLoading] = useState(false);
    let [userId, setUserıd] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    let [userInfo, setUserInfo] = useState({ "name": "", "email": "", "gender": "Erkek", "birthdayString": "", "password": "", "avatar": "" });
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
    let [imageData, setImageData] = useState(null)
    let [imageUrl, setImageUrl] = useState("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")

    function birthdayString(date, dateString) {
        setUserInfo({ ...userInfo, birthdayString: dateString || birthdayString })
    }

    function getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    let fileSelectHandler = (e) => {
        setImageData(e.target.files[0])
        beforeUpload(e.target.files[0])
        getBase64(e.target.files[0], setImageUrl)
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

    let addUser = () => {
        if (userInfo.name == "" || userInfo.email == "" || userInfo.birthdayString == "" || userInfo.password == "") {
            message.info("Lütfen tüm alanları doldurun");
        } else {
            setLoading(true)
            const formData = new FormData;
            formData.append('image', imageData);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            const url = 'http://localhost:3000/single';
            axios.post(url, formData, config).then(resp => {
                axios.post(`http://localhost:3000/api/register`, {
                    name: userInfo.name,
                    email: userInfo.email,
                    birthdayString: userInfo.birthdayString,
                    avatar: resp.data.result.path,
                    password: userInfo.password,
                    gender: userInfo.gender
                }, {
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

            }).catch(err => {
                message.error("The image could not be loaded!");
            })
        }
    }


    let deleteImage = () => {
        setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")
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

                                <div className="mb-3 mt-3">
                                    <div>Lütfen avatar giriniz!</div>

                                    <div className="d-flex">
                                        <label htmlFor="image" className="fileUploadContainer">
                                            <div>
                                                <img src={imageUrl} style={{ width: imageUrl == "https://i.dlpng.com/static/png/6669605_preview.png" ? "60px" : "100%", objectFit: imageUrl == "https://i.dlpng.com/static/png/6669605_preview.png" ? "fill" : "contain", height: imageUrl == "https://i.dlpng.com/static/png/6669605_preview.png" ? "auto" : "80px" }} />
                                            </div>
                                        </label>
                                        <input hidden id="image" type="file" name="image" onChange={fileSelectHandler} />

                                        <div className="uploadImageSetting">
                                            <div className="deleteImageFileUpload ml-4" onClick={() => deleteImage()}>
                                                Sil
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Input onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} type="text" placeholder="Enter Name" className="w-100 mb-3" />
                                </div>

                                <div className="mb-3">
                                    <Input onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} type="email" placeholder="Enter Email" className="w-100 mb-3" /></div>

                                <div className="mb-3">
                                    <Switch onChange={gender} size="default" checkedChildren="Female" unCheckedChildren="Male" className="mb-3" />
                                </div>

                                <div className="mb-3">
                                    <DatePicker onChange={birthdayString} size="large" className="w-100 mb-3" format={dateFormatList} />
                                </div>
                                <div className="mb-3">
                                    <Input onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })} type="password" className="w-100 mb-3" placeholder="Enter Password" />
                                </div>

                                <Button type="primary" className="w-100" size="large" onClick={() => addUser()}>
                                    Kayıt Et
                                </Button>
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
