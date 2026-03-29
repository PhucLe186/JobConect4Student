import AdobeLogo from '~/asset/img/Adobe.png';
import AppleLogo from '~/asset/img/Apple.png';
import AwsLogo from '~/asset/img/AWS.png';
import GoogleLogo from '~/asset/img/Google.png';
import GrabLogo from '~/asset/img/Grab.png';
import IbmLogo from '~/asset/img/IBM.png';
import LgLogo from '~/asset/img/LG.png';
import MbLogo from '~/asset/img/MB.png';
import MicrosoftLogo from '~/asset/img/Microsoft.png';
import NaverLogo from '~/asset/img/Naver.png';
import NecLogo from '~/asset/img/NEC.png';
import NetflixLogo from '~/asset/img/Netflix.png';
import OracleLogo from '~/asset/img/Oracle.png';
import SamsungLogo from '~/asset/img/Samsung.png';
import ShopeeLogo from '~/asset/img/Shopee.png';
import TiktokLogo from '~/asset/img/TikTok.png';
import VisaLogo from '~/asset/img/Visa.png';

const COMPANY_LOGO_KEYWORDS = [
    { pattern: /adobe/i, logo: AdobeLogo },
    { pattern: /apple/i, logo: AppleLogo },
    { pattern: /aws|amazon/i, logo: AwsLogo },
    { pattern: /google/i, logo: GoogleLogo },
    { pattern: /grab/i, logo: GrabLogo },
    { pattern: /ibm/i, logo: IbmLogo },
    { pattern: /\blg\b/i, logo: LgLogo },
    { pattern: /\bmb\b|mb bank|military bank/i, logo: MbLogo },
    { pattern: /microsoft/i, logo: MicrosoftLogo },
    { pattern: /naver/i, logo: NaverLogo },
    { pattern: /nec/i, logo: NecLogo },
    { pattern: /netflix/i, logo: NetflixLogo },
    { pattern: /oracle/i, logo: OracleLogo },
    { pattern: /samsung/i, logo: SamsungLogo },
    { pattern: /shopee/i, logo: ShopeeLogo },
    { pattern: /tiktok/i, logo: TiktokLogo },
    { pattern: /visa/i, logo: VisaLogo },
];

const COMPANY_VARIANTS = [
    {
        suffix: 'Tech Center',
        unit: 'tech-center',
        sizeOffset: 0,
        description: 'Tap trung phat trien san pham web, mobile va he thong noi bo.',
    },
    {
        suffix: 'Digital Hub',
        unit: 'digital-hub',
        sizeOffset: 65,
        description: 'Phat trien cac nen tang so, du lieu va tu dong hoa quy trinh van hanh.',
    },
    {
        suffix: 'Innovation Lab',
        unit: 'innovation-lab',
        sizeOffset: 120,
        description: 'Thu nghiem tinh nang moi, toi uu trai nghiem va xay dung prototype san pham.',
    },
    {
        suffix: 'Operations Office',
        unit: 'operations-office',
        sizeOffset: 180,
        description: 'Dieu phoi van hanh, giam sat chat luong dich vu va ho tro phong ban lien quan.',
    },
    {
        suffix: 'Experience Studio',
        unit: 'experience-studio',
        sizeOffset: 240,
        description: 'Tap trung vao customer experience, design system va tang truong nguoi dung.',
    },
];

