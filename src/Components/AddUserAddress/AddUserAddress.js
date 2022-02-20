import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Select, message, Spin } from 'antd';
import cityes from '../../countries/city.json'
import { AlignCenterOutlined } from '@ant-design/icons';
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import axios from 'axios';
const { Option } = Select;

const AddUserAddress = (props) => {

    let { setShowAddressPopup, addressInfo, setAddressInfo, setStorageAdress } = props;
    let { token } = useContext(GlobalSettingsContext)
    let { user, setUser } = useContext(CompanySettingsContext);
    let [province, setProvince] = useState(cityes.data);
    let [district, setDistrict] = useState(null);
    let [loading, setLoading] = useState(false);

    function onProvinceChange(value) {
        setAddressInfo({ ...addressInfo, province: value })
        setDistrict(province.filter(data => data.il_adi == value).map(data => data.ilceler));
    }

    function onDistrictChange(value) {
        setAddressInfo({ ...addressInfo, district: value });
    }

    let addAddressInfo = () => {
        if (addressInfo.name == "" || addressInfo.province == "" || addressInfo.district == "", addressInfo.address == "", addressInfo.addressTitle == "", addressInfo.phone == "") {
            message.info("Lütfen tüm alanları doldurun!!")
        } else {
            setLoading(true)
            axios.post('http://localhost:3000/api/address', {
                ...addressInfo, id: user._id
            }, {
                headers: { "Content-Type": "application/json", authorization: `${token}` }
            }).then(({ data: { result, result_message } }) => {
                if (result_message.type == "success") {
                    message.success("Your shipping address has been successfully added..")
                    setShowAddressPopup(false)
                    setLoading(false)
                    localStorage.setItem("address", JSON.stringify(addressInfo))
                    setStorageAdress(addressInfo)
                } else {
                    message.error(result_message.message)
                    setLoading(false)
                }
            });
        }
    }


    return (
        <>
            <div className="before-bg" onClick={() => {setShowAddressPopup(false)}}></div>
            <div className="addUserAddressContainer card">
                <div className="card-header">
                    <div className="close-user-address" onClick={() => setShowAddressPopup(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </div>
                </div>
                <div className="card-body">
                    <div className="mb-2">
                        <label htmlFor="name" className="mb-2"><b>Name Surname</b></label>
                        <Input id="name" onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })} size="large" type="text" placeholder="Name Surname" value={addressInfo.name || ""} className="w-100" />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="province" className="mb-2"><b>Province</b></label>
                        <Select
                            id="province"
                            className="w-100"
                            size="large"
                            showSearch
                            placeholder="Select a province"
                            optionFilterProp="children"
                            onChange={onProvinceChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                province && province.map((provin, i) => (
                                    <Option key={i} value={provin.il_adi}>{provin.il_adi}</Option>
                                ))
                            }

                        </Select>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="district" className="mb-2"><b>Province</b></label>
                        <Select
                            id="district"
                            className="w-100"
                            size="large"
                            showSearch
                            placeholder="Select a district"
                            optionFilterProp="children"
                            onChange={onDistrictChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                district && district[0].map((dist, i) => (
                                    <Option value={dist.ilce_adi}>{dist.ilce_adi}</Option>
                                ))
                            }

                        </Select>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="address" className="mb-2"><b>Address</b></label>
                        <Input.TextArea id="address" onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })} size="large" type="text" placeholder="Address" value={addressInfo.address || ""} className="w-100" />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="addressTitle" className="mb-2"><b>Address Title</b></label>
                        <Input id="addressTitle" onChange={(e) => setAddressInfo({ ...addressInfo, addressTitle: e.target.value })} size="large" type="text" placeholder="Address Title" value={addressInfo.addressTitle || ""} className="w-100" />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="phone" className="mb-2"><b>Phone</b></label>
                        <Input id="phone" onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })} size="large" type="text" placeholder="Phone number" value={addressInfo.phone || ""} className="w-100" />
                    </div>


                    <Button type="primary" shape="round" icon={<AlignCenterOutlined />} className="w-100" size="large" onClick={() => addAddressInfo()}>
                        Save Address
                    </Button>

                </div>
            </div>

            {
                loading && <div className="loading__container">
                    <Spin size="large" />
                </div>
            }

        </>
    );
};

export default AddUserAddress;
