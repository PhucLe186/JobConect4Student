require('dotenv').config();

const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI in Server/.env');
}

const DEFAULT_SEED_PASSWORD = 'SeedEmployer@123';
const SEED_SOURCE = 'mock-company-data';

const COMPANY_VARIANTS = [
  {
    suffix: 'Tech Center',
    unit: 'tech-center',
    sizeOffset: 0,
    description: 'Tập trung phát triển sản phẩm web, mobile và hệ thống nội bộ.',
  },
  {
    suffix: 'Digital Hub',
    unit: 'digital-hub',
    sizeOffset: 65,
    description: 'Phát triển các nền tảng số, dữ liệu và tự động hóa quy trình vận hành.',
  },
  {
    suffix: 'Innovation Lab',
    unit: 'innovation-lab',
    sizeOffset: 120,
    description: 'Thử nghiệm tính năng mới, tối ưu trải nghiệm và xây dựng prototype sản phẩm.',
  },
  {
    suffix: 'Operations Office',
    unit: 'operations-office',
    sizeOffset: 180,
    description: 'Điều phối vận hành, giám sát chất lượng dịch vụ và hỗ trợ phòng ban liên quan.',
  },
  {
    suffix: 'Experience Studio',
    unit: 'experience-studio',
    sizeOffset: 240,
    description: 'Tập trung vào customer experience, design system và tăng trưởng người dùng.',
  },
];

const JOB_TEMPLATES = [
  {
    title: 'Frontend React Developer',
    department: 'Engineering',
    job_type: 'full-time',
    experience: '2 năm',
    level: 'Nhân viên',
    min_salary: 18000000,
    max_salary: 30000000,
    description:
      'Phát triển giao diện web, dashboard và công cụ nội bộ cho sản phẩm đang tăng trưởng.',
    requirements:
      'React, TypeScript, HTML, CSS, REST API, tối ưu hiệu năng giao diện.',
  },
  {
    title: 'Backend Developer',
    department: 'Engineering',
    job_type: 'full-time',
    experience: '2 năm',
    level: 'Nhân viên',
    min_salary: 20000000,
    max_salary: 34000000,
    description:
      'Xây dựng API, service backend và tối ưu luồng dữ liệu cho hệ thống vận hành.',
    requirements:
      'Node.js hoặc Java, SQL, Redis, API design, kinh nghiệm cloud.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    job_type: 'full-time',
    experience: '1 năm',
    level: 'Nhân viên',
    min_salary: 15000000,
    max_salary: 26000000,
    description:
      'Thiết kế luồng người dùng, wireframe và prototype cho sản phẩm web và mobile.',
    requirements:
      'Figma, UX research, design system, prototype, phối hợp với dev team.',
  },
  {
    title: 'Data Analyst',
    department: 'Data',
    job_type: 'full-time',
    experience: '1 năm',
    level: 'Nhân viên',
    min_salary: 16000000,
    max_salary: 28000000,
    description:
      'Phân tích dữ liệu, xây dựng dashboard và đề xuất cải tiến dựa trên chỉ số kinh doanh.',
    requirements:
      'SQL, Excel, Power BI hoặc Tableau, tư duy phân tích và trình bày dữ liệu.',
  },
  {
    title: 'QA Automation Engineer',
    department: 'Engineering',
    job_type: 'full-time',
    experience: '1 năm',
    level: 'Nhân viên',
    min_salary: 17000000,
    max_salary: 29000000,
    description:
      'Xây dựng bộ test automation và báo cáo chất lượng cho hệ thống sản phẩm.',
    requirements:
      'API testing, Selenium hoặc Cypress, bug tracking, quy trình kiểm thử.',
  },
];

