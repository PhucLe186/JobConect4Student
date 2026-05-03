require('dotenv').config();

const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI in Server/.env');
}

const DEFAULT_PASSWORD = 'Employer@2026!';
const SEED_SOURCE = 'page1-real-brand-companies';

const REAL_COMPANIES = [
  {
    company_name: 'Google Vietnam',
    login_email: 'google.vietnam@company.jobconnect4students.local',
    industry: 'Công nghệ thông tin và nền tảng số',
    size: 1100,
    address: '76 Lê Lợi, Quận 1, TP.HCM',
    website: 'https://careers.google.com',
    description:
      'Doanh nghiệp công nghệ quốc tế phát triển hệ sinh thái tìm kiếm, cloud, dữ liệu và AI tại thị trường Việt Nam.',
    job: {
      title: 'Frontend Engineer',
      department: 'Engineering',
      job_type: 'full-time',
      experience: '2 năm',
      level: 'Nhân viên',
      min_salary: '25000000',
      max_salary: '40000000',
      location: 'Quận 1, TP.HCM',
      requirements:
        'React, TypeScript, REST API, HTML, CSS, UI performance, teamwork.',
      description:
        'Phát triển giao diện sản phẩm và dashboard nội bộ cho các nền tảng số đang tăng trưởng.',
    },
  },
  {
    company_name: 'Grab Vietnam',
    login_email: 'grab.vietnam@company.jobconnect4students.local',
    industry: 'Công nghệ và vận tải số',
    size: 900,
    address: '27 Lê Duẩn, Quận 1, TP.HCM',
    website: 'https://www.grab.com/vn',
    description:
      'Hệ sinh thái gọi xe, giao nhận và fintech với đội ngũ vận hành và sản phẩm lớn tại Việt Nam.',
    job: {
      title: 'Backend Engineer',
      department: 'Engineering',
      job_type: 'full-time',
      experience: '2 năm',
      level: 'Nhân viên',
      min_salary: '24000000',
      max_salary: '38000000',
      location: 'Quận 1, TP.HCM',
      requirements:
        'Node.js, SQL, Redis, API design, microservices, cloud deployment.',
      description:
        'Xây dựng API và service backend hỗ trợ nền tảng giao vận và vận hành số.',
    },
  },
  {
    company_name: 'LG Electronics Vietnam',
    login_email: 'lg.electronics.vietnam@company.jobconnect4students.local',
    industry: 'Điện tử và thiết bị gia dụng',
    size: 1500,
    address: '18 Lê Hồng Phong, Ngô Quyền, Hải Phòng',
    website: 'https://www.lg.com/vn',
    description:
      'Phát triển thiết bị thông minh, giải pháp điện tử và hệ thống quản lý sản xuất quy mô lớn.',
    job: {
      title: 'Product Designer',
      department: 'Design',
      job_type: 'full-time',
      experience: '1 năm',
      level: 'Nhân viên',
      min_salary: '18000000',
      max_salary: '30000000',
      location: 'Hải Phòng',
      requirements:
        'Figma, UX research, design system, prototype, product collaboration.',
      description:
        'Thiết kế luồng người dùng và prototype cho ứng dụng điều phối sản xuất và thiết bị thông minh.',
    },
  },
  {
    company_name: 'Samsung Vietnam',
    login_email: 'samsung.vietnam@company.jobconnect4students.local',
    industry: 'Điện tử, thiết bị di động và bán dẫn',
    size: 2500,
    address: '88 Quốc Lộ 18, Yên Phong, Bắc Ninh',
    website: 'https://www.samsung.com/vn',
    description:
      'Tập đoàn công nghệ với trung tâm sản xuất, R&D và đội ngũ vận hành quy mô lớn tại Việt Nam.',
    job: {
      title: 'Data Analyst',
      department: 'Data',
      job_type: 'full-time',
      experience: '1 năm',
      level: 'Nhân viên',
      min_salary: '19000000',
      max_salary: '32000000',
      location: 'Bắc Ninh',
      requirements:
        'SQL, Excel, Power BI, dashboarding, business analysis, reporting.',
      description:
        'Phân tích dữ liệu vận hành và xây dựng dashboard hỗ trợ tối ưu sản xuất.',
    },
  },
  {
    company_name: 'Microsoft Vietnam',
    login_email: 'microsoft.vietnam@company.jobconnect4students.local',
    industry: 'Phần mềm, cloud và AI',
    size: 850,
    address: '40 Liễu Giai, Ba Đình, Hà Nội',
    website: 'https://www.microsoft.com/vi-vn',
    description:
      'Cung cấp giải pháp cloud, năng suất và tự động hóa cho doanh nghiệp tại Việt Nam.',
    job: {
      title: 'Cloud Solutions Engineer',
      department: 'Cloud',
      job_type: 'full-time',
      experience: '2 năm',
      level: 'Nhân viên',
      min_salary: '28000000',
      max_salary: '42000000',
      location: 'Hà Nội',
      requirements:
        'Azure, Docker, CI/CD, scripting, troubleshooting, solution design.',
      description:
        'Triển khai và tối ưu các giải pháp cloud cho khách hàng doanh nghiệp.',
    },
  },
  {
    company_name: 'Oracle Vietnam',
    login_email: 'oracle.vietnam@company.jobconnect4students.local',
    industry: 'Cloud, cơ sở dữ liệu và enterprise software',
    size: 760,
    address: '50 Hai Bà Trưng, Quận 1, TP.HCM',
    website: 'https://www.oracle.com/vn',
    description:
      'Tập trung vào cloud infrastructure, cơ sở dữ liệu và giải pháp vận hành doanh nghiệp.',
    job: {
      title: 'Database Engineer',
      department: 'Data Platform',
      job_type: 'full-time',
      experience: '2 năm',
      level: 'Nhân viên',
      min_salary: '26000000',
      max_salary: '40000000',
      location: 'Quận 1, TP.HCM',
      requirements:
        'Oracle DB, SQL, performance tuning, backup, monitoring, Linux.',
      description:
        'Vận hành hệ thống cơ sở dữ liệu và tối ưu hiệu năng cho các ứng dụng doanh nghiệp.',
    },
  },
  {
    company_name: 'Shopee Vietnam',
    login_email: 'shopee.vietnam@company.jobconnect4students.local',
    industry: 'Thương mại điện tử',
    size: 1200,
    address: '66 Nguyễn Chí Thanh, Cầu Giấy, Hà Nội',
    website: 'https://shopee.vn',
    description:
      'Nền tảng e-commerce lớn tập trung vào vận hành seller, buyer và logistics tại Việt Nam.',
    job: {
      title: 'E-commerce Operations Analyst',
      department: 'Operations',
      job_type: 'full-time',
      experience: '1 năm',
      level: 'Nhân viên',
      min_salary: '17000000',
      max_salary: '29000000',
      location: 'Hà Nội',
      requirements:
        'Excel, SQL basics, reporting, process optimization, communication.',
      description:
        'Theo dõi vận hành sàn TMĐT và đề xuất cải tiến dựa trên chỉ số kinh doanh.',
    },
  },
  {
    company_name: 'TikTok Vietnam',
    login_email: 'tiktok.vietnam@company.jobconnect4students.local',
    industry: 'Mạng xã hội và nội dung số',
    size: 980,
    address: '22 Lê Thánh Tôn, Quận 1, TP.HCM',
    website: 'https://www.tiktok.com',
    description:
      'Phát triển nền tảng nội dung số, creator tools, ads và giải pháp moderation.',
    job: {
      title: 'Content Strategy Specialist',
      department: 'Content',
      job_type: 'full-time',
      experience: '1 năm',
      level: 'Nhân viên',
      min_salary: '18000000',
      max_salary: '30000000',
      location: 'Quận 1, TP.HCM',
      requirements:
        'Content planning, analytics, campaign execution, communication, trends.',
      description:
        'Phân tích hành vi người dùng và đề xuất chiến lược nội dung cho thị trường Việt Nam.',
    },
  },
  {
    company_name: 'Naver Vietnam',
    login_email: 'naver.vietnam@company.jobconnect4students.local',
    industry: 'Internet service và AI',
    size: 640,
    address: '32 Bạch Đằng, Hải Châu, Đà Nẵng',
    website: 'https://www.navercorp.com',
    description:
      'Doanh nghiệp internet và AI với các đội kỹ thuật, dữ liệu và sản phẩm quốc tế.',
    job: {
      title: 'AI Platform Engineer',
      department: 'AI',
      job_type: 'full-time',
      experience: '2 năm',
      level: 'Nhân viên',
      min_salary: '24000000',
      max_salary: '39000000',
      location: 'Đà Nẵng',
      requirements:
        'Python, API development, model deployment, data pipelines, monitoring.',
      description:
        'Xây dựng nền tảng phục vụ các bài toán AI và dữ liệu cho sản phẩm internet.',
    },
  },
];

