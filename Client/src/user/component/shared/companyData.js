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
        job_type: 'full-time',
        experience: '2 năm',
        level: 'Nhân viên',
        min_salary: 18000000,
        max_salary: 30000000,
        description: 'Phát triển giao diện web, dashboard và công cụ nội bộ cho các sản phẩm đang tăng trưởng.',
        requirements: 'Thành thạo React, TypeScript, HTML, CSS, REST API và tối ưu hiệu năng giao diện.',
    },
    {
        title: 'Backend Developer',
        job_type: 'full-time',
        experience: '2 năm',
        level: 'Nhân viên',
        min_salary: 20000000,
        max_salary: 34000000,
        description: 'Xây dựng API, service backend và tối ưu luồng dữ liệu cho hệ thống vận hành.',
        requirements: 'Node.js hoặc Java, SQL, Redis, API design và kinh nghiệm làm việc với cloud.',
    },
    {
        title: 'Product Designer',
        job_type: 'full-time',
        experience: '1 năm',
        level: 'Nhân viên',
        min_salary: 15000000,
        max_salary: 26000000,
        description: 'Thiết kế luồng người dùng, wireframe và prototype cho sản phẩm web và mobile.',
        requirements: 'Figma, UX research, design system, prototype và khả năng phối hợp với dev team.',
    },
    {
        title: 'Data Analyst',
        job_type: 'full-time',
        experience: '1 năm',
        level: 'Nhân viên',
        min_salary: 16000000,
        max_salary: 28000000,
        description: 'Phân tích dữ liệu, xây dựng dashboard và đề xuất cải tiến dựa trên chỉ số kinh doanh.',
        requirements: 'SQL, Excel, Power BI hoặc Tableau, tư duy phân tích và trình bày dữ liệu.',
    },
    {
        title: 'QA Automation Engineer',
        job_type: 'full-time',
        experience: '1 năm',
        level: 'Nhân viên',
        min_salary: 17000000,
        max_salary: 29000000,
        description: 'Xây dựng bộ test automation và báo cáo chất lượng cho hệ thống sản phẩm.',
        requirements: 'API testing, Selenium hoặc Cypress, bug tracking và quy trình kiểm thử phần mềm.',
    },
];

