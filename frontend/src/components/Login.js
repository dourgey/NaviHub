import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const onFinish = async (values) => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: values.username,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                
                // 获取用户信息
                const userResponse = await fetch(`${apiUrl}/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    localStorage.setItem('isAdmin', userData.is_admin);
                    // 登录成功后强制刷新页面，确保 isAdmin 状态同步
                    window.location.href = '/';
                } else {
                    console.error('获取用户信息失败:', userResponse.status);
                    setError('获取用户信息失败');
                    localStorage.removeItem('token');
                }
            } else {
                console.error('登录失败:', response.status);
                setError('用户名或密码错误');
            }
        } catch (err) {
            console.error('登录失败:', err);
            setError('登录失败，请稍后重试');
            localStorage.removeItem('token');
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '100px auto' }}>
            <h2>登录</h2>
            {error && <Alert message={error} type="error" style={{ marginBottom: 20 }} />}
            <Form onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder="用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password placeholder="密码" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login; 