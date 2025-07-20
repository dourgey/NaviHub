import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Navigation.css';

const Navigation = () => {
    const [links, setLinks] = useState([]);
    const [groups, setGroups] = useState([]);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        // 验证 token 有效性
        fetchLinks();
    }, [navigate]);

    const fetchLinks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('/api/links/', {
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
            } else if (response.status === 401) {
                // token 失效，清除本地存储并重定向到登录页
                localStorage.removeItem('token');
                localStorage.removeItem('isAdmin');
                navigate('/login');
            } else {
                console.error('获取链接失败:', response.status);
            }
        } catch (error) {
            console.error('获取链接失败:', error);
            if (error.message === 'Failed to fetch') {
                localStorage.removeItem('token');
                localStorage.removeItem('isAdmin');
                navigate('/login');
            }
        }
    };

    return (
        <div className="metro-container">
            <div className="metro-grid">
                {/* 显示有分组的链接 */}
                {groups.map(group => (
                    <div key={group} className="metro-group">
                        <h2 className="group-title">{group}</h2>
                        <div className="metro-tiles">
                            {links
                                .filter(link => link.group === group)
                                .map(link => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="metro-tile"
                                    >
                                        {link.icon && (
                                            <img
                                                src={link.icon}
                                                alt={link.name}
                                                className="tile-icon"
                                            />
                                        )}
                                        <div className="tile-content">
                                            <h3>{link.name}</h3>
                                            {link.description && (
                                                <p>{link.description}</p>
                                            )}
                                        </div>
                                    </a>
                                ))}
                        </div>
                    </div>
                ))}
                
                {/* 显示未分组的链接 */}
                {links.filter(link => !link.group).length > 0 && (
                    <div className="metro-group">
                        <h2 className="group-title">未分组</h2>
                        <div className="metro-tiles">
                            {links
                                .filter(link => !link.group)
                                .map(link => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="metro-tile"
                                    >
                                        {link.icon && (
                                            <img
                                                src={link.icon}
                                                alt={link.name}
                                                className="tile-icon"
                                            />
                                        )}
                                        <div className="tile-content">
                                            <h3>{link.name}</h3>
                                            {link.description && (
                                                <p>{link.description}</p>
                                            )}
                                        </div>
                                    </a>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navigation; 