const COMPANY_SEEDS = [
    {
        brand: 'Google Vietnam',
        industry: 'Công nghệ thông tin và nền tảng số',
        city: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 3', 'Bình Thạnh', 'TP. Thủ Đức', 'Tân Bình'],
        streets: ['Lê Lợi', 'Nguyễn Huệ', 'Tôn Đức Thắng', 'Đồng Khởi', 'Võ Văn Kiệt'],
        description: 'Doanh nghiệp công nghệ quốc tế phát triển hệ sinh thái tìm kiếm, cloud, dữ liệu và AI.',
        sizeBase: 1100,
        website: 'https://careers.google.com',
    },
    {
        brand: 'Grab Vietnam',
        industry: 'Công nghệ và vận tải số',
        city: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 7', 'Phú Nhuận', 'TP. Thủ Đức', 'Bình Thạnh'],
        streets: ['Nguyễn Thị Minh Khai', 'Lê Duẩn', 'Mai Chí Thọ', 'Phạm Viết Chánh', 'Nam Kỳ Khởi Nghĩa'],
        description: 'Hệ sinh thái gọi xe, giao nhận và fintech với đội ngũ vận hành và sản phẩm lớn.',
        sizeBase: 900,
        website: 'https://www.grab.com/vn',
    },
    {
        brand: 'LG Electronics Vietnam',
        industry: 'Điện tử và thiết bị gia dụng',
        city: 'Hải Phòng',
        districts: ['Tràng Duệ', 'Lê Chân', 'Ngô Quyền', 'An Dương', 'Hồng Bàng'],
        streets: ['Phạm Văn Đồng', 'Lê Hồng Phong', 'Hồ Sen', 'Trần Nguyên Hãn', 'Hải Phòng Gate'],
        description: 'Phát triển thiết bị thông minh, giải pháp điện tử và hệ thống quản lý sản xuất.',
        sizeBase: 1500,
        website: 'https://www.lg.com/vn',
    },
    {
        brand: 'Samsung Vietnam',
        industry: 'Điện tử, thiết bị di động và bán dẫn',
        city: 'Bac Ninh',
        districts: ['Yen Phong', 'Tu Son', 'Tien Du', 'Que Vo', 'Bac Ninh City'],
        streets: ['Trần Hưng Đạo', 'Nguyễn Trãi', 'Lý Anh Tông', 'Ngô Gia Tự', 'Quốc Lộ 18'],
        description: 'Tập đoàn công nghệ với trung tâm sản xuất, R&D và đội ngũ vận hành quy mô lớn.',
        sizeBase: 2500,
        website: 'https://www.samsung.com/vn',
    },
    {
        brand: 'Microsoft Vietnam',
        industry: 'Phần mềm, cloud và AI',
        city: 'Hà Nội',
        districts: ['Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Nam Từ Liêm', 'Hai Bà Trưng'],
        streets: ['Liễu Giai', 'Phạm Hùng', 'Tôn Thất Thuyết', 'Trần Duy Hưng', 'Kim Mã'],
        description: 'Cung cấp giải pháp cloud, năng suất và tự động hóa cho doanh nghiệp tại Việt Nam.',
        sizeBase: 850,
        website: 'https://www.microsoft.com/vi-vn',
    },
    {
        brand: 'Oracle Vietnam',
        industry: 'Cloud, cơ sở dữ liệu và enterprise software',
        city: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 7', 'TP. Thủ Đức'],
        streets: ['Nguyễn Du', 'Hai Bà Trưng', 'Pasteur', 'Võ Văn Tần', 'Điện Biên Phủ'],
        description: 'Tập trung vào cloud infrastructure, cơ sở dữ liệu và giải pháp vận hành doanh nghiệp.',
        sizeBase: 760,
        website: 'https://www.oracle.com/vn',
    },
    {
        brand: 'Shopee Vietnam',
        industry: 'Thương mại điện tử',
        city: 'Hà Nội',
        districts: ['Cầu Giấy', 'Ba Đình', 'Hai Bà Trưng', 'Đống Đa', 'Long Biên'],
        streets: ['Điện Biên Phủ', 'Xã Đàn', 'Nguyễn Chí Thanh', 'Minh Khai', 'Trần Hưng Đạo'],
        description: 'Nền tảng e-commerce lớn tập trung vào vận hành seller, buyer và logistics.',
        sizeBase: 1200,
        website: 'https://shopee.vn',
    },
    {
        brand: 'TikTok Vietnam',
        industry: 'Mạng xã hội và nội dung số',
        city: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 2', 'Quận 4', 'Quận 7', 'TP. Thủ Đức'],
        streets: ['Pasteur', 'Nguyễn Bỉnh Khiêm', 'Võ Thị Sáu', 'Lê Thánh Tôn', 'Nguyễn Hữu Cảnh'],
        description: 'Phát triển nền tảng nội dung số, creator tools, ads và giải pháp moderation.',
        sizeBase: 980,
        website: 'https://www.tiktok.com',
    },
    {
        brand: 'Naver Vietnam',
        industry: 'Internet service và AI',
        city: 'Đà Nẵng',
        districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Liên Chiểu', 'Ngũ Hành Sơn'],
        streets: ['Nguyễn Văn Linh', 'Võ Nguyên Giáp', 'Trần Phú', 'Bạch Đằng', '2 Tháng 9'],
        description: 'Doanh nghiệp internet và AI với các đội kỹ thuật, dữ liệu và sản phẩm quốc tế.',
        sizeBase: 640,
        website: 'https://www.navercorp.com',
    },
    {
        brand: 'NEC Vietnam',
        industry: 'Hạ tầng CNTT và giải pháp doanh nghiệp',
        city: 'Hà Nội',
        districts: ['Nam Từ Liêm', 'Cầu Giấy', 'Ba Đình', 'Thanh Xuân', 'Tây Hồ'],
        streets: ['Phạm Hùng', 'Lê Đức Thọ', 'Tố Hữu', 'Khuất Duy Tiến', 'Nguyễn Hoàng'],
        description: 'Cung cấp giải pháp hạ tầng, quản trị hệ thống, an ninh và chính phủ số.',
        sizeBase: 700,
        website: 'https://www.nec.com',
    },
    {
        brand: 'IBM Vietnam',
        industry: 'Tư vấn công nghệ, hybrid cloud và data',
        city: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 3', 'Bình Thạnh', 'Quận 7', 'TP. Thủ Đức'],
        streets: ['Lê Thánh Tôn', 'Nguyễn Huệ', 'Cách Mạng Tháng 8', 'Hoàng Văn Thụ', 'Xa Lộ Hà Nội'],
        description: 'Tập trung vào data platform, tư vấn doanh nghiệp và giải pháp tự động hóa.',
        sizeBase: 720,
        website: 'https://www.ibm.com/vn-vi',
    },
    {
        brand: 'MB Bank Digital',
        industry: 'Ngân hàng số và fintech',
        city: 'Hà Nội',
        districts: ['Cầu Giấy', 'Đống Đa', 'Ba Đình', 'Thanh Xuân', 'Hai Bà Trưng'],
        streets: ['Lê Văn Lương', 'Trần Duy Hưng', 'Nguyễn Tuân', 'Thái Hà', 'Láng Hạ'],
        description: 'Khối công nghệ phát triển ứng dụng ngân hàng số, hệ thống thanh toán và dữ liệu.',
        sizeBase: 1300,
        website: 'https://www.mbbank.com.vn',
    },
    {
        brand: 'Techcombank Digital',
        industry: 'Tài chính và ngân hàng',
        city: 'Đà Nẵng',
        districts: ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Cẩm Lệ', 'Liên Chiểu'],
        streets: ['Nguyễn Huệ', 'Trần Hưng Đạo', 'Lê Duẩn', 'Hoàng Diệu', 'Phạm Văn Đồng'],
        description: 'Vận hành và phát triển hệ thống tài chính số, CRM và trải nghiệm khách hàng.',
        sizeBase: 880,
        website: 'https://www.techcombank.com',
    },
    {
        brand: 'VNG Corporation',
        industry: 'Công nghệ, game và digital product',
        city: 'Hồ Chí Minh',
        districts: ['Quận 7', 'Quận 1', 'TP. Thủ Đức', 'Quận 4', 'Quận 3'],
        streets: ['Nguyễn Văn Linh', 'Huỳnh Tấn Phát', 'Bến Vân Đồn', 'Điện Biên Phủ', 'Cách Mạng Tháng 8'],
        description: 'Công ty công nghệ Việt Nam tập trung vào game, thanh toán, cloud và sản phẩm số.',
        sizeBase: 1400,
        website: 'https://vng.com.vn',
    },
    {
        brand: 'MoMo',
        industry: 'Fintech và thanh toán điện tử',
        city: 'Hồ Chí Minh',
        districts: ['Quận 1', 'Quận 3', 'Quận 10', 'Phú Nhuận', 'TP. Thủ Đức'],
        streets: ['Pasteur', 'Nam Kỳ Khởi Nghĩa', 'Nguyễn Thị Minh Khai', 'Hoàng Văn Thụ', 'Mai Chí Thọ'],
        description: 'Nền tảng ví điện tử và thanh toán số với hệ thống vận hành quy mô lớn.',
        sizeBase: 980,
        website: 'https://momo.vn',
    },
    {
        brand: 'GHN - Giao Hàng Nhanh',
        industry: 'Logistics và vận chuyển',
        city: 'Hải Phòng',
        districts: ['Lê Chân', 'Ngô Quyền', 'Dương Kinh', 'An Dương', 'Kiến An'],
        streets: ['Hải Phòng Port', 'Lạch Tray', 'Tô Hiệu', 'Hồ Sen', 'Trần Nguyên Hãn'],
        description: 'Mạng lưới logistics và giao nhận phát triển nhanh với đội vận hành trên toàn quốc.',
        sizeBase: 1600,
        website: 'https://ghn.vn',
    },
    {
        brand: 'FPT Software',
        industry: 'Phần mềm và outsourcing',
        city: 'Đà Nẵng',
        districts: ['Ngũ Hành Sơn', 'Hải Châu', 'Liên Chiểu', 'Cẩm Lệ', 'Sơn Trà'],
        streets: ['Võ Chí Công', '2 Tháng 9', 'Nguyễn Văn Linh', 'Lê Duẩn', 'Nguyễn Tất Thành'],
        description: 'Doanh nghiệp phần mềm phát triển dự án offshore, sản phẩm số và giải pháp doanh nghiệp.',
        sizeBase: 2200,
        website: 'https://fptsoftware.com',
    },
    {
        brand: 'ZaloPay',
        industry: 'Fintech và nền tảng dịch vụ số',
        city: 'Hà Nội',
        districts: ['Ba Đình', 'Cầu Giấy', 'Tây Hồ', 'Đống Đa', 'Thanh Xuân'],
        streets: ['Kim Mã', 'Hoàng Đạo Thúy', 'Lê Văn Lương', 'Tôn Đức Thắng', 'Láng Hạ'],
        description: 'Nền tảng thanh toán số và dịch vụ tài chính gắn với hệ sinh thái người dùng lớn.',
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

const formatCurrency = (value) => {
    const num = toNumber(value);
    if (num === 0) return 'Thương lượng';
    
    // Format với dấu phẩy và đơn vị triệu
    if (num >= 1000000) {
        const millions = num / 1000000;
        return `${millions.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} triệu`;
    }
    
    return num.toLocaleString('vi-VN') + ' đ';
};

const createInitials = (name = 'Company') => {
    const words = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

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

const createContactPhone = (index) => `0${900000000 + index}`;

const createWorkingHours = (jobType) => {
    if (jobType === 'part-time') {
        return 'Linh hoat theo ca: Thứ 2 - Thứ 7, 18:00 - 22:00';
    }

    return 'Thứ 2 - Thứ 6, 8:30 - 17:30';
};

const getDefaultPhoneByLocation = (location = '') => {
    const normalizedLocation = String(location)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\u0111/g, 'd');

    if (normalizedLocation.includes('tp.hcm') || normalizedLocation.includes('ho chi minh')) {
        return '028 7300 6868';
    }

    if (normalizedLocation.includes('ha noi')) {
        return '024 7300 6868';
    }

    if (normalizedLocation.includes('da nang')) {
        return '0236 7300 6868';
    }

    return '0901 686 868';
};

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
            description: `${template.description} Làm việc tại ${company.company_name} với môi trường chuyên nghiệp và quy trình rõ ràng.`,
            requirements: template.requirements,
            level: template.level,
            phone: createContactPhone(index),
            workingHours: createWorkingHours(template.job_type),
            status: 'open',
            logo: company.logo,
        };
    });

