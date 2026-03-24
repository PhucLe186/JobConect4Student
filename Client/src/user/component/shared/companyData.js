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

const toNumber = (value, fallback = 0) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

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

const createCompanyId = (name) =>
    `mock-company-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;

const createJobId = (name) =>
    `mock-job-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;

export const MOCK_COMPANIES = [
    {
        _id: createCompanyId('Google Vietnam'),
        company_name: 'Google Vietnam',
        industry: 'Cong nghe thong tin va nen tang so',
        size: 1200,
        address: 'Toa nha Deutsches Haus, Quan 1, TP.HCM',
        website: 'https://about.google',
        description: 'Van hanh nhieu san pham tim kiem, ban do, cloud va giai phap AI cho thi truong Viet Nam.',
    },
    {
        _id: createCompanyId('Grab Vietnam'),
        company_name: 'Grab Vietnam',
        industry: 'Cong nghe, giao nhan va fintech',
        size: 1800,
        address: 'Mapletree Business Centre, TP. Thu Duc, TP.HCM',
        website: 'https://www.grab.com/vn',
        description: 'Phat trien he sinh thai giao thong, giao hang, thanh toan va dich vu so tai Dong Nam A.',
    },
    {
        _id: createCompanyId('LG Electronics Vietnam'),
        company_name: 'LG Electronics Vietnam',
        industry: 'Dien tu va thiet bi gia dung',
        size: 2400,
        address: 'Khu cong nghiep Trang Due, Hai Phong',
        website: 'https://www.lg.com/vn',
        description: 'San xuat va phat trien cac dong san pham gia dung, man hinh, giai tri va thiet bi thong minh.',
    },
    {
        _id: createCompanyId('Samsung Vietnam'),
        company_name: 'Samsung Vietnam',
        industry: 'Dien tu, thiet bi di dong va ban dan',
        size: 5000,
        address: 'Khu cong nghiep Yen Phong, Bac Ninh',
        website: 'https://www.samsung.com/vn',
        description: 'Tap doan cong nghe toan cau voi cac trung tam san xuat, R&D va van hanh quy mo lon tai Viet Nam.',
    },
    {
        _id: createCompanyId('Microsoft Vietnam'),
        company_name: 'Microsoft Vietnam',
        industry: 'Phan mem, cloud va AI',
        size: 950,
        address: 'Capital Place, Ba Dinh, Ha Noi',
        website: 'https://www.microsoft.com/vi-vn',
        description: 'Cung cap giai phap doanh nghiep, cloud Azure va cong cu nang suat cho nhieu to chuc tai Viet Nam.',
    },
    {
        _id: createCompanyId('Oracle Vietnam'),
        company_name: 'Oracle Vietnam',
        industry: 'Cloud, co so du lieu va enterprise software',
        size: 700,
        address: 'Bitexco Financial Tower, Quan 1, TP.HCM',
        website: 'https://www.oracle.com/vn',
        description: 'Chuyen ve co so du lieu, cloud infrastructure va cac ung dung quan tri doanh nghiep.',
    },
    {
        _id: createCompanyId('Shopee Vietnam'),
        company_name: 'Shopee Vietnam',
        industry: 'Thuong mai dien tu',
        size: 2200,
        address: 'Saigon Centre, Quan 1, TP.HCM',
        website: 'https://shopee.vn',
        description: 'Nen tang e-commerce lon voi cac doi ngu san pham, du lieu, van hanh va marketing tang truong nhanh.',
    },
    {
        _id: createCompanyId('TikTok Vietnam'),
        company_name: 'TikTok Vietnam',
        industry: 'Mang xa hoi va noi dung so',
        size: 1300,
        address: 'The Hallmark, TP. Thu Duc, TP.HCM',
        website: 'https://www.tiktok.com',
        description: 'Nen tang video ngan toan cau voi cac nhom creator growth, ads, moderation va engineering.',
    },
    {
        _id: createCompanyId('Naver Vietnam'),
        company_name: 'Naver Vietnam',
        industry: 'Internet service va AI',
        size: 650,
        address: 'Da Nang Software Park, Da Nang',
        website: 'https://www.navercorp.com',
        description: 'Phat trien cac nen tang tim kiem, cloud, AI va dich vu internet cho thi truong quoc te.',
    },
    {
        _id: createCompanyId('NEC Vietnam'),
        company_name: 'NEC Vietnam',
        industry: 'Ha tang CNTT va giai phap doanh nghiep',
        size: 780,
        address: 'Keangnam Landmark, Nam Tu Liem, Ha Noi',
        website: 'https://www.nec.com',
        description: 'Tap trung vao ha tang he thong, giai phap chinh phu so, bao mat va van hanh doanh nghiep.',
    },
    {
        _id: createCompanyId('IBM Vietnam'),
        company_name: 'IBM Vietnam',
        industry: 'Tu van cong nghe, hybrid cloud va data',
        size: 860,
        address: 'The Nexus, Quan 1, TP.HCM',
        website: 'https://www.ibm.com/vn-vi',
        description: 'Cung cap giai phap data, automation, consulting va cloud cho doanh nghiep lon.',
    },
    {
        _id: createCompanyId('MB Bank Digital'),
        company_name: 'MB Bank Digital',
        industry: 'Ngan hang so va fintech',
        size: 1600,
        address: 'Le Van Luong, Cau Giay, Ha Noi',
        website: 'https://www.mbbank.com.vn',
        description: 'Khoi cong nghe cua MB Bank tap trung vao mobile banking, core services, du lieu va bao mat.',
    },
];