const COMPANY_SEEDS = [
  {
    brand: 'Google Vietnam',
    industry: 'Công nghệ thông tin và nền tảng số',
    city: 'TP.HCM',
    districts: ['Quận 1', 'Quận 3', 'Bình Thạnh', 'TP. Thủ Đức', 'Tân Bình'],
    streets: ['Lê Lợi', 'Nguyễn Huệ', 'Tôn Đức Thắng', 'Đồng Khởi', 'Võ Văn Kiệt'],
    description:
      'Doanh nghiệp công nghệ quốc tế phát triển hệ sinh thái tìm kiếm, cloud, dữ liệu và AI.',
    sizeBase: 1100,
    website: 'https://careers.google.com',
  },
  {
    brand: 'Grab Vietnam',
    industry: 'Công nghệ và vận tải số',
    city: 'TP.HCM',
    districts: ['Quận 1', 'Quận 7', 'Phú Nhuận', 'TP. Thủ Đức', 'Bình Thạnh'],
    streets: [
      'Nguyễn Thị Minh Khai',
      'Lê Duẩn',
      'Mai Chí Thọ',
      'Phạm Viết Chánh',
      'Nam Kỳ Khởi Nghĩa',
    ],
    description:
      'Hệ sinh thái gọi xe, giao nhận và fintech với đội ngũ vận hành và sản phẩm lớn.',
    sizeBase: 900,
    website: 'https://www.grab.com/vn',
  },
  {
    brand: 'LG Electronics Vietnam',
    industry: 'Điện tử và thiết bị gia dụng',
    city: 'Hải Phòng',
    districts: ['Tràng Duệ', 'Lê Chân', 'Ngô Quyền', 'An Dương', 'Hồng Bàng'],
    streets: ['Phạm Văn Đồng', 'Lê Hồng Phong', 'Hồ Sen', 'Trần Nguyên Hãn', 'Cổng Hải Phòng'],
    description:
      'Phát triển thiết bị thông minh, giải pháp điện tử và hệ thống quản lý sản xuất.',
    sizeBase: 1500,
    website: 'https://www.lg.com/vn',
  },
  {
    brand: 'Samsung Vietnam',
    industry: 'Điện tử, thiết bị di động và bán dẫn',
    city: 'Bắc Ninh',
    districts: ['Yên Phong', 'Từ Sơn', 'Tiên Du', 'Quế Võ', 'TP. Bắc Ninh'],
    streets: ['Trần Hưng Đạo', 'Nguyễn Trãi', 'Lý Anh Tông', 'Ngô Gia Tự', 'Quốc Lộ 18'],
    description:
      'Tập đoàn công nghệ với trung tâm sản xuất, R&D và đội ngũ vận hành quy mô lớn.',
    sizeBase: 2500,
    website: 'https://www.samsung.com/vn',
  },
  {
    brand: 'Microsoft Vietnam',
    industry: 'Phần mềm, cloud và AI',
    city: 'Hà Nội',
    districts: ['Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Nam Từ Liêm', 'Hai Bà Trưng'],
    streets: ['Liễu Giai', 'Phạm Hùng', 'Tôn Thất Thuyết', 'Trần Duy Hưng', 'Kim Mã'],
    description:
      'Cung cấp giải pháp cloud, năng suất và tự động hóa cho doanh nghiệp tại Việt Nam.',
    sizeBase: 850,
    website: 'https://www.microsoft.com/vi-vn',
  },
  {
    brand: 'Oracle Vietnam',
    industry: 'Cloud, cơ sở dữ liệu và enterprise software',
    city: 'TP.HCM',
    districts: ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 7', 'TP. Thủ Đức'],
    streets: ['Nguyễn Du', 'Hải Triều', 'Pasteur', 'Võ Văn Tần', 'Điện Biên Phủ'],
    description:
      'Tập trung vào cloud infrastructure, cơ sở dữ liệu và giải pháp vận hành doanh nghiệp.',
    sizeBase: 760,
    website: 'https://www.oracle.com/vn',
  },
  {
    brand: 'Shopee Vietnam',
    industry: 'Thương mại điện tử',
    city: 'Hà Nội',
    districts: ['Cầu Giấy', 'Ba Đình', 'Hai Bà Trưng', 'Đống Đa', 'Long Biên'],
    streets: ['Điện Biên Phủ', 'Xã Đàn', 'Nguyễn Chí Thanh', 'Minh Khai', 'Trần Hưng Đạo'],
    description:
      'Nền tảng e-commerce lớn tập trung vào vận hành seller, buyer và logistics.',
    sizeBase: 1200,
    website: 'https://shopee.vn',
  },
  {
    brand: 'TikTok Vietnam',
    industry: 'Mạng xã hội và nội dung số',
    city: 'TP.HCM',
    districts: ['Quận 1', 'Quận 2', 'Quận 4', 'Quận 7', 'TP. Thủ Đức'],
    streets: ['Pasteur', 'Nguyễn Bỉnh Khiêm', 'Võ Thị Sáu', 'Lê Thánh Tôn', 'Nguyễn Hữu Cảnh'],
    description:
      'Phát triển nền tảng nội dung số, creator tools, ads và giải pháp moderation.',
    sizeBase: 980,
    website: 'https://www.tiktok.com',
  },
  {
    brand: 'Naver Vietnam',
    industry: 'Internet service và AI',
    city: 'Đà Nẵng',
    districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Liên Chiểu', 'Ngũ Hành Sơn'],
    streets: ['Nguyễn Văn Linh', 'Võ Nguyên Giáp', 'Trần Phú', 'Bạch Đằng', '2 Tháng 9'],
    description:
      'Doanh nghiệp internet và AI với các đội kỹ thuật, dữ liệu và sản phẩm quốc tế.',
    sizeBase: 640,
    website: 'https://www.navercorp.com',
  },
  {
    brand: 'NEC Vietnam',
    industry: 'Hạ tầng CNTT và giải pháp doanh nghiệp',
    city: 'Hà Nội',
    districts: ['Nam Từ Liêm', 'Cầu Giấy', 'Ba Đình', 'Thanh Xuân', 'Tây Hồ'],
    streets: ['Phạm Hùng', 'Lê Đức Thọ', 'Tố Hữu', 'Khuất Duy Tiến', 'Nguyễn Hoàng'],
    description:
      'Cung cấp giải pháp hạ tầng, quản trị hệ thống, an ninh và chính phủ số.',
    sizeBase: 700,
    website: 'https://www.nec.com',
  },
  {
    brand: 'IBM Vietnam',
    industry: 'Tư vấn công nghệ, hybrid cloud và data',
    city: 'TP.HCM',
    districts: ['Quận 1', 'Quận 3', 'Bình Thạnh', 'Quận 7', 'TP. Thủ Đức'],
    streets: ['Lê Thánh Tôn', 'Nguyễn Huệ', 'Cách Mạng Tháng 8', 'Hoàng Văn Thụ', 'Xa Lộ Hà Nội'],
    description:
      'Tập trung vào data platform, tư vấn doanh nghiệp và giải pháp tự động hóa.',
    sizeBase: 720,
    website: 'https://www.ibm.com/vn-vi',
  },
  {
    brand: 'MB Bank Digital',
    industry: 'Ngân hàng số và fintech',
    city: 'Hà Nội',
    districts: ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân', 'Hai Bà Trưng'],
    streets: ['Lê Văn Lương', 'Trần Duy Hưng', 'Nguyễn Tuân', 'Thái Hà', 'Láng Hạ'],
    description:
      'Khối công nghệ phát triển ứng dụng ngân hàng số, hệ thống thanh toán và dữ liệu.',
    sizeBase: 1300,
    website: 'https://www.mbbank.com.vn',
  },
  {
    brand: 'Techcombank Digital',
    industry: 'Tài chính và ngân hàng',
    city: 'Đà Nẵng',
    districts: ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Cẩm Lệ', 'Liên Chiểu'],
    streets: ['Nguyễn Huệ', 'Trần Hưng Đạo', 'Lê Duẩn', 'Hoàng Diệu', 'Phạm Văn Đồng'],
    description:
      'Vận hành và phát triển hệ thống tài chính số, CRM và trải nghiệm khách hàng.',
    sizeBase: 880,
    website: 'https://www.techcombank.com',
  },
  {
    brand: 'VNG Corporation',
    industry: 'Công nghệ, game và digital product',
    city: 'TP.HCM',
    districts: ['Quận 7', 'Quận 1', 'TP. Thủ Đức', 'Quận 4', 'Quận 3'],
    streets: ['Nguyễn Văn Linh', 'Huỳnh Tấn Phát', 'Bến Vân Đồn', 'Điện Biên Phủ', 'Cách Mạng Tháng 8'],
    description:
      'Công ty công nghệ Việt Nam tập trung vào game, thanh toán, cloud và sản phẩm số.',
    sizeBase: 1400,
    website: 'https://vng.com.vn',
  },
  {
    brand: 'MoMo',
    industry: 'Fintech và thanh toán điện tử',
    city: 'TP.HCM',
    districts: ['Quận 1', 'Quận 3', 'Quận 10', 'Phú Nhuận', 'TP. Thủ Đức'],
    streets: ['Pasteur', 'Nam Kỳ Khởi Nghĩa', 'Nguyễn Thị Minh Khai', 'Hoàng Văn Thụ', 'Mai Chí Thọ'],
    description:
      'Nền tảng ví điện tử và thanh toán số với hệ thống vận hành quy mô lớn.',
    sizeBase: 980,
    website: 'https://momo.vn',
  },
  {
    brand: 'GHN - Giao Hàng Nhanh',
    industry: 'Logistics và vận chuyển',
    city: 'Hải Phòng',
    districts: ['Lê Chân', 'Ngô Quyền', 'Dương Kinh', 'An Dương', 'Kiến An'],
    streets: ['Cảng Hải Phòng', 'Lạch Tray', 'Tô Hiệu', 'Hồ Sen', 'Trần Nguyên Hãn'],
    description:
      'Mạng lưới logistics và giao nhận phát triển nhanh với đội vận hành trên toàn quốc.',
    sizeBase: 1600,
    website: 'https://ghn.vn',
  },
  {
    brand: 'FPT Software',
    industry: 'Phần mềm và outsourcing',
    city: 'Đà Nẵng',
    districts: ['Ngũ Hành Sơn', 'Hải Châu', 'Liên Chiểu', 'Cẩm Lệ', 'Sơn Trà'],
    streets: ['Võ Chí Công', '2 Tháng 9', 'Nguyễn Văn Linh', 'Lê Duẩn', 'Nguyễn Tất Thành'],
    description:
      'Doanh nghiệp phần mềm phát triển dự án offshore, sản phẩm số và giải pháp doanh nghiệp.',
    sizeBase: 2200,
    website: 'https://fptsoftware.com',
  },
  {
    brand: 'ZaloPay',
    industry: 'Fintech và nền tảng dịch vụ số',
    city: 'Hà Nội',
    districts: ['Ba Đình', 'Cầu Giấy', 'Tây Hồ', 'Đống Đa', 'Thanh Xuân'],
    streets: ['Kim Mã', 'Hoàng Đạo Thúy', 'Lê Văn Lương', 'Tôn Đức Thắng', 'Láng Hạ'],
    description:
      'Nền tảng thanh toán số và dịch vụ tài chính gắn với hệ sinh thái người dùng lớn.',
    sizeBase: 900,
    website: 'https://zalopay.vn',
  },
];

