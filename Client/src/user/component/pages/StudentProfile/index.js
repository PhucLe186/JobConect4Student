<<<<<<< HEAD
import React, { useMemo, useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import styles from "./StudentProfile.module.scss";
import translations from "~/component/Translation";
import { AuthContext } from '~/context/AuthContext';

=======
import React, { useContext, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./StudentProfile.module.scss";
import translations from "~/component/Translation";
import { AuthContext } from "~/context/AuthContext";
>>>>>>> 165a7464 (new updat 29/11/2025)
const cx = classNames.bind(styles);

const skillsCatalog = [
    { id: 1, name: "JavaScript" }, { id: 2, name: "React" }, { id: 3, name: "Node.js" },
    { id: 4, name: "Python" }, { id: 5, name: "Java" }, { id: 6, name: "C/C++" },
    { id: 7, name: "SQL" }, { id: 8, name: "UI/UX" }, { id: 9, name: "Git" },
    { id: 10, name: "Communication" }, { id: 11, name: "Teamwork" }, { id: 12, name: "Problem Solving" },
];

function StudentProfile() {
    const {language}= useContext(AuthContext)
    const [selectedSkillId, setSelectedSkillId] = useState(skillsCatalog[0]?.id ?? 1);
<<<<<<< HEAD
    const [experience, setExperience] = useState('noExperience');
    const [studentSkills, setStudentSkills] = useState([
        { skill_id: 2, experience: 'twoYears' },
        { skill_id: 3, experience: 'oneYear' },
    ]);
=======
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
    const { api, user } = useContext(AuthContext);
>>>>>>> c3165e2f (fix tu them cac thong tin ca nhan khi dang ki)

    const t = translations[language];

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            if (!user) {
                setLoading(false);
                return;
            }
            
            const response = await api.get('applications/history');
            console.log('Profile Response data:', response.data);
            
            if (response.data.personalInfo) {
                setProfileData({
                    name: response.data.personalInfo.name || '',
                    email: response.data.personalInfo.email || '',
                    dateOfBirth: response.data.personalInfo.dateOfBirth ? new Date(response.data.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
                    gender: response.data.personalInfo.gender || 'Male',
                    phone: response.data.personalInfo.phone || '',
                    address: response.data.personalInfo.address || '',
                    avatar: response.data.personalInfo.avatar || '',
                    school: response.data.personalInfo.school || '',
                    major: response.data.personalInfo.major || '',
                    gpa: response.data.personalInfo.gpa || '',
                    graduation_year: response.data.personalInfo.graduation_year || '',
                    career_goal: response.data.personalInfo.career_goal || '',
                    desired_salary: response.data.personalInfo.desired_salary || ''
                });
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
                updatedSkills[existingSkillIndex] = { ...updatedSkills[existingSkillIndex], experience: experience };
                return updatedSkills;
            } else {
                return [...prevSkills, { skill_id: Number(selectedSkillId), experience: experience }];
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
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh.');
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

            // Upload file lên server
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await fetch('http://localhost:5001/student/upload-avatar', {
                method: 'POST',
                body: formData
            });
            
            // Cập nhật avatar URL từ server
            setProfileData(prev => ({ 
                ...prev, 
                avatar: response.data.avatarUrl 
            }));
            
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            alert('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert(t.saveAlert); 
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
                <h1 className={cx("profile-page__title")}>{t.studentProfile}</h1>
            </header>

            <form className={cx("profile-form")} onSubmit={handleFormSubmit}>
                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.personalInfoTitle}</h2> 
                    <div className={cx("card__body", "card__body--grid")}>
                        <div className={cx("avatar")}>
                            <div 
                                className={cx("avatar__preview")} 
                                aria-label="Ảnh đại diện"
                                style={{
                                    backgroundImage: profileData.avatar ? `url(${profileData.avatar})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                            <label htmlFor="avatar" className={cx("btn", "avatar__upload")}>
                                {uploading ? 'Đang tải...' : t.uploadButton}
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
                        <div className={cx("skills__form")} onSubmit={handleAddSkill}>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="skill_id">{t.selectSkillLabel}</label>
                                <select id="skill_id" name="skill_id" className={cx("form-group__input")} value={selectedSkillId} onChange={(e) => setSelectedSkillId(Number(e.target.value))}>
                                    {skillsCatalog.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                                </select>
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="experience">{t.experienceLabel}</label>
                                <select id="experience" name="experience" className={cx("form-group__input")} value={experience} onChange={(e) => setExperience(e.target.value)}>
                                    <option value="noExperience">{t.noExperience}</option>
                                    <option value="oneYear">{t.oneYear}</option>
                                    <option value="twoYears">{t.twoYears}</option>
                                    <option value="threeYears">{t.threeYears}</option>
                                    <option value="fourYears">{t.fourYears}</option>
                                </select>
                            </div>
                            <button type="submit" className={cx("btn", "btn--primary", "skills__add-btn")}>{t.addSkillButton}</button>
                        </div>
                        <ul className={cx("skills__list")}>
                            {studentSkills.map(({ skill_id, experience }) => {
                                const getExperienceText = (exp) => {
                                    switch(exp) {
                                        case 'noExperience': return t.noExperience;
                                        case 'oneYear': return t.oneYear;
                                        case 'twoYears': return t.twoYears;
                                        case 'threeYears': return t.threeYears;
                                        case 'fourYears': return t.fourYears;
                                        default: return exp;
                                    }
                                };
                                return (
                                    <li key={skill_id} className={cx("skills__item")}>
                                        <span className={cx("skills__name")}>{skillMap[skill_id] ?? `Skill ID #${skill_id}`}</span>
                                        <span className={cx("skills__rating")}>{getExperienceText(experience)}</span>
                                        <button 
                                            type="button" 
                                            className={cx("skills__remove-btn")} 
                                            onClick={() => handleRemoveSkill(skill_id)}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>

                <div className={cx("profile-form__actions")}>
                    <button className={cx("btn", "btn--primary")} type="submit">{t.saveButton}</button>
                </div>
            </form>
        </main>
    );
}

export default StudentProfile;