export const MOCK_COMPANIES = buildMockCompanies();
export const MOCK_JOBS = buildMockJobs(MOCK_COMPANIES);

export const normalizeCompany = (company = {}) => {
    const companyName = company.company_name || company.name || 'Công ty đang cập nhật';
    const size = toNumber(company.size, 0);
    const description = company.description || 'Công ty đang cập nhật thông tin giới thiệu.';

    return {
        ...company,
        _id: company._id || createCompanyId(companyName),
        company_name: companyName,
        description,
        industry: company.industry || 'Đang cập nhật lĩnh vực hoạt động',
        address: company.address || 'Đang cập nhật địa chỉ',
        website: company.website || '',
        size,
        sizeLabel: size > 0 ? `${size}+ nhân sự` : 'Đang cập nhật quy mô',
        shortDescription: description.slice(0, 120) + (description.length > 120 ? '...' : ''),
        logo: getCompanyLogo(companyName, company.logo),
    };
};

export const normalizeJob = (job = {}) => {
    const companyName = job.company_name || job.company || 'Công ty đang cập nhật';
    const minSalary = toNumber(job.min_salary || job.salaryMin, 0);
    const maxSalary = toNumber(job.max_salary || job.salaryMax, 0);
    const location =
        job.location || [job.district, job.province].filter(Boolean).join(', ') || 'Đang cập nhật địa điểm';
    const jobType = job.job_type || job.jobType || 'full-time';
    const salaryLabel =
        minSalary > 0 || maxSalary > 0
            ? minSalary > 0 && maxSalary > 0 && minSalary !== maxSalary
                ? `${formatCurrency(minSalary)} - ${formatCurrency(maxSalary)}`
                : formatCurrency(maxSalary || minSalary)
            : 'Thương lượng';

    return {
        ...job,
        id: job.id || job._id || createJobId(`${companyName}-${job.title || 'vi-tri'}`),
        employer_id: job.employer_id || '',
        company_name: companyName,
        location,
        job_type: jobType,
        min_salary: String(minSalary || ''),
        max_salary: String(maxSalary || ''),
        phone: job.phone || getDefaultPhoneByLocation(location),
        workingHours: job.workingHours || createWorkingHours(jobType),
        experience: job.experience || 'không yêu cầu',
        industry: job.industry || 'Đang cập nhật',
        deadline: job.deadline || '',
        requirements: job.requirements || '',
        description: job.description || 'Đang cập nhật mô tả công việc.',
        logo: getCompanyLogo(companyName, job.logo),
        salaryLabel,
        typeLabel: jobType === 'part-time' ? 'Part-time' : jobType === 'internship' ? 'Internship' : 'Full-time',
        deadlineLabel: job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Đang cập nhật',
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