const slugify = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const createAddress = (seed, variantIndex) => {
  const district = seed.districts[variantIndex % seed.districts.length];
  const street = seed.streets[variantIndex % seed.streets.length];
  const streetNumber = 18 + (variantIndex + 1) * 27;

  return `${streetNumber} ${street}, ${district}, ${seed.city}`;
};

const createWebsite = (seed, variant) =>
  `${seed.website.replace(/\/$/, '')}/${variant.unit}`;
const createSeedEmail = (companyName) =>
  `${slugify(companyName)}@seed.jobconnect4students.local`;

const buildMockCompanies = () =>
  COMPANY_SEEDS.flatMap((seed) =>
    COMPANY_VARIANTS.map((variant, variantIndex) => {
      const companyName = `${seed.brand} ${variant.suffix}`;

      return {
        company_name: companyName,
        industry: seed.industry,
        size: seed.sizeBase + variant.sizeOffset,
        address: createAddress(seed, variantIndex),
        website: createWebsite(seed, variant),
        description: `${seed.description} ${variant.description}`,
        email: createSeedEmail(companyName),
        logo: '',
      };
    }),
  );

const buildMockJobs = (companies) =>
  companies.map((company, index) => {
    const template = JOB_TEMPLATES[index % JOB_TEMPLATES.length];
    const deadlineDate = new Date(2026, 4 + (index % 4), 5 + (index % 20));
    const salaryOffset = (index % 6) * 1000000;

    return {
      company_name: company.company_name,
      title: template.title,
      department: template.department,
      job_type: template.job_type,
      min_salary: String(template.min_salary + salaryOffset),
      max_salary: String(template.max_salary + salaryOffset),
      experience: template.experience,
      industry: company.industry,
      location: company.address.split(',').slice(1).join(',').trim(),
      deadline: deadlineDate,
      description: `${template.description} Làm việc tại ${company.company_name} với môi trường chuyên nghiệp và quy trình rõ ràng.`,
      requirements: template.requirements,
      level: template.level,
      status: 'open',
      created_at: new Date(2026, 2 + (index % 3), 10 + (index % 15)),
    };
  });

