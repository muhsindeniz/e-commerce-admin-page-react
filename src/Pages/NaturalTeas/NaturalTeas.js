import React, { useContext, useState, useEffect, useMemo, useLayoutEffect } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { Button, message, Spin, Modal, Select, Input, Form, Upload } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router';

const { Option } = Select;
const { TextArea } = Input;

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

const NaturalTeas = () => {

  let { token } = useContext(GlobalSettingsContext)
  let history = useHistory();
  let [loading, setLoading] = useState(false);
  let [userId, setUserıd] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userList, setUserList] = useState(false);
  const [farmerList, setFarmerList] = useState(null)
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  let [imageData, setImageData] = useState(null)
  let [proId, setProId] = useState(null)
  let [imageUrl, setImageUrl] = useState("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")
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

  let fileSelectHandler = (e) => {
    setImageData(e.target.files[0])
    beforeUpload(e.target.files[0])
    getBase64(e.target.files[0], setImageUrl)
  }

  const onFinish = async () => {
    if (productData.name == "" || productData.discount == "" || productData.price == "" || productData.newPrice == "" || productData.productDescription == "" || productData.farmerName == "" || productData.calorie == "" || productData.carbohydrate == "" || productData.oil == "") {
      message.info("Please fill in all fields")
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
      await axios.post(url, formData, config).then(resp => {
        setLoading(false)
        message.success(resp.data.result_message.message)
        axios.post('http://localhost:3000/api/addTeas', {
          name: productData.name,
          price: productData.price,
          discount: productData.discount,
          newPrice: productData.newPrice,
          productDescription: productData.productDescription,
          farmerName: productData.farmerName,
          avatar: resp.data.result.path,
          calorie: productData.calorie,
          carbohydrate: productData.carbohydrate,
          protein: productData.protein,
          oil: productData.oil
        }, {
          headers:
          {
            "Content-Type": "application/json",
            authorization: `${token}`
          }
        })
          .then(response => {
            message.success("Ürün başarıyla eklendi");
            setIsUserModalVisible(false)
            setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")
            setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" })
            setImageData(null)
            call();
          })
          .catch(error => {
            message.error("Could not save product information!")
            setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" })
          })
      }).catch(err => {
        message.error("The image could not be loaded!");
      })
    }
  };

  let call = useMemo(() => async () => {
    setLoading(true)
    if (token) {
      await axios.get('http://localhost:3000/api/teas', {
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

  let GetfarmerData = useMemo(() => async () => {
    setLoading(true)
    if (token) {
      await axios.get('http://localhost:3000/api/farmer', {
        headers: {
          Authorization: token
        }
      })
        .then(res => {
          setFarmerList(res.data);
          setLoading(false)
        })
        .catch(e => {
          message.info(e)
          setLoading(false)
        })
    }
  });

  useEffect(() => {
    GetfarmerData()
  }, [])

  useLayoutEffect(() => {
    call();
  }, [token])

  let deleteUser = async (id) => {
    setLoading(true)
    if (id) {
      await axios.delete(`http://localhost:3000/api/teas/${id}`, {
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

  let deleteImage = () => {
    setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")
  }


  let onEditProduct = (id) => {
    if (id) {
      axios.get(`http://localhost:3000/api/teas/${id}`, {
        headers: {
          Authorization: token
        }
      })
        .then(res => {
          setProductData({
            ...productData,
            avatar: res.data.result.avatar,
            calorie: res.data.result.calorie,
            carbohydrate: res.data.result.carbohydrate,
            discount: res.data.result.discount,
            farmerName: res.data.result.farmerName,
            name: res.data.result.name,
            newPrice: res.data.result.newPrice,
            oil: res.data.result.oil,
            price: res.data.result.price,
            productCategory: res.data.result.productCategory,
            productDescription: res.data.result.productDescription,
            protein: res.data.result.protein
          })
          setImageUrl(`http://localhost:3000/${res.data.result.avatar}`)
          setLoading(false)
        })
        .catch(e => {
          message.info(e)
          setLoading(false)
        })
    }
  }

  let onEditDataProduct = async () => {
    if (productData.name == "" || productData.discount == "" || productData.price == "" || productData.newPrice == "" || productData.productDescription == "" || productData.farmerName == "" || productData.calorie == "" || productData.carbohydrate == "" || productData.oil == "") {
      message.info("Please fill in all fields")
    } else {
      if (imageData === null) {
        axios.patch(`http://localhost:3000/api/teas/${proId}`, {
          name: productData.name,
          price: productData.price,
          discount: productData.discount,
          newPrice: productData.newPrice,
          productDescription: productData.productDescription,
          farmerName: productData.farmerName,
          avatar: productData.avatar,
          calorie: productData.calorie,
          carbohydrate: productData.carbohydrate,
          protein: productData.protein,
          oil: productData.oil
        }, {
          headers:
          {
            "Content-Type": "application/json",
            authorization: `${token}`
          }
        })
          .then(response => {
            message.success("Ürün başarıyla güncellendi");
            setEditProductModalVisible(false)
            setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")
            setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" })
            setImageData(null)
            call();
          })
          .catch(error => {
            message.error("Could not save product information!")
            setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" })
          })
      } else {
        const formData = new FormData;
        formData.append('image', imageData);
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        const url = 'http://localhost:3000/single';
        await axios.post(url, formData, config).then(resp => {
          setLoading(false)
          message.success(resp.data.result_message.message)
          axios.patch(`http://localhost:3000/api/teas/${proId}`, {
            name: productData.name,
            price: productData.price,
            discount: productData.discount,
            newPrice: productData.newPrice,
            productDescription: productData.productDescription,
            farmerName: productData.farmerName,
            avatar: resp.data.result.path,
            calorie: productData.calorie,
            carbohydrate: productData.carbohydrate,
            protein: productData.protein,
            oil: productData.oil
          }, {
            headers:
            {
              "Content-Type": "application/json",
              authorization: `${token}`
            }
          })
            .then(response => {
              message.success("Ürün başarıyla güncellendi .!!");
              setEditProductModalVisible(false)
              setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png")
              setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" })
              setImageData(null)
              call();
            })
            .catch(error => {
              message.error("Could not save product information!")
              setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" })
            })
        }).catch(err => {
          message.error("The image could not be loaded!");
        })
      }

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
                <h3>Ürün Ekleme</h3>
                <button className="close-button" onClick={() => { setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" }); setIsUserModalVisible(false); setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png") }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="card-body">

                <div className="mb-3">
                  <Input placeholder="Lütfen ürün adı giriniz!" onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input placeholder="Lütfen fiyat giriniz!" onChange={(e) => setProductData({ ...productData, price: e.target.value })} />
                </div>

                <div className="mb-3">
                  <label>Lütfen indirim oranı giriniz!</label>
                  <Select className="w-100" onChange={discount}>
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
                </div>

                <h4 className="d-flex justify-content-center flex-column align-items-center">
                  Yeni Fiyat
                  <b className="ml-3">
                    {
                      (parseInt(productData.price) || 0) - (((parseInt(productData.price) || 0) * (parseInt(productData.discount) || 0)) / 100)
                    }
                  </b>
                </h4>

                <label>Lütfen çifçiyi seçiniz!</label>
                <Select onChange={farmer} className="w-100">
                  {
                    farmerList && farmerList.map((farmer,index) => (
                      <Option key={index} value={farmer.name}>{farmer.name}</Option>
                    ))
                  }
                </Select>

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
                  <TextArea placeholder="Lütfen açıklama giriniz!" onChange={(e) => setProductData({ ...productData, productDescription: e.target.value })} />
                </div>
                <div className="mb-3">
                  <Input placeholder="Lütfen kalori giriniz!" onChange={(e) => setProductData({ ...productData, calorie: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input placeholder="Lütfen karbonhidrat giriniz!" onChange={(e) => setProductData({ ...productData, carbohydrate: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input placeholder="Lütfen protein giriniz!" onChange={(e) => setProductData({ ...productData, protein: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input placeholder="Lütfen yağ giriniz!" onChange={(e) => setProductData({ ...productData, oil: e.target.value })} />
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
        editProductModalVisible && <div>
          <div className="popup-filter"></div>
          <div className="add-user-popup-container">
            <div className="card">
              <div className="card-header">
                <h3>Ürün Düzenleme</h3>
                <button className="close-button" onClick={() => { setProductData({ ...productData, name: "", newPrice: "", productDescription: "", farmerName: "", avatar: "", calorie: "", carbohydrate: "", protein: "", oil: "", price: "", discount: "" }); setEditProductModalVisible(false); setImageUrl("http://www.clker.com/cliparts/S/j/7/o/b/H/cloud-upload-outline.svg.med.png") }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
              </div>
              <div className="card-body">

                <div className="mb-3">
                  <Input value={productData.name} placeholder="Lütfen ürün adı giriniz!" onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input value={productData.price} placeholder="Lütfen fiyat giriniz!" onChange={(e) => setProductData({ ...productData, price: e.target.value })} />
                </div>

                <div className="mb-3">
                  <label>Lütfen indirim oranı giriniz!</label>
                  <Select value={productData.discount} className="w-100" onChange={discount}>
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
                </div>

                <h4 className="d-flex justify-content-center flex-column align-items-center">
                  Yeni Fiyat
                  <b className="ml-3">
                    {
                      (parseInt(productData.price) || 0) - (((parseInt(productData.price) || 0) * (parseInt(productData.discount) || 0)) / 100)
                    }
                  </b>
                </h4>

                <label>Lütfen çifçiyi seçiniz!</label>
                <Select value={productData.farmerName} onChange={farmer} className="w-100">
                  {
                    farmerList && farmerList.map((farmer,index) => (
                      <Option key={index} value={farmer.name}>{farmer.name}</Option>
                    ))
                  }
                </Select>

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
                  <TextArea value={productData.productDescription} placeholder="Lütfen açıklama giriniz!" onChange={(e) => setProductData({ ...productData, productDescription: e.target.value })} />
                </div>
                <div className="mb-3">
                  <Input value={productData.calorie} placeholder="Lütfen kalori giriniz!" onChange={(e) => setProductData({ ...productData, calorie: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input value={productData.carbohydrate} placeholder="Lütfen karbonhidrat giriniz!" onChange={(e) => setProductData({ ...productData, carbohydrate: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input value={productData.protein} placeholder="Lütfen protein giriniz!" onChange={(e) => setProductData({ ...productData, protein: e.target.value })} />
                </div>

                <div className="mb-3">
                  <Input value={productData.oil} placeholder="Lütfen yağ giriniz!" onChange={(e) => setProductData({ ...productData, oil: e.target.value })} />
                </div>

                <Button type="primary" className="w-100" size="large" onClick={() => onEditDataProduct()}>
                  Kayıt Et
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      <div className="card">

        <div className="card-body">
          <h3>Doğal Çaylar</h3>

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
                        <Button className="ml-4" onClick={() => { setEditProductModalVisible(true); setProId(data._id); onEditProduct(data._id) }}>Düzenle</Button>
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

export default NaturalTeas;