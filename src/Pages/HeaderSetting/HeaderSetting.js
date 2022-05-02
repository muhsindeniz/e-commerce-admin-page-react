import { Button, message, Spin } from 'antd'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'

const HeaderSetting = () => {

  let [setting, setSetting] = useState([])
  let [loading, setLoading] = useState(false)
  let [updateSetting, setUpdateSetting] = useState({
    "facebook": "",
    "twitter": "",
    "youtube": "",
    "instagram": "",
    "title": "",
    "keywords": "",
    "description": "",
    "footerDescription": "",
    "phone": "",
    "email": "",
    "address": ""

  })

  useEffect(() => {
    axios.get('http://localhost:3000/api/seoSetting')
      .then(response => {
        setSetting(...response.data)
      })
  }, [])

  useEffect(() => {
    setUpdateSetting({
      ...updateSetting,
      facebook: setting.facebook,
      twitter: setting.twitter,
      youtube: setting.youtube,
      instagram: setting.instagram,
      title: setting.title,
      keywords: setting.keywords,
      description: setting.description,
      footerDescription: setting.footerDescription,
      phone: setting.phone,
      email: setting.email,
      address: setting.address
    })
  }, [setting])

  console.log(updateSetting)

  let updateWebSetting = () => {
    setLoading(true)
    axios.patch('http://localhost:3000/api/seoSetting', {
      ...updateSetting
    })
    .then(resp => {
      console.log(resp)
      if(resp.data.result_message.type === 'success')
        message.success(resp.data.result.message)
      else
      message.success("Üzgünüz bilgiler güncellenemedi!")
      setLoading(false)
    })
    .catch(err => {
      setLoading(false)
    })
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-lg-6">
          <h4>Sosyal medya bağlantıları</h4>
          <div className="card border rounded p-3 mb-3">
            <div className="form-container">
              <label className="mb-2" htmlFor="facebook">Facebook</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, facebook: e.target.value })} defaultValue={setting.facebook || ""} type="url" size="large" id="facebook" placeholder="Facebook bağlantısı" />
            </div>

            <div className="form-container">
              <label className="mb-2" htmlFor="twitter">Twitter</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, twitter: e.target.value })} defaultValue={setting.twitter || ""} type="url" size="large" id="twitter" placeholder="Twitter bağlantısı" />
            </div>

            <div className="form-container">
              <label className="mb-2" htmlFor="youtube">Youtube</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, youtube: e.target.value })} defaultValue={setting.youtube || ""} type="url" size="large" id="youtube" placeholder="Youtube bağlantısı" />
            </div>

            <div className="form-container">
              <label className="mb-2" htmlFor="instagram">Instagram</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, instagram: e.target.value })} defaultValue={setting.instagram || ""} type="url" size="large" id="instagram" placeholder="Instagram bağlantısı" />
            </div>
          </div>

          <h4>SEO ayarları</h4>

          <div className="card border rounded p-3 mb-3">
            <div className="form-container">
              <label className="mb-2" htmlFor="title">Başlık</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, title: e.target.value })} defaultValue={setting.title || ""} type="url" size="large" id="title" placeholder="Helath Path | Your Health Path" />
            </div>
            <div className="form-container">
              <label className="mb-2" htmlFor="keywords">Anahtar Kelimeler</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, keywords: e.target.value })} defaultValue={setting.keywords || ""} type="url" size="large" id="keywords" placeholder="sağlık, sebze, meyve" />
            </div>
            <div className="form-container">
              <label className="mb-2">Açıklama</label>
              <textarea onChange={(e) => setUpdateSetting({ ...updateSetting, description: e.target.value })} defaultValue={setting.description || ""} size="large" rows={2} maxLength={250} placeholder="You can easily obtain health products and create your own diet list." />
            </div>
          </div>
        </div>

        <div className="col-sm-12 col-lg-6">
          <h4>Footer açıklama yazısı</h4>
          <div className="card border rounded p-3 mb-3">
            <div className="form-container">
              <textarea onChange={(e) => setUpdateSetting({ ...updateSetting, footerDescription: e.target.value })} defaultValue={setting.footerDescription || ""} size="large" rows={4} maxLength={250} placeholder="Açıklama giriniz" />
            </div>
          </div>

          <h4>İletişim bilgileri</h4>

          <div className="card border rounded p-3 mb-3">
            <div className="form-container">
              <label className="mb-2" htmlFor="phone">Telefon</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, phone: e.target.value })} defaultValue={setting.phone || ""} type="tel" size="large" id="phone" placeholder="Telefon numarası" />
            </div>

            <div className="form-container">
              <label className="mb-2" htmlFor="email">Email</label>
              <input onChange={(e) => setUpdateSetting({ ...updateSetting, email: e.target.value })} defaultValue={setting.email || ""} type="email" size="large" id="email" placeholder="Email adresi" />
            </div>

            <div className="form-container">
              <label className="mb-2" htmlFor="address">Address</label>
              <textarea onChange={(e) => setUpdateSetting({ ...updateSetting, address: e.target.value })} defaultValue={setting.address || ""} size="large" rows={3} id="address" placeholder="Address giriniz" />
            </div>
          </div>
          <div className="w-100">
            <Button type="primary" size="large" onClick={() => updateWebSetting()}>Kaydet</Button>
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

export default HeaderSetting