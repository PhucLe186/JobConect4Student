import classNames from "classnames/bind";
import { useFormState } from "react-dom";
import styles from './Job.module.scss';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cx= classNames.bind(styles)
function ApplyPopup({language, JobData,setShowApplyPopup, api }) {

    const [cvOption, setCvOption] = useState('');
    const [coverLetter, setCoverLetter]= useFormState('')
    const [uploadedCV, setUploadedCV] = useState(null);
    const navigate = useNavigate();
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (allowedTypes.includes(file.type)) {
                setUploadedCV(file);
            } else {
                alert(language === 'vi' ? 'Chỉ chấp nhận file PDF, DOC, DOCX' : 'Only PDF, DOC, DOCX files are allowed');
            }
        }
    };
    const HandleApplications=async(id)=> {
        setShowApplyPopup(true);
    }
    const handleCreateCV = () => {
        navigate('/cv_builder');
        setShowApplyPopup(false);
    };
    const handleApplySubmit = async () => {
        if (cvOption === 'upload' && !uploadedCV) {
            alert(language === 'vi' ? 'Vui lòng tải lên CV' : 'Please upload your CV');
            return;
        }
        if (cvOption === 'create') {
            handleCreateCV();
            return;
        }
        
        try{
            const formData = new FormData();
            formData.append('id', JobData._id);
            formData.append('cv', uploadedCV);
            formData.append('coverLetter', coverLetter);
            
            const res = await api.post('applications', formData);
            
            if(res.data.status) {
                alert(res.data.status)
                setShowApplyPopup(false);
                setCvOption('');
                setUploadedCV(null);
                setCoverLetter('');
            }
        }catch(error) {
            if(error.response) {
                alert(error.response?.data?.message)
            }
            else {
                alert('lỗi kết nối tới server')
            }
        }
    };
    return ( 
        <div className={cx('popup-overlay')} onClick={() => setShowApplyPopup(false)}>
                    <div className={cx('popup-content')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('popup-header')}>
                            <h3>{language === 'vi' ? 'Ứng tuyển việc làm' : 'Apply for Job'}</h3>
                            <button 
                                className={cx('popup-close')}
                                onClick={() => setShowApplyPopup(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className={cx('popup-body')}>
                            <div className={cx('job-info')}>
                                <h4>{JobData.title}</h4>
                                <p>{JobData.company_name}</p>
                            </div>
                            
                            <div className={cx('popup-field')}>
                                <label className={cx('popup-label')}>
                                    {language === 'vi' ? 'Chọn tùy chọn CV' : 'Choose CV Option'} <span className={cx('required')}>*</span>
                                </label>
                                <div className={cx('cv-options')}>
                                    <label className={cx('cv-option')}>
                                        <input 
                                            type="radio" 
                                            name="cvOption" 
                                            value="upload"
                                            checked={cvOption === 'upload'}
                                            onChange={(e) => setCvOption(e.target.value)}
                                        />
                                        <span>{language === 'vi' ? 'Tải lên CV có sẵn' : 'Upload existing CV'}</span>
                                    </label>
                                    <label className={cx('cv-option')}>
                                        <input 
                                            type="radio" 
                                            name="cvOption" 
                                            value="create"
                                            checked={cvOption === 'create'}
                                            onChange={(e) => setCvOption(e.target.value)}
                                        />
                                        <span>{language === 'vi' ? 'Tạo CV mới' : 'Create new CV'}</span>
                                    </label>
                                </div>
                            </div>

                            {cvOption === 'upload' && (
                                <div className={cx('popup-field')}>
                                    <label className={cx('popup-label')}>
                                        {language === 'vi' ? 'Tải lên file CV (PDF, DOC, DOCX)' : 'Upload CV file (PDF, DOC, DOCX)'}
                                    </label>
                                    <input
                                        type="file"
                                        className={cx('popup-file-input')}
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileUpload}
                                    />
                                    {uploadedCV && (
                                        <div className={cx('uploaded-file')}>
                                            <i className="fas fa-file"></i>
                                            <span>{uploadedCV.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {cvOption === 'create' && (
                                <div className={cx('popup-field')}>
                                    <div className={cx('create-cv-info')}>
                                        <i className="fas fa-info-circle"></i>
                                        <span>{language === 'vi' 
                                            ? 'Bạn sẽ được chuyển đến trang tạo CV'
                                            : 'You will be redirected to CV builder page'
                                        }</span>
                                    </div>
                                </div>
                            )}

                            <div className={cx('popup-field')}>
                                <label className={cx('popup-label')}>
                                    {language === 'vi' ? 'Thư xin việc (tùy chọn)' : 'Cover Letter (optional)'}
                                </label>
                                <textarea
                                    className={cx('popup-textarea')}
                                    rows={6}
                                    placeholder={language === 'vi' 
                                        ? 'Viết thư xin việc để tăng cơ hội được tuyển dụng...'
                                        : 'Write a cover letter to increase your chances...'}
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={cx('popup-actions')}>
                            <button 
                                className={cx('popup-btn', 'popup-btn--cancel')}
                                onClick={() => setShowApplyPopup(false)}
                            >
                                {language === 'vi' ? 'Hủy' : 'Cancel'}
                            </button>
                            <button 
                                className={cx('popup-btn', 'popup-btn--submit')}
                                onClick={handleApplySubmit}
                                disabled={!cvOption}
                            >
                                {cvOption === 'create' 
                                    ? (language === 'vi' ? 'Đi đến tạo CV' : 'Go to CV Builder')
                                    : (language === 'vi' ? 'Gửi ứng tuyển' : 'Submit Application')
                                }
                            </button>
                        </div>
                    </div>
                </div>
     );
}

export default ApplyPopup;