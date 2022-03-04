import React, { useContext, useState, useEffect, useMemo, useLayoutEffect } from 'react'
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { Button, message, Spin, Modal, Select, Input, Form, Upload } from 'antd';
import axios from 'axios';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Yalnızca JPG/PNG dosyası yükleyebilirsiniz!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Resim 2MB den küçük olmalıdır!');
  }
  return isJpgOrPng && isLt2M;
}

const VegetablesSetting = () => {

  let { token } = useContext(GlobalSettingsContext)
  let { name } = useContext(CompanySettingsContext);
  let history = useHistory();
  let [loading, setLoading] = useState(false);
  let [userId, setUserıd] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userList, setUserList] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  let [imageUrl, setImageUrl] = useState(null)
  let [productData, setProductData] = useState({
    "name": "",
    "price": "",
    "discount": "",
    "newPrice": "",
    "productDescription": "",
    "farmerName": "",
    "avatar": "",
    "calorie": "",
    "carbohydrate": "",
    "protein": "",
    "oil": ""
  })

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  let handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl)
        setLoading(false)
      }
      );
    }
  };


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

  function discount(data) {
    let newP = (parseInt(productData.price) || 0) - (((parseInt(productData.price) || 0) * (parseInt(data) || 0)) / 100);
    setProductData({ ...productData, discount: data, newPrice: newP })
  }

  function farmer(data) {
    setProductData({ ...productData, farmerName: data })
  }


  const onFinish = (data) => {
    console.log(data)

    // setLoading(true)
    // axios.patch(`http://localhost:3000/api/vegetables/`, { ...productData }).then(({ result_message }) => {
    //   if (result_message.type == "success") {
    //     message.success("Ürün başarıyla eklendi..")
    //     history.push('/vegatables-setting')
    //     call()
    //     setLoading(false)

    //   }
    //   else message.error("Your information could not be updated!!", 3)
    //   setLoading(false)
    // })

  };

  // console.log(productData)

  const onFinishFailed = ({ errorInfo }) => {
    message.error("Kullanıcı kaydı eklenemedi.!!")
  };


  let call = useMemo(() => async () => {
    setLoading(true)
    if (token) {
      await axios.get('http://localhost:3000/api/vegetables', {
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
      await axios.delete(`http://localhost:3000/api/vegetables/${id}`, {
        headers: {
          Authorization: token
        }
      })
        .then(res => {
          message.success("Ürün başarıyla silindi..")
          call();
          setLoading(false)
        })
        .catch(e => {
          message.info(e)
          setLoading(false)
        })
    }
  }


  return (
    <>

      <Modal title="Uyarı!" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Ürünü silmek istediğinizden emin misiniz ?</p>
      </Modal>

      {
        isUserModalVisible && <div>
          <div className="popup-filter"></div>
          <div className="add-user-popup-container">
            <div className="card">
              <div className="card-header">
                <h3>Kullanıcı Ekle</h3>
                <button className="close-button" onClick={() => setIsUserModalVisible(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
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
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 24 }}
                  className="vegetablePopupContainer"
                >
                  <Form.Item
                    label="Ürünün Adı"
                    name="name"
                    rules={[{ required: true, message: 'Lütfen ürün adı giriniz!' }]}
                  >
                    <Input onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
                  </Form.Item>

                  <Form.Item
                    label="Fiyat"
                    name="price"
                    rules={[{ required: true, message: 'Lütfen fiyat giriniz!' }]}
                  >
                    <Input onChange={(e) => setProductData({ ...productData, price: e.target.value })} />
                  </Form.Item>

                  <Form.Item label="İndirim Oranı"
                    name="discount"
                    rules={[{ required: true, message: 'Lütfen indirim oranı giriniz!' }]}>
                    <Select onChange={discount}>
                      <Option value="0">%0</Option>
                      <Option value="5">%5</Option>
                      <Option value="10">%10</Option>
                      <Option value="15">%15</Option>
                      <Option value="20">%20</Option>
                      <Option value="25">%25</Option>
                      <Option value="30">%30</Option>
                      <Option value="35">%35</Option>
                      <Option value="40">%40</Option>
                      <Option value="45">%45</Option>
                      <Option value="50">%50</Option>
                      <Option value="55">%55</Option>
                      <Option value="60">%60</Option>
                      <Option value="65">%65</Option>
                      <Option value="70">%70</Option>
                      <Option value="75">%75</Option>
                      <Option value="80">%80</Option>
                      <Option value="85">%85</Option>
                      <Option value="90">%90</Option>
                      <Option value="95">%95</Option>
                      <Option value="100">%100</Option>
                    </Select>
                  </Form.Item>

                  <h4 className="d-flex justify-content-center flex-column align-items-center">
                    Yeni Fiyat
                    <b className="ml-3">
                      {
                        (parseInt(productData.price) || 0) - (((parseInt(productData.price) || 0) * (parseInt(productData.discount) || 0)) / 100)
                      }
                    </b>
                  </h4>

                  <Form.Item label="Çiftçi"
                    name="farmerName"
                    rules={[{ required: true, message: 'Lütfen çifçiyi seçiniz!' }]}>
                    <Select onChange={farmer}>
                      <Option value="Muhsin Deniz">Muhsin Deniz</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="avatar" label="Ürün Resmi"
                    rules={[{ required: true, message: 'Lütfen avatar giriniz!' }]}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="http://localhost:3000/api/addVegetables"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Açıklama"
                    name="productDescription"
                    rules={[{ required: true, message: 'Lütfen açıklama giriniz!' }]}
                  >
                    <Input.TextArea onChange={(e) => setProductData({ ...productData, productDescription: e.target.value })} />
                  </Form.Item>

                  <Form.Item
                    label="Kalori"
                    name="calorie"
                    rules={[{ required: true, message: 'Lütfen kalori giriniz!' }]}
                  >
                    <Input onChange={(e) => setProductData({ ...productData, calorie: e.target.value })} />
                  </Form.Item>

                  <Form.Item
                    label="Karbonhidrat"
                    name="carbohydrate"
                    rules={[{ required: true, message: 'Lütfen karbonhidrat giriniz!' }]}
                  >
                    <Input onChange={(e) => setProductData({ ...productData, carbohydrate: e.target.value })} />
                  </Form.Item>

                  <Form.Item
                    label="Protein"
                    name="protein"
                    rules={[{ required: true, message: 'Lütfen protein giriniz!' }]}
                  >
                    <Input onChange={(e) => setProductData({ ...productData, protein: e.target.value })} />
                  </Form.Item>

                  <Form.Item
                    label="Yağ"
                    name="oil"
                    rules={[{ required: true, message: 'Lütfen yağ giriniz!' }]}
                  >
                    <Input onChange={(e) => setProductData({ ...productData, oil: e.target.value })} />
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
          <h3>Sebzeler</h3>

          <div className="d-flex justify-content-end mb-3 w-100">
            <Button onClick={() => setIsUserModalVisible(true)}>Yeni Ekle</Button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Ürün</th>
                  <th scope="col">İsim</th>
                  <th scope="col">Fiyat</th>
                  <th scope="col">İndirim</th>
                  <th scope="col">Yeni Fiyat</th>
                  <th scope="col">Üretici</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  userList && userList.map((data, key) => (
                    <tr key={key}>
                      <td><img src={`http://localhost:3000/${data.avatar}`} width="120px" style={{ objectFit: "contain", maxHeight: "100px" }} /></td>
                      <td>{data.name}</td>
                      <td>{data.price}</td>
                      <td>{data.discount}</td>
                      <td>{data.newPrice}</td>
                      <td>{data.farmerName}</td>
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

export default VegetablesSetting;