export const MOCK_JOBS = [
    {
        id: createJobId('Frontend React Developer Google Vietnam'),
        employer_id: createCompanyId('Google Vietnam'),
        title: 'Frontend React Developer',
        company_name: 'Google Vietnam',
        location: 'TP.HCM',
        job_type: 'full-time',
        min_salary: '22000000',
        max_salary: '35000000',
        experience: '2 năm',
        industry: 'Cong nghe thong tin va nen tang so',
        deadline: '2026-06-30',
        description: 'Phat trien giao dien web, dashboard va cong cu noi bo cho cac san pham quy mo lon.',
        requirements: 'Thanh thao React, TypeScript, HTML, CSS, REST API va toi uu hieu nang giao dien.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Product Designer Grab Vietnam'),
        employer_id: createCompanyId('Grab Vietnam'),
        title: 'Product Designer',
        company_name: 'Grab Vietnam',
        location: 'TP.HCM',
        job_type: 'full-time',
        min_salary: '18000000',
        max_salary: '28000000',
        experience: '2 năm',
        industry: 'Cong nghe, giao nhan va fintech',
        deadline: '2026-07-05',
        description: 'Thiet ke luong nguoi dung cho ung dung di dong va nen tang merchant.',
        requirements: 'Figma, design system, UX research, prototype va tu duy san pham.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('QA Automation Engineer LG Electronics Vietnam'),
        employer_id: createCompanyId('LG Electronics Vietnam'),
        title: 'QA Automation Engineer',
        company_name: 'LG Electronics Vietnam',
        location: 'Hai Phong',
        job_type: 'full-time',
        min_salary: '16000000',
        max_salary: '26000000',
        experience: '1 năm',
        industry: 'Dien tu va thiet bi gia dung',
        deadline: '2026-06-18',
        description: 'Xay dung bo test automation cho he thong quan ly san xuat va dashboard noi bo.',
        requirements: 'Selenium, Cypress, API testing, SQL va bao cao chat luong.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Android Developer Samsung Vietnam'),
        employer_id: createCompanyId('Samsung Vietnam'),
        title: 'Android Developer',
        company_name: 'Samsung Vietnam',
        location: 'Bac Ninh',
        job_type: 'full-time',
        min_salary: '25000000',
        max_salary: '40000000',
        experience: '3 năm',
        industry: 'Dien tu, thiet bi di dong va ban dan',
        deadline: '2026-07-12',
        description: 'Phat trien tinh nang cho ung dung mobile va cong cu he thong noi bo.',
        requirements: 'Kotlin, Java, clean architecture, unit test va toi uu hieu nang.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Cloud Engineer Microsoft Vietnam'),
        employer_id: createCompanyId('Microsoft Vietnam'),
        title: 'Cloud Engineer',
        company_name: 'Microsoft Vietnam',
        location: 'Ha Noi',
        job_type: 'full-time',
        min_salary: '30000000',
        max_salary: '45000000',
        experience: '3 năm',
        industry: 'Phan mem, cloud va AI',
        deadline: '2026-07-20',
        description: 'Van hanh va toi uu ha tang cloud cho cac ung dung doanh nghiep.',
        requirements: 'Azure, Docker, Kubernetes, CI/CD, monitoring va networking.',
        level: 'Trưởng nhóm',
        status: 'open',
    },
    {
        id: createJobId('Database Administrator Oracle Vietnam'),
        employer_id: createCompanyId('Oracle Vietnam'),
        title: 'Database Administrator',
        company_name: 'Oracle Vietnam',
        location: 'TP.HCM',
        job_type: 'full-time',
        min_salary: '28000000',
        max_salary: '42000000',
        experience: '3 năm',
        industry: 'Cloud, co so du lieu va enterprise software',
        deadline: '2026-08-01',
        description: 'Quan tri he thong co so du lieu va ho tro trien khai cho khach hang doanh nghiep.',
        requirements: 'Oracle DB, SQL, performance tuning, backup va shell scripting.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Data Analyst Shopee Vietnam'),
        employer_id: createCompanyId('Shopee Vietnam'),
        title: 'Data Analyst',
        company_name: 'Shopee Vietnam',
        location: 'TP.HCM',
        job_type: 'full-time',
        min_salary: '18000000',
        max_salary: '32000000',
        experience: '1 năm',
        industry: 'Thuong mai dien tu',
        deadline: '2026-06-28',
        description: 'Phan tich hanh vi nguoi dung, dashboard kinh doanh va chi so van hanh.',
        requirements: 'SQL, Excel, Power BI, Python va ky nang trinh bay du lieu.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Content Strategy Associate TikTok Vietnam'),
        employer_id: createCompanyId('TikTok Vietnam'),
        title: 'Content Strategy Associate',
        company_name: 'TikTok Vietnam',
        location: 'TP.HCM',
        job_type: 'full-time',
        min_salary: '15000000',
        max_salary: '25000000',
        experience: '1 năm',
        industry: 'Mang xa hoi va noi dung so',
        deadline: '2026-06-26',
        description: 'Phan tich xu huong noi dung va toi uu chien luoc tang truong creator.',
        requirements: 'Marketing, communication, analytics va van hanh chien dich.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('AI Research Intern Naver Vietnam'),
        employer_id: createCompanyId('Naver Vietnam'),
        title: 'AI Research Intern',
        company_name: 'Naver Vietnam',
        location: 'Da Nang',
        job_type: 'internship',
        min_salary: '6000000',
        max_salary: '10000000',
        experience: 'không yêu cầu',
        industry: 'Internet service va AI',
        deadline: '2026-07-10',
        description: 'Ho tro thu nghiem mo hinh, xu ly du lieu va danh gia ket qua AI.',
        requirements: 'Python, machine learning, data analysis va doc hieu tai lieu tieng Anh.',
        level: 'Thực tập sinh',
        status: 'open',
    },
    {
        id: createJobId('System Engineer NEC Vietnam'),
        employer_id: createCompanyId('NEC Vietnam'),
        title: 'System Engineer',
        company_name: 'NEC Vietnam',
        location: 'Ha Noi',
        job_type: 'full-time',
        min_salary: '17000000',
        max_salary: '29000000',
        experience: '2 năm',
        industry: 'Ha tang CNTT va giai phap doanh nghiep',
        deadline: '2026-07-15',
        description: 'Trien khai ha tang server, quan tri he thong va ho tro du an doanh nghiep.',
        requirements: 'Windows Server, Linux, network, virtualization va troubleshooting.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Business Analyst IBM Vietnam'),
        employer_id: createCompanyId('IBM Vietnam'),
        title: 'Business Analyst',
        company_name: 'IBM Vietnam',
        location: 'TP.HCM',
        job_type: 'full-time',
        min_salary: '20000000',
        max_salary: '34000000',
        experience: '2 năm',
        industry: 'Tu van cong nghe, hybrid cloud va data',
        deadline: '2026-07-18',
        description: 'Lam viec voi stakeholder de mo ta quy trinh, yeu cau va giai phap so hoa.',
        requirements: 'Documentation, stakeholder management, SQL va ky nang phan tich nghiep vu.',
        level: 'Nhân viên',
        status: 'open',
    },
    {
        id: createJobId('Backend Developer MB Bank Digital'),
        employer_id: createCompanyId('MB Bank Digital'),
        title: 'Backend Developer',
        company_name: 'MB Bank Digital',
        location: 'Ha Noi',
        job_type: 'full-time',
        min_salary: '22000000',
        max_salary: '36000000',
        experience: '2 năm',
        industry: 'Ngan hang so va fintech',
        deadline: '2026-07-25',
        description: 'Phat trien microservice cho ung dung ngan hang so va he thong thanh toan.',
        requirements: 'Java hoặc Node.js, Spring Boot hoặc NestJS, Redis, Kafka va SQL.',
        level: 'Nhân viên',
        status: 'open',
    },
];

export const normalizeCompany = (company = {}) => {
    const companyName = company.company_name || company.name || 'Cong ty dang cap nhat';
    const size = toNumber(company.size, 0);

    return {
        ...company,
        _id: company._id || createCompanyId(companyName),
        company_name: companyName,
        description: company.description || 'Cong ty dang cap nhat thong tin gioi thieu.',
        industry: company.industry || 'Dang cap nhat linh vuc hoat dong',
        address: company.address || 'Dang cap nhat dia chi',
        website: company.website || '',
        size,
        sizeLabel: size > 0 ? `${size}+ nhan su` : 'Dang cap nhat quy mo',
        shortDescription:
            (company.description || 'Cong ty dang cap nhat thong tin gioi thieu.').slice(0, 120) +
            ((company.description || '').length > 120 ? '...' : ''),
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
