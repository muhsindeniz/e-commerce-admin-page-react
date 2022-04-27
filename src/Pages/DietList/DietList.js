import React, { useContext, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { Button, message, Spin, Modal, Select, Input, Popconfirm, Upload } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router';
import moment from 'moment';
import { Link } from 'react-router-dom';

const DietList = () => {

    let { token } = useContext(GlobalSettingsContext)
    let history = useHistory();
    let [loading, setLoading] = useState(false);
    const [dietList, setDietList] = useState(false);
    let [dietListId, setDietListId] = useState(null)

    useEffect(() => {
        getData();
    }, [])

    let getData = () => {
        setLoading(true)
        axios.get('http://localhost:3000/api/dietList')
            .then(data => {
                setDietList(data.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }

    function confirm(e) {
        deleteList()
    }

    let deleteList = () => {
        if (dietListId && token) {
            axios.delete(`http://localhost:3000/api/dietList/${dietListId}`, {
                headers: {
                    "Authorization": token
                }
            })
                .then(resp => {
                    if (resp.data.result_message.type === "success") {
                        message.success("List deleted successfully.")
                        getData()
                    } else {
                        message.error("Sorry, the list could not be deleted!!")
                    }
                })
                .catch(err => {
                    console.error("Error")
                })
        }
    }


    return (
        <>

            <div className="card">
                <div className="card-body">
                    <h3>Diyet Listeleri</h3>
                    <div className="d-flex justify-content-end mb-3 w-100">
                        <Link to="/diet-list-add">
                            <Button>Yeni Ekle</Button>
                        </Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">İçerik</th>
                                    <th scope="col">Tarih</th>
                                    <th scope="col">Dr. Adı</th>
                                    <th scope="col">Liste Tipi</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dietList && dietList.map((data, key) => (
                                        <tr key={key}>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: `${(data.content).replace(/<[^>]*>?/gm, '').substring(0, 30)}...` }}></div>
                                            </td>
                                            <td>{moment(data?.createdAt).format('MMMM Do YYYY')}</td>
                                            <td>{data.drName}</td>
                                            <td>{data.type}KG - {Number(data.type) + 10}KG arası diyet Listesi</td>
                                            <td>
                                                <Popconfirm
                                                    title="Are you sure to delete this diet list?"
                                                    onConfirm={confirm}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button type="primary" onClick={() => setDietListId(data._id)}>Sil</Button>
                                                </Popconfirm>
                                                <Link to={`/diet-list-add/${data._id}`}>
                                                    <Button className="ml-4">Düzenle</Button>
                                                </Link>
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

export default DietList;