async function getLatestCreatedAt(jobsCollection) {
  const latestJob = await jobsCollection
    .find({}, { projection: { created_at: 1 } })
    .sort({ created_at: -1, _id: -1 })
    .limit(1)
    .next();

  return latestJob?.created_at instanceof Date
    ? latestJob.created_at
    : new Date();
}

async function upsertEmployerAccount({
  usersCollection,
  employerCollection,
  company,
  hashedPassword,
}) {
  const userPayload = {
    name: company.company_name,
    email: company.login_email,
    password: hashedPassword,
    dateOfbirth: new Date('1990-01-01T00:00:00.000Z'),
    gender: 'other',
    role: 'employer',
    email_verified: true,
    language: 'vi',
    seed_source: SEED_SOURCE,
  };

  await usersCollection.updateOne(
    { email: company.login_email },
    {
      $set: userPayload,
      $setOnInsert: { created_at: new Date() },
    },
    { upsert: true },
  );

  const user = await usersCollection.findOne(
    { email: company.login_email },
    { projection: { _id: 1, email: 1 } },
  );

  if (!user?._id) {
    throw new Error(`Failed to create or load user for ${company.company_name}`);
  }

  const employerPayload = {
    user_id: new ObjectId(user._id),
    company_name: company.company_name,
    description: company.description,
    size: company.size,
    industry: company.industry,
    address: company.address,
    email: company.login_email,
    website: company.website,
    logo: '',
    seed_source: SEED_SOURCE,
  };

  await employerCollection.updateOne(
    { company_name: company.company_name },
    {
      $set: employerPayload,
      $setOnInsert: { created_at: new Date() },
    },
    { upsert: true },
  );

  const employer = await employerCollection.findOne(
    { company_name: company.company_name },
    { projection: { _id: 1, user_id: 1, company_name: 1 } },
  );

  if (!employer?._id) {
    throw new Error(
      `Failed to create or load employer profile for ${company.company_name}`,
    );
  }

  return { user, employer };
}