const JOB_TEMPLATES = [
    {
        title: 'Frontend React Developer',
        job_type: 'full-time',
        experience: '2 năm',
        level: 'Nhân viên',
        min_salary: 18000000,
        max_salary: 30000000,
        description: 'Phat trien giao dien web, dashboard va cong cu noi bo cho san pham dang tang truong.',
        requirements: 'Thanh thao React, TypeScript, HTML, CSS, REST API va toi uu hieu nang giao dien.',
    },
    {
        title: 'Backend Developer',
        job_type: 'full-time',
        experience: '2 năm',
        level: 'Nhân viên',
        min_salary: 20000000,
        max_salary: 34000000,
        description: 'Xay dung API, service backend va toi uu luong du lieu cho he thong van hanh.',
        requirements: 'Node.js hoac Java, SQL, Redis, API design va kinh nghiem lam viec voi cloud.',
    },
    {
        title: 'Product Designer',
        job_type: 'full-time',
        experience: '1 năm',
        level: 'Nhân viên',
        min_salary: 15000000,
        max_salary: 26000000,
        description: 'Thiet ke luong nguoi dung, wireframe va prototype cho san pham web va mobile.',
        requirements: 'Figma, UX research, design system, prototype va kha nang phoi hop voi dev team.',
    },
    {
        title: 'Data Analyst',
        job_type: 'full-time',
        experience: '1 năm',
        level: 'Nhân viên',
        min_salary: 16000000,
        max_salary: 28000000,
        description: 'Phan tich du lieu, xay dung dashboard va de xuat cai tien dua tren chi so kinh doanh.',
        requirements: 'SQL, Excel, Power BI hoac Tableau, tu duy phan tich va trinh bay du lieu.',
    },
    {
        title: 'QA Automation Engineer',
        job_type: 'full-time',
        experience: '1 năm',
        level: 'Nhân viên',
        min_salary: 17000000,
        max_salary: 29000000,
        description: 'Xay dung bo test automation va bao cao chat luong cho he thong san pham.',
        requirements: 'API testing, Selenium hoac Cypress, bug tracking va quy trinh kiem thu phan mem.',
    },
];