async function ensureEmployer(
  usersCollection,
  employerCollection,
  company,
  hashedPassword,
  counters,
) {
  let user = await usersCollection.findOne({ email: company.email });

  if (!user) {
    const userPayload = {
      name: company.company_name,
      email: company.email,
      password: hashedPassword,
      dateOfbirth: new Date('1990-01-01'),
      gender: 'other',
      role: 'employer',
      email_verified: true,
      language: 'vi',
      seed_source: SEED_SOURCE,
    };

    const insertUserResult = await usersCollection.insertOne(userPayload);
    user = { _id: insertUserResult.insertedId, ...userPayload };
    counters.insertedUsers += 1;
  } else {
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          name: company.company_name,
          role: 'employer',
          email_verified: true,
          language: 'vi',
          seed_source: SEED_SOURCE,
        },
      },
    );
  }

  const employerPayload = {
    user_id: user._id,
    company_name: company.company_name,
    description: company.description,
    size: company.size,
    industry: company.industry,
    address: company.address,
    email: company.email,
    website: company.website,
    logo: company.logo,
    seed_source: SEED_SOURCE,
  };

  const existingEmployer = await employerCollection.findOne({
    company_name: company.company_name,
  });

  if (existingEmployer) {
    await employerCollection.updateOne(
      { _id: existingEmployer._id },
      { $set: employerPayload },
    );
    counters.updatedEmployers += 1;

    return {
      ...existingEmployer,
      ...employerPayload,
      _id: existingEmployer._id,
    };
  }

  const insertEmployerResult = await employerCollection.insertOne(employerPayload);
  counters.insertedEmployers += 1;

  return {
    _id: insertEmployerResult.insertedId,
    ...employerPayload,
  };
}

