import { Injectable, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ApplyJobDocument, job_applications } from './applyjob.schema';
import { Model, Types } from 'mongoose';
import { CSV, ResumeDocument } from '../resume/resume.schema';
import { Student, StudentDocument } from '../student/student.schema';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { Jobs, JobsDocument } from '../jobs/schema/jobs.schema';
import { Employer, EmployerDocument } from '../employer/employer.schema';
import { StudentSkills, StudentSkillDocument } from '../skills/schema/StudentSkill.schema';
import { JobSkills, JobSkillDocument } from '../skills/schema/JobSkill.schema';
import { Skills, SkillDocument } from '../skills/schema/skills.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as fuzz from 'fuzzball'; // Import thư viện chuẩn Levenshtein

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
    @InjectModel(job_applications.name) private jobApplyModel: Model<ApplyJobDocument>,
    @InjectModel(CSV.name) private CVModel: Model<ResumeDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(StudentSkills.name) private studentSkillModel: Model<StudentSkillDocument>,
    @InjectModel(JobSkills.name) private jobSkillModel: Model<JobSkillDocument>,
    @InjectModel(Skills.name) private skillModel: Model<SkillDocument>,
    private httpService: HttpService,
  ) {}

  private readonly defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  private ensureStudentRole(user: JwtUser) {
    if (user.role !== 'student') {
      throw new ForbiddenException('Chỉ tài khoản sinh viên/ứng viên mới có thể nộp CV ứng tuyển');
    }
  }

  // =================================================================
  // BỘ CÔNG CỤ XỬ LÝ CHUỖI VÀ TỪ ĐIỂN AI
  // =================================================================
  private sanitizeLog(value: unknown): string {
    return String(value ?? '').replace(/[\r\n\t]/g, ' ').slice(0, 200);
  }

  private normalizeText(value = '') {
    return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private parseGpa(value: unknown) {
    const normalized = value?.toString().replace(',', '.').trim();
    const gpa = Number(normalized);
    return Number.isFinite(gpa) ? gpa : 0;
  }

  private getEnglishMeta(skills: Array<{ name: string; level: number }>, careerGoal?: string) {
    const englishKeywords = ['english', 'tieng anh', 'ielts', 'toeic', 'toefl'];
    const matchedSkill = skills
      .filter((skill) => englishKeywords.some((keyword) => this.normalizeText(skill.name).includes(keyword)))
      .sort((left, right) => right.level - left.level)[0];

    if (matchedSkill) {
      return {
        englishLabel: `${matchedSkill.name} (${matchedSkill.level}/5)`,
        englishScore: Math.min(100, 45 + matchedSkill.level * 12),
      };
    }

    if (careerGoal && englishKeywords.some((keyword) => this.normalizeText(careerGoal).includes(keyword))) {
      return { englishLabel: 'Career goal mentions English', englishScore: 65 };
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
      school: studentInfo?.school || '',
      major: studentInfo?.major || '',
      graduation_year: studentInfo?.graduation_year || '',
    };
  }

  private async ensureNotApplied(jobId: string, userId: string) {
    const job = await this.jobsModel.findById(jobId).lean();
    if (!job) throw new BadRequestException('Công việc không tồn tại!');
    if (job.status !== 'open') throw new BadRequestException('Công việc này hiện không nhận ứng tuyển!');

    const existing = await this.jobApplyModel.findOne({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
    });
    if (existing) throw new ConflictException('Bạn đã ứng tuyển vị trí này rồi!');
  }

  // =================================================================
  // 1. LẤY 5 TIÊU CHÍ JD TỪ MONGODB (ĐÃ FIX LỖI SKILL RỖNG)
  // =================================================================
  private async getJdCriteria(jobId: string) {
    const job = await this.jobsModel.findById(jobId).lean();
    if (!job) throw new BadRequestException('Công việc không tồn tại!');
    if (job.status !== 'open') throw new BadRequestException('Công việc này hiện không nhận ứng tuyển!');

    const jobSkillDocs = await this.jobSkillModel
      .find({ Job_id: new Types.ObjectId(jobId) })
      .populate('skill_id', 'name')
      .lean();

    const skillNames: string[] = jobSkillDocs
      .map((js: any) => js.skill_id?.name || '')
      .filter((n: string) => n.length > 0);

    // FIX: Fallback lấy skill từ text 'requirements' nếu bảng job_skills trống
    const finalSkills = skillNames.length > 0 ? skillNames : (job.requirements || '');

    const criteria = {
      position: job.title || '', 
      level: job.level || '', 
      address: job.location || '', 
      gpa: (job as any).min_gpa || 0,
      skills: finalSkills, 
      requirements: job.requirements || '',
    };

    console.log('\n--- [DB] 5 TIÊU CHÍ JD TỪ DATABASE ---');
    console.log('1. Vị trí:', this.sanitizeLog(criteria.position));
    console.log('2. Cấp bậc:', this.sanitizeLog(criteria.level));
    console.log('3. Địa điểm:', this.sanitizeLog(criteria.address));
    console.log('4. GPA tối thiểu:', criteria.gpa);
    console.log('5. Skills truyền đi:', typeof finalSkills === 'string' ? this.sanitizeLog(finalSkills) : finalSkills);

    return criteria;
  }

  // =================================================================
  // 2. CHẤM ĐIỂM MATCH: ĐỒNG BỘ FUZZY MATCH VỚI PYTHON
  // =================================================================
  private calculateMatchScore(formData: any, jdCriteria: any) {
    const details = {
      position: { score: 0, max: 10, jd: '', cv: '', matched: false },
      level:    { score: 0, max: 20, jd: '', cv: '', matched: false },
      address:  { score: 0, max: 15, jd: '', cv: '', matched: false },
      gpa:      { score: 0, max: 25, jd: 0,  cv: 0,  matched: false },
      skills:   { score: 0, max: 30, jd: [] as string[], cv: [] as string[], matchedSkills: [] as string[] },
    };

    console.log('\n======================================================');
    console.log('🚀 [NESTJS] BẮT ĐẦU CHẤM ĐIỂM BẰNG FUZZBALL (CÙNG THUẬT TOÁN PYTHON)');
    console.log('======================================================');

    // --- TIÊU CHÍ 1: VỊ TRÍ (10đ) ---
    const jdPos = this.normalizeText(jdCriteria.position);
    const formPosRaw = formData.position || formData.career_goal || '';
    const formPos = this.normalizeText(formPosRaw);
    details.position.jd = jdCriteria.position;
    details.position.cv = formPosRaw;
    if (jdPos) {
      const ratio = fuzz.partial_ratio(jdPos, formPos);
      if (ratio >= 80) { details.position.score = 10; details.position.matched = true; }
      console.log(`[1. Vị trí] JD: "${jdPos}" | Form: "${formPos}" => Ratio: ${ratio}% | Điểm: ${details.position.score}/10`);
    }

    // --- TIÊU CHÍ 2: CẤP BẬC (20đ) ---
    const jdLevel = this.normalizeText(jdCriteria.level);
    const formLevel = this.normalizeText(formData.level || '');
    details.level.jd = jdCriteria.level;
    details.level.cv = formData.level || '';
    if (jdLevel) {
      const ratio = fuzz.ratio(jdLevel, formLevel);
      if (ratio >= 85) { details.level.score = 20; details.level.matched = true; }
      console.log(`[2. Cấp bậc] JD: "${jdLevel}" | Form: "${formLevel}" => Ratio: ${ratio}% | Điểm: ${details.level.score}/20`);
    }

    // --- TIÊU CHÍ 3: ĐỊA ĐIỂM (15đ) ---
    const jdAddr = this.normalizeText(jdCriteria.address);
    const formAddr = this.normalizeText(formData.address || '');
    details.address.jd = jdCriteria.address;
    details.address.cv = formData.address || '';
    if (jdAddr) {
      const ratio = fuzz.partial_ratio(jdAddr, formAddr);
      if (ratio >= 60) { details.address.score = 15; details.address.matched = true; }
      console.log(`[3. Địa điểm] JD: "${jdAddr}" | Form: "${formAddr}" => Ratio: ${ratio}% | Điểm: ${details.address.score}/15`);
    }

    // --- TIÊU CHÍ 4: GPA (25đ) ---
    const formGpa = this.parseGpa(formData.gpa);
    const jdGpa   = this.parseGpa(jdCriteria.gpa);
    details.gpa.jd = jdGpa;
    details.gpa.cv = formGpa;
    if (jdGpa > 0) {
      if (formGpa >= jdGpa) {
        details.gpa.score = 25; details.gpa.matched = true;
      } else {
        details.gpa.score = Math.round((formGpa / jdGpa) * 25 * 100) / 100;
      }
      console.log(`[4. GPA] JD Yêu cầu: ${jdGpa} | CV Có: ${formGpa} | Điểm: ${details.gpa.score}/25`);
    } else {
      console.log(`[4. GPA] JD không yêu cầu GPA | Điểm: 0/25`);
    }

    // --- TIÊU CHÍ 5: SKILLS (30đ) ---
    let jdSkills: string[] = [];
    if (Array.isArray(jdCriteria.skills)) {
      jdSkills = jdCriteria.skills.map((s: string) => this.normalizeText(s)).filter((s: string) => s.length > 1);
    } else if (typeof jdCriteria.skills === 'string' && jdCriteria.skills.length > 0) {
      // Nếu skill là string (fallback từ requirements), cắt theo dấu phẩy, chấm phẩy, xuống dòng
      jdSkills = jdCriteria.skills.split(/[,;\n|]/).map(s => this.normalizeText(s)).filter(s => s.length > 1);
    }
    
    details.skills.jd = jdSkills;
    const cvSkillRaw = formData.skill || formData.skills || '';
    const cvSkillText = this.normalizeText(typeof cvSkillRaw === 'string' ? cvSkillRaw : (cvSkillRaw as string[]).join(', '));
    details.skills.cv = [cvSkillText];

    if (jdSkills.length > 0) {
      const matched = jdSkills.filter((s) => {
        const ratio = fuzz.partial_ratio(s, cvSkillText);
        console.log(`  - Xét skill JD "${s}" trong đoạn "${cvSkillText.substring(0, 30)}..." => Ratio: ${ratio}%`);
        return ratio >= 80;
      });
      details.skills.matchedSkills = matched;
      details.skills.score = Math.round((matched.length / jdSkills.length) * 30 * 100) / 100;
      console.log(`[5. Skills] JD có ${jdSkills.length} skills | Khớp ${matched.length} skills | Điểm: ${details.skills.score}/30`);
    } else {
      console.log(`[5. Skills] JD không yêu cầu skills | Điểm: 0/30`);
    }

    const total = details.position.score + details.level.score + details.address.score + details.gpa.score + details.skills.score;
    console.log('======================================================');
    console.log(`🏆 TỔNG ĐIỂM CHUNG CUỘC NESTJS: ${total}/100`);
    console.log('======================================================\n');

    return { total, details };
  }

  // =================================================================
  // PREVIEW SCORE: Chấm điểm từ form - KHÔNG lưu DB
  // =================================================================
  async previewScore(jobId: string, formData: any) {
    const jdCriteria = await this.getJdCriteria(jobId); // đã check status open bên trong
    const { total, details } = this.calculateMatchScore(formData, jdCriteria);
    return {
      score: total,
      criteriaScores: [
        { key: 'position', score: details.position.score, max: 10, jd: details.position.jd, cv: details.position.cv, matched: details.position.matched, matchedKeywords: details.position.matched ? [details.position.cv] : [], missingKeywords: !details.position.matched && details.position.jd ? [details.position.jd] : [] },
        { key: 'level',    score: details.level.score,    max: 20, jd: details.level.jd,    cv: details.level.cv,    matched: details.level.matched,    matchedKeywords: details.level.matched    ? [details.level.cv]    : [], missingKeywords: !details.level.matched    && details.level.jd    ? [details.level.jd]    : [] },
        { key: 'address',  score: details.address.score,  max: 15, jd: details.address.jd,  cv: details.address.cv,  matched: details.address.matched,  matchedKeywords: details.address.matched  ? [details.address.cv]  : [], missingKeywords: !details.address.matched  && details.address.jd  ? [details.address.jd]  : [] },
        { key: 'gpa',      score: details.gpa.score,      max: 25, jd: details.gpa.jd,      cv: details.gpa.cv,      matched: details.gpa.matched,      matchedKeywords: details.gpa.matched      ? [`GPA ${details.gpa.cv}`] : [], missingKeywords: !details.gpa.matched && details.gpa.jd > 0 ? [`GPA >= ${details.gpa.jd}`] : [] },
        { key: 'skills',   score: details.skills.score,   max: 30, matchedKeywords: details.skills.matchedSkills, missingKeywords: details.skills.jd.filter((s) => !details.skills.matchedSkills.includes(s)) },
      ],
      matchedKeywords: [...details.skills.matchedSkills, ...(details.position.matched ? [details.position.cv] : [])].filter(Boolean).slice(0, 8),
      missingKeywords: [
        ...details.skills.jd.filter((s) => !details.skills.matchedSkills.includes(s)),
        ...(!details.position.matched && details.position.jd ? [details.position.jd] : []),
        ...(!details.address.matched && details.address.jd ? [details.address.jd] : []),
      ].filter(Boolean).slice(0, 6),
    };
  }

  // =================================================================
  // GỌI API SANG PYTHON
  // =================================================================
  async analyzeCVDraft(jobId: string, cvFile: Express.Multer.File) {
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('ID công việc không hợp lệ');
    }
    const jdCriteria = await this.getJdCriteria(jobId);

    const form = new FormData();
    const safeCvPath = path.resolve('./uploads/cvs', path.basename(cvFile.path));
    if (!safeCvPath.startsWith(path.resolve('./uploads/cvs'))) {
      throw new BadRequestException('Đường dẫn file CV không hợp lệ');
    }
    form.append('file', fs.createReadStream(safeCvPath), { filename: cvFile.originalname });
    form.append('jd_criteria', JSON.stringify(jdCriteria));

    try {
      const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post(`${AI_SERVICE_URL}/api/extract-cv`, form, { headers: form.getHeaders() });
      return response.data;
    } catch (error) {
      const message = error?.response?.data ? JSON.stringify(error.response.data) : error instanceof Error ? error.message : 'Unknown AI error';
      console.error('AI Error:', message);
      throw new BadRequestException('Hệ thống AI đang bận, không thể bóc tách tự động lúc này.');
    }
  }

  // =================================================================
  // [VÒNG 1] AUTO-SCREENING
  // =================================================================
  async smartApplyJob(jobId: string, user: JwtUser, cvFile: Express.Multer.File) {
    const { userId } = user;
    this.ensureStudentRole(user);
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('ID công việc không hợp lệ');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    await this.ensureNotApplied(jobId, userId);

    const aiResponse = await this.analyzeCVDraft(jobId, cvFile);
    const rawData = aiResponse.data || {};
    const pythonScore = aiResponse.score || 0;
    console.log('[Python AI] Đã chấm điểm sơ bộ. Điểm số: %d/100', pythonScore);

    const applicantProfile = await this.getApplicantProfile(userId);
    const finalEmail = rawData.email || applicantProfile.email;
    const finalPhone = rawData.phone || applicantProfile.phone;
    const finalName = rawData.full_name || rawData.fullName || applicantProfile.fullName;

    const PASS_THRESHOLD = 60;

    if (pythonScore < PASS_THRESHOLD) {
      return {
        status: 'low_score',
        message: `Hệ thống AI đánh giá độ phù hợp của bạn là ${pythonScore}/100. Vui lòng kiểm tra và bổ sung thông tin trên Form!`,
        require_form: true,
        match_score: pythonScore,
        cvFilePath: cvFile.path,
        formData: { ...rawData, email: finalEmail, phone: finalPhone, full_name: finalName },
      };
    }

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
      match_score: pythonScore,
      ai_extracted_data: {
        ...rawData,
        school: rawData.school || applicantProfile.school || '',
        major: rawData.major || applicantProfile.major || '',
        graduation_year: rawData.graduation_year || applicantProfile.graduation_year || '',
      },
    });

    return { status: 'success', message: 'CV của bạn rất xuất sắc! Đã tự động ứng tuyển thành công.', require_form: false, match_score: pythonScore };
  }

  // =================================================================
  // [VÒNG 1] AUTO-SCREENING BẰNG CV BUILDER
  // =================================================================
  async smartApplyCvBuilder(jobId: string, user: JwtUser, cvId: string) {
    const { userId } = user;
    this.ensureStudentRole(user);
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('ID công việc không hợp lệ');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    if (!Types.ObjectId.isValid(cvId)) {
      throw new BadRequestException('ID CV không hợp lệ');
    }
    await this.ensureNotApplied(jobId, userId);

    const cv = await this.CVModel.findOne({ _id: new Types.ObjectId(cvId), student_id: new Types.ObjectId(userId) });
    if (!cv) throw new BadRequestException('CV không tồn tại');

    const cvData = cv.cv_data || {};
    
    // Only extract 5 fields from the builder CV: position, gpa, address, level, and skill
    const formData = {
      position: cvData.desiredPosition || cvData.headline || '',
      address: cvData.contacts?.address || '',
      gpa: cvData.education?.gpa || '',
      level: cvData.desiredLevel || '',
      skill: Array.isArray(cvData.skills) ? cvData.skills.join(', ') : '',
    };

    const jdCriteria = await this.getJdCriteria(jobId);

    console.log('\n======================================================================');
    console.log('📡 [NESTJS -> CV BUILDER] SO SÁNH GIỮA JD VÀ CV MARKDOWN (DATABASE)');
    console.log(`- Job ID: ${jobId}`);
    console.log(`- CV ID (Markdown): ${cvId} (Title: "${cv.title}")`);
    console.log('----------------------------------------------------------------------');
    console.log('📁 [JD CRITERIA] Dữ liệu JD lấy từ DB:', JSON.stringify(jdCriteria, null, 2));
    console.log('📁 [CV MARKDOWN] Dữ liệu CV trích xuất từ cv_data:', JSON.stringify(formData, null, 2));
    console.log('======================================================================\n');

    const { total: finalScore, details: matchDetails } = this.calculateMatchScore(formData, jdCriteria);

    console.log('\n======================================================================');
    console.log(`🏆 [KẾT QUẢ SO SÁNH] Điểm số cuối cùng: ${finalScore}/100`);
    console.log('======================================================================\n');

    const PASS_THRESHOLD = 60;
    
    // Fallback/Resolve profile information from system for required name/email/phone
    const applicantProfile = await this.getApplicantProfile(userId);
    const finalEmail = applicantProfile.email;
    const finalPhone = applicantProfile.phone;
    const finalName = applicantProfile.fullName;

    if (finalScore < PASS_THRESHOLD) {
      return {
        status: 'low_score',
        message: `Hệ thống đánh giá độ phù hợp của CV bạn chọn là ${finalScore}/100. Vui lòng kiểm tra và bổ sung thông tin trên Form!`,
        require_form: true,
        match_score: finalScore,
        cvId: cvId,
        formData: {
          ...formData,
          full_name: finalName,
          email: finalEmail,
          phone: finalPhone,
        },
      };
    }

    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      cv_id: new Types.ObjectId(cvId),
      full_name: finalName,
      email: finalEmail,
      phone: finalPhone,
      cover_letter: 'Tự động ứng tuyển qua hệ thống AI Smart Matching (CV Builder)',
      applied_at: new Date(),
      status: 'sent',
      match_score: finalScore,
      ai_extracted_data: {
        ...formData,
        match_details: matchDetails,
      },
    });

    return { status: 'success', message: 'CV của bạn rất xuất sắc! Đã tự động ứng tuyển thành công.', require_form: false, match_score: finalScore };
  }

  // =================================================================
  // [VÒNG 2] NỘP FORM CHÍNH THỨC
  // =================================================================
  async submitFinalCV(jobId: string, user: JwtUser, cvFilePath: string, formData: any, cvId?: string) {
    const { userId } = user;
    this.ensureStudentRole(user);
    if (!Types.ObjectId.isValid(jobId)) {
      throw new BadRequestException('ID công việc không hợp lệ');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    if (cvId && !Types.ObjectId.isValid(cvId)) {
      throw new BadRequestException('ID CV không hợp lệ');
    }

    const fullName = formData.full_name || formData.fullName;
    if (!fullName) throw new BadRequestException('Thiếu họ tên');
    if (!formData.email) throw new BadRequestException('Thiếu email');
    if (!formData.phone) throw new BadRequestException('Thiếu số điện thoại');

    if (!cvFilePath && !cvId) throw new BadRequestException('Thiếu đường dẫn file CV hoặc CV từ Builder');
    if (cvFilePath) {
      const safePath = path.resolve('./uploads/cvs', path.basename(cvFilePath));
      if (!safePath.startsWith(path.resolve('./uploads/cvs')) || !fs.existsSync(safePath)) {
        throw new BadRequestException('File CV không tồn tại hoặc đường dẫn không hợp lệ');
      }
    }

    await this.ensureNotApplied(jobId, userId);

    const jdCriteria = await this.getJdCriteria(jobId);
    const { total: finalScore, details: matchDetails } = this.calculateMatchScore(formData, jdCriteria);

    const studentProfile = await this.getApplicantProfile(userId);
    
    const applyData: any = {
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      full_name: fullName,
      email: formData.email,
      phone: formData.phone,
      cover_letter: formData.cover_letter || '',
      applied_at: new Date(),
      status: 'sent',
      match_score: finalScore,
      ai_extracted_data: {
        ...formData,
        match_details: matchDetails,
        school: studentProfile.school || '',
        major: studentProfile.major || '',
        graduation_year: studentProfile.graduation_year || '',
      },
    };

    if (cvFilePath) {
      applyData.cv_file_path = cvFilePath;
    }
    if (cvId) {
      applyData.cv_id = new Types.ObjectId(cvId);
    }

    await this.jobApplyModel.create(applyData);

    return { status: 'Ứng tuyển thành công!', match_score: finalScore, match_details: matchDetails };
  }

  // (GIỮ NGUYÊN HOÀN TOÀN CÁC HÀM CŨ: applyJobs, applyWithDetails, getApplicationHistory, getEmployerCandidates, getTopCandidates)
  async applyJobs(jobid: string, user: JwtUser, options?: { cvFile?: Express.Multer.File; coverLetter?: string }): Promise<{ status: string }> {
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

    const cv = await this.CVModel.findOne({ student_id: new Types.ObjectId(userId) });
    if (!cv) throw new Error('Vui lòng tải CV lên hoặc tạo CV trước khi ứng tuyển');

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

  async applyWithDetails(applicationData: { jobId: string; fullName: string; email: string; phone: string; coverLetter?: string; }, cvFile: Express.Multer.File, user: JwtUser): Promise<{ status: string }> {
    const { userId } = user;
    const { jobId, fullName, email, phone, coverLetter } = applicationData;
    this.ensureStudentRole(user);
    const applicantProfile = await this.getApplicantProfile(userId);

    await this.ensureNotApplied(jobId, userId);
    // cvFile có thể null trong luồng fallback (AI không chạy)

    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      cv_file_path: cvFile?.path || '',
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
        .populate({ path: 'job_id', model: 'Jobs', populate: { path: 'employer_id', model: 'Employer', select: 'company_name logo' } })
        .populate('cv_id')
        .sort({ applied_at: -1 }),
    ]);

    return {
      personalInfo: {
        name: userInfo?.name, email: userInfo?.email, dateOfBirth: userInfo?.dateOfbirth, gender: userInfo?.gender,
        phone: studentInfo?.phone, address: studentInfo?.address, avatar: studentInfo?.avatar, school: studentInfo?.school,
        major: studentInfo?.major, gpa: studentInfo?.gpa, graduation_year: studentInfo?.graduation_year,
        career_goal: studentInfo?.career_goal, desired_salary: studentInfo?.desired_salary,
      },
      applications: applications.map((app) => ({
        id: app._id, jobTitle: (app.job_id as any)?.title || 'N/A', companyName: (app.job_id as any)?.employer_id?.company_name || 'N/A',
        companyLogo: (app.job_id as any)?.employer_id?.logo, status: app.status, applied_at: app.applied_at,
        cv: app.cv_id, cv_file_path: app.cv_file_path, full_name: app.full_name, email: app.email, phone: app.phone,
        cover_letter: app.cover_letter, match_score: app.match_score,
      })),
    };
  }

  async getEmployerCandidates(user: JwtUser, filterCriteria?: FilterCriteria) {
    const { userId } = user;
    const jobs = await this.jobsModel.find({ employer_id: new Types.ObjectId(userId) }).select('title location').lean();
    if (jobs.length === 0) return { candidates: [] };

    const jobIds = jobs.map((job) => job._id);
    const jobMap = new Map(jobs.map((job) => [job._id.toString(), { id: job._id.toString(), title: job.title || '', location: job.location || '' }]));
    const applications = await this.jobApplyModel.find({ job_id: { $in: jobIds } }).sort({ match_score: -1, applied_at: -1 }).lean();
    if (applications.length === 0) return { candidates: [] };

    const applicantUserIds = Array.from(new Set(applications.map((a) => a.student_id?.toString()))).filter(Boolean);
    const objectUserIds = applicantUserIds.map((id) => new Types.ObjectId(id));
    const [users, students] = await Promise.all([
      this.userModel.find({ _id: { $in: objectUserIds } }).select('name email dateOfbirth gender').lean(),
      this.studentModel.find({ user_id: { $in: objectUserIds } }).lean(),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const studentMap = new Map(students.map((s) => [s.user_id.toString(), s]));
    const studentSkills = students.length ? await this.studentSkillModel.find({ student_id: { $in: students.map((s) => s._id) } }).populate('skill_id', 'name').lean() : [];

    const studentSkillMap = new Map<string, Array<{ id: string; name: string; level: number }>>();
    studentSkills.forEach((ss: any) => {
      const sid = ss.student_id?.toString();
      if (!sid) return;
      const list = studentSkillMap.get(sid) || [];
      list.push({ id: ss.skill_id?._id?.toString() || '', name: ss.skill_id?.name || '', level: ss.level || 0 });
      studentSkillMap.set(sid, list);
    });

    const candidatesByUserId = new Map<string, any>();
    applications.forEach((application: any) => {
      const applicantUserId = application.student_id?.toString();
      if (!applicantUserId) return;

      const account = userMap.get(applicantUserId);
      const student = studentMap.get(applicantUserId);
      const job = jobMap.get(application.job_id?.toString());
      const candidateSkills = student ? studentSkillMap.get(student._id.toString()) || [] : [];
      const { englishLabel, englishScore } = this.getEnglishMeta(candidateSkills, student?.career_goal);
      const gpa = this.parseGpa(student?.gpa);

      if (filterCriteria) {
        if (filterCriteria.minGpa !== undefined && gpa < filterCriteria.minGpa) return;
        if (filterCriteria.minMatchScore !== undefined && (application.match_score || 0) < filterCriteria.minMatchScore) return;
        if (filterCriteria.level && this.normalizeText(student?.career_goal || '') !== this.normalizeText(filterCriteria.level)) return;
        if (filterCriteria.address && !this.normalizeText(student?.address || '').includes(this.normalizeText(filterCriteria.address))) return;
        if (filterCriteria.skills && filterCriteria.skills.length > 0) {
          const studentSkillNames = candidateSkills.map((s) => this.normalizeText(s.name));
          const hasSkill = filterCriteria.skills.some((s) => studentSkillNames.includes(this.normalizeText(s)));
          if (!hasSkill) return;
        }
      }

      if (!candidatesByUserId.has(applicantUserId)) {
        const extractedData = application.ai_extracted_data || {};
        candidatesByUserId.set(applicantUserId, {
          id: applicantUserId, application_id: application._id?.toString() || '', cv_id: application.cv_id?.toString() || '',
          cv_file_path: application.cv_file_path || '', name: extractedData.full_name || application.full_name || account?.name || 'Chưa cập nhật',
          email: extractedData.email || application.email || account?.email || '', phone: extractedData.phone || application.phone || student?.phone || '',
          address: extractedData.address || student?.address || '', gpa: extractedData.gpa ? this.parseGpa(extractedData.gpa) : gpa,
          avatar: student?.avatar || this.defaultAvatar, school: student?.school || extractedData.school || '', major: student?.major || extractedData.major || '',
          graduation_year: student?.graduation_year || extractedData.graduation_year || '', career_goal: student?.career_goal || extractedData.position || '',
          desired_salary: student?.desired_salary || '', englishLabel, englishScore, skills: candidateSkills, match_score: application.match_score || 0,
          verified_cv_data: extractedData, status: application.status, latestAppliedAt: application.applied_at, latestJobTitle: job?.title || '',
          totalApplications: 0, appliedJobs: [],
        });
      }

      const candidate = candidatesByUserId.get(applicantUserId);
      candidate.totalApplications += 1;
      candidate.appliedJobs.push({ id: job?.id || application.job_id?.toString() || '', title: job?.title || '', location: job?.location || '', status: application.status, applied_at: application.applied_at });
    });

    const candidates = Array.from(candidatesByUserId.values())
      .map((c) => ({ ...c, appliedJobs: c.appliedJobs.slice(0, 5) }))
      .sort((a, b) => {
        if (b.match_score !== a.match_score) return b.match_score - a.match_score;
        return new Date(b.latestAppliedAt).getTime() - new Date(a.latestAppliedAt).getTime();
      });

    return { candidates };
  }

  async getTopCandidates(user: JwtUser, jobId?: string, limit = 10) {
    const { userId } = user;
    const employerJobs = await this.jobsModel.find({ employer_id: new Types.ObjectId(userId) }).select('_id title location level experience').lean();
    if (employerJobs.length === 0) return { topCandidates: [] };

    const targetJobIds = jobId ? [new Types.ObjectId(jobId)] : employerJobs.map((j) => j._id);
    const applications = await this.jobApplyModel.find({ job_id: { $in: targetJobIds }, status: { $ne: 'rejected' } }).sort({ match_score: -1 }).lean();
    if (applications.length === 0) return { topCandidates: [] };

    const studentUserIds = [...new Set(applications.map((a) => a.student_id?.toString()).filter(Boolean))];
    const objectIds = studentUserIds.map((id) => new Types.ObjectId(id));
    const [users, students] = await Promise.all([
      this.userModel.find({ _id: { $in: objectIds } }).select('name email').lean(),
      this.studentModel.find({ user_id: { $in: objectIds } }).lean(),
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const studentMap = new Map(students.map((s) => [s.user_id.toString(), s]));
    const studentIds = students.map((s) => s._id);
    const allStudentSkills = studentIds.length > 0 ? await this.studentSkillModel.find({ student_id: { $in: studentIds } }).populate('skill_id', 'name').lean() : [];

    const skillMap = new Map<string, Array<{ name: string; level: number }>>();
    allStudentSkills.forEach((ss: any) => {
      const sid = ss.student_id?.toString();
      if (!sid) return;
      const list = skillMap.get(sid) || [];
      list.push({ name: ss.skill_id?.name || '', level: ss.level || 0 });
      skillMap.set(sid, list);
    });

    let jobRequiredSkills: string[] = [];
    if (jobId) {
      const jobSkillDocs = await this.jobSkillModel.find({ Job_id: new Types.ObjectId(jobId) }).populate('skill_id', 'name').lean();
      jobRequiredSkills = jobSkillDocs.map((js: any) => this.normalizeText(js.skill_id?.name || '')).filter((n) => n.length > 0);
    }

    const jobMap = new Map(employerJobs.map((j) => [j._id.toString(), j]));
    const candidateScores = new Map<string, any>();

    applications.forEach((app: any) => {
      const uid = app.student_id?.toString();
      if (!uid || candidateScores.has(uid)) return;

      const account = userMap.get(uid);
      const student = studentMap.get(uid);
      const studentSkills = student ? skillMap.get(student._id.toString()) || [] : [];
      const job = jobMap.get(app.job_id?.toString());

      const gpa = this.parseGpa(student?.gpa);
      const gpaScore = Math.min(100, (gpa / 4) * 100);

      let skillScore = 0;
      if (studentSkills.length > 0) {
        const avgLevel = studentSkills.reduce((sum, s) => sum + s.level, 0) / studentSkills.length;
        const skillCountScore = Math.min(50, studentSkills.length * 10);
        const skillLevelScore = (avgLevel / 5) * 50;
        skillScore = skillCountScore + skillLevelScore;

        if (jobRequiredSkills.length > 0) {
          const matchedCount = studentSkills.filter((s) => jobRequiredSkills.some((req) => {
            const norm = this.normalizeText(s.name);
            return norm === req || norm.includes(req) || req.includes(norm);
          })).length;
          const matchRatio = matchedCount / jobRequiredSkills.length;
          skillScore = skillScore * 0.6 + matchRatio * 100 * 0.4;
        }
      }

      const matchScore = app.match_score || 0;
      const excellenceScore = Math.round(gpaScore * 0.3 + skillScore * 0.4 + matchScore * 0.3);

      candidateScores.set(uid, {
        id: uid, application_id: app._id?.toString(), name: account?.name || app.full_name || 'Chưa cập nhật',
        email: account?.email || app.email || '', phone: student?.phone || app.phone || '', avatar: student?.avatar || this.defaultAvatar,
        school: student?.school || '', major: student?.major || '', gpa, gpa_score: Math.round(gpaScore), skills: studentSkills,
        skill_score: Math.round(skillScore), match_score: matchScore, excellence_score: excellenceScore, career_goal: student?.career_goal || '',
        graduation_year: student?.graduation_year || '', cv_file_path: app.cv_file_path || '', applied_job: job?.title || '',
        applied_at: app.applied_at, status: app.status, ranking_breakdown: { gpa_weight: '30%', skill_weight: '40%', match_weight: '30%', gpa_raw: gpa, skill_count: studentSkills.length, match_raw: matchScore },
      });
    });

    const topCandidates = Array.from(candidateScores.values()).sort((a, b) => b.excellence_score - a.excellence_score).slice(0, limit);
    return { total: candidateScores.size, showing: topCandidates.length, topCandidates };
  }
}