async function upsertSpotlightJob({
  jobsCollection,
  company,
  employerUserId,
  createdAt,
  deadline,
}) {
  const jobPayload = {
    employer_id:
      employerUserId instanceof ObjectId
        ? employerUserId
        : new ObjectId(employerUserId),
    title: company.job.title,
    description: company.job.description,
    job_type: company.job.job_type,
    min_salary: company.job.min_salary,
    max_salary: company.job.max_salary,
    location: company.job.location,
    deadline,
    created_at: createdAt,
    industry: company.industry,
    department: company.job.department,
    experience: company.job.experience,
    requirements: company.job.requirements,
    level: company.job.level,
    status: 'open',
    seed_source: SEED_SOURCE,
  };

  await jobsCollection.updateOne(
    {
      employer_id: jobPayload.employer_id,
      seed_source: SEED_SOURCE,
    },
    {
      $set: jobPayload,
      $setOnInsert: { created_marker: new Date() },
    },
    { upsert: true },
  );
}

async function seedPage1RealCompanies() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db();
    const usersCollection = db.collection('users');
    const employerCollection = db.collection('employer');
    const jobsCollection = db.collection('jobs');

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const latestCreatedAt = await getLatestCreatedAt(jobsCollection);
    const baseCreatedAt = new Date(latestCreatedAt.getTime() + 10 * 60 * 1000);

    for (const [index, company] of REAL_COMPANIES.entries()) {
      const { user } = await upsertEmployerAccount({
        usersCollection,
        employerCollection,
        company,
        hashedPassword,
      });

      const createdAt = new Date(baseCreatedAt.getTime() - index * 60 * 1000);
      const deadline = new Date(
        baseCreatedAt.getTime() + (index + 20) * 86400000,
      );

      await upsertSpotlightJob({
        jobsCollection,
        company,
        employerUserId: user._id,
        createdAt,
        deadline,
      });
    }

    console.log('Seeded 9 real-brand employer accounts for page 1 successfully.');
    console.table(
      REAL_COMPANIES.map((company, index) => ({
        order_on_jobs_page: index + 1,
        company_name: company.company_name,
        username: company.login_email,
        password: DEFAULT_PASSWORD,
        profile_path: '/NTDprofile',
      })),
    );
  } catch (error) {
    console.error('Failed to seed page 1 real-brand companies:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedPage1RealCompanies();
