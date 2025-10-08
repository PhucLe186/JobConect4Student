function Footer() {
    return (
        <footer>
            <div className="container text-center">
                <h5 className="fw-bold text-primary">
                    JobConnect <span className="text-success">4Students</span>
                </h5>
                <p>497 Hoa Hao Street, Ward 7, District 10, Ho Chi Minh City</p>
                <p>
                    Hotline : 0943009243 |{' '}
                    <button
                        onClick={openZaloChat}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                    >
                        Chat Zalo: 0943009243
                    </button>
                </p>
                <div className="mt-2">
                    <a href="#">Facebook</a> · <a href="#">Instagram</a> ·<a href="#">YouTube</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
