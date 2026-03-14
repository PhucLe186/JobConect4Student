import React, { useMemo, useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./StudentProfile.module.scss";
import translations from "~/component/Translation";
import { AuthContext } from '~/context/AuthContext';

const cx = classNames.bind(styles);

const skillsCatalog = [
    { id: 1, name: "JavaScript" }, { id: 2, name: "React" }, { id: 3, name: "Node.js" },
    { id: 4, name: "Python" }, { id: 5, name: "Java" }, { id: 6, name: "C/C++" },
    { id: 7, name: "SQL" }, { id: 8, name: "UI/UX" }, { id: 9, name: "Git" },
    { id: 10, name: "Communication" }, { id: 11, name: "Teamwork" }, { id: 12, name: "Problem Solving" },
];

function StudentProfile({ language = 'vi' }) {
    const [selectedSkillId, setSelectedSkillId] = useState(skillsCatalog[0]?.id ?? 1);
    const [level, setLevel] = useState(3);
    const [studentSkills, setStudentSkills] = useState([]);
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

    useEffect(() => {
        console.log('useEffect triggered, user:', user);
        fetchProfileData();
    }, [user]); // Thêm dependency

    const fetchProfileData = async () => {
        try {
            if (!user) {
                console.log('No user found, skipping profile fetch');
                setLoading(false);
                return;
            }
            
            console.log('Fetching profile for user:', user);
            
            // Gọi API lấy thông tin student profile
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
            }
        } catch (err) {
            console.error('Lỗi khi tải thông tin profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const skillMap = useMemo(() => Object.fromEntries(skillsCatalog.map(s => [s.id, s.name])), []);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (!selectedSkillId) return;
        setStudentSkills((prevSkills) => {
            const existingSkillIndex = prevSkills.findIndex(s => s.skill_id === Number(selectedSkillId));
            if (existingSkillIndex >= 0) {
                const updatedSkills = [...prevSkills];
                updatedSkills[existingSkillIndex] = { ...updatedSkills[existingSkillIndex], level: Number(level) };
                return updatedSkills;
            } else {
                return [...prevSkills, { skill_id: Number(selectedSkillId), level: Number(level) }];
            }
        });
    };

    const handleRemoveSkill = (skillIdToRemove) => {
        setStudentSkills((prevSkills) => prevSkills.filter(s => s.skill_id !== skillIdToRemove));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra kích thước file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
            return;
        }

        // Kiểm tra định dạng file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            alert('Vui lòng chọn file jpg, jpeg hoặc png.');
            return;
        }

        setUploading(true);
        
        try {
            // Tạo preview ngay lập tức
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);

            // Upload file lên server với JWT token
            const formData = new FormData();
            formData.append('avatar', file);
            
            const response = await api.post('student/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data && response.data.avatarUrl) {
                // Cập nhật avatar URL từ server
                setProfileData(prev => ({ 
                    ...prev, 
                    avatar: response.data.avatarUrl 
                }));
                console.log('Avatar updated successfully:', response.data.avatarUrl);
                alert('Tải ảnh thành công!');
                
                // Gọi lại fetchProfileData để đảm bảo dữ liệu đồng bộ
                await fetchProfileData();
            } else {
                console.error('Invalid response:', response.data);
                alert('Upload thành công nhưng không nhận được URL ảnh.');
            }
            
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            alert('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
            // Khôi phục avatar cũ
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
                // Tải lại dữ liệu để đảm bảo đồng bộ
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
                        <form className={cx("skills__form")} onSubmit={handleAddSkill}>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="skill_id">{t.selectSkillLabel}</label>
                                <select id="skill_id" name="skill_id" className={cx("form-group__input")} value={selectedSkillId} onChange={(e) => setSelectedSkillId(Number(e.target.value))}>
                                    {skillsCatalog.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                                </select>
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="level">{t.levelLabel}</label>
                                <input id="level" name="level" className={cx("form-group__input")} type="range" min="1" max="5" value={level} onChange={(e) => setLevel(Number(e.target.value))} />
                                <span className={cx("skills__level-indicator")}>{level}</span>
                            </div>
                            <button type="submit" className={cx("btn", "btn--primary", "skills__add-btn")}>{t.addSkillButton}</button>
                        </form>
                        <ul className={cx("skills__list")}>
                            {studentSkills.map(({ skill_id, level }) => (
                                <li key={skill_id} className={cx("skills__item")}>
                                    <span className={cx("skills__name")}>{skillMap[skill_id] ?? `Skill ID #${skill_id}`}</span>
                                    <span className={cx("skills__rating")}>{"★".repeat(level)}{"☆".repeat(5 - level)}</span>
                                    <button 
                                        type="button" 
                                        className={cx("skills__remove-btn")} 
                                        onClick={() => handleRemoveSkill(skill_id)}
                                        title={`Xóa kỹ năng ${skillMap[skill_id]}`}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
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