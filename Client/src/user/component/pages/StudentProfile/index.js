import React, { useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./StudentProfile.module.scss";
import translations from "~/component/Translation";

const cx = classNames.bind(styles);

const skillsCatalog = [
    { id: 1, name: "JavaScript" }, { id: 2, name: "React" }, { id: 3, name: "Node.js" },
    { id: 4, name: "Python" }, { id: 5, name: "Java" }, { id: 6, name: "C/C++" },
    { id: 7, name: "SQL" }, { id: 8, name: "UI/UX" }, { id: 9, name: "Git" },
    { id: 10, name: "Communication" }, { id: 11, name: "Teamwork" }, { id: 12, name: "Problem Solving" },
];

function StudentProfile({ language = 'vi' }) {
    const [selectedSkillId, setSelectedSkillId] = useState(skillsCatalog[0]?.id ?? 1);
    const [experience, setExperience] = useState('noExperience');
    const [studentSkills, setStudentSkills] = useState([
        { skill_id: 2, experience: 'twoYears' },
        { skill_id: 3, experience: 'oneYear' },
    ]);

    const t = translations[language];

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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert(t.saveAlert); 
    };

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
                            <div className={cx("avatar__preview")} aria-label="Ảnh đại diện" />
                            <label htmlFor="avatar" className={cx("btn", "avatar__upload")}>{t.uploadButton}</label> 
                            <input id="avatar" name="avatar" type="file" accept="image/*" className={cx("avatar__input")} />
                        </div>

                        <div className={cx("card__fields")}>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="name">{t.fullNameLabel}</label>
                                <input className={cx("form-group__input")} id="name" name="name" type="text" placeholder="Nguyễn Văn A" />
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="dateOfBirth">{t.dateOfBirthLabel}</label>
                                <input className={cx("form-group__input")} id="dateOfBirth" name="dateOfBirth" type="date" />
                            </div>
                            <div className={cx("form-group", "form-group--inline")}>
                                <span className={cx("form-group__label")}>{t.genderLabel}</span>
                                <label className={cx("radio")}>
                                    <input className={cx("radio__input")} type="radio" name="gender" value="Male" defaultChecked />
                                    <span className={cx("radio__label")}>{t.male}</span>
                                </label>
                                <label className={cx("radio")}>
                                    <input className={cx("radio__input")} type="radio" name="gender" value="Female" />
                                    <span className={cx("radio__label")}>{t.female}</span>
                                </label>
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="email">{t.emailLabel}</label>
                                <input className={cx("form-group__input")} id="email" name="email" type="email" placeholder="email@sv.edu.vn" />
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="phone">{t.phoneLabel}</label>
                                <input className={cx("form-group__input")} id="phone" name="phone" type="tel" placeholder="0123 456 789" />
                            </div>
                            <div className={cx("form-group")}>
                                <label className={cx("form-group__label")} htmlFor="address">{t.addressLabel}</label>
                                <input className={cx("form-group__input")} id="address" name="address" type="text" placeholder="Quận/Huyện, Tỉnh/Thành" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.educationTitle}</h2>
                    <div className={cx("card__body")}>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="school">{t.schoolLabel}</label>
                            <input className={cx("form-group__input")} id="school" name="school" type="text" placeholder="ĐH Công nghệ..." />
                        </div>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="major">{t.majorLabel}</label>
                            <input className={cx("form-group__input")} id="major" name="major" type="text" placeholder="Khoa học Máy tính..." />
                        </div>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="gpa">{t.gpaLabel}</label>
                            <input className={cx("form-group__input")} id="gpa" name="gpa" type="number" step="0.01" min="0" max="4" placeholder="3.20" />
                        </div>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="graduation_year">{t.graduationYearLabel}</label>
                            <input className={cx("form-group__input")} id="graduation_year" name="graduation_year" type="number" placeholder="2026" />
                        </div>
                    </div>
                </section>

                <section className={cx("profile-form__section", "card")}>
                    <h2 className={cx("card__title")}>{t.careerGoalTitle}</h2>
                    <div className={cx("card__body")}>
                        <div className={cx("form-group")}>
                            <label className={cx("form-group__label")} htmlFor="desired_salary">{t.salaryLabel}</label>
                            <input className={cx("form-group__input")} id="desired_salary" name="desired_salary" type="number" placeholder="15000000" />
                        </div>
                        <div className={cx("form-group", "form-group--full-col")}>
                            <label className={cx("form-group__label")} htmlFor="career_goal">{t.goalDescriptionLabel}</label>
                            <textarea className={cx("form-group__textarea")} id="career_goal" name="career_goal" rows="3" placeholder="Mô tả mục tiêu ngắn hạn & dài hạn của bạn…"></textarea>
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