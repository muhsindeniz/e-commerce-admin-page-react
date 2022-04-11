import React, { useState, useEffect, useContext } from 'react'
import { Button, message, Spin, Modal, Select, Input, Switch, DatePicker } from 'antd';
import axios from 'axios';
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext'
import moment from 'moment'

const CuponCodes = () => {

    const { Option } = Select;
    let { token } = useContext(GlobalSettingsContext)
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editPopupShow, setEditPopupShow] = useState(false);
    const [cuponList, setCuponList] = useState([])
    const dateFormatList = 'YYYY/MM/DD';
    const [couponData, setCouponData] = useState({
        coupon: "",
        createdAt: "",
        finishAt: "",
        type: "",
    })

    let call = async () => {
        if (token) {
            setLoading(true)
            await axios.get('http://localhost:3000/api/coupon', {
                headers:
                {
                    authorization: token
                }
            })
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

    function createdAt(value, dateString) {
        setCouponData({ ...couponData, createdAt: dateString })
    }

    function typeHandleChange(value) {
        setCouponData({ ...couponData, type: value })
    }

    function finishAt(value, dateString) {
        setCouponData({ ...couponData, finishAt: dateString })
    }

    function onOk(value) { }
    function onFinishOk(value) { }

    let setUserıd = (id) => {
        setLoading(true)
        axios.delete(`http://localhost:3000/api/coupon/${id}`, {
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

    let onFinish = () => {
        setLoading(true)
        axios.post('http://localhost:3000/api/addCoupon', { ...couponData })
            .then(resp => {
                setIsUserModalVisible(false)
                setLoading(false)
                if (resp.data.result_message.type === "info") {
                    message.info(resp.data.result_message.message)
                } else if (resp.data.result_message.type === "error")
                    message.error(resp.data.result_message.message)
                else {
                    message.success(resp.data.result_message.message)
                }
                call()
            })
            .catch(err => {
                setLoading(false)
                message.error("Kupon kodu eklenemedi!!")
                console.log(err)
            })
    }

    let onEditFinish = (id) => {
        setLoading(true)
        axios.patch(`http://localhost:3000/api/coupon/${id}`, { ...couponData })
            .then(resp => {
                setEditPopupShow(false)
                setLoading(false)
                if (resp.data.result_message.type === "info") {
                    message.info(resp.data.result_message.message)
                } else if (resp.data.result_message.type === "error")
                    message.error(resp.data.result_message.message)
                else {
                    message.success(resp.data.result_message.message)
                }
                call()
            })
            .catch(err => {
                setLoading(false)
                message.error("Kupon kodu eklenemedi!!")
                console.log(err)
            })
    }

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

            {
                isUserModalVisible && <div>
                    <div className="popup-filter"></div>
                    <div className="add-user-popup-container">
                        <div className="card">
                            <div className="card-header">
                                <h3>Kupon Kodu Ekleme</h3>
                                <button className="close-button" onClick={() => { setCouponData({ ...couponData, coupon: "", createdAt: "", finishAt: "", type: "" }); setIsUserModalVisible(false); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="card-body">

                                <div className="mb-3">
                                    <label>Kupon Kodu</label>
                                    <Input style={{ textTransform: "uppercase" }} placeholder="indirim100" maxLength={12} onChange={(e) => setCouponData({ ...couponData, coupon: e.target.value.toUpperCase() })} />
                                </div>

                                <div className="mb-3">
                                    <DatePicker placeholder="Başlangıç Tarihi" format={dateFormatList} onChange={createdAt} onOk={onOk} />
                                </div>

                                <div className="mb-3">
                                    <DatePicker placeholder="Bitiş Bitiş" format={dateFormatList} onChange={finishAt} onOk={onFinishOk} />
                                </div>

                                <div className="mb-3">
                                    <Select defaultValue="5" style={{ width: 120 }} onChange={typeHandleChange}>
                                        <Option value="5">5$</Option>
                                        <Option value="10">10$</Option>
                                        <Option value="15">15$</Option>
                                        <Option value="25">25$</Option>
                                        <Option value="35">35$</Option>
                                        <Option value="50">50$</Option>
                                        <Option value="75">75$</Option>
                                        <Option value="100">100$</Option>
                                    </Select>
                                </div>

                                <Button type="primary" className="w-100" size="large" onClick={() => onFinish()}>
                                    Kayıt Et
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {
                editPopupShow && <div>
                    <div className="popup-filter"></div>
                    <div className="add-user-popup-container">
                        <div className="card">
                            <div className="card-header">
                                <h3>Kupon Kodu Ekleme</h3>
                                <button className="close-button" onClick={() => { setCouponData({ ...couponData, coupon: "", createdAt: "", finishAt: "", type: "" }); setEditPopupShow(false); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="card-body">

                                <div className="mb-3">
                                    <label>Kupon Kodu</label>
                                    <Input value={couponData?.coupon || ""} style={{ textTransform: "uppercase" }} placeholder="indirim100" maxLength={12} onChange={(e) => setCouponData({ ...couponData, coupon: e.target.value.toUpperCase() })} />
                                </div>

                                <div className="mb-3">
                                    <DatePicker value={moment(couponData?.createdAt || Date.now, dateFormatList)} format={dateFormatList} placeholder="Başlangıç Tarihi" onChange={createdAt} onOk={onOk} />
                                </div>

                                <div className="mb-3">
                                    <DatePicker value={moment(couponData?.finishAt || Date.now, dateFormatList)} format={dateFormatList} placeholder="Bitiş Tarihi" onChange={finishAt} onOk={onFinishOk} />
                                </div>

                                <div className="mb-3">
                                    <Select value={couponData?.type || "5"} style={{ width: 120 }} onChange={typeHandleChange}>
                                        <Option value="5">5$</Option>
                                        <Option value="10">10$</Option>
                                        <Option value="15">15$</Option>
                                        <Option value="25">25$</Option>
                                        <Option value="35">35$</Option>
                                        <Option value="50">50$</Option>
                                        <Option value="75">75$</Option>
                                        <Option value="100">100$</Option>
                                    </Select>
                                </div>

                                <Button type="primary" className="w-100" size="large" onClick={() => onEditFinish(couponData._id)}>
                                    Kayıt Et
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }

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
                                    <th scope="col">Kupon</th>
                                    <th scope="col">Başlangıç Tarihi</th>
                                    <th scope="col">Bitiş Tatihi</th>
                                    <th scope="col">Kupon Tipi</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cuponList && cuponList.map((data, key) => (
                                        <tr key={key}>
                                            <th scope="row">{key + 1}</th>
                                            <td style={{ textTransform: "uppercase" }}>{data?.coupon}</td>
                                            <td>{moment(data?.createdAt).format('MMMM Do YYYY')}</td>
                                            <td>{moment(data?.finishAt).format('MMMM Do YYYY')}</td>
                                            <td>{data?.type}$</td>
                                            <td>
                                                <Button type="primary" onClick={() => { setUserıd(data._id) }}>Sil</Button>
                                                <Button className="ml-4" onClick={() => { setEditPopupShow(true); getEditItem(data._id) }}>Düzenle</Button>
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

export default CuponCodes