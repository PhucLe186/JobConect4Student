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
  // 1. LẤY TIÊU CHÍ JD TỪ MONGODB (ÁNH XẠ)
  // =================================================================
  private async getJdCriteria(jobId: string) {
    const job = await this.jobsModel.findById(jobId).lean();
    if (!job) throw new BadRequestException('Công việc không tồn tại!');

    const criteria = {
      position: job.title,
      level: job.level,
      address: job.location,
      experience: job.experience,
      gpa: (job as any).min_gpa || 0,
      skills: job.requirements || '', // Ép requirements (text) thành skills
    };

    return criteria;
  }

  // =================================================================
  // 2. NESTJS TỰ CHẤM ĐIỂM (REGEX & FUZZY MATCHING THÔNG MINH)
  // =================================================================
  private calculateMatchScore(formData: any, jdCriteria: any) {
    const scores = { position: 0, level: 0, address: 0, gpa: 0, skill: 0 };

    // 1. POSITION (10đ)
    const jdPos = this.normalizeText(jdCriteria.position || '');
    const formPos = this.normalizeText(formData.position || '');
    if (
      jdPos &&
      formPos &&
      (jdPos.includes(formPos) || formPos.includes(jdPos))
    )
      scores.position = 10;

    // 2. LEVEL (20đ)
    const jdLevel = this.normalizeText(jdCriteria.level || '');
    const formLevel = this.normalizeText(formData.level || '');
    if (
      jdLevel &&
      formLevel &&
      (jdLevel.includes(formLevel) || formLevel.includes(jdLevel))
    )
      scores.level = 20;

    // 3. ADDRESS (15đ)
    const jdAddress = this.normalizeText(jdCriteria.address || '');
    const formAddress = this.normalizeText(formData.address || '');
    if (
      jdAddress &&
      formAddress &&
      (jdAddress.includes(formAddress) || formAddress.includes(jdAddress))
    )
      scores.address = 15;

    // 4. GPA (25đ)
    const formGpa = this.parseGpa(formData.gpa);
    const jdGpa = this.parseGpa(jdCriteria.gpa);
    if (jdGpa > 0) {
      scores.gpa =
        formGpa >= jdGpa ? 25 : Math.round((formGpa / jdGpa) * 25 * 100) / 100;
    } else {
      scores.gpa = 25; // JD không yêu cầu GPA thì auto cho full điểm
    }

    // 5. SKILL (30đ) - Chấm điểm Regex & Fuzzy
    const jdReqText = this.normalizeText(jdCriteria.skills || ''); // Lấy chuỗi requirements
    const formSkillText = this.normalizeText(formData.skill || '');

    if (jdReqText && formSkillText) {
      // Tách các kỹ năng ứng viên nhập thành mảng
      const applicantSkills = formSkillText
        .split(/[,;\-|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);
      let matchedSkillsCount = 0;

      applicantSkills.forEach((cvSkill) => {
        let keyword = cvSkill;
        // Kiểm tra từ điển OCR
        for (const [wrong, correct] of Object.entries(this.skillAliases)) {
          if (keyword === wrong) keyword = correct;
        }

        // Tìm kiếm Regex an toàn
        const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safeKeyword, 'i');

        if (regex.test(jdReqText)) {
          matchedSkillsCount++;
        } else {
          // Fuzzy Matching (Bỏ dấu/khoảng trắng)
          const pureKeyword = this.cleanString(keyword);
          const pureJd = this.cleanString(jdReqText);
          if (pureKeyword.length > 2 && pureJd.includes(pureKeyword)) {
            matchedSkillsCount++;
          }
        }
      });

      // Quy đổi điểm: Cần 3 keyword khớp để đạt 30 điểm
      const EXPECTED_CORE_SKILLS = 3;
      scores.skill = Math.min(
        30,
        Math.round((matchedSkillsCount / EXPECTED_CORE_SKILLS) * 30),
      );
    } else if (!jdReqText) {
      scores.skill = 30;
    }

    const total =
      scores.position +
      scores.level +
      scores.address +
      scores.gpa +
      scores.skill;
    console.log('\n--- [NESTJS] CHI TIẾT CHẤM ĐIỂM FORM ---');
    console.log(scores);
    console.log(`=> TỔNG ĐIỂM MỚI: ${total}/100\n`);

    return total;
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
    const finalScore = this.calculateMatchScore(formData, jdCriteria);

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
      ai_extracted_data: formData,
    });

    return { status: 'Ứng tuyển thành công!', match_score: finalScore };
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
}