async function seedMockData() {
  const client = new MongoClient(uri);
  const counters = {
    insertedUsers: 0,
    insertedEmployers: 0,
    updatedEmployers: 0,
    insertedJobs: 0,
    skippedJobs: 0,
    updatedJobs: 0,
  };

  const companies = buildMockCompanies();
  const jobs = buildMockJobs(companies);

  try {
    await client.connect();

    const db = client.db();
    const usersCollection = db.collection('users');
    const employerCollection = db.collection('employer');
    const jobsCollection = db.collection('jobs');

    const hashedPassword = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 10);
    const employerMap = new Map();

    for (const company of companies) {
      const employer = await ensureEmployer(
        usersCollection,
        employerCollection,
        company,
        hashedPassword,
        counters,
      );

      employerMap.set(company.company_name.toLowerCase(), employer);
    }

    for (const job of jobs) {
      const employer = employerMap.get(job.company_name.toLowerCase());

      if (!employer?.user_id) {
        console.warn(
          `Skip job because employer was not found: ${job.company_name} / ${job.title}`,
        );
        counters.skippedJobs += 1;
        continue;
      }

      const employerUserId =
        employer.user_id instanceof ObjectId
          ? employer.user_id
          : new ObjectId(employer.user_id);

      const jobPayload = {
        employer_id: employerUserId,
        title: job.title,
        description: job.description,
        job_type: job.job_type,
        min_salary: job.min_salary,
        max_salary: job.max_salary,
        location: job.location,
        deadline: job.deadline,
        created_at: job.created_at,
        industry: job.industry,
        department: job.department,
        experience: job.experience,
        requirements: job.requirements,
        level: job.level,
        status: job.status,
        seed_source: SEED_SOURCE,
      };

      const existingJob = await jobsCollection.findOne({
        employer_id: employerUserId,
        title: job.title,
        seed_source: SEED_SOURCE,
      });

      if (existingJob) {
        await jobsCollection.updateOne(
          { _id: existingJob._id },
          { $set: jobPayload },
        );
        counters.updatedJobs += 1;
        continue;
      }

      await jobsCollection.insertOne(jobPayload);

      counters.insertedJobs += 1;
    }

    console.log('Seed completed successfully.');
    console.table(counters);
    console.log(
      `Default password for seeded employer accounts: ${DEFAULT_SEED_PASSWORD}`,
    );
  } catch (error) {
    console.error('Failed to seed mock companies and jobs:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedMockData();
