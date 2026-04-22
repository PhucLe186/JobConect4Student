import { Injectable, BadRequestException } from '@nestjs/common';
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
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';

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
    // Bổ sung HttpService để gọi API sang Python
    private httpService: HttpService,
  ) {}

  private readonly defaultAvatar =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  private normalizeText(value = '') {
    return value
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
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

    return {
      englishLabel: '',
      englishScore: 0,
    };
  }

  private async getApplicantProfile(userId: string) {
    const [userInfo, studentInfo] = await Promise.all([
      this.userModel.findById(userId).lean(),
      this.studentModel.findOne({ user_id: new Types.ObjectId(userId) }).lean(),
    ]);

    if (!userInfo) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }

    return {
      fullName: userInfo.name || 'Chưa cập nhật',
      email: userInfo.email || 'Chưa cập nhật',
      phone: studentInfo?.phone || 'Chưa cập nhật',
    };
  }

  private async ensureNotApplied(jobId: string, userId: string) {
    const existingApplication = await this.jobApplyModel.findOne({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
    });

    if (existingApplication) {
      throw new Error('Bạn đã ứng tuyển vị trí này rồi!');
    }
  }

  // ==========================================
  // [NEW] CÁC HÀM XỬ LÝ AI VÀ FORM
  // ==========================================

  // 1. Lấy JD để chấm điểm
  private async getJdCriteria(jobId: string) {
    const job = await this.jobsModel.findById(jobId).lean();
    if (!job) throw new BadRequestException('Công việc không tồn tại!');
    
    // LƯU Ý DÀNH CHO BẠN: Nếu bạn muốn query Skills chuẩn từ DB, 
    // hãy Inject thêm model JobSkills vào file này giống như cách bạn làm với StudentSkills nhé.
    // Hiện tại mình đang mock mảng skills để test code.
    return {
      position: job.title,
      level: job.level,
      address: job.location,
      gpa: 0, 
      skills: ['react', 'node', 'python'] 
    };
  }

  // 2. Chấm điểm logic form (Đã hoàn thiện lại theo tỷ lệ 100 điểm của Python)
  private calculateMatchScore(formData: any, jdCriteria: any) {
    let scores = { position: 0, level: 0, address: 0, gpa: 0, skill: 0, total: 0 };

    // 2.1 Chấm điểm Position (Max 10đ)
    const jdPos = (jdCriteria.position || '').toLowerCase();
    const formPos = (formData.position || '').toLowerCase();
    if (jdPos && formPos.includes(jdPos)) scores.position = 10;

    // 2.2 Chấm điểm Level (Max 20đ)
    const jdLevel = (jdCriteria.level || '').toLowerCase();
    const formLevel = (formData.level || '').toLowerCase();
    if (jdLevel && jdLevel === formLevel) scores.level = 20;

    // 2.3 Chấm điểm Address (Max 15đ)
    const jdAddress = (jdCriteria.address || '').toLowerCase();
    const formAddress = (formData.address || '').toLowerCase();
    if (jdAddress && formAddress.includes(jdAddress)) scores.address = 15;

    // 2.4 Chấm điểm GPA (Max 25đ) - Dùng lại hàm parseGpa có sẵn của bạn
    const formGpa = this.parseGpa(formData.gpa);
    const jdGpa = this.parseGpa(jdCriteria.gpa);
    if (jdGpa > 0) {
      if (formGpa >= jdGpa) scores.gpa = 25;
      else scores.gpa = Math.round((formGpa / jdGpa) * 25 * 100) / 100;
    } else {
      scores.gpa = 25; // Nếu JD ko set gpa min thì coi như full điểm
    }

    // 2.5 Chấm điểm Skill (Max 30đ)
    const jdSkills = jdCriteria.skills || [];
    const formSkillText = (formData.skill || '').toLowerCase();
    
    if (jdSkills.length > 0) {
      let matchCount = 0;
      jdSkills.forEach(reqSkill => {
        if (formSkillText.includes(reqSkill.toLowerCase())) {
          matchCount++;
        }
      });
      scores.skill = Math.round((matchCount / jdSkills.length) * 30 * 100) / 100;
    } else {
      scores.skill = 30; // Nếu JD ko yêu cầu skill thì full điểm
    }

    // Tổng kết
    scores.total = scores.position + scores.level + scores.address + scores.gpa + scores.skill;
    return scores.total;
  }

  // 3. API 1: Phân tích CV nháp qua Python AI
  async analyzeCVDraft(jobId: string, cvFile: Express.Multer.File) {
    const jdCriteria = await this.getJdCriteria(jobId);

    const form = new FormData();
    form.append('file', fs.createReadStream(cvFile.path), { filename: cvFile.originalname });
    form.append('jd_criteria', JSON.stringify(jdCriteria));

    try {
      const pythonApiUrl = 'http://localhost:8000/api/extract-cv'; 
      const response = await lastValueFrom(
        this.httpService.post(pythonApiUrl, form, { headers: form.getHeaders() })
      );
      return response.data;
    } catch (error) {
      console.error('AI Error:', error.message);
      throw new BadRequestException('Hệ thống AI đang bận, không thể bóc tách tự động lúc này.');
    }
  }

  // 4. API 2: Nộp CV chính thức bằng dữ liệu Form
  async submitFinalCV(
    jobId: string,
    user: JwtUser,
    cvFilePath: string,
    formData: any
  ) {
    const { userId } = user;

    const fullName = formData.full_name || formData.fullName;
    if (!fullName) throw new BadRequestException('Thiếu họ tên');
    if (!formData.email) throw new BadRequestException('Thiếu email');
    if (!formData.phone) throw new BadRequestException('Thiếu số điện thoại');

    await this.ensureNotApplied(jobId, userId);
    
    const jdCriteria = await this.getJdCriteria(jobId);
    const finalScore = this.calculateMatchScore(formData, jdCriteria);

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
      match_score: finalScore,        // Lưu điểm CV ưu tú
      ai_extracted_data: formData     // Lưu cục dữ liệu đã confirm
    });

    return { status: 'Ứng tuyển thành công!', match_score: finalScore };
  }

  // ==========================================
  // CÁC HÀM CŨ ĐƯỢC GIỮ NGUYÊN (VÀ CẬP NHẬT SORTING)
  // ==========================================

  async applyJobs(
    jobid: string,
    user: JwtUser,
    options?: { cvFile?: Express.Multer.File; coverLetter?: string },
  ): Promise<{ status: string }> {
    const { userId } = user;
    const { cvFile, coverLetter } = options || {};

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

    if (!cv) {
      throw new Error('Vui lòng tải CV lên hoặc tạo CV trước khi ứng tuyển');
    }

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
    user: JwtUser
  ): Promise<{ status: string }> {
    const { userId } = user;
    const { jobId, fullName, email, phone, coverLetter } = applicationData;
    const applicantProfile = await this.getApplicantProfile(userId);

    await this.ensureNotApplied(jobId, userId);

    if (!cvFile) {
      throw new Error('Vui lòng tải lên CV trước khi ứng tuyển');
    }

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

    const userInfo = await this.userModel.findById(userId);
    const studentInfo = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });

    const applications = await this.jobApplyModel
      .find({ student_id: new Types.ObjectId(userId) })
      .populate({
        path: 'job_id',
        model: 'Jobs',
        populate: {
          path: 'employer_id',
          model: 'Employer',
          select: 'company_name logo'
        }
      })
      .populate('cv_id')
      .sort({ applied_at: -1 });

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
        desired_salary: studentInfo?.desired_salary
      },
      applications: applications.map(app => ({
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
        cover_letter: app.cover_letter
      }))
    };
  }

  async getEmployerCandidates(user: JwtUser) {
    const { userId } = user;

    const jobs = await this.jobsModel
      .find({ employer_id: new Types.ObjectId(userId) })
      .select('title location')
      .lean();

    if (jobs.length === 0) {
      return { candidates: [] };
    }

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

    // [CẬP NHẬT] Đẩy ưu tiên sắp xếp match_score lên đầu cho "CV Ưu Tú"
    const applications = await this.jobApplyModel
      .find({ job_id: { $in: jobIds } })
      .sort({ match_score: -1, applied_at: -1 }) // <-- Điểm cao xếp trước, sau đó mới tính thời gian
      .lean();

    if (applications.length === 0) {
      return { candidates: [] };
    }

    const applicantUserIds = Array.from(
      new Set(applications.map((application) => application.student_id?.toString())),
    ).filter(Boolean);

    const objectUserIds = applicantUserIds.map((id) => new Types.ObjectId(id));

    const [users, students] = await Promise.all([
      this.userModel
        .find({ _id: { $in: objectUserIds } })
        .select('name email dateOfbirth gender')
        .lean(),
      this.studentModel.find({ user_id: { $in: objectUserIds } }).lean(),
    ]);

    const userMap = new Map(users.map((account) => [account._id.toString(), account]));
    const studentMap = new Map(
      students.map((student) => [student.user_id.toString(), student]),
    );

    const studentSkills = students.length
      ? await this.studentSkillModel
          .find({ student_id: { $in: students.map((student) => student._id) } })
          .populate('skill_id', 'name')
          .lean()
      : [];

    const studentSkillMap = new Map<
      string,
      Array<{ id: string; name: string; level: number }>
    >();

    studentSkills.forEach((studentSkill: any) => {
      const studentId = studentSkill.student_id?.toString();

      if (!studentId) {
        return;
      }

      const currentSkills = studentSkillMap.get(studentId) || [];
      currentSkills.push({
        id: studentSkill.skill_id?._id?.toString?.() || '',
        name: studentSkill.skill_id?.name || '',
        level: studentSkill.level || 0,
      });
      studentSkillMap.set(studentId, currentSkills);
    });

    const candidatesByUserId = new Map<string, any>();

    applications.forEach((application: any) => {
      const applicantUserId = application.student_id?.toString();

      if (!applicantUserId) {
        return;
      }

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

      if (!candidatesByUserId.has(applicantUserId)) {
        candidatesByUserId.set(applicantUserId, {
          id: applicantUserId,
          application_id: application._id?.toString?.() || '',
          cv_id: application.cv_id?.toString?.() || '',
          cv_file_path: application.cv_file_path || '',
          name: account?.name || application.full_name || 'Chua cap nhat',
          email: account?.email || application.email || '',
          phone: student?.phone || application.phone || '',
          address: student?.address || '',
          avatar: student?.avatar || this.defaultAvatar,
          school: student?.school || '',
          major: student?.major || '',
          gpa: this.parseGpa(student?.gpa),
          graduation_year: student?.graduation_year || '',
          career_goal: student?.career_goal || '',
          desired_salary: student?.desired_salary || '',
          englishLabel,
          englishScore,
          skills: candidateSkills,
          // [CẬP NHẬT] Gắn dữ liệu AI và Điểm để FE hiển thị
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
        id: job?.id || application.job_id?.toString?.() || '',
        title: job?.title || '',
        location: job?.location || '',
        status: application.status,
        applied_at: application.applied_at,
      });
    });

    // Sắp xếp lại lần cuối đảm bảo ưu tiên điểm AI cao nhất -> thời gian gần nhất
    const candidates = Array.from(candidatesByUserId.values())
      .map((candidate) => ({
        ...candidate,
        appliedJobs: candidate.appliedJobs.slice(0, 5),
      }))
      .sort((left, right) => {
        if (right.match_score !== left.match_score) {
          return right.match_score - left.match_score;
        }
        return new Date(right.latestAppliedAt).getTime() - new Date(left.latestAppliedAt).getTime();
      });

    return { candidates };
  }
}