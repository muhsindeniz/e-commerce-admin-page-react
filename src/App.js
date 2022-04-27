import { useEffect, useLayoutEffect, useState } from 'react';
import { GlobalSettingsContext } from "./Contexts/GlobalSettingsContext"
import { CompanySettingsContext } from "./Contexts/CompanySettingsContext"
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Login from './Pages/Login/Login';
import './Assets/css/bootstrap.min.css'
import './Assets/css/style.css'
import './Assets/css/plugins.css'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'antd/dist/antd.css';
import 'react-quill/dist/quill.snow.css';
import MasterPage from './Pages/MasterPage';

function App(props) {
  let [mobile, setMobile] = useState(false)
  let [token, setToken] = useState(localStorage.getItem("adminToken"))
  let [user, setUser] = useState(JSON.parse(localStorage.getItem("admin")))
  let history = useHistory()

  useEffect(() => {
    let getSize = () => {
      let size = { width: window.innerWidth, height: window.innerHeight }
      setMobile(size.width < 768 ? true : false)
    }
    getSize()
    window.addEventListener("resize", getSize)
    return () => {
      window.removeEventListener('resize', getSize)
      window.removeEventListener('load', getSize)
    }
  }, [])



  return (
    <GlobalSettingsContext.Provider value={{ mobile, token, setToken }}>
      <CompanySettingsContext.Provider value={{ user, setUser }}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={MasterPage} />
          </Switch>
        </Router>
      </CompanySettingsContext.Provider>
    </GlobalSettingsContext.Provider>
  );
}

export default App;