const COMPANY_SEEDS = [
    {
        brand: 'Google Vietnam',
        industry: 'Cong nghe thong tin va nen tang so',
        city: 'TP.HCM',
        districts: ['Quan 1', 'Quan 3', 'Binh Thanh', 'TP. Thu Duc', 'Tan Binh'],
        streets: ['Le Loi', 'Nguyen Hue', 'Ton Duc Thang', 'Dong Khoi', 'Vo Van Kiet'],
        description: 'Doanh nghiep cong nghe quoc te phat trien he sinh thai tim kiem, cloud, du lieu va AI.',
        sizeBase: 1100,
        website: 'https://careers.google.com',
    },
    {
        brand: 'Grab Vietnam',
        industry: 'Cong nghe va van tai so',
        city: 'TP.HCM',
        districts: ['Quan 1', 'Quan 7', 'Phu Nhuan', 'TP. Thu Duc', 'Binh Thanh'],
        streets: ['Nguyen Thi Minh Khai', 'Le Duan', 'Mai Chi Tho', 'Pham Viet Chanh', 'Nam Ky Khoi Nghia'],
        description: 'He sinh thai goi xe, giao nhan va fintech voi doi ngu van hanh va san pham lon.',
        sizeBase: 900,
        website: 'https://www.grab.com/vn',
    },
    {
        brand: 'LG Electronics Vietnam',
        industry: 'Dien tu va thiet bi gia dung',
        city: 'Hai Phong',
        districts: ['Trang Due', 'Le Chan', 'Ngo Quyen', 'An Duong', 'Hong Bang'],
        streets: ['Pham Van Dong', 'Le Hong Phong', 'Ho Sen', 'Tran Nguyen Han', 'Hai Phong Gate'],
        description: 'Phat trien thiet bi thong minh, giai phap dien tu va he thong quan ly san xuat.',
        sizeBase: 1500,
        website: 'https://www.lg.com/vn',
    },
    {
        brand: 'Samsung Vietnam',
        industry: 'Dien tu, thiet bi di dong va ban dan',
        city: 'Bac Ninh',
        districts: ['Yen Phong', 'Tu Son', 'Tien Du', 'Que Vo', 'Bac Ninh City'],
        streets: ['Tran Hung Dao', 'Nguyen Trai', 'Ly Anh Tong', 'Ngo Gia Tu', 'Quoc Lo 18'],
        description: 'Tap doan cong nghe voi trung tam san xuat, R&D va doi ngu van hanh quy mo lon.',
        sizeBase: 2500,
        website: 'https://www.samsung.com/vn',
    },
    {
        brand: 'Microsoft Vietnam',
        industry: 'Phan mem, cloud va AI',
        city: 'Ha Noi',
        districts: ['Ba Dinh', 'Cau Giay', 'Dong Da', 'Nam Tu Liem', 'Hai Ba Trung'],
        streets: ['Lieu Giai', 'Pham Hung', 'Ton That Thuyet', 'Tran Duy Hung', 'Kim Ma'],
        description: 'Cung cap giai phap cloud, nang suat va tu dong hoa cho doanh nghiep tai Viet Nam.',
        sizeBase: 850,
        website: 'https://www.microsoft.com/vi-vn',
    },
    {
        brand: 'Oracle Vietnam',
        industry: 'Cloud, co so du lieu va enterprise software',
        city: 'TP.HCM',
        districts: ['Quan 1', 'Quan 3', 'Quan 4', 'Quan 7', 'TP. Thu Duc'],
        streets: ['Nguyen Du', 'Hai Trieu', 'Pasteur', 'Vo Van Tan', 'Dien Bien Phu'],
        description: 'Tap trung vao cloud infrastructure, co so du lieu va giai phap van hanh doanh nghiep.',
        sizeBase: 760,
        website: 'https://www.oracle.com/vn',
    },
    {
        brand: 'Shopee Vietnam',
        industry: 'Thuong mai dien tu',
        city: 'Ha Noi',
        districts: ['Cau Giay', 'Ba Dinh', 'Hai Ba Trung', 'Dong Da', 'Long Bien'],
        streets: ['Dien Bien Phu', 'Xa Dan', 'Nguyen Chi Thanh', 'Minh Khai', 'Tran Hung Dao'],
        description: 'Nen tang e-commerce lon tap trung vao van hanh seller, buyer va logistics.',
        sizeBase: 1200,
        website: 'https://shopee.vn',
    },
    {
        brand: 'TikTok Vietnam',
        industry: 'Mang xa hoi va noi dung so',
        city: 'TP.HCM',
        districts: ['Quan 1', 'Quan 2', 'Quan 4', 'Quan 7', 'TP. Thu Duc'],
        streets: ['Pasteur', 'Nguyen Binh Khiem', 'Vo Thi Sau', 'Le Thanh Ton', 'Nguyen Huu Canh'],
        description: 'Phat trien nen tang noi dung so, creator tools, ads va giai phap moderation.',
        sizeBase: 980,
        website: 'https://www.tiktok.com',
    },
    {
        brand: 'Naver Vietnam',
        industry: 'Internet service va AI',
        city: 'Da Nang',
        districts: ['Hai Chau', 'Thanh Khe', 'Son Tra', 'Lien Chieu', 'Ngu Hanh Son'],
        streets: ['Nguyen Van Linh', 'Vo Nguyen Giap', 'Tran Phu', 'Bach Dang', '2 Thang 9'],
        description: 'Doanh nghiep internet va AI voi cac doi ky thuat, du lieu va san pham quoc te.',
        sizeBase: 640,
        website: 'https://www.navercorp.com',
    },
    {
        brand: 'NEC Vietnam',
        industry: 'Ha tang CNTT va giai phap doanh nghiep',
        city: 'Ha Noi',
        districts: ['Nam Tu Liem', 'Cau Giay', 'Ba Dinh', 'Thanh Xuan', 'Tay Ho'],
        streets: ['Pham Hung', 'Le Duc Tho', 'To Huu', 'Khuat Duy Tien', 'Nguyen Hoang'],
        description: 'Cung cap giai phap ha tang, quan tri he thong, an ninh va chinh phu so.',
        sizeBase: 700,
        website: 'https://www.nec.com',
    },
    {
        brand: 'IBM Vietnam',
        industry: 'Tu van cong nghe, hybrid cloud va data',
        city: 'TP.HCM',
        districts: ['Quan 1', 'Quan 3', 'Binh Thanh', 'Quan 7', 'TP. Thu Duc'],
        streets: ['Le Thanh Ton', 'Nguyen Hue', 'Cach Mang Thang 8', 'Hoang Van Thu', 'Xa Lo Ha Noi'],
        description: 'Tap trung vao data platform, tu van doanh nghiep va giai phap tu dong hoa.',
        sizeBase: 720,
        website: 'https://www.ibm.com/vn-vi',
    },
    {
        brand: 'MB Bank Digital',
        industry: 'Ngan hang so va fintech',
        city: 'Ha Noi',
        districts: ['Cau Giay', 'Dong Da', 'Ba Dinh', 'Thanh Xuan', 'Hai Ba Trung'],
        streets: ['Le Van Luong', 'Tran Duy Hung', 'Nguyen Tuan', 'Thai Ha', 'Lang Ha'],
        description: 'Khoi cong nghe phat trien ung dung ngan hang so, he thong thanh toan va du lieu.',
        sizeBase: 1300,
        website: 'https://www.mbbank.com.vn',
    },
    {
        brand: 'Techcombank Digital',
        industry: 'Tai chinh va ngan hang',
        city: 'Da Nang',
        districts: ['Hai Chau', 'Son Tra', 'Thanh Khe', 'Cam Le', 'Lien Chieu'],
        streets: ['Nguyen Hue', 'Tran Hung Dao', 'Le Duan', 'Hoang Dieu', 'Pham Van Dong'],
        description: 'Van hanh va phat trien he thong tai chinh so, CRM va trai nghiem khach hang.',
        sizeBase: 880,
        website: 'https://www.techcombank.com',
    },
    {
        brand: 'VNG Corporation',
        industry: 'Cong nghe, game va digital product',
        city: 'TP.HCM',
        districts: ['Quan 7', 'Quan 1', 'TP. Thu Duc', 'Quan 4', 'Quan 3'],
        streets: ['Nguyen Van Linh', 'Huynh Tan Phat', 'Ben Van Don', 'Dien Bien Phu', 'Cach Mang Thang 8'],
        description: 'Cong ty cong nghe Viet Nam tap trung vao game, thanh toan, cloud va san pham so.',
        sizeBase: 1400,
        website: 'https://vng.com.vn',
    },
    {
        brand: 'MoMo',
        industry: 'Fintech va thanh toan dien tu',
        city: 'TP.HCM',
        districts: ['Quan 1', 'Quan 3', 'Quan 10', 'Phu Nhuan', 'TP. Thu Duc'],
        streets: ['Pasteur', 'Nam Ky Khoi Nghia', 'Nguyen Thi Minh Khai', 'Hoang Van Thu', 'Mai Chi Tho'],
        description: 'Nen tang vi dien tu va thanh toan so voi he thong van hanh quy mo lon.',
        sizeBase: 980,
        website: 'https://momo.vn',
    },
    {
        brand: 'GHN - Giao Hang Nhanh',
        industry: 'Logistics va van chuyen',
        city: 'Hai Phong',
        districts: ['Le Chan', 'Ngo Quyen', 'Duong Kinh', 'An Duong', 'Kien An'],
        streets: ['Hai Phong Port', 'Lach Tray', 'To Hieu', 'Ho Sen', 'Tran Nguyen Han'],
        description: 'Mang luoi logistics va giao nhan phat trien nhanh voi doi van hanh tren toan quoc.',
        sizeBase: 1600,
        website: 'https://ghn.vn',
    },
    {
        brand: 'FPT Software',
        industry: 'Phan mem va outsourcing',
        city: 'Da Nang',
        districts: ['Ngu Hanh Son', 'Hai Chau', 'Lien Chieu', 'Cam Le', 'Son Tra'],
        streets: ['Vo Chi Cong', '2 Thang 9', 'Nguyen Van Linh', 'Le Duan', 'Nguyen Tat Thanh'],
        description: 'Doanh nghiep phan mem phat trien du an offshore, san pham so va giai phap doanh nghiep.',
        sizeBase: 2200,
        website: 'https://fptsoftware.com',
    },
    {
        brand: 'ZaloPay',
        industry: 'Fintech va nen tang dich vu so',
        city: 'Ha Noi',
        districts: ['Ba Dinh', 'Cau Giay', 'Tay Ho', 'Dong Da', 'Thanh Xuan'],
        streets: ['Kim Ma', 'Hoang Dao Thuy', 'Le Van Luong', 'Ton Duc Thang', 'Lang Ha'],
        description: 'Nen tang thanh toan so va dich vu tai chinh gan voi he sinh thai nguoi dung lon.',
        sizeBase: 900,
        website: 'https://zalopay.vn',
    },
];

const toNumber = (value, fallback = 0) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const slugify = (value = '') =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const formatCurrency = (value) =>
    toNumber(value).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    });

const createInitials = (name = 'Company') => {
    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);

    if (words.length === 0) {
        return 'C';
    }

    return words.map((word) => word.charAt(0).toUpperCase()).join('');
};

export const createCompanyPlaceholder = (name = 'Company') => {
    const initials = createInitials(name);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
            <rect width="96" height="96" rx="18" fill="#eef5ff"/>
            <rect x="6" y="6" width="84" height="84" rx="16" fill="#dcecff"/>
            <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
                fill="#0b63ce" font-family="Arial, sans-serif" font-size="28" font-weight="700">${initials}</text>
        </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getCompanyLogo = (companyName = '', providedLogo = '') => {
    const matchedEntry = COMPANY_LOGO_KEYWORDS.find((entry) => entry.pattern.test(companyName));
    if (matchedEntry?.logo) {
        return matchedEntry.logo;
    }

    if (providedLogo && typeof providedLogo === 'string' && providedLogo.trim()) {
        return providedLogo.trim();
    }

    return createCompanyPlaceholder(companyName);
};

const createCompanyId = (name) => `mock-company-${slugify(name)}`;

const createJobId = (name) => `mock-job-${slugify(name)}`;

const createAddress = (seed, variantIndex) => {
    const district = seed.districts[variantIndex % seed.districts.length];
    const street = seed.streets[variantIndex % seed.streets.length];
    const streetNumber = 18 + (variantIndex + 1) * 27;

    return `${streetNumber} ${street}, ${district}, ${seed.city}`;
};

const createWebsite = (seed, variant) => `${seed.website.replace(/\/$/, '')}/${variant.unit}`;

const buildMockCompanies = () =>
    COMPANY_SEEDS.flatMap((seed) =>
        COMPANY_VARIANTS.map((variant, variantIndex) => {
            const companyName = `${seed.brand} ${variant.suffix}`;

            return {
                _id: createCompanyId(companyName),
                company_name: companyName,
                industry: seed.industry,
                size: seed.sizeBase + variant.sizeOffset,
                address: createAddress(seed, variantIndex),
                website: createWebsite(seed, variant),
                description: `${seed.description} ${variant.description}`,
                logo: getCompanyLogo(companyName),
            };
        }),
    );

const buildMockJobs = (companies) =>
    companies.map((company, index) => {
        const template = JOB_TEMPLATES[index % JOB_TEMPLATES.length];
        const deadlineDate = new Date(2026, 4 + (index % 4), 5 + (index % 20));
        const salaryOffset = (index % 6) * 1000000;

        return {
            id: createJobId(`${company.company_name}-${template.title}`),
            employer_id: company._id,
            title: template.title,
            company_name: company.company_name,
            location: company.address.split(',').slice(1).join(',').trim(),
            job_type: template.job_type,
            min_salary: String(template.min_salary + salaryOffset),
            max_salary: String(template.max_salary + salaryOffset),
            experience: template.experience,
            industry: company.industry,
            deadline: deadlineDate.toISOString().slice(0, 10),
            description: `${template.description} Lam viec tai ${company.company_name} voi moi truong chuyen nghiep va quy trinh ro rang.`,
            requirements: template.requirements,
            level: template.level,
            status: 'open',
            logo: company.logo,
        };
    });

export const MOCK_COMPANIES = buildMockCompanies();
export const MOCK_JOBS = buildMockJobs(MOCK_COMPANIES);

export const normalizeCompany = (company = {}) => {
    const companyName = company.company_name || company.name || 'Cong ty dang cap nhat';
    const size = toNumber(company.size, 0);
    const description = company.description || 'Cong ty dang cap nhat thong tin gioi thieu.';

    return {
        ...company,
        _id: company._id || createCompanyId(companyName),
        company_name: companyName,
        description,
        industry: company.industry || 'Dang cap nhat linh vuc hoat dong',
        address: company.address || 'Dang cap nhat dia chi',
        website: company.website || '',
        size,
        sizeLabel: size > 0 ? `${size}+ nhan su` : 'Dang cap nhat quy mo',
        shortDescription: description.slice(0, 120) + (description.length > 120 ? '...' : ''),
        logo: getCompanyLogo(companyName, company.logo),
    };
};

export const normalizeJob = (job = {}) => {
    const companyName = job.company_name || job.company || 'Cong ty dang cap nhat';
    const minSalary = toNumber(job.min_salary || job.salaryMin, 0);
    const maxSalary = toNumber(job.max_salary || job.salaryMax, 0);
    const location = job.location || [job.district, job.province].filter(Boolean).join(', ') || 'Dang cap nhat dia diem';
    const jobType = job.job_type || job.jobType || 'full-time';
    const salaryLabel =
        minSalary > 0 || maxSalary > 0
            ? `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary || minSalary)}`
            : 'Thuong luong';

    return {
        ...job,
        id: job.id || job._id || createJobId(`${companyName}-${job.title || 'vi-tri'}`),
        employer_id: job.employer_id || '',
        company_name: companyName,
        location,
        job_type: jobType,
        min_salary: String(minSalary || ''),
        max_salary: String(maxSalary || ''),
        experience: job.experience || 'không yêu cầu',
        industry: job.industry || 'Dang cap nhat',
        deadline: job.deadline || '',
        requirements: job.requirements || '',
        description: job.description || 'Dang cap nhat mo ta cong viec.',
        logo: getCompanyLogo(companyName, job.logo),
        salaryLabel,
        typeLabel:
            jobType === 'part-time'
                ? 'Part-time'
                : jobType === 'internship'
                  ? 'Internship'
                  : 'Full-time',
        deadlineLabel: job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Dang cap nhat',
    };
};

export const mergeCompanies = (apiCompanies = []) => {
    const normalizedApiCompanies = apiCompanies.map(normalizeCompany);
    const apiCompanyNames = new Set(normalizedApiCompanies.map((company) => company.company_name.toLowerCase()));
    const extraCompanies = MOCK_COMPANIES.map(normalizeCompany).filter(
        (company) => !apiCompanyNames.has(company.company_name.toLowerCase()),
    );

    return [...normalizedApiCompanies, ...extraCompanies];
};

export const mergeJobs = (apiJobs = []) => {
    const normalizedApiJobs = apiJobs.map(normalizeJob);
    const apiJobKeys = new Set(
        normalizedApiJobs.map((job) => `${job.company_name.toLowerCase()}::${job.title.toLowerCase()}`),
    );
    const extraJobs = MOCK_JOBS.map(normalizeJob).filter(
        (job) => !apiJobKeys.has(`${job.company_name.toLowerCase()}::${job.title.toLowerCase()}`),
    );

    return [...normalizedApiJobs, ...extraJobs];
};
