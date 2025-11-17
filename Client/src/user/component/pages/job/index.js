import React from 'react';

function Job() {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Chi tiết công việc</h1>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Nội dung chính */}
                    <div style={{ flex: 2, backgroundColor: 'white', padding: '30px', borderRadius: '10px' }}>
                        <h2>Giáo viên dạy Tiếng Anh</h2>
                        <p><strong>Công ty:</strong> GoGlobal</p>
                        <p><strong>Mức lương:</strong> 25.000–30.000 VND</p>
                        
                        <hr />
                        
                        <h3>Mô tả công việc</h3>
                        <p>Giảng dạy các lớp tiếng Anh từ cơ bản đến nâng cao và hỗ trợ học sinh trong quá trình học.</p>
                        
                        <h3>Thời gian làm việc</h3>
                        <p>Làm việc từ thứ 2 đến thứ 6; thời gian linh hoạt theo lịch giảng dạy.</p>
                        
                        <h3>Quyền lợi</h3>
                        <ul>
                            <li>Được đào tạo chuyên môn</li>
                            <li>Môi trường làm việc thân thiện</li>
                        </ul>
                        
                        <h3>Yêu cầu</h3>
                        <ul>
                            <li>Trình độ C1 tiếng Anh</li>
                            <li>Có trách nhiệm</li>
                        </ul>
                        
                        <button style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Ứng tuyển ngay
                        </button>
                    </div>
                    
                    {/* Sidebar */}
                    <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '10px', height: 'fit-content' }}>
                        <h3>Thông tin doanh nghiệp</h3>
                        <p><strong>Tên:</strong> GoGlobal Việt Nam</p>
                        <p><strong>Địa chỉ:</strong> 123 Nguyễn Văn Cừ, Hà Nội</p>
                        <p><strong>Website:</strong> www.goglobal.edu</p>
                        
                        <hr />
                        
                        <h4>Thông tin tuyển dụng</h4>
                        <p><strong>Số lượng:</strong> 05</p>
                        <p><strong>Hạn nộp:</strong> 30/12/2025</p>
                        <p><strong>Hình thức:</strong> Full-time</p>
                        
                        <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
                            Liên hệ công ty
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Job;
