import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CVList() {
    const [cvList, setCvList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCVList();
    }, []);

    const fetchCVList = async () => {
        try {
            const response = await fetch('http://localhost:5000/resume/list');
            if (response.ok) {
                const data = await response.json();
                setCvList(data);
            }
        } catch (error) {
            console.error('Error fetching CV list:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Đang tải danh sách CV...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Danh sách CV đã lưu</h1>
            
            {cvList.length === 0 ? (
                <p>Chưa có CV nào được lưu</p>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {cvList.map((cv) => (
                        <div key={cv._id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h3>{cv.title}</h3>
                            <p><strong>Họ tên:</strong> {cv.fullname}</p>
                            <p><strong>Template:</strong> {cv.template_type}</p>
                            <p><strong>Ngày tạo:</strong> {new Date(cv.created_at).toLocaleDateString('vi-VN')}</p>
                            
                            <div style={{ marginTop: '10px' }}>
                                <Link 
                                    to={`/cv-viewer/${cv._id}`}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        padding: '8px 16px',
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                        marginRight: '10px'
                                    }}
                                >
                                    Xem CV
                                </Link>
                                
                                <Link 
                                    to={`/cv-builder?resumeId=${cv._id}`}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        padding: '8px 16px',
                                        textDecoration: 'none',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Chỉnh sửa
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CVList;