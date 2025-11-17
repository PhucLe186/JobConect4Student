import React from 'react';

const Contact = () => {
    return (
        <div style={{ padding: '40px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Liên hệ với chúng tôi</h1>
                
                <form style={{ marginBottom: '40px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Họ và tên:</label>
                        <input 
                            type="text" 
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '2px solid #ddd', 
                                borderRadius: '5px', 
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }} 
                            placeholder="Nhập họ và tên của bạn"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Email:</label>
                        <input 
                            type="email" 
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '2px solid #ddd', 
                                borderRadius: '5px', 
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }} 
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Tin nhắn:</label>
                        <textarea 
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                border: '2px solid #ddd', 
                                borderRadius: '5px', 
                                fontSize: '16px',
                                minHeight: '120px',
                                boxSizing: 'border-box',
                                resize: 'vertical'
                            }} 
                            placeholder="Nhập tin nhắn của bạn"
                        ></textarea>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button 
                            type="submit" 
                            style={{ 
                                backgroundColor: '#007bff', 
                                color: 'white', 
                                padding: '15px 40px', 
                                border: 'none', 
                                borderRadius: '5px', 
                                fontSize: '18px', 
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Cảm ơn bạn đã liên hệ!');
                            }}
                        >
                            Gửi tin nhắn
                        </button>
                    </div>
                </form>

                <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px' }}>
                    <h3 style={{ color: '#333', marginBottom: '20px' }}>Thông tin liên hệ</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#555' }}>📍 Địa chỉ:</strong>
                        <p style={{ margin: '5px 0', color: '#666' }}>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#555' }}>📞 Hotline:</strong>
                        <p style={{ margin: '5px 0', color: '#666' }}>0943009243</p>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: '#555' }}>✉️ Email:</strong>
                        <p style={{ margin: '5px 0', color: '#666' }}>contact@jobconnect4students.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
