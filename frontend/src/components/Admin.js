import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Tabs, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const Admin = () => {
    const [links, setLinks] = useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const [userForm] = Form.useForm();

    const apiBase = process.env.REACT_APP_API_URL;

    console.log("API base:", process.env.REACT_APP_API_URL);

    useEffect(() => {
        fetchLinks();
        fetchUsers();
    }, []);

    const fetchLinks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBase}/api/links/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLinks(data);
                // 提取所有不重复的分组
                const uniqueGroups = [...new Set(data.map(link => link.group).filter(Boolean))];
                setGroups(uniqueGroups);
            } else {
                console.error('获取链接失败:', response.status);
                message.error('获取链接失败');
            }
        } catch (error) {
            console.error('获取链接失败:', error);
            message.error('获取链接失败');
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBase}/api/users/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('获取用户失败:', response.status);
                message.error('获取用户失败');
            }
        } catch (error) {
            console.error('获取用户失败:', error);
            message.error('获取用户失败');
        }
    };

    const handleLinkSubmit = async () => {
        try {
            const values = await form.validateFields();
            // 只取第一个分组（如果是数组）
            if (Array.isArray(values.group)) {
                values.group = values.group.length > 0 ? values.group[0] : null;
            }
            // 移除 id 字段，避免 422
            delete values.id;
            const token = localStorage.getItem('token');
            const url = editingLink 
                ? `${apiBase}/api/links/${editingLink.id}/`
                : `${apiBase}/api/links/`;
            const method = editingLink ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success(editingLink ? '链接更新成功' : '链接创建成功');
                setIsLinkModalVisible(false);
                form.resetFields();
                setEditingLink(null);
                fetchLinks();
            } else {
                console.error('操作失败:', response.status);
                message.error('操作失败');
            }
        } catch (error) {
            console.error('提交失败:', error);
            message.error('提交失败');
        }
    };

    const handleUserSubmit = async () => {
        try {
            const values = await userForm.validateFields();
            const token = localStorage.getItem('token');
            const url = editingUser 
                ? `${apiBase}/api/users/${editingUser.id}/`
                : `${apiBase}/api/users/`;
            const method = editingUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success(editingUser ? '用户更新成功' : '用户创建成功');
                setIsUserModalVisible(false);
                userForm.resetFields();
                setEditingUser(null);
                fetchUsers();
            } else {
                console.error('操作失败:', response.status);
                message.error('操作失败');
            }
        } catch (error) {
            console.error('提交失败:', error);
            message.error('提交失败');
        }
    };

    const handleDeleteLink = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBase}/api/links/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                message.success('链接删除成功');
                fetchLinks();
            } else {
                console.error('删除失败:', response.status);
                message.error('删除失败');
            }
        } catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBase}/api/users/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                message.success('用户删除成功');
                fetchUsers();
            } else {
                console.error('删除失败:', response.status);
                message.error('删除失败');
            }
        } catch (error) {
            console.error('删除失败:', error);
            message.error('删除失败');
        }
    };

    const showModal = (link = null) => {
        setEditingLink(link);
        if (link) {
            form.setFieldsValue(link);
        } else {
            form.resetFields();
        }
        setIsLinkModalVisible(true);
    };

    const handleCancel = () => {
        setIsLinkModalVisible(false);
        form.resetFields();
        setEditingLink(null);
    };

    const linkColumns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: '分组',
            dataIndex: 'group',
            key: 'group',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteLink(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const userColumns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '管理员',
            dataIndex: 'is_admin',
            key: 'is_admin',
            render: (isAdmin) => isAdmin ? '是' : '否',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingUser(record);
                            userForm.setFieldsValue(record);
                            setIsUserModalVisible(true);
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteUser(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ 
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            margin: '20px'
        }}>
            <Tabs defaultActiveKey="links">
                <Tabs.TabPane tab="链接管理" key="links">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        style={{ 
                            marginBottom: 16,
                            background: '#ff8a8a',
                            borderColor: '#ff8a8a'
                        }}
                    >
                        添加链接
                    </Button>
                    <Table 
                        columns={linkColumns} 
                        dataSource={links} 
                        rowKey="id"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                            padding: '16px'
                        }}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="用户管理" key="users">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingUser(null);
                            userForm.resetFields();
                            setIsUserModalVisible(true);
                        }}
                        style={{ 
                            marginBottom: 16,
                            background: '#ff8a8a',
                            borderColor: '#ff8a8a'
                        }}
                    >
                        添加用户
                    </Button>
                    <Table 
                        columns={userColumns} 
                        dataSource={users} 
                        rowKey="id"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                            padding: '16px'
                        }}
                    />
                </Tabs.TabPane>
            </Tabs>

            <Modal
                title={editingLink ? '编辑链接' : '添加链接'}
                open={isLinkModalVisible}
                onOk={handleLinkSubmit}
                onCancel={handleCancel}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ required: true, message: '请输入名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[{ required: true, message: '请输入URL' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="icon"
                        label="图标URL"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="group"
                        label="分组"
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder="选择或输入分组"
                            optionFilterProp="children"
                            notFoundContent={null}
                            showArrow={false}
                            mode="tags"
                            style={{ width: '100%' }}
                        >
                            {groups.map(group => (
                                <Option key={group} value={group}>{group}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingUser ? '编辑用户' : '添加用户'}
                open={isUserModalVisible}
                onOk={handleUserSubmit}
                onCancel={() => {
                    setIsUserModalVisible(false);
                    userForm.resetFields();
                    setEditingUser(null);
                }}
                okText="保存"
                cancelText="取消"
            >
                <Form form={userForm} layout="vertical">
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: !editingUser, message: '请输入密码' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="is_admin"
                        label="管理员"
                        valuePropName="checked"
                    >
                        <Input type="checkbox" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Admin; 