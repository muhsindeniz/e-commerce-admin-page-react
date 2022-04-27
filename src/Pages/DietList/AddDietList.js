import React, { useContext, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { Button, message, Spin, Modal, Select, Input, Popconfirm, Upload } from 'antd';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';

const { Option } = Select;

const AddDietList = () => {

    let { token } = useContext(GlobalSettingsContext)
    let history = useHistory();
    let path = useParams();
    let [loading, setLoading] = useState(false);
    let [value, setValue] = useState('');
    let [type, setType] = useState('');
    let [drName, setDrName] = useState('');
    let [email, setEmail] = useState('');

    function handleChange(e) {
        setType(e)
    }

    let modules = {
        toolbar: {
            container: [
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                    { align: [] }
                ],
                ["link", "image"],
                ["clean"]
            ]
        },
        clipboard: { matchVisual: false }
    };

    let formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "size",
        "color",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "align"
    ];

    useEffect(() => {
        if (path.id) {
            setLoading(true)
            axios.get(`http://localhost:3000/api/dietList/${path.id}`)
                .then(resp => {
                    setLoading(false)
                    setValue(resp.data.result.content)
                    setType(resp.data.result.type)
                    setDrName(resp.data.result.drName)
                    setEmail(resp.data.result.email)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }, [path])

    let saveData = () => {
        if (value == "" || type == "" || email == "" || drName == "") {
            message.info("Lütfen tüm alanları doldurum!")
        } else {
            if (!path.id) {
                setLoading(true)
                axios.post('http://localhost:3000/api/dietList', {
                    content: value,
                    type: type,
                    drName: drName,
                    email: email
                })
                    .then(resp => {
                        if (resp.data.result_message.type === "success") {
                            message.success("Liste başarıyla eklendi")
                            history.push('/diet-list')
                            setLoading(false)
                        } else {
                            message.error("Liste eklenemedi!!")
                            setLoading(false)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        setLoading(false)
                    })
            } else {
                setLoading(true)
                axios.patch(`http://localhost:3000/api/dietList/${path.id}`, {
                    content: value,
                    type: type,
                    drName: drName,
                    email: email
                })
                    .then(resp => {
                        if (resp.data.result_message.type === "success") {
                            message.success("Liste başarıyla güncellendi")
                            history.push('/diet-list')
                            setLoading(false)
                        } else {
                            message.error("Liste eklenemedi!!")
                            setLoading(false)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-start mb-3 w-100">
                        <Link to="/diet-list">
                            <Button>Geri</Button>
                        </Link>
                    </div>
                    <h3>Diyet Listesi Ekle</h3>

                    <div className="mb-3">
                        <Input value={drName} type="text" onChange={(e) => setDrName(e.target.value)} placeholder="Diyetisyen Adı" size="large" />
                    </div>

                    <div className="mb-3">
                        <Input value={email} type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email adresi" size="large" />
                    </div>

                    <div className="mb-3">
                        <Select
                            showSearch
                            placeholder="Diyet listesi tipi"
                            optionFilterProp="children"
                            size="large"
                            className="w-50"
                            value={type}
                            onChange={handleChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="50">50-60 Kilo Arası Kişiler İçin Diyet Listesi</Option>
                            <Option value="70">70-80 Kilo Arası Kişiler İçin Diyet Listesi</Option>
                            <Option value="80">80-90 Kilo Arası Kişiler İçin Diyet Listesi</Option>
                            <Option value="100">100-110 Kilo Arası Kişiler İçin Diyet Listesi</Option>
                            <Option value="120">120-130 Kilo Arası Kişiler İçin Diyet Listesi</Option>
                        </Select>
                    </div>

                    <div className="mb-3">
                        <ReactQuill theme="snow" formats={formats} modules={modules} value={value} onChange={setValue} />
                    </div>

                    <Button size="large" className="w-100" type="primary" onClick={() => saveData()}>Kaydet</Button>

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

export default AddDietList