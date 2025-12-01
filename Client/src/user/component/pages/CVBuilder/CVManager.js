import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../../../../services/api';

const CVManager = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingResume, setEditingResume] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        template_type: 'modern',
        cv_data: {
            personal_info: {
                name: '',
                email: '',
                phone: '',
                address: ''
            },
            experience: [],
            education: [],
            skills: []
        }
    });

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const data = await resumeAPI.getMyResumes();
            setResumes(data);
        } catch (error) {
            console.error('Error fetching resumes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingResume) {
                await resumeAPI.updateResume(editingResume._id, formData);
                alert('Cập nhật CV thành công!');
            } else {
                await resumeAPI.createResume(formData);
                alert('Tạo CV thành công!');
            }
            setShowForm(false);
            setEditingResume(null);
            fetchResumes();
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Lỗi khi lưu CV');
        }
    };

    const handleEdit = async (resumeId) => {
        try {
            const resume = await resumeAPI.getResumeById(resumeId);
            setFormData(resume);
            setEditingResume(resume);
            setShowForm(true);
        } catch (error) {
            console.error('Error fetching resume:', error);
        }
    };

    const handleDelete = async (resumeId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa CV này?')) {
            try {
                await resumeAPI.deleteResume(resumeId);
                alert('Xóa CV thành công!');
                fetchResumes();
            } catch (error) {
                console.error('Error deleting resume:', error);
                alert('Lỗi khi xóa CV');
            }
        }
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                cv_data: {
                    ...prev.cv_data,
                    [parent]: {
                        ...prev.cv_data[parent],
                        [child]: value
                    }
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Quản lý CV</h2>
            
            <button 
                onClick={() => setShowForm(true)}
                style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                Tạo CV mới
            </button>

            {showForm && (
                <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
                    <h3>{editingResume ? 'Chỉnh sửa CV' : 'Tạo CV mới'}</h3>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label>Tiêu đề CV:</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Template:</label>
                        <select
                            value={formData.template_type}
                            onChange={(e) => handleInputChange('template_type', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="creative">Creative</option>
                        </select>
                    </div>

                    <h4>Thông tin cá nhân</h4>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Họ tên:</label>
                        <input
                            type="text"
                            value={formData.cv_data.personal_info.name}
                            onChange={(e) => handleInputChange('personal_info.name', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.cv_data.personal_info.email}
                            onChange={(e) => handleInputChange('personal_info.email', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label>Số điện thoại:</label>
                        <input
                            type="text"
                            value={formData.cv_data.personal_info.phone}
                            onChange={(e) => handleInputChange('personal_info.phone', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <button 
                            onClick={handleSave}
                            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}
                        >
                            Lưu CV
                        </button>
                        <button 
                            onClick={() => { setShowForm(false); setEditingResume(null); }}
                            style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h3>Danh sách CV</h3>
                {resumes.length === 0 ? (
                    <p>Chưa có CV nào</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Tiêu đề</th>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Template</th>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Ngày tạo</th>
                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.map((resume) => (
                                <tr key={resume._id}>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{resume.title}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{resume.template_type}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                        {new Date(resume.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                                        <button 
                                            onClick={() => handleEdit(resume._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', marginRight: '5px' }}
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(resume._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CVManager;