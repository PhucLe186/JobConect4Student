import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ApplyJobDocument, job_applications } from './applyjob.schema';
import { Model, Types } from 'mongoose';
import { CSV, ResumeDocument } from '../resume/resume.schema';
import { Student, StudentDocument } from '../student/student.schema';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { Jobs, JobsDocument } from '../jobs/schema/jobs.schema';
import { Employer, EmployerDocument } from '../employer/employer.schema';
import {
  StudentSkills,
  StudentSkillDocument,
} from '../skills/schema/StudentSkill.schema';
import { JobSkills, JobSkillDocument } from '../skills/schema/JobSkill.schema';
import { Skills, SkillDocument } from '../skills/schema/skills.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as fs from 'fs';

export interface FilterCriteria {
  minGpa?: number;
  level?: string;
  address?: string;
  skills?: string[];
  minMatchScore?: number;
}

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(job_applications.name)
    private jobApplyModel: Model<ApplyJobDocument>,
    @InjectModel(CSV.name) private CVModel: Model<ResumeDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(StudentSkills.name)
    private studentSkillModel: Model<StudentSkillDocument>,
    @InjectModel(JobSkills.name)
    private jobSkillModel: Model<JobSkillDocument>,
    @InjectModel(Skills.name)
    private skillModel: Model<SkillDocument>,
    private httpService: HttpService,
  ) {}

  private readonly defaultAvatar =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  private ensureStudentRole(user: JwtUser) {
    if (user.role !== 'student') {
      throw new ForbiddenException(
        'Ch? t?i kho?n sinh vi?n/?ng vi?n m?i c? th? n?p CV ?ng tuy?n',
      );
    }
  }

  // =================================================================
  // BỘ CÔNG CỤ XỬ LÝ CHUỖI VÀ TỪ ĐIỂN AI
  // =================================================================
  private readonly skillAliases: Record<string, string> = {
    'c/cd': 'ci/cd',
    cicd: 'ci/cd',
    react: 'reactjs',
    node: 'nodejs',
    vue: 'vuejs',
    k8s: 'kubernetes',
    aws: 'amazon web services',
    js: 'javascript',
  };

  private normalizeText(value = '') {
    return value
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private cleanString(str: string) {
    // Xóa sạch mọi khoảng trắng và ký tự đặc biệt (chỉ giữ chữ/số)
    return this.normalizeText(str || '').replace(/[\s\-\/\.]+/g, '');
  }

  private parseGpa(value: unknown) {
    const normalized = value?.toString().replace(',', '.').trim();
    const gpa = Number(normalized);
    return Number.isFinite(gpa) ? gpa : 0;
  }

  private getEnglishMeta(
    skills: Array<{ name: string; level: number }>,
    careerGoal?: string,
  ) {
    const englishKeywords = ['english', 'tieng anh', 'ielts', 'toeic', 'toefl'];
    const matchedSkill = skills
      .filter((skill) =>
        englishKeywords.some((keyword) =>
          this.normalizeText(skill.name).includes(keyword),
        ),
      )
      .sort((left, right) => right.level - left.level)[0];

    if (matchedSkill) {
      return {
        englishLabel: `${matchedSkill.name} (${matchedSkill.level}/5)`,
        englishScore: Math.min(100, 45 + matchedSkill.level * 12),
      };
    }

    if (
      careerGoal &&
      englishKeywords.some((keyword) =>
        this.normalizeText(careerGoal).includes(keyword),
      )
    ) {
      return {
        englishLabel: 'Career goal mentions English',
        englishScore: 65,
      };
    }

    return { englishLabel: '', englishScore: 0 };
  }

  private async getApplicantProfile(userId: string) {
    const [userInfo, studentInfo] = await Promise.all([
      this.userModel.findById(userId).lean(),
      this.studentModel.findOne({ user_id: new Types.ObjectId(userId) }).lean(),
    ]);

    if (!userInfo) throw new Error('Không tìm thấy thông tin người dùng');

    return {
      fullName: userInfo.name || 'Chưa cập nhật',
      email: userInfo.email || 'Chưa cập nhật',
      phone: studentInfo?.phone || 'Chưa cập nhật',
    };
  }

  private async ensureNotApplied(jobId: string, userId: string) {
    const existing = await this.jobApplyModel.findOne({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
    });
    if (existing) throw new Error('Bạn đã ứng tuyển vị trí này rồi!');
  }

  // =================================================================
  // 1. LẤY 5 TIÊU CHÍ JD TỪ MONGODB (QUERY DB THẬT)
  // =================================================================
  private async getJdCriteria(jobId: string) {
    const job = await this.jobsModel.findById(jobId).lean();
    if (!job) throw new BadRequestException('Công việc không tồn tại!');

    // Query skills thật từ bảng job_skills -> populate tên từ bảng skills
    const jobSkillDocs = await this.jobSkillModel
      .find({ Job_id: new Types.ObjectId(jobId) })
      .populate('skill_id', 'name')
      .lean();

    const skillNames: string[] = jobSkillDocs
      .map((js: any) => js.skill_id?.name || '')
      .filter((n: string) => n.length > 0);

    const criteria = {
      position: job.title || '',           // Tiêu chí 1: Vị trí
      level: job.level || '',              // Tiêu chí 2: Cấp bậc
      address: job.location || '',         // Tiêu chí 3: Địa điểm
      gpa: (job as any).min_gpa || 0,      // Tiêu chí 4: GPA tối thiểu
      skills: skillNames,                  // Tiêu chí 5: Mảng skill từ DB thật
      requirements: job.requirements || '',
    };

    console.log('\n--- [DB] 5 TIÊU CHÍ JD TỪ DATABASE ---');
    console.log('1. Vị trí:', criteria.position);
    console.log('2. Cấp bậc:', criteria.level);
    console.log('3. Địa điểm:', criteria.address);
    console.log('4. GPA tối thiểu:', criteria.gpa);
    console.log('5. Skills từ DB:', criteria.skills);

    return criteria;
  }

  // =================================================================
  // 2. CHẤM ĐIỂM MATCH: 5 TIÊU CHÍ JOB vs 5 TIÊU CHÍ CV (TỪ DB)
  // =================================================================
  private calculateMatchScore(formData: any, jdCriteria: any) {
    const details = {
      position: { score: 0, max: 10, jd: '', cv: '', matched: false },
      level: { score: 0, max: 20, jd: '', cv: '', matched: false },
      address: { score: 0, max: 15, jd: '', cv: '', matched: false },
      gpa: { score: 0, max: 25, jd: 0, cv: 0, matched: false },
      skills: { score: 0, max: 30, jd: [] as string[], cv: [] as string[], matchedSkills: [] as string[] },
    };

    // --- TIÊU CHÍ 1: VỊ TRÍ (10đ) ---
    const jdPos = this.normalizeText(jdCriteria.position);
    const formPos = this.normalizeText(formData.position || '');
    details.position.jd = jdCriteria.position;
    details.position.cv = formData.position || '';
    if (jdPos && formPos && (jdPos.includes(formPos) || formPos.includes(jdPos))) {
      details.position.score = 10;
      details.position.matched = true;
    }

    // --- TIÊU CHÍ 2: CẤP BẬC (20đ) ---
    const jdLevel = this.normalizeText(jdCriteria.level);
    const formLevel = this.normalizeText(formData.level || '');
    details.level.jd = jdCriteria.level;
    details.level.cv = formData.level || '';
    if (jdLevel && formLevel && (jdLevel.includes(formLevel) || formLevel.includes(jdLevel))) {
      details.level.score = 20;
      details.level.matched = true;
    } else if (!jdLevel) {
      details.level.score = 20;
      details.level.matched = true;
    }

    // --- TIÊU CHÍ 3: ĐỊA ĐIỂM (15đ) ---
    const jdAddr = this.normalizeText(jdCriteria.address);
    const formAddr = this.normalizeText(formData.address || '');
    details.address.jd = jdCriteria.address;
    details.address.cv = formData.address || '';
    if (jdAddr && formAddr && (jdAddr.includes(formAddr) || formAddr.includes(jdAddr))) {
      details.address.score = 15;
      details.address.matched = true;
    } else if (!jdAddr) {
      details.address.score = 15;
      details.address.matched = true;
    }

    // --- TIÊU CHÍ 4: GPA (25đ) ---
    const formGpa = this.parseGpa(formData.gpa);
    const jdGpa = this.parseGpa(jdCriteria.gpa);
    details.gpa.jd = jdGpa;
    details.gpa.cv = formGpa;
    if (jdGpa > 0) {
      if (formGpa >= jdGpa) {
        details.gpa.score = 25;
        details.gpa.matched = true;
      } else {
        details.gpa.score = Math.round((formGpa / jdGpa) * 25 * 100) / 100;
      }
    } else {
      details.gpa.score = 25; // JD không yêu cầu GPA -> full điểm
      details.gpa.matched = true;
    }

    // --- TIÊU CHÍ 5: SKILLS (30đ) - So sánh với skills từ DB ---
    const jdSkills: string[] = Array.isArray(jdCriteria.skills) ? jdCriteria.skills : [];
    details.skills.jd = jdSkills;

    // Lấy skills từ CV (formData)
    const cvSkillText = formData.skill || formData.skills || '';
    const cvSkills: string[] = typeof cvSkillText === 'string'
      ? cvSkillText.split(/[,;|]/).map((s: string) => s.trim()).filter((s: string) => s.length > 1)
      : Array.isArray(cvSkillText) ? cvSkillText : [];
    details.skills.cv = cvSkills;

    if (jdSkills.length > 0 && cvSkills.length > 0) {
      const matchedSkills: string[] = [];

      cvSkills.forEach((cvSkill) => {
        let keyword = this.normalizeText(cvSkill);
        for (const [wrong, correct] of Object.entries(this.skillAliases)) {
          if (keyword === wrong) keyword = correct;
        }

        const isMatch = jdSkills.some((jdSkill) => {
          const normalizedJd = this.normalizeText(jdSkill);
          if (normalizedJd === keyword) return true;
          if (normalizedJd.includes(keyword) || keyword.includes(normalizedJd)) return true;
          const pureJd = this.cleanString(jdSkill);
          const pureCv = this.cleanString(keyword);
          return pureCv.length > 2 && (pureJd.includes(pureCv) || pureCv.includes(pureJd));
        });

        if (isMatch) matchedSkills.push(cvSkill);
      });

      details.skills.matchedSkills = matchedSkills;
      const ratio = matchedSkills.length / jdSkills.length;
      details.skills.score = Math.min(30, Math.round(ratio * 30));
    } else if (jdSkills.length === 0) {
      // Fallback: dùng requirements text nếu job không có skills trong DB
      const reqText = this.normalizeText(jdCriteria.requirements || '');
      if (reqText && cvSkills.length > 0) {
        let matchCount = 0;
        cvSkills.forEach((cvSkill) => {
          let keyword = this.normalizeText(cvSkill);
          for (const [wrong, correct] of Object.entries(this.skillAliases)) {
            if (keyword === wrong) keyword = correct;
          }
          const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (new RegExp(safeKeyword, 'i').test(reqText)) matchCount++;
          else if (this.cleanString(keyword).length > 2 && this.cleanString(reqText).includes(this.cleanString(keyword))) matchCount++;
        });
        details.skills.score = Math.min(30, Math.round((matchCount / Math.max(cvSkills.length, 3)) * 30));
      } else {
        details.skills.score = 30;
      }
    }

    const total = details.position.score + details.level.score + details.address.score + details.gpa.score + details.skills.score;

    console.log('\n--- [NESTJS] CHI TIẾT CHẤM ĐIỂM 5 TIÊU CHÍ ---');
    console.log('1. Vị trí:', details.position);
    console.log('2. Cấp bậc:', details.level);
    console.log('3. Địa điểm:', details.address);
    console.log('4. GPA:', details.gpa);
    console.log('5. Skills:', details.skills);
    console.log(`=> TỔNG ĐIỂM: ${total}/100\n`);

    return { total, details };
  }

  // =================================================================
  // GỌI API SANG PYTHON (GỬI CV + TIÊU CHÍ)
  // =================================================================
  async analyzeCVDraft(jobId: string, cvFile: Express.Multer.File) {
    const jdCriteria = await this.getJdCriteria(jobId);

    const form = new FormData();
    form.append('file', fs.createReadStream(cvFile.path), {
      filename: cvFile.originalname,
    });
    form.append('jd_criteria', JSON.stringify(jdCriteria));

    try {
      const response = await fetch('http://localhost:8000/api/extract-cv', {
        method: 'POST',
        headers: form.getHeaders() as Record<string, string>,
        body: form as unknown as BodyInit,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `AI service returned ${response.status}`);
      }

      return response.json();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown AI error';
      console.error('AI Error:', message);
      throw new BadRequestException(
        'Hệ thống AI đang bận, không thể bóc tách tự động lúc này.',
      );
    }
  }

  // =================================================================
  // [VÒNG 1] AUTO-SCREENING: PYTHON ĐỌC VÀ CHẤM ĐIỂM SƠ BỘ
  // =================================================================
  async smartApplyJob(
    jobId: string,
    user: JwtUser,
    cvFile: Express.Multer.File,
  ) {
    const { userId } = user;
    this.ensureStudentRole(user);
    await this.ensureNotApplied(jobId, userId);

    // 1. Gọi Python AI
    const aiResponse = await this.analyzeCVDraft(jobId, cvFile);

    // 2. Lấy kết quả từ Python
    const rawData = aiResponse.data || {};
    const pythonScore = aiResponse.score || 0;
    console.log(`[Python AI] Đã chấm điểm sơ bộ. Điểm số: ${pythonScore}/100`);

    // Bổ sung thông tin cá nhân
    const applicantProfile = await this.getApplicantProfile(userId);
    const finalEmail = rawData.email || applicantProfile.email;
    const finalPhone = rawData.phone || applicantProfile.phone;
    const finalName =
      rawData.full_name || rawData.fullName || applicantProfile.fullName;

    // 3. RẼ NHÁNH DỰA VÀO ĐIỂM PYTHON CHẤM
    const PASS_THRESHOLD = 60; // Ngưỡng an toàn

    if (pythonScore < PASS_THRESHOLD) {
      return {
        status: 'low_score',
        message: `Hệ thống AI đánh giá độ phù hợp của bạn là ${pythonScore}/100. Vui lòng kiểm tra và bổ sung thông tin trên Form!`,
        require_form: true, // Frontend hiện form
        match_score: pythonScore,
        cvFilePath: cvFile.path,
        formData: {
          ...rawData,
          email: finalEmail,
          phone: finalPhone,
          full_name: finalName,
        },
      };
    }

    // Nếu điểm cao (>=60) -> Nộp thẳng!
    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      cv_file_path: cvFile.path,
      full_name: finalName,
      email: finalEmail,
      phone: finalPhone,
      cover_letter: 'Tự động ứng tuyển qua hệ thống AI Smart Matching',
      applied_at: new Date(),
      status: 'sent',
      match_score: pythonScore, // Dùng điểm Python
      ai_extracted_data: rawData,
    });

    return {
      status: 'success',
      message: 'CV của bạn rất xuất sắc! Đã tự động ứng tuyển thành công.',
      require_form: false,
      match_score: pythonScore,
    };
  }

  // =================================================================
  // [VÒNG 2] NỘP FORM CHÍNH THỨC: NESTJS CHẤM LẠI ĐIỂM
  // =================================================================
  async submitFinalCV(
    jobId: string,
    user: JwtUser,
    cvFilePath: string,
    formData: any,
  ) {
    const { userId } = user;
    this.ensureStudentRole(user);

    const fullName = formData.full_name || formData.fullName;
    if (!fullName) throw new BadRequestException('Thiếu họ tên');
    if (!formData.email) throw new BadRequestException('Thiếu email');
    if (!formData.phone) throw new BadRequestException('Thiếu số điện thoại');

    await this.ensureNotApplied(jobId, userId);

    // 1. Lấy lại tiêu chí JD từ DB
    const jdCriteria = await this.getJdCriteria(jobId);

    // 2. NESTJS tự tính toán lại điểm dựa trên Form ứng viên đã sửa
    const { total: finalScore, details: matchDetails } = this.calculateMatchScore(formData, jdCriteria);

    // 3. Lưu vào DB với điểm số MỚI NHẤT
    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      cv_file_path: cvFilePath,
      full_name: fullName,
      email: formData.email,
      phone: formData.phone,
      cover_letter: formData.cover_letter || '',
      applied_at: new Date(),
      status: 'sent',
      match_score: finalScore,
      ai_extracted_data: { ...formData, match_details: matchDetails },
    });

    return { status: 'Ứng tuyển thành công!', match_score: finalScore, match_details: matchDetails };
  }

  // =================================================================
  // CÁC HÀM CŨ CỦA BẠN (GIỮ NGUYÊN)
  // =================================================================

  // (Phần code bên dưới giữ nguyên các hàm applyJobs, applyWithDetails, getApplicationHistory, getEmployerCandidates)
  async applyJobs(
    jobid: string,
    user: JwtUser,
    options?: { cvFile?: Express.Multer.File; coverLetter?: string },
  ): Promise<{ status: string }> {
    const { userId } = user;
    const { cvFile, coverLetter } = options || {};

    this.ensureStudentRole(user);
    await this.ensureNotApplied(jobid, userId);
    const applicantProfile = await this.getApplicantProfile(userId);

    if (cvFile) {
      await this.jobApplyModel.create({
        job_id: new Types.ObjectId(jobid),
        student_id: new Types.ObjectId(userId),
        cv_file_path: cvFile.path,
        full_name: applicantProfile.fullName,
        email: applicantProfile.email,
        phone: applicantProfile.phone,
        cover_letter: coverLetter || '',
        applied_at: new Date(),
      });
      return { status: 'Ứng tuyển thành công!' };
    }

    const cv = await this.CVModel.findOne({
      student_id: new Types.ObjectId(userId),
    });
    if (!cv)
      throw new Error('Vui lòng tải CV lên hoặc tạo CV trước khi ứng tuyển');

    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobid),
      student_id: new Types.ObjectId(userId),
      cv_id: (cv as any)._id,
      full_name: applicantProfile.fullName,
      email: applicantProfile.email,
      phone: applicantProfile.phone,
      cover_letter: coverLetter || '',
      applied_at: new Date(),
    });
    return { status: 'Ứng tuyển thành công!' };
  }

  async applyWithDetails(
    applicationData: {
      jobId: string;
      fullName: string;
      email: string;
      phone: string;
      coverLetter?: string;
    },
    cvFile: Express.Multer.File,
    user: JwtUser,
  ): Promise<{ status: string }> {
    const { userId } = user;
    const { jobId, fullName, email, phone, coverLetter } = applicationData;
    this.ensureStudentRole(user);
    const applicantProfile = await this.getApplicantProfile(userId);

    await this.ensureNotApplied(jobId, userId);
    if (!cvFile) throw new Error('Vui lòng tải lên CV trước khi ứng tuyển');

    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      cv_file_path: cvFile.path,
      full_name: fullName || applicantProfile.fullName,
      email: email || applicantProfile.email,
      phone: phone || applicantProfile.phone,
      cover_letter: coverLetter || '',
      applied_at: new Date(),
    });

    return { status: 'Ứng tuyển thành công!' };
  }

  async getApplicationHistory(user: JwtUser) {
    const { userId } = user;

    const [userInfo, studentInfo, applications] = await Promise.all([
      this.userModel.findById(userId),
      this.studentModel.findOne({ user_id: new Types.ObjectId(userId) }),
      this.jobApplyModel
        .find({ student_id: new Types.ObjectId(userId) })
        .populate({
          path: 'job_id',
          model: 'Jobs',
          populate: {
            path: 'employer_id',
            model: 'Employer',
            select: 'company_name logo',
          },
        })
        .populate('cv_id')
        .sort({ applied_at: -1 }),
    ]);

    return {
      personalInfo: {
        name: userInfo?.name,
        email: userInfo?.email,
        dateOfBirth: userInfo?.dateOfbirth,
        gender: userInfo?.gender,
        phone: studentInfo?.phone,
        address: studentInfo?.address,
        avatar: studentInfo?.avatar,
        school: studentInfo?.school,
        major: studentInfo?.major,
        gpa: studentInfo?.gpa,
        graduation_year: studentInfo?.graduation_year,
        career_goal: studentInfo?.career_goal,
        desired_salary: studentInfo?.desired_salary,
      },
      applications: applications.map((app) => ({
        id: app._id,
        jobTitle: (app.job_id as any)?.title || 'N/A',
        companyName: (app.job_id as any)?.employer_id?.company_name || 'N/A',
        companyLogo: (app.job_id as any)?.employer_id?.logo,
        status: app.status,
        applied_at: app.applied_at,
        cv: app.cv_id,
        cv_file_path: app.cv_file_path,
        full_name: app.full_name,
        email: app.email,
        phone: app.phone,
        cover_letter: app.cover_letter,
        match_score: app.match_score,
      })),
    };
  }

  // NTD lấy danh sách ứng viên với filterCriteria tùy chỉnh
  async getEmployerCandidates(user: JwtUser, filterCriteria?: FilterCriteria) {
    const { userId } = user;

    const jobs = await this.jobsModel
      .find({ employer_id: new Types.ObjectId(userId) })
      .select('title location')
      .lean();

    if (jobs.length === 0) return { candidates: [] };

    const jobIds = jobs.map((job) => job._id);
    const jobMap = new Map(
      jobs.map((job) => [
        job._id.toString(),
        {
          id: job._id.toString(),
          title: job.title || '',
          location: job.location || '',
        },
      ]),
    );

    const applications = await this.jobApplyModel
      .find({ job_id: { $in: jobIds } })
      .sort({ match_score: -1, applied_at: -1 })
      .lean();

    if (applications.length === 0) return { candidates: [] };

    const applicantUserIds = Array.from(
      new Set(applications.map((a) => a.student_id?.toString())),
    ).filter(Boolean);

    const objectUserIds = applicantUserIds.map((id) => new Types.ObjectId(id));

    const [users, students] = await Promise.all([
      this.userModel
        .find({ _id: { $in: objectUserIds } })
        .select('name email dateOfbirth gender')
        .lean(),
      this.studentModel.find({ user_id: { $in: objectUserIds } }).lean(),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const studentMap = new Map(students.map((s) => [s.user_id.toString(), s]));

    const studentSkills = students.length
      ? await this.studentSkillModel
          .find({ student_id: { $in: students.map((s) => s._id) } })
          .populate('skill_id', 'name')
          .lean()
      : [];

    const studentSkillMap = new Map<
      string,
      Array<{ id: string; name: string; level: number }>
    >();
    studentSkills.forEach((ss: any) => {
      const sid = ss.student_id?.toString();
      if (!sid) return;
      const list = studentSkillMap.get(sid) || [];
      list.push({
        id: ss.skill_id?._id?.toString() || '',
        name: ss.skill_id?.name || '',
        level: ss.level || 0,
      });
      studentSkillMap.set(sid, list);
    });

    const candidatesByUserId = new Map<string, any>();

    applications.forEach((application: any) => {
      const applicantUserId = application.student_id?.toString();
      if (!applicantUserId) return;

      const account = userMap.get(applicantUserId);
      const student = studentMap.get(applicantUserId);
      const job = jobMap.get(application.job_id?.toString());
      const candidateSkills = student
        ? studentSkillMap.get(student._id.toString()) || []
        : [];
      const { englishLabel, englishScore } = this.getEnglishMeta(
        candidateSkills,
        student?.career_goal,
      );
      const gpa = this.parseGpa(student?.gpa);

      if (filterCriteria) {
        if (filterCriteria.minGpa !== undefined && gpa < filterCriteria.minGpa)
          return;
        if (
          filterCriteria.minMatchScore !== undefined &&
          (application.match_score || 0) < filterCriteria.minMatchScore
        )
          return;
        if (
          filterCriteria.level &&
          this.normalizeText(student?.career_goal || '') !==
            this.normalizeText(filterCriteria.level)
        ) {
        }
        if (filterCriteria.address) {
          const studentAddr = this.normalizeText(student?.address || '');
          const filterAddr = this.normalizeText(filterCriteria.address);
          if (!studentAddr.includes(filterAddr)) return;
        }
        if (filterCriteria.skills && filterCriteria.skills.length > 0) {
          const studentSkillNames = candidateSkills.map((s) =>
            this.normalizeText(s.name),
          );
          const hasSkill = filterCriteria.skills.some((s) =>
            studentSkillNames.includes(this.normalizeText(s)),
          );
          if (!hasSkill) return;
        }
      }

      if (!candidatesByUserId.has(applicantUserId)) {
        candidatesByUserId.set(applicantUserId, {
          id: applicantUserId,
          application_id: application._id?.toString() || '',
          cv_id: application.cv_id?.toString() || '',
          cv_file_path: application.cv_file_path || '',
          name: account?.name || application.full_name || 'Chưa cập nhật',
          email: account?.email || application.email || '',
          phone: student?.phone || application.phone || '',
          address: student?.address || '',
          avatar: student?.avatar || this.defaultAvatar,
          school: student?.school || '',
          major: student?.major || '',
          gpa,
          graduation_year: student?.graduation_year || '',
          career_goal: student?.career_goal || '',
          desired_salary: student?.desired_salary || '',
          englishLabel,
          englishScore,
          skills: candidateSkills,
          match_score: application.match_score || 0,
          verified_cv_data: application.ai_extracted_data || {},
          status: application.status,
          latestAppliedAt: application.applied_at,
          latestJobTitle: job?.title || '',
          totalApplications: 0,
          appliedJobs: [],
        });
      }

      const candidate = candidatesByUserId.get(applicantUserId);
      candidate.totalApplications += 1;
      candidate.appliedJobs.push({
        id: job?.id || application.job_id?.toString() || '',
        title: job?.title || '',
        location: job?.location || '',
        status: application.status,
        applied_at: application.applied_at,
      });
    });

    const candidates = Array.from(candidatesByUserId.values())
      .map((c) => ({ ...c, appliedJobs: c.appliedJobs.slice(0, 5) }))
      .sort((a, b) => {
        if (b.match_score !== a.match_score)
          return b.match_score - a.match_score;
        return (
          new Date(b.latestAppliedAt).getTime() -
          new Date(a.latestAppliedAt).getTime()
        );
      });

    return { candidates };
  }

  // =================================================================
  // API: HIỂN THỊ CV ƯU TÚ CHO NHÀ TUYỂN DỤNG (QUERY DB THẬT)
  // Xếp hạng dựa trên: GPA, số lượng skills, match_score
  // =================================================================
  async getTopCandidates(user: JwtUser, jobId?: string, limit = 10) {
    const { userId } = user;

    // 1. Lấy danh sách job của NTD từ DB
    const employerJobs = await this.jobsModel
      .find({ employer_id: new Types.ObjectId(userId) })
      .select('_id title location level experience')
      .lean();

    if (employerJobs.length === 0) return { topCandidates: [] };

    // 2. Lọc theo jobId nếu có, không thì lấy tất cả job
    const targetJobIds = jobId
      ? [new Types.ObjectId(jobId)]
      : employerJobs.map((j) => j._id);

    // 3. Query applications từ DB (chỉ lấy status != rejected)
    const applications = await this.jobApplyModel
      .find({
        job_id: { $in: targetJobIds },
        status: { $ne: 'rejected' },
      })
      .sort({ match_score: -1 })
      .lean();

    if (applications.length === 0) return { topCandidates: [] };

    // 4. Lấy thông tin student, user, skills từ DB
    const studentUserIds = [...new Set(
      applications.map((a) => a.student_id?.toString()).filter(Boolean),
    )];
    const objectIds = studentUserIds.map((id) => new Types.ObjectId(id));

    const [users, students] = await Promise.all([
      this.userModel.find({ _id: { $in: objectIds } }).select('name email').lean(),
      this.studentModel.find({ user_id: { $in: objectIds } }).lean(),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const studentMap = new Map(students.map((s) => [s.user_id.toString(), s]));

    // 5. Query skills từ DB cho tất cả student
    const studentIds = students.map((s) => s._id);
    const allStudentSkills = studentIds.length > 0
      ? await this.studentSkillModel
          .find({ student_id: { $in: studentIds } })
          .populate('skill_id', 'name')
          .lean()
      : [];

    const skillMap = new Map<string, Array<{ name: string; level: number }>>();
    allStudentSkills.forEach((ss: any) => {
      const sid = ss.student_id?.toString();
      if (!sid) return;
      const list = skillMap.get(sid) || [];
      list.push({ name: ss.skill_id?.name || '', level: ss.level || 0 });
      skillMap.set(sid, list);
    });

    // 6. Nếu có jobId cụ thể, lấy skills yêu cầu của job đó từ DB
    let jobRequiredSkills: string[] = [];
    if (jobId) {
      const jobSkillDocs = await this.jobSkillModel
        .find({ Job_id: new Types.ObjectId(jobId) })
        .populate('skill_id', 'name')
        .lean();
      jobRequiredSkills = jobSkillDocs
        .map((js: any) => this.normalizeText(js.skill_id?.name || ''))
        .filter((n) => n.length > 0);
    }

    // 7. Tính điểm ưu tú cho mỗi ứng viên
    const jobMap = new Map(employerJobs.map((j) => [j._id.toString(), j]));
    const candidateScores = new Map<string, any>();

    applications.forEach((app: any) => {
      const uid = app.student_id?.toString();
      if (!uid || candidateScores.has(uid)) return;

      const account = userMap.get(uid);
      const student = studentMap.get(uid);
      const studentSkills = student ? skillMap.get(student._id.toString()) || [] : [];
      const job = jobMap.get(app.job_id?.toString());

      // Tính GPA score (0-100)
      const gpa = this.parseGpa(student?.gpa);
      const gpaScore = Math.min(100, (gpa / 4) * 100);

      // Tính skill score (0-100) dựa trên số skill + level
      let skillScore = 0;
      if (studentSkills.length > 0) {
        const avgLevel = studentSkills.reduce((sum, s) => sum + s.level, 0) / studentSkills.length;
        const skillCountScore = Math.min(50, studentSkills.length * 10);
        const skillLevelScore = (avgLevel / 5) * 50;
        skillScore = skillCountScore + skillLevelScore;

        // Bonus nếu match với skills yêu cầu của job
        if (jobRequiredSkills.length > 0) {
          const matchedCount = studentSkills.filter((s) =>
            jobRequiredSkills.some((req) => {
              const norm = this.normalizeText(s.name);
              return norm === req || norm.includes(req) || req.includes(norm);
            }),
          ).length;
          const matchRatio = matchedCount / jobRequiredSkills.length;
          skillScore = skillScore * 0.6 + matchRatio * 100 * 0.4;
        }
      }

      // Tổng hợp điểm ưu tú: GPA 30% + Skills 40% + Match Score 30%
      const matchScore = app.match_score || 0;
      const excellenceScore = Math.round(
        gpaScore * 0.3 + skillScore * 0.4 + matchScore * 0.3,
      );

      candidateScores.set(uid, {
        id: uid,
        application_id: app._id?.toString(),
        name: account?.name || app.full_name || 'Chưa cập nhật',
        email: account?.email || app.email || '',
        phone: student?.phone || app.phone || '',
        avatar: student?.avatar || this.defaultAvatar,
        school: student?.school || '',
        major: student?.major || '',
        gpa,
        gpa_score: Math.round(gpaScore),
        skills: studentSkills,
        skill_score: Math.round(skillScore),
        match_score: matchScore,
        excellence_score: excellenceScore,
        career_goal: student?.career_goal || '',
        graduation_year: student?.graduation_year || '',
        cv_file_path: app.cv_file_path || '',
        applied_job: job?.title || '',
        applied_at: app.applied_at,
        status: app.status,
        ranking_breakdown: {
          gpa_weight: '30%',
          skill_weight: '40%',
          match_weight: '30%',
          gpa_raw: gpa,
          skill_count: studentSkills.length,
          match_raw: matchScore,
        },
      });
    });

    // 8. Sắp xếp theo điểm ưu tú giảm dần, trả về top N
    const topCandidates = Array.from(candidateScores.values())
      .sort((a, b) => b.excellence_score - a.excellence_score)
      .slice(0, limit);

    return {
      total: candidateScores.size,
      showing: topCandidates.length,
      topCandidates,
    };
  }
}
