import React, { useContext, useEffect, useState } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import axios from 'axios';
import { Button, Popconfirm, Spin, Select, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const Orders = () => {

    let [orders, setOrders] = useState([])
    let [detailData, setDetailData] = useState([])
    let [loading, setLoading] = useState(false)
    let [showProductDetail, setShowProductDetail] = useState(false);
    let { token } = useContext(GlobalSettingsContext)

    useEffect(() => {
        getData()
    }, [])

    let getData = () => {
        setLoading(true)
        axios.get('http://localhost:3000/api/orders')
            .then(resp => {
                setOrders(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    let confirm = (id) => {
        axios.delete(`http://localhost:3000/api/orders/${id}`,
            {
                headers:
                {
                    authorization: token
                }
            })
            .then(resp => {
                if (resp.data.result_message.type === 'success') {
                    message.success("Sipariş başarıyla silindi..")
                    getData();
                } else {
                    message.info("Hata sipariş silinemedi!!")
                }
            })
    }

    function handleChange(id, e) {
        axios.patch(`http://localhost:3000/api/orders/${id}`, {
            orderStatus: e
        })
            .then(resp => {
                if (resp.data.result_message.type === 'success') {
                    message.success("Kargo durumu güncellendi..")
                } else {
                    message.info("Kargo durumu güncellenemedi!!")
                }
            })
    }

    let getProductDetail = (id) => {
        setLoading(true)
        axios.get(`http://localhost:3000/api/orders/${id}`)
            .then(resp => {
                setDetailData(resp.data.result)
                setLoading(false)

            })
            .catch(err => {
                console.log(err)
                setLoading(false)

            })
    }

    console.log(detailData)
    return (
        <>
            {
                showProductDetail && <div>
                    <div className="popup-filter"></div>
                    <div className="add-user-popup-container">
                        <div className="card">
                            <div className="card-header">
                                <h3>Ürün Detayları</h3>
                                <button className="close-button" onClick={() => setShowProductDetail(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="card-body">
                                <div>
                                    <div className="mb-2">
                                        <h4> <b>Delivery address:</b></h4>
                                    </div>

                                    <div>
                                        {
                                            detailData && detailData.address && detailData.address.map((ads, index) => (
                                                <div key={index}>
                                                    <div className="mb-2">
                                                        <b>{ads?.addressTitle}</b>
                                                    </div>

                                                    <div>
                                                        {ads?.province} /  {ads?.district}
                                                    </div>
                                                    <div>
                                                        {ads?.address}
                                                    </div>
                                                    <div>
                                                        <b>{ads?.name} - {ads?.phone}</b>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="mt-3">
                                        <h4>Products</h4>

                                        {
                                            detailData && detailData.basket && detailData.basket.map((data, index) => (
                                                <div className="mb-3 d-flex flex-wrap">
                                                    <div style={{ flex: "1" }}>
                                                        <img src={`http://localhost:3000/${data?.avatar}`} width="110px" height="110px" style={{ objectFit: "cover", minHeight: "90px" }} />
                                                    </div>

                                                    <div style={{ flex: "2" }} className="d-flex flex-wrap justify-content-between">
                                                        <div>
                                                            Ürün satıcısı:
                                                            <div>
                                                                <b>
                                                                    {
                                                                        data?.farmerName
                                                                    }
                                                                </b>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            Kilo miktarı:
                                                            <div>
                                                                <b>
                                                                    {
                                                                        data?.quntity
                                                                    }
                                                                    KG
                                                                </b>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        Toplam ödenecek tutar:
                                        <h4 className="mt-1">
                                            <b>
                                                {
                                                    detailData?.totalPricePaid
                                                }
                                                $
                                            </b>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="card">
                <div className="card-body">
                    <h3>Siparişler</h3>

                    <div className="d-flex justify-content-end mb-3 w-100">
                        <Button>Sipariş raporu çıkart</Button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Sipariş sahibi</th>
                                    <th scope="col">Sipariş tarihi</th>
                                    <th scope="col">Ödenenecek tutar</th>
                                    <th scope="col">Sipariş Durumu</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders && orders.map((data, key) => (
                                        <tr key={key}>
                                            <th scope="row">{key + 1}</th>
                                            <td>
                                                Data
                                            </td>
                                            <td>{moment(new Date(data?.createdAt)).format("DD MMM dddd h:mm")}</td>
                                            <td>{data?.totalPricePaid}$</td>
                                            <td>
                                                <Select
                                                    optionFilterProp="children"
                                                    size="large"
                                                    className="w-100"
                                                    defaultValue={data?.orderStatus}
                                                    onChange={(e) => handleChange(data?._id, e)}
                                                >
                                                    <Option value="Waiting for approval">Onay bekleniyor</Option>
                                                    <Option value="Products are being prepared">Ürünler hazırlanıyor</Option>
                                                    <Option value="Your order is on its way">Siparişiniz yola çıktı</Option>
                                                    <Option value="Order delivered">Sipariş teslim edildi</Option>
                                                </Select>
                                            </td>
                                            <td>
                                                <Button type="primary" onClick={() => { setShowProductDetail(true); getProductDetail(data._id) }}>Detayları Getir</Button>
                                                <Popconfirm
                                                    title="Are you sure to delete this diet list?"
                                                    onConfirm={() => confirm(data._id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button className="ml-3" type="danger">Sil</Button>
                                                </Popconfirm>
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

export default Orders
