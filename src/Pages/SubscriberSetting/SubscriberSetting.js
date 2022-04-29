import React, { useState, useEffect, useContext } from 'react'
import { Button, message, Spin, Modal, Select, Input, Switch, DatePicker } from 'antd';
import axios from 'axios';
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext'
import moment from 'moment'

const SubscriberSetting = () => {

    const { Option } = Select;
    let { token } = useContext(GlobalSettingsContext)
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editPopupShow, setEditPopupShow] = useState(false);
    const [cuponList, setCuponList] = useState([])
    const [couponData, setCouponData] = useState({
        userId: "",
        type: "",
    })

    let call = async () => {
        setLoading(true)
        if (token) {
            await axios.get('http://localhost:3000/api/subscribe')
                .then(resp => {
                    setCuponList(resp.data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    message.info("veriler yüklenemedi lütfen internet bağlantınızı kontrol edin")
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        call()
    }, [])

    let setUserıd = (id) => {
        setLoading(true)
        axios.delete(`http://localhost:3000/api/subscribe/${id}`, {
            headers:
            {
                authorization: token
            }
        })
            .then(resp => {
                message.success(resp.data.result_message.message)
                call()
                setLoading(false)
            })
            .catch(err => {
                // message.error(err.data.result_message.message)
                console.log(err)
                setLoading(false)
            })
    }

    // let onFinish = () => {
    //     setLoading(true)
    //     axios.post('http://localhost:3000/api/addCoupon', { ...couponData })
    //         .then(resp => {
    //             setIsUserModalVisible(false)
    //             setLoading(false)
    //             if (resp.data.result_message.type === "info") {
    //                 message.info(resp.data.result_message.message)
    //             } else if (resp.data.result_message.type === "error")
    //                 message.error(resp.data.result_message.message)
    //             else {
    //                 message.success(resp.data.result_message.message)
    //             }
    //             call()
    //         })
    //         .catch(err => {
    //             setLoading(false)
    //             message.error("Kupon kodu eklenemedi!!")
    //             console.log(err)
    //         })
    // }

    // let onEditFinish = (id) => {
    //     setLoading(true)
    //     axios.patch(`http://localhost:3000/api/coupon/${id}`, { ...couponData })
    //         .then(resp => {
    //             setEditPopupShow(false)
    //             setLoading(false)
    //             if (resp.data.result_message.type === "info") {
    //                 message.info(resp.data.result_message.message)
    //             } else if (resp.data.result_message.type === "error")
    //                 message.error(resp.data.result_message.message)
    //             else {
    //                 message.success(resp.data.result_message.message)
    //             }
    //             call()
    //         })
    //         .catch(err => {
    //             setLoading(false)
    //             message.error("Kupon kodu eklenemedi!!")
    //             console.log(err)
    //         })
    // }

    let getEditItem = (id) => {
        setLoading(true)
        axios.get(`http://localhost:3000/api/coupon/${id}`)
            .then(resp => {
                setCouponData(resp.data.result)
                setLoading(false)
            })
            .catch(err => {
                message.error(err.data.result_message.message)
                setLoading(false)
            })
    }

    return (
        <>


            <div className="card">
                <div className="card-body">
                    <h3>Kupon Kodları</h3>

                    <div className="d-flex justify-content-end mb-3 w-100">
                        <Button onClick={() => setIsUserModalVisible(true)}>Yeni Ekle</Button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Abone ID</th>
                                    <th scope="col">Email</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cuponList && cuponList.map((data, key) => (
                                        <tr key={key}>
                                            <th scope="row">{key + 1}</th>
                                            <td>{data?.userId}</td>
                                            <td>{data?.email}</td>
                                            <td>
                                                <Button type="primary" onClick={() => { setUserıd(data._id) }}>Aboneği Sil</Button>
                                                {/* <Button className="ml-4" onClick={() => { getEditItem(data._id) }}>Düzenle</Button> */}
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

export default SubscriberSetting