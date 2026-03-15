import React, { useMemo, useState, useEffect, useContext, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./StudentProfile.module.scss";
import translations from "~/component/Translation";
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function StudentProfile({ language = 'vi' }) {
    const [skillRows, setSkillRows] = useState([{ id: 1, skillId: '', level: 3 }]); // Mảng các dòng skill
    const [studentSkills, setStudentSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        address: '',
        avatar: '',
        school: '',
        major: '',
        gpa: '',
        graduation_year: '',
        career_goal: '',
        desired_salary: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { api, user } = useContext(AuthContext);

    const t = translations[language];

    const fetchProfileData = useCallback(async () => {
        try {
            if (!user) {
                console.log('No user found, skipping profile fetch');
                setLoading(false);
                return;
            }
            
            console.log('Fetching profile for user:', user);
            
            const response = await api.get('student');
            console.log('Profile Response data:', response.data);
            
            if (response.data) {
                const profileData = {
                    name: response.data.name || '',
                    email: response.data.email || '',
                    dateOfBirth: response.data.dateOfbirth ? new Date(response.data.dateOfbirth).toISOString().split('T')[0] : '',
                    gender: response.data.gender || 'Male',
                    phone: response.data.phone || '',
                    address: response.data.address || '',
                    avatar: response.data.avatar || '',
                    school: response.data.school || '',
                    major: response.data.major || '',
                    gpa: response.data.gpa || '',
                    graduation_year: response.data.graduation_year || '',
                    career_goal: response.data.career_goal || '',
                    desired_salary: response.data.desired_salary || ''
                };
                
                console.log('Setting profile data:', profileData);
                console.log('Avatar URL:', profileData.avatar);
                
                setProfileData(profileData);
                
                // Set skills từ profile data
                if (response.data.skills) {
                    console.log('Setting skills from profile:', response.data.skills);
                    setStudentSkills(response.data.skills);
                }
            }
        } catch (err) {
            console.error('Lỗi khi tải thông tin profile:', err);
        } finally {
            setLoading(false);
        }
    }, [api, user]);

    useEffect(() => {
        fetchProfileData();
        fetchAvailableSkills();
    }, [fetchProfileData]);

    const fetchAvailableSkills = async () => {
        try {
            console.log('🔄 Fetching available skills...');
            const response = await api.get('skills');
            console.log('📥 Available skills response:', response.data);
            console.log('📊 Skills count:', response.data ? response.data.length : 0);
            setAvailableSkills(response.data || []);
            console.log('✅ Available skills set in state');
        } catch (err) {
            console.error('❌ Lỗi khi tải danh sách skills:', err);
        }
    };

    // Lấy danh sách skills chưa được thêm
    const getAvailableSkillsForAdd = () => {
        const studentSkillIds = studentSkills.map(ss => ss.skill_id?._id).filter(Boolean);
        const filtered = availableSkills.filter(skill => !studentSkillIds.includes(skill._id));
        console.log('🎯 Available skills for add:', filtered.length);
        console.log('🚫 Student skill IDs:', studentSkillIds);
        return filtered;
    };

    const addNewSkillRow = () => {
        const newId = Math.max(...skillRows.map(row => row.id)) + 1;
        setSkillRows([...skillRows, { id: newId, skillId: '', level: 3 }]);
    };

    const removeSkillRow = (rowId) => {
        if (skillRows.length > 1) {
            setSkillRows(skillRows.filter(row => row.id !== rowId));
        }
    };

    const updateSkillRow = (rowId, field, value) => {
        setSkillRows(skillRows.map(row => 
            row.id === rowId ? { ...row, [field]: value } : row
        ));
    };

    const handleAddAllSkills = async () => {
        // Lọc các dòng có skillId hợp lệ
        const validSkills = skillRows.filter(row => row.skillId);
        
        if (validSkills.length === 0) {
            alert('Vui lòng chọn ít nhất một kỹ năng');
            return;
        }
        
        try {
            // Sử dụng API bulk để thêm nhiều skills cùng lúc
            const skillsToAdd = validSkills.map(row => ({
                skillId: row.skillId,
                level: row.level
            }));
            
            const response = await api.post('skills/student/bulk', {
                skills: skillsToAdd
            });
            
            if (response.data) {
                alert(response.data.message || `Thêm thành công ${skillsToAdd.length} kỹ năng!`);
                // Reset về 1 dòng trống
                setSkillRows([{ id: 1, skillId: '', level: 3 }]);
                // Refresh profile để lấy skills mới
                await fetchProfileData();
            }
        } catch (error) {
            console.error('Lỗi khi thêm skills:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi thêm kỹ năng');
        }
    };

    const handleRemoveSkill = async (skillIdToRemove) => {
        try {
            const response = await api.delete(`skills/student/${skillIdToRemove}`);
            
            if (response.data) {
                alert(response.data.message || 'Xóa kỹ năng thành công!');
                // Refresh profile để cập nhật skills
                await fetchProfileData();
            }
        } catch (error) {
            console.error('Lỗi khi xóa skill:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa kỹ năng');
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Vui lòng chọn file jpg, jpeg hoặc png.');
            return;
        }

        setUploading(true);
        
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('avatar', file);
            
            const response = await api.post('student/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data && response.data.avatarUrl) {
                setProfileData(prev => ({ 
                    ...prev, 
                    avatar: response.data.avatarUrl 
                }));
                console.log('Avatar updated successfully:', response.data.avatarUrl);
                alert('Tải ảnh thành công!');
                
                await fetchProfileData();
            } else {
                console.error('Invalid response:', response.data);
                alert('Upload thành công nhưng không nhận được URL ảnh.');
            }
            
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            alert('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
            fetchProfileData();
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            console.log('Submitting profile data:', profileData);
            
            const response = await api.post('student/update-profile', profileData);
            
            if (response.data && response.data.success) {
                alert('Lưu hồ sơ thành công!');
                await fetchProfileData();
            } else {
                alert('Có lỗi xảy ra khi lưu hồ sơ.');
            }
        } catch (error) {
            console.error('Lỗi khi lưu hồ sơ:', error);
            alert('Lỗi khi lưu hồ sơ. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className={cx("profile-page")}>
                <div className={cx("loading")}>Đang tải thông tin...</div>
            </main>
        );
    }

    return (
        <main className={cx("profile-page")}>
            <header className={cx("profile-page__header")}>
                <h1 className={cx("profile-page__title")}>{t.pageTitle}</h1>
            </header>

            <form className={cx("profile-form")} onSubmit={handleFormSubmit}>
                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.personalInfoTitle}</h2> 
                    <div className={cx("card__body", "card__body--grid")}>
                        <div className={cx("avatar")}>
                            <div 
                                className={cx("avatar__preview", {
                                    "avatar__preview--empty": !profileData.avatar || profileData.avatar.includes('flaticon.com'),
                                    "avatar__preview--has-image": profileData.avatar && !profileData.avatar.includes('flaticon.com')
                                })} 
                                aria-label="Ảnh đại diện"
                                style={{
                                    backgroundImage: profileData.avatar ? `url(${profileData.avatar})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                            <label htmlFor="avatar" className={cx("btn", "avatar__upload")}>
                                {uploading ? 'Đang tải...' : 
                                 (profileData.avatar && !profileData.avatar.includes('flaticon.com') ? 'Thay đổi ảnh' : t.uploadButton)}
                            </label> 
                            <input 
                                id="avatar" 
                                name="avatar" 
                                type="file" 
                                accept="image/*" 
                                className={cx("avatar__input")} 
                                onChange={handleAvatarChange}
                                disabled={uploading}
                            />
                        </div>

                        <div className={cx("card__fields")}>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="name">{t.fullNameLabel}</label>
                                <input 
                                    className={cx("form-group__input")} 
                                    id="name" 
                                    name="name" 
                                    type="text" 
                                    placeholder="Nguyễn Văn A" 
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                />
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="dateOfBirth">{t.dateOfBirthLabel}</label>
                                <input 
                                    className={cx("form-group__input")} 
                                    id="dateOfBirth" 
                                    name="dateOfBirth" 
                                    type="date" 
                                    value={profileData.dateOfBirth}
                                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                                />
                            </div>
                            <div className={cx("form-group", "form-group--inline")}>
                                <span className={cx("form-group__label")}>{t.genderLabel}</span>
                                <label className={cx("radio")}>
                                    <input 
                                        className={cx("radio__input")} 
                                        type="radio" 
                                        name="gender" 
                                        value="Male" 
                                        checked={profileData.gender === 'Male'}
                                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                                    />
                                    <span className={cx("radio__label")}>{t.male}</span>
                                </label>
                                <label className={cx("radio")}>
                                    <input 
                                        className={cx("radio__input")} 
                                        type="radio" 
                                        name="gender" 
                                        value="Female" 
                                        checked={profileData.gender === 'Female'}
                                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                                    />
                                    <span className={cx("radio__label")}>{t.female}</span>
                                </label>
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="email">{t.emailLabel}</label>
                                <input 
                                    className={cx("form-group__input")} 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    placeholder="email@sv.edu.vn" 
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                />
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="phone">{t.phoneLabel}</label>
                                <input 
                                    className={cx("form-group__input")} 
                                    id="phone" 
                                    name="phone" 
                                    type="tel" 
                                    placeholder="0123 456 789" 
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                />
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="address">{t.addressLabel}</label>
                                <input 
                                    className={cx("form-group__input")} 
                                    id="address" 
                                    name="address" 
                                    type="text" 
                                    placeholder="Quận/Huyện, Tỉnh/Thành" 
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.educationTitle}</h2>
                    <div className={cx("card__body")}>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="school">{t.schoolLabel}</label>
                            <input 
                                className={cx("form-group__input")} 
                                id="school" 
                                name="school" 
                                type="text" 
                                placeholder="ĐH Công nghệ..." 
                                value={profileData.school}
                                onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                            />
                        </div>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="major">{t.majorLabel}</label>
                            <input 
                                className={cx("form-group__input")} 
                                id="major" 
                                name="major" 
                                type="text" 
                                placeholder="Khoa học Máy tính..." 
                                value={profileData.major}
                                onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                            />
                        </div>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="gpa">{t.gpaLabel}</label>
                            <input 
                                className={cx("form-group__input")} 
                                id="gpa" 
                                name="gpa" 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                max="4" 
                                placeholder="3.20" 
                                value={profileData.gpa}
                                onChange={(e) => setProfileData({...profileData, gpa: e.target.value})}
                            />
                        </div>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="graduation_year">{t.graduationYearLabel}</label>
                            <input 
                                className={cx("form-group__input")} 
                                id="graduation_year" 
                                name="graduation_year" 
                                type="number" 
                                placeholder="2026" 
                                value={profileData.graduation_year}
                                onChange={(e) => setProfileData({...profileData, graduation_year: e.target.value})}
                            />
                        </div>
                    </div>
                </section>

                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.careerGoalTitle}</h2>
                    <div className={cx("card__body")}>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="desired_salary">{t.salaryLabel}</label>
                            <input 
                                className={cx("form-group__input")} 
                                id="desired_salary" 
                                name="desired_salary" 
                                type="number" 
                                placeholder="15000000" 
                                value={profileData.desired_salary}
                                onChange={(e) => setProfileData({...profileData, desired_salary: e.target.value})}
                            />
                        </div>
                        <div className={cx("form-group", "form-group--full-col")}>
                            <label className={cx("form-group__label")} htmlFor="career_goal">{t.goalDescriptionLabel}</label>
                            <textarea 
                                className={cx("form-group__textarea")} 
                                id="career_goal" 
                                name="career_goal" 
                                rows="3" 
                                placeholder="Mô tả mục tiêu ngắn hạn & dài hạn của bạn…"
                                value={profileData.career_goal}
                                onChange={(e) => setProfileData({...profileData, career_goal: e.target.value})}
                            ></textarea>
                        </div>
                    </div>
                </section>

                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.skillsTitle}</h2>
                    <div className={cx("skills")}>
                        {/* Hiển thị skills hiện tại */}
                        <div className={cx("current-skills")}>
                            <h3>Kỹ năng hiện tại:</h3>
                            <ul className={cx("skills__list")}>
                                {studentSkills.map((studentSkill) => (
                                    <li key={studentSkill._id} className={cx("skills__item")}>
                                        <span className={cx("skills__name")}>
                                            {studentSkill.skill_id?.name || 'Unknown Skill'}
                                        </span>
                                        <span className={cx("skills__rating")}>{"★".repeat(studentSkill.level)}{"☆".repeat(5 - studentSkill.level)}</span>
                                        <button 
                                            type="button" 
                                            className={cx("skills__remove-btn")} 
                                            onClick={() => handleRemoveSkill(studentSkill.skill_id._id)}
                                            title={`Xóa kỹ năng ${studentSkill.skill_id?.name}`}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                                {studentSkills.length === 0 && (
                                    <li className={cx("no-skills")}>Chưa có kỹ năng nào</li>
                                )}
                            </ul>
                        </div>

                        {/* Form thêm skills */}
                        <div className={cx("add-skills-section")}>
                            <h3>Thêm kỹ năng mới:</h3>
                            <div className={cx("skills__form")}>
                                {skillRows.map((row, index) => (
                                    <div key={row.id} className={cx("skill-row")}>
                                        <div className={cx("form-group")}>
                                            <label className={cx("form-group__label")} htmlFor={`skill_${row.id}`}>
                                                {index === 0 ? t.selectSkillLabel : `Kỹ năng ${index + 1}`}
                                            </label>
                                            <select 
                                                id={`skill_${row.id}`}
                                                className={cx("form-group__input")} 
                                                value={row.skillId} 
                                                onChange={(e) => updateSkillRow(row.id, 'skillId', e.target.value)}
                                            >
                                                <option value="">Chọn kỹ năng...</option>
                                                {getAvailableSkillsForAdd().map(skill => (
                                                    <option key={skill._id} value={skill._id}>{skill.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className={cx("form-group")}>
                                            <label className={cx("form-group__label")} htmlFor={`level_${row.id}`}>
                                                {index === 0 ? t.levelLabel : `Mức độ ${index + 1}`}
                                            </label>
                                            <input 
                                                id={`level_${row.id}`}
                                                className={cx("form-group__input")} 
                                                type="range" 
                                                min="1" 
                                                max="5" 
                                                value={row.level} 
                                                onChange={(e) => updateSkillRow(row.id, 'level', Number(e.target.value))}
                                            />
                                            <span className={cx("skills__level-indicator")}>
                                                {row.level} {"★".repeat(row.level)}{"☆".repeat(5 - row.level)}
                                            </span>
                                        </div>
                                        
                                        <div className={cx("skill-row-actions")}>
                                            {index === skillRows.length - 1 && (
                                                <button 
                                                    type="button" 
                                                    className={cx("btn", "btn--secondary", "add-row-btn")}
                                                    onClick={addNewSkillRow}
                                                >
                                                    + Thêm dòng
                                                </button>
                                            )}
                                            {skillRows.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    className={cx("btn", "btn--danger", "remove-row-btn")}
                                                    onClick={() => removeSkillRow(row.id)}
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                <div className={cx("form-actions")}>
                                    <button 
                                        type="button" 
                                        className={cx("btn", "btn--primary", "skills__add-btn")}
                                        onClick={handleAddAllSkills}
                                    >
                                        Thêm tất cả kỹ năng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={cx("profile-form__actions")}>
                    <button 
                        className={cx("btn", "btn--primary")} 
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? 'Đang lưu...' : t.saveButton}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default StudentProfile;