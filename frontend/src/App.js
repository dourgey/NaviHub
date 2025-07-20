import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { LinkOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Admin from './components/Admin';
import './App.css';

const { Header, Content } = Layout;

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const apiBase = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const admin = localStorage.getItem('isAdmin') === 'true';
        setIsAuthenticated(!!token);
        setIsAdmin(admin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
        setIsAdmin(false);
        window.location.href = '/login';
    };

    // 受保护的路由组件
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    // 公共路由组件（已登录用户不能访问）
    const PublicRoute = ({ children }) => {
        if (isAuthenticated) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ffb8b8, #ffd6a5)' }}>
                                <Header style={{
                                    position: 'fixed',
                                    width: '100%',
                                    zIndex: 1000,
                                    backdropFilter: 'blur(10px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <Menu theme="dark" mode="horizontal" style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        backgroundColor: 'transparent',
                                        border: 'none'
                                    }}
                                    selectedKeys={['nav']}
                                    items={[
                                        {
                                            key: 'nav',
                                            icon: <LinkOutlined />,
                                            label: <Link to="/">NaviHub</Link>
                                        },
                                        ...(isAdmin ? [{
                                            key: 'admin',
                                            icon: <UserOutlined />,
                                            label: <Link to="/admin">管理后台</Link>
                                        }] : []),
                                        {
                                            key: 'logout',
                                            icon: <LogoutOutlined />,
                                            label: '退出',
                                            onClick: handleLogout
                                        }
                                    ]}
                                    />
                                </Header>
                                <Content>
                                    <Navigation />
                                </Content>
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                {isAdmin && (
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <Layout style={{ minHeight: '100vh' }}>
                                    <Header>
                                        <Menu theme="dark" mode="horizontal" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Menu.Item key="nav" icon={<LinkOutlined />}>
                                                <Link to="/">导航</Link>
                                            </Menu.Item>
                                            <Menu.Item key="admin" icon={<UserOutlined />}>
                                                <Link to="/admin">管理后台</Link>
                                            </Menu.Item>
                                            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                                                退出
                                            </Menu.Item>
                                        </Menu>
                                    </Header>
                                    <Content>
                                        <Admin />
                                    </Content>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App; 