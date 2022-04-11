import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, message, Layout, Button } from 'antd';
import { GlobalSettingsContext } from '../../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../../Contexts/CompanySettingsContext'
import { useHistory } from "react-router-dom";
import {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    LogoutOutlined,
    LoginOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Sidebar = ({ children }) => {

    let { mobile, token, setToken } = useContext(GlobalSettingsContext)
    let { user, setUser } = useContext(CompanySettingsContext);
    let history = useHistory();
    let [collapsed, setCollapsed] = useState(false)

    let logOut = () => {
        message.info("Çıkış yapılıyor...")
        setTimeout(() => {
            localStorage.removeItem("admin")
            localStorage.removeItem("adminToken")
            setUser(null)
            setToken(null)
            message.success("Başarıyla çıkış yapıldı.")
            history.push('/login')
        }, 2000)
    }

    let onCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <>
            <Layout>
                <Header className="header d-flex align-items-center justify-content-between">
                    <div className="text-white d-flex align-items-center">
                        <UserOutlined />
                        <div className="ml-3">Muhsin Deniz</div>
                    </div>
                    <Button type="ghost" className="text-white" onClick={() => logOut()}>
                        <LoginOutlined />
                        Logout
                    </Button>
                </Header>
                <Layout>
                    <Sider width={200} className="site-layout-background" collapsible collapsed={collapsed} onCollapse={onCollapse}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <SubMenu key="sub1" icon={<UserOutlined />} title="Genel Ayarlar">
                                <Menu.Item key="1"><Link to="/">Satış Özetleri</Link></Menu.Item>
                                <Menu.Item key="2"><Link to="/admin-setting">Yönetici Ayarları</Link></Menu.Item>
                                <Menu.Item key="3"><Link to="/users">Kullanıcılar</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/cupon-codes">Kupon Kodları</Link></Menu.Item>
                                <Menu.Item key="5"><Link to="/header-setting">Header Ayarları</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="/footer-setting">Footer Ayarları</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<UserOutlined />} title="Çifçi Ayarları">
                                <Menu.Item key="7"><Link to="/farmer-setting">Çifçi Bilgileri</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<LaptopOutlined />} title="Kategoriler">
                                <Menu.Item key="8"><Link to="/vegatables-setting">Sebzeler</Link></Menu.Item>
                                <Menu.Item key="9"><Link to="/fruits-setting">Meyveler</Link></Menu.Item>
                                <Menu.Item key="10"><Link to="/natural-teas-setting">Doğal Çaylar</Link></Menu.Item>
                                <Menu.Item key="11"><Link to="/useful-plants-setting">Faydalı Bitkiler</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub4" icon={<NotificationOutlined />} title="Diyet Listeleri">
                                <Menu.Item key="12">option9</Menu.Item>
                                <Menu.Item key="13">option12</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub5" icon={<NotificationOutlined />} title="Abone Ayarları">
                                <Menu.Item key="14"><Link to="/subscriber-setting">Kayıtlı Aboneler</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default Sidebar
