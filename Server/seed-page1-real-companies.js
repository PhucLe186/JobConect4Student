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
    industry: 'Dien tu, thiet bi di dong va ban dan',
    size: 2500,
    address: '88 Quoc Lo 18, Yen Phong, Bac Ninh',
    website: 'https://www.samsung.com/vn',
    description:
      'Tap doan cong nghe voi trung tam san xuat, R&D va doi ngu van hanh quy mo lon tai Viet Nam.',
    job: {
      title: 'Data Analyst',
      department: 'Data',
      job_type: 'full-time',
      experience: '1 nam',
      level: 'Nhan vien',
      min_salary: '19000000',
      max_salary: '32000000',
      location: 'Bac Ninh',
      requirements:
        'SQL, Excel, Power BI, dashboarding, business analysis, reporting.',
      description:
        'Phan tich du lieu van hanh va xay dung dashboard ho tro toi uu san xuat.',
    },
  },
  {
    company_name: 'Microsoft Vietnam',
    login_email: 'microsoft.vietnam@company.jobconnect4students.local',
    industry: 'Phan mem, cloud va AI',
    size: 850,
    address: '40 Liễu Giai, Ba Đình, Hà Nội',
    website: 'https://www.microsoft.com/vi-vn',
    description:
      'Cung cap giai phap cloud, nang suat va tu dong hoa cho doanh nghiep tai Viet Nam.',
    job: {
      title: 'Cloud Solutions Engineer',
      department: 'Cloud',
      job_type: 'full-time',
      experience: '2 nam',
      level: 'Nhan vien',
      min_salary: '28000000',
      max_salary: '42000000',
      location: 'Ha Noi',
      requirements:
        'Azure, Docker, CI/CD, scripting, troubleshooting, solution design.',
      description:
        'Trien khai va toi uu cac giai phap cloud cho khach hang doanh nghiep.',
    },
  },
  {
    company_name: 'Oracle Vietnam',
    login_email: 'oracle.vietnam@company.jobconnect4students.local',
    industry: 'Cloud, co so du lieu va enterprise software',
    size: 760,
    address: '50 Hai Bà Trưng, Quận 1, TP.HCM',
    website: 'https://www.oracle.com/vn',
    description:
      'Tap trung vao cloud infrastructure, co so du lieu va giai phap van hanh doanh nghiep.',
    job: {
      title: 'Database Engineer',
      department: 'Data Platform',
      job_type: 'full-time',
      experience: '2 nam',
      level: 'Nhan vien',
      min_salary: '26000000',
      max_salary: '40000000',
      location: 'Quan 1, TP.HCM',
      requirements:
        'Oracle DB, SQL, performance tuning, backup, monitoring, Linux.',
      description:
        'Van hanh he thong co so du lieu va toi uu hieu nang cho cac ung dung doanh nghiep.',
    },
  },
  {
    company_name: 'Shopee Vietnam',
    login_email: 'shopee.vietnam@company.jobconnect4students.local',
    industry: 'Thuong mai dien tu',
    size: 1200,
    address: '66 Nguyễn Chí Thanh, Cầu Giấy, Hà Nội',
    website: 'https://shopee.vn',
    description:
      'Nen tang e-commerce lon tap trung vao van hanh seller, buyer va logistics tai Viet Nam.',
    job: {
      title: 'E-commerce Operations Analyst',
      department: 'Operations',
      job_type: 'full-time',
      experience: '1 nam',
      level: 'Nhan vien',
      min_salary: '17000000',
      max_salary: '29000000',
      location: 'Ha Noi',
      requirements:
        'Excel, SQL basics, reporting, process optimization, communication.',
      description:
        'Theo doi van hanh san TMDT va de xuat cai tien dua tren chi so kinh doanh.',
    },
  },
  {
    company_name: 'TikTok Vietnam',
    login_email: 'tiktok.vietnam@company.jobconnect4students.local',
    industry: 'Mang xa hoi va noi dung so',
    size: 980,
    address: '22 Lê Thánh Tôn, Quận 1, TP.HCM',
    website: 'https://www.tiktok.com',
    description:
      'Phat trien nen tang noi dung so, creator tools, ads va giai phap moderation.',
    job: {
      title: 'Content Strategy Specialist',
      department: 'Content',
      job_type: 'full-time',
      experience: '1 nam',
      level: 'Nhan vien',
      min_salary: '18000000',
      max_salary: '30000000',
      location: 'Quan 1, TP.HCM',
      requirements:
        'Content planning, analytics, campaign execution, communication, trends.',
      description:
        'Phan tich hanh vi nguoi dung va de xuat chien luoc noi dung cho thi truong Viet Nam.',
    },
  },
  {
    company_name: 'Naver Vietnam',
    login_email: 'naver.vietnam@company.jobconnect4students.local',
    industry: 'Internet service va AI',
    size: 640,
    address: '32 Bạch Đằng, Hải Châu, Đà Nẵng',
    website: 'https://www.navercorp.com',
    description:
      'Doanh nghiep internet va AI voi cac doi ky thuat, du lieu va san pham quoc te.',
    job: {
      title: 'AI Platform Engineer',
      department: 'AI',
      job_type: 'full-time',
      experience: '2 nam',
      level: 'Nhan vien',
      min_salary: '24000000',
      max_salary: '39000000',
      location: 'Da Nang',
      requirements:
        'Python, API development, model deployment, data pipelines, monitoring.',
      description:
        'Xay dung nen tang phuc vu cac bai toan AI va du lieu cho san pham internet.',
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
      const deadline = new Date(baseCreatedAt.getTime() + (index + 20) * 86400000);

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
