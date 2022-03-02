import React, { useEffect, useState, useContext } from 'react'
import { message, Spin } from 'antd';
import axios from 'axios';
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext'

const AdminSetting = () => {

  let [adminInfo, setAdminInfo] = useState({ "oldPassword": "", "password": "", "newPassword": "" });
  let [loading, setLoading] = useState(false)
  let { token } = useContext(GlobalSettingsContext)
  let { user, setUser } = useContext(CompanySettingsContext);

  let updatePassword = () => {
    if (adminInfo.oldPassword == "" || adminInfo.password == "" || adminInfo.newPassword == "") {
      message.info("Please fill in all fields!!")
    } else {
      if (adminInfo.password === adminInfo.newPassword) {
        setLoading(true)
        axios.post('http://localhost:3000/api/adminUpdatePassword', {
          password: adminInfo.oldPassword,
          newPassword: adminInfo.newPassword
        }, {
          headers: { "Content-Type": "application/json", authorization: `${token}` }
        }).then(({ data: { result, result_message } }) => {
          if (result_message.type == "success") {
            message.success("Your password has been successfully updated..")
            setLoading(false)
          } else {
            message.error(result_message.message)
            setLoading(false)
          }
        });
      } else {
        message.info("Passwords are not the same!!")
      }
    }
  }

  return (
    <>
      <div>
        <h3>Account Setting</h3>
        <div className="card">
          <div className="card-body">
            <h4 className="text-danger"><b><u>Update Password</u></b></h4>
            <div className="form-group mb-3 mt-3">
              <label htmlFor="exampleInputEmail1">Old Password</label>
              <input type="password" className="form-control" id="exampleInputEmail1" onChange={(e) => setAdminInfo({ ...adminInfo, oldPassword: e.target.value })} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputPassword1">New Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="exampleInputPassword2">New Password Again</label>
              <input type="password" className="form-control" id="exampleInputPassword2" onChange={(e) => setAdminInfo({ ...adminInfo, newPassword: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" onClick={() => updatePassword()}>Update Password</button>
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

export default AdminSetting