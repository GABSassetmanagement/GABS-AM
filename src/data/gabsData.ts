export interface StatItem {
  label: string;
  value: string;
  sublabel: string;
  prefix?: string;
  numericTarget: number;
  numericStart?: number;
  suffix?: string;
  decimals?: number;
}

export interface BlogArticle {
  id: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  fullContent: string[];
  keyTakeaways: string[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  productTag: string;
}

export interface ProductItem {
  step: string;
  id: string;
  title: string;
  positioning: string;
  description: string;
  extendedCopy: string;
  highlights: {
    label: string;
    value: string;
  }[];
  accentColor: 'blue' | 'emerald' | 'gold';
}

export interface StrategyInstrument {
  step: string;
  name: string;
  category: string;
  description: string;
}

export interface ServiceItem {
  step: string;
  title: string;
  tagline: string;
  description: string;
  accent: 'blue' | 'emerald';
}

export interface LeaderProfile {
  id: string;
  name: string;
  credentials?: string;
  role: string;
  group: 'board' | 'management';
  shortBio: string;
  fullBio: string[];
  specialties: string[];
  initials: string;
  imageUrl: string;
  accentTone: 'blue' | 'emerald' | 'gold';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const PARTNER_INSTITUTIONS = [
  {
    name: 'Securities & Exchange Commission',
    shortName: 'SEC Nigeria',
    role: 'Primary Regulator',
  },
  {
    name: 'Fund Managers Association of Nigeria',
    shortName: 'FMAN',
    role: 'Industry Association',
  },
  {
    name: 'Zenith Nominees Limited',
    shortName: 'ZENITH NOMINEES',
    role: 'Custodian Partner',
  },
  {
    name: 'FBNQuest Merchant Bank',
    shortName: 'FBNQuest',
    role: 'Merchant Banking Partner',
  },
  {
    name: 'Strengths Africa',
    shortName: 'STRENGTHS Africa',
    role: 'Strategic Partner',
  },
];

export const VERITAAS_STATS: StatItem[] = [
  {
    label: '5-Year Projected Assets Under Management',
    value: 'NGN 1T+',
    sublabel: 'Targeting Top 5 Portfolio Management Ranking in Nigeria',
    prefix: 'NGN ',
    numericTarget: 1,
    numericStart: 0.1,
    suffix: 'T+',
    decimals: 1,
  },
  {
    label: 'Minimum Subscription — GABS Time Classic',
    value: 'NGN 1M',
    sublabel: 'One Million Naira Only for Safe Structured Deposits',
    prefix: 'NGN ',
    numericTarget: 1,
    numericStart: 10,
    suffix: 'M',
    decimals: 0,
  },
  {
    label: 'Flexible Investment Tenures',
    value: '6–36 Mos',
    sublabel: 'Tailored Duration Aligned with Your Financial Goals',
    prefix: '6–',
    numericTarget: 36,
    numericStart: 6,
    suffix: ' Mos',
    decimals: 0,
  },
  {
    label: 'Executive Leadership & Market Experience',
    value: '30+ Years',
    sublabel: 'Stockbroking, Capital Markets, Forensic & Treasury Governance',
    prefix: '',
    numericTarget: 30,
    numericStart: 0,
    suffix: '+ Years',
    decimals: 0,
  },
];

export const CORE_VALUES = [
  {
    step: '01',
    name: 'Value',
    detail: 'Relentless focus on preserving capital and generating superior risk-adjusted returns for every stakeholder.',
  },
  {
    step: '02',
    name: 'Innovation',
    detail: 'Delivering forward-looking financial instruments and cutting-edge digital portfolio technology.',
  },
  {
    step: '03',
    name: 'Integrity',
    detail: 'Adhering to the highest SEC regulatory standards and transparent fiduciary stewardship.',
  },
  {
    step: '04',
    name: 'Speed',
    detail: 'Agile execution, responsive client service, and timely deployment of capital across market opportunities.',
  },
  {
    step: '05',
    name: 'Sustainability',
    detail: 'Building enduring wealth designed to protect and compound across generations.',
  },
];

export const WHY_INVEST_REASONS = [
  {
    step: '01',
    title: 'Professional Expertise',
    description: 'Our team conducts thorough market analysis to identify high-quality investment opportunities across diverse asset classes.',
  },
  {
    step: '02',
    title: 'Transparent Reporting',
    description: 'Clients receive clear updates and comprehensive performance reports on their investments at all times.',
  },
  {
    step: '03',
    title: 'Capital Preservation Focus',
    description: 'Our investment philosophy prioritizes protecting investors’ capital while generating competitive returns.',
  },
  {
    step: '04',
    title: 'Trusted Investment Partner',
    description: 'We are committed to maintaining strong relationships built on trust, regulatory compliance, and integrity.',
  },
  {
    step: '05',
    title: 'Diversified Investment Strategy',
    description: 'Funds are allocated across carefully selected SEC-sanctioned financial instruments to reduce risk.',
  },
];

export const GABS_PRODUCTS: ProductItem[] = [
  {
    step: '01',
    id: 'fixed-income',
    title: 'GABS Fixed Income',
    positioning: 'Core Income Product',
    description:
      'GABS Fixed Income is a professionally managed fixed income investment solution designed to provide investors with stable and predictable returns while prioritizing capital preservation.',
    extendedCopy:
      'Through careful portfolio selection and disciplined investment management, funds are strategically deployed into high-quality fixed income instruments such as commercial papers, treasury instruments, and other money market opportunities. This investment solution is ideal for individuals and institutions seeking consistent income with moderate risk exposure.',
    highlights: [
      { label: 'Product Positioning', value: 'Core Income Product' },
      { label: 'Risk Profile', value: 'Moderate Risk · Capital Preservation' },
      { label: 'Underlying Assets', value: 'Commercial Papers & Treasury Instruments' },
    ],
    accentColor: 'blue',
  },
  {
    step: '02',
    id: 'time-classic',
    title: 'GABS Time Classic',
    positioning: 'Safe Structured Deposit',
    description:
      'GABS Time Classic offers a secure investment opportunity in money market instruments, providing a low-risk approach with a guaranteed return on investment.',
    extendedCopy:
      'GABS Time Classic offers flexible investment tenures ranging from 6 to 36 months, allowing you to choose a duration that aligns with your financial goals. The minimum subscription for this investment is NGN 1,000,000.00 (One Million Naira Only).',
    highlights: [
      { label: 'Product Positioning', value: 'Safe Structured Deposit' },
      { label: 'Minimum Subscription', value: 'NGN 1,000,000.00' },
      { label: 'Flexible Tenures', value: '6 to 36 Months' },
    ],
    accentColor: 'emerald',
  },
  {
    step: '03',
    id: 'alternate-investment',
    title: 'GABS Alternate Investment',
    positioning: 'Higher Yield Opportunities',
    description:
      'With the GABS Alternate Investment, we provide clients with access to carefully selected investment opportunities similar to treasury bills that offer a maximum return, while maintaining manageable risk levels.',
    extendedCopy:
      'Engineered for discerning individual and institutional investors seeking enhanced yield curves above conventional deposits, backed by rigorous credit vetting and disciplined risk management.',
    highlights: [
      { label: 'Product Positioning', value: 'Higher Yield Opportunities' },
      { label: 'Benchmark Structure', value: 'Treasury-Backed & Structured Yield' },
      { label: 'Risk Governance', value: 'Manageable & Actively Monitored' },
    ],
    accentColor: 'gold',
  },
];

export const INVESTMENT_STRATEGY_INSTRUMENTS: StrategyInstrument[] = [
  {
    step: '01',
    name: 'Commercial Papers',
    category: 'Short-Term Corporate Debt',
    description: 'High-grade short-term debt obligations issued by creditworthy corporate institutions for predictable yield.',
  },
  {
    step: '02',
    name: 'Money Market Securities',
    category: 'Liquid Sovereign & Institutional',
    description: 'Highly liquid, low-volatility instruments providing steady capital appreciation and liquidity preservation.',
  },
  {
    step: '03',
    name: 'Treasury Bills',
    category: 'Sovereign Backed',
    description: 'Government-backed sovereign securities offering zero-default-risk baseline returns and portfolio stability.',
  },
  {
    step: '04',
    name: 'Short-Term Structured Investment Opportunities',
    category: 'Tailored Yield Enhancement',
    description: 'Bespoke SEC-sanctioned structured notes engineered to capture alpha within defined maturity windows.',
  },
  {
    step: '05',
    name: 'Corporate Debt Instruments',
    category: 'Fixed Income Bonds',
    description: 'Vetted investment-grade corporate bonds delivering consistent coupon income over medium-term horizons.',
  },
  {
    step: '06',
    name: 'Equity',
    category: 'Capital Appreciation',
    description: 'Strategic positions in fundamentally strong listed equities to capture long-term capital growth.',
  },
];

export const GABS_SERVICES: ServiceItem[] = [
  {
    step: '01',
    title: 'Asset Management',
    tagline: 'Your Assets, Strategically Managed',
    description:
      'We provide an end-to-end approach to wealth creation, preservation, and transfer. Our solutions include portfolio diversification, estate planning, tax optimization, and legacy strategies designed to protect and grow wealth across generations.',
    accent: 'blue',
  },
  {
    step: '02',
    title: 'Investment Advisory',
    tagline: 'We turn your business goals into achievable financial strategies.',
    description:
      'Our advisory team delivers personalized investment guidance informed by rigorous market research, trend analysis, and deep sector expertise. Whether you’re building long-term wealth or seeking strategic short-term gains, we design strategies to match your unique risk profile and financial goals.',
    accent: 'emerald',
  },
  {
    step: '03',
    title: 'Client Service',
    tagline: 'We keep you informed at all times.',
    description:
      'We provide personalized investment advice and maintain open communication, keeping you informed about market trends, investment strategies, and the performance of your portfolio.',
    accent: 'blue',
  },
];

export const VALUE_PROPOSITIONS = [
  {
    step: '01',
    title: 'Expert Investment Management',
    description:
      'Our team of seasoned investment professionals possess a deep understanding of market dynamics and employs vigorous research and analysis to identify compelling investment opportunities across diverse asset classes.',
  },
  {
    step: '02',
    title: 'Personalized Solutions',
    description:
      'We recognize that every investor is unique. That’s why we offer tailored investment solutions designed to meet your specific needs and financial circumstances.',
  },
  {
    step: '03',
    title: 'Disciplined Risk Management',
    description:
      'Preserving your capital is paramount and we employ a disciplined approach to risk management, carefully assessing and mitigating potential risks through diversification, strategic asset allocation, and continuous monitoring of market conditions to safeguard and optimize your investments.',
  },
];

export const FIVE_YEAR_VISION_PILLARS = [
  {
    step: '01',
    title: 'Investing in Technology',
    description: 'Currently, we are developing our APP to leverage cutting-edge technology in enhancing our customer experience.',
  },
  {
    step: '02',
    title: 'Expanding our Client Base',
    description: 'Aggressively pursuing new clients across all target segments including HNWIs, corporates, and retail investors.',
  },
  {
    step: '03',
    title: 'Client Focus',
    description: 'Delivering strong returns for our clients and ensuring exceptional satisfaction across every advisory touchpoint.',
  },
  {
    step: '04',
    title: 'Building a Diversified Portfolio',
    description: 'Expanding our investment offerings to include a wider range of asset classes and investment strategies.',
  },
];

export const LEADERSHIP_PROFILES: LeaderProfile[] = [
  // Board of Directors (4)
  {
    id: 'claudius-otegbade',
    name: 'Claudius Otegbade',
    credentials: 'MBA, CPA (USA), FCA (Nig), CAMS, CFE',
    role: 'Board Director · Forensic & Regulatory Strategy',
    group: 'board',
    initials: 'CO',
    imageUrl: '/team/claudius-otegbade.jpg',
    accentTone: 'blue',
    shortBio:
      'Accomplished financial leader and forensic expert with over 18 years of international experience across North America and Africa.',
    fullBio: [
      'Claudius Otegbade is an accomplished financial leader and forensic expert with over 18 years of international experience across North America and Africa. Prior to his current role, he held several senior positions in Canada, and Nigeria. He currently serves as the Co-Founder and Lead Partner at C&G Professional Services Ltd, where he provides strategic regulatory advisory services.',
      'Claudius holds an MBA and is a certified Public Accountant (USA), Fellow of the Institute of Chartered Accountants of Nigeria (FCA), Certified Anti-Money Laundering Specialist (CAMS), and Certified Fraud Examiner (CFE). He brings to the Board extensive expertise in forensic accounting, anti-money laundering (AML) compliance, financial crime risk management, and strategic advisory for financial institutions and multinational corporations.',
    ],
    specialties: ['Forensic Accounting', 'AML Compliance', 'Financial Crime Risk', 'Regulatory Advisory'],
  },
  {
    id: 'aisha-k-gambo',
    name: 'Aisha K. Gambo',
    credentials: 'IFRS Certified · Public Sector Finance',
    role: 'Board Director · Treasury & Financial Governance',
    group: 'board',
    initials: 'AG',
    imageUrl: '/team/aisha-gambo.jpg',
    accentTone: 'emerald',
    shortBio:
      'Distinguished financial management executive with over 25 years of experience spanning across the banking, power and public sectors.',
    fullBio: [
      'Aisha K. Gambo is a distinguished financial management executive with over 25 years of experience spanning across the banking, power and public sectors. She previously acted as Acting Assistant General Manager (Finance) at the PHCN Residual Group, where she played a vital role in strengthening financial governance of the nation’s power sector assets.',
      'Aisha holds advanced certifications in International Financial Reporting Standards (IFRS) and Public Sector Financial Management. She brings to the Board expertise on treasury operations, financial controls, and large-scale organizational restructuring.',
    ],
    specialties: ['Treasury Operations', 'IFRS Governance', 'Financial Controls', 'Organizational Restructuring'],
  },
  {
    id: 'joseph-tunde-ajayi',
    name: 'Engr. Joseph Tunde Ajayi',
    credentials: 'Fellow IDA · PMP Certified',
    role: 'Board Director · ESG & Global Infrastructure',
    group: 'board',
    initials: 'JA',
    imageUrl: '/team/joseph-ajayi.jpg',
    accentTone: 'gold',
    shortBio:
      'Globally distinguished engineer and environmental consultant with over 40 years of leadership experience across 25 countries.',
    fullBio: [
      'Engr. Joseph Tunde Ajayi is a globally distinguished engineer and environmental consultant with over 40 years of leadership experience in infrastructure and sustainable development. His career spans 25 countries across four continents, bringing a truly international perspective to the Board.',
      'A Fellow of the Institute of Development Administration, he also holds a Certification in Project Management and Implementation. Engr. Ajayi provides critical oversight in ESG (Environmental, Social, and Governance) frameworks and ensures excellence in the execution of complex global projects.',
    ],
    specialties: ['ESG Frameworks', 'Sustainable Development', 'Global Infrastructure', 'Project Governance'],
  },
  {
    id: 'bolatito-arinola-laditan',
    name: 'Bolatito Arinola Laditan',
    credentials: 'Public Policy & Regulatory Reform',
    role: 'Board Director · Public Administration & Governance',
    group: 'board',
    initials: 'BL',
    imageUrl: '/team/bolatito-laditan.jpg',
    accentTone: 'blue',
    shortBio:
      'Seasoned administrator with a 35-year career of distinguished service within the Nigerian Federal Civil Service.',
    fullBio: [
      'Bolatito Arinola Laditan is a seasoned administrator with a 35-year career of distinguished service within the Nigerian Federal Civil Service. She has been a key architect of public policy and organizational reform.',
      'Bolatito’s career highlights include serving as the Director at the Federal Ministry of Power, where she led the development of the Strategic Implementation Framework for the Power Sector Roadmap. She brings to the Board unparalleled expertise in public administration, governance, and the Nigerian regulatory landscape.',
    ],
    specialties: ['Public Policy', 'Regulatory Landscape', 'Strategic Frameworks', 'Corporate Governance'],
  },

  // Management Team (5)
  {
    id: 'idika-uma-kalu',
    name: 'Idika Uma Kalu',
    credentials: 'MBA (Finance), M.Sc, ACIB, FCS, FSM, NES',
    role: 'MD/CEO',
    group: 'management',
    initials: 'IK',
    imageUrl: '/team/idika-kalu.jpg',
    accentTone: 'blue',
    shortBio:
      'Brings over 30 years of experience in stockbroking and funds/portfolio management, leading overall success and growth of GABS Financial.',
    fullBio: [
      'Idika Uma Kalu brings over 30 years of experience in stockbroking and funds/portfolio management including consultancy for the Senate and House of Representatives Joint Commission on Capital Markets. As the MD/CEO of GABS Financial Services Limited he leads the company, and ensures the overall success and growth of the organization.',
      'He holds an MBA in Finance and an M.Sc. in Public Administration (Financial Management). He is also an Associate of the Institute of Chartered Bankers of Nigeria (ACIB), Chartered Institute of Stockbrokers (FCS), Fellow, Institute of Strategic Management, Nigeria (FSM), and a Member of Nigerian Economic Society (NES).',
    ],
    specialties: ['Portfolio Management', 'Capital Markets', 'Stockbroking', 'Executive Leadership'],
  },
  {
    id: 'oyelowo-ayodeji',
    name: 'Oyelowo Ayodeji',
    credentials: 'ATSWA, IM, NCMI',
    role: 'Head of Compliance',
    group: 'management',
    initials: 'OA',
    imageUrl: '/team/oyelowo-ayodeji.jpg',
    accentTone: 'emerald',
    shortBio:
      'Oversees strategic implementation of regulatory frameworks, ensuring all operations align with the highest standard of corporate governance.',
    fullBio: [
      'Oyelowo Ayodeji brings years of experience in internal control, treasury management and compliance. As Head of Compliance he oversees the strategic implementation of the organization’s regulatory frameworks, ensuring that all operations aligns with the highest standard of corporate governance.',
      'He is a member of the Associate Accounting Technician Scheme of West Africa (ATSWA), the Nigerian Institute of Management (IM), and the Nigerian Capital Market Institute (NCMI).',
    ],
    specialties: ['Regulatory Compliance', 'Internal Control', 'Treasury Management', 'SEC Governance'],
  },
  {
    id: 'stella-tinuola-yakubu',
    name: 'Stella Tinuola Yakubu',
    credentials: 'LL.B · NBA · Society for Corporate Governance',
    role: 'Head of Legal',
    group: 'management',
    initials: 'SY',
    imageUrl: '/team/stella-yakubu.jpg',
    accentTone: 'gold',
    shortBio:
      'Seasoned legal professional with expertise in corporate law, public policy, and investment law across finance and real estate.',
    fullBio: [
      'Stella Tinuola Yakubu is a seasoned legal professional with expertise in corporate law, public policy, and investment law. With experience in finance, investment, and real estate, she excels at providing sound legal counsel and compliance. As Head of Legal and Human Resources at GABS Financial Services Limited, Stella oversees legal and HR functions, drawing on her strong background in corporate governance.',
      'An alumni of the University of Benin and Lagos Business School, Stella is a member of the Nigeria Bar Association and Society for Corporate Governance of Nigeria.',
    ],
    specialties: ['Investment Law', 'Corporate Governance', 'Legal Advisory', 'Human Capital'],
  },
  {
    id: 'esther-owolabi',
    name: 'Esther Owolabi',
    credentials: 'ACA, AAT',
    role: 'Acting Head of FINCON',
    group: 'management',
    initials: 'EO',
    imageUrl: '/team/esther-owolabi.jpg',
    accentTone: 'blue',
    shortBio:
      'Chartered Accountant overseeing financial reporting, internal controls, and compliance to ensure all financial records are accurate.',
    fullBio: [
      'Esther Owolabi is a finance and accounting professional with years of experience in consulting and various financial sectors. Esther has developed technical proficiency in accounting software, and financial analysis. As the Ag. Head of FINCON, she oversees the company’s financial reporting, controls, and compliance to ensure all financial records are accurate and properly managed.',
      'She is a qualified Chartered Accountant (ACA) and a qualified member of the Association of Accounting Technicians (AAT).',
    ],
    specialties: ['Financial Reporting', 'Chartered Accounting', 'Financial Analysis', 'Internal Controls'],
  },
  {
    id: 'olubukunola-emmanuel',
    name: 'Olubukunola Emmanuel',
    credentials: 'Credit Analysis, Trade Finance & AML Certified',
    role: 'Head of Business',
    group: 'management',
    initials: 'OE',
    imageUrl: '/team/olubukunola-emmanuel.jpg',
    accentTone: 'emerald',
    shortBio:
      'Dynamic finance leader with over 18 years of experience in banking, capital strategy, relationship management, and operational leadership.',
    fullBio: [
      'Olubukunola Emmanuel is a dynamic finance leader with over 18 years of experience in banking, capital strategy, relationship management, and operational leadership across leading financial institutions in Nigeria. She has strong expertise in deposit mobilization, client advisory, and credit reviews. As Head of Business she leads the company’s business strategy to drive growth, revenue, and overall business performance.',
      'Olubukunola holds professional certifications in credit analysis, trade finance, and anti-money laundering, which further strengthen her expertise in financial management, regulatory compliance, and risk oversight.',
    ],
    specialties: ['Business Strategy', 'Deposit Mobilization', 'Client Advisory', 'Credit & Risk Oversight'],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is GABS Financial Services Limited licensed and regulated?',
    answer:
      'Yes. GABS Financial Services Limited was incorporated on the 11th of June 2021 and licensed in July 2024 by the Securities and Exchange Commission (SEC) Nigeria as a fund and portfolio management company. We are also a proud member of the Fund Managers Association of Nigeria (FMAN), adhering to the highest industry standards.',
  },
  {
    question: 'What types of investors and institutions do you work with?',
    answer:
      'We partner with discerning individuals, high-net-worth investors, corporate treasuries, family offices, and institutional clients seeking capital preservation, predictable fixed income, and strategic wealth creation across generations.',
  },
  {
    question: 'What is the minimum subscription and tenure for GABS Time Classic?',
    answer:
      'The minimum subscription for GABS Time Classic is NGN 1,000,000.00 (One Million Naira Only). It offers flexible investment tenures ranging from 6 to 36 months, allowing you to choose a duration that aligns with your financial goals with a guaranteed return on investment.',
  },
  {
    question: 'What financial instruments do you deploy client funds into?',
    answer:
      'Client funds are strategically deployed into carefully selected SEC-sanctioned investment instruments including Commercial Papers, Money Market Securities, Treasury Bills, Short-Term Structured Investment Opportunities, Corporate Debt Instruments, and fundamentally sound Equities.',
  },
  {
    question: 'How do you manage risk and keep clients informed?',
    answer:
      'Preserving your capital is paramount. We employ a disciplined approach to risk management through portfolio diversification, strategic asset allocation, and continuous market monitoring. Clients receive transparent reporting, regular portfolio updates, and dedicated advisory access at all times.',
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'navigating-nigerian-fixed-income-2026',
    category: 'Fixed Income & Treasury',
    date: 'October 2026',
    readTime: '5 min read',
    title: 'Navigating High-Yield Fixed Income & Commercial Papers in Nigeria',
    excerpt:
      'How institutional treasuries and discerning individual investors can lock in predictable, inflation-beating returns across SEC-sanctioned money market instruments.',
    author: 'Idika Uma Kalu',
    authorRole: 'MD/CEO, GABS Financial',
    imageUrl: '/images/blog_fixed_income_treasury_1791591200706.jpg',
    fullContent: [
      'In an evolving macroeconomic environment, capital preservation paired with real yield generation remains the cornerstone of disciplined portfolio management in Nigeria. Fixed income instruments—ranging from sovereign Treasury Bills to investment-grade Commercial Papers—continue to offer compelling risk-adjusted opportunities when structured with precision.',
      'Through GABS Fixed Income and GABS Time Classic, our investment committee rigorously screens corporate issuers and sovereign maturities across 6 to 36-month tenures. By staggering maturity ladders and prioritizing high-grade credit counterparties, investors achieve both liquidity predictability and steady compounding.',
      'Whether managing corporate working-capital reserves or personal family wealth, aligning duration with verified SEC-sanctioned instruments ensures your capital works harder without unnecessary volatility.',
    ],
    keyTakeaways: [
      'Ladder maturities between 6 and 36 months to balance liquidity and peak yield curves.',
      'Prioritize SEC-sanctioned commercial papers backed by strong corporate balance sheets.',
      'Combine sovereign Treasury Bills with structured deposits for capital preservation.',
    ],
  },
  {
    id: 'building-generational-wealth-structures',
    category: 'Wealth & Legacy Advisory',
    date: 'September 2026',
    readTime: '6 min read',
    title: 'Structuring Multi-Generational Wealth: Estate, Trust & Portfolio Governance',
    excerpt:
      'A practical blueprint for Nigerian executives, family offices, and entrepreneurs seeking seamless wealth preservation and intergenerational transfer.',
    author: 'Olubukunola Emmanuel',
    authorRole: 'Head of Business, GABS Financial',
    imageUrl: '/images/blog_wealth_preservation_strategy_1791591212093.jpg',
    fullContent: [
      'Creating wealth requires entrepreneurial vision; preserving and transferring it across generations demands institutional governance. Many Nigerian families and business founders face value erosion during leadership transitions due to fragmented asset holding structures and lack of formal estate planning.',
      'At GABS Financial Services Limited, our Asset Management mandate integrates portfolio diversification, tax optimization, and bespoke legacy strategies. By ring-fencing core family capital inside regulated fixed-income and equity mandates, families establish clear distribution rules and enduring financial security.',
      'Early engagement with a licensed fund manager allows families to stress-test liquidity needs, fund educational or philanthropic endowments, and protect operating businesses from personal liquidity shocks.',
    ],
    keyTakeaways: [
      'Separate operating business risk from core family wealth preservation portfolios.',
      'Establish transparent governance charters and tax-efficient transfer structures early.',
      'Review asset allocation quarterly against long-term family liabilities.',
    ],
  },
  {
    id: 'sec-regulation-fiduciary-safety',
    category: 'Regulation & Compliance',
    date: 'August 2026',
    readTime: '4 min read',
    title: 'Why SEC Regulation & Independent Custodianship Matter for Your Capital',
    excerpt:
      'Understanding the institutional safeguards, FMAN standards, and custodian segregation that protect investor portfolios at GABS Financial.',
    author: 'Oyelowo Ayodeji',
    authorRole: 'Head of Compliance, GABS Financial',
    imageUrl: '/images/blog_sec_regulatory_governance_1791591222776.jpg',
    fullContent: [
      'Before committing capital to any investment manager, the single most important due-diligence question an investor should ask is: How is my principal regulated and safeguarded? In Nigeria, licensing by the Securities and Exchange Commission (SEC) and active membership in the Fund Managers Association of Nigeria (FMAN) establish strict fiduciary accountability.',
      'GABS Financial operates with institutional-grade asset segregation alongside leading custodian partners including Zenith Nominees Limited. This structure guarantees that client assets are held distinctly from corporate operational accounts and deployed strictly in accordance with approved investment mandates.',
      'Combined with continuous AML oversight, forensic internal controls, and transparent periodic reporting, regulatory compliance is not merely a legal requirement—it is the foundation of investor confidence.',
    ],
    keyTakeaways: [
      'Verify SEC licensing and FMAN membership before deploying institutional or retail funds.',
      'Custodian segregation ensures client portfolios are ring-fenced and independently verified.',
      'Transparent performance reporting empowers informed investment decisions at every stage.',
    ],
  },
  {
    id: 'optimizing-corporate-treasury-reserves',
    category: 'Institutional Treasury',
    date: 'July 2026',
    readTime: '5 min read',
    title: 'Unlocking Alpha on Idle Corporate Cash: Treasury & Alternate Strategies',
    excerpt:
      'How CFOs and finance directors transform dormant balance-sheet cash into high-performing, liquid treasury portfolios with GABS Alternate Investment.',
    author: 'Esther Owolabi, ACA',
    authorRole: 'Acting Head of FINCON, GABS Financial',
    imageUrl: '/images/blog_corporate_treasury_liquidity_1791591242605.jpg',
    fullContent: [
      'Holding excess corporate liquidity in zero-or-low-interest current accounts silently erodes purchasing power. Forward-looking CFOs and treasury teams across Abuja and Lagos are increasingly turning to bespoke short-term structured investments to optimize cash-flow cycles.',
      'With GABS Alternate Investment, corporate treasuries gain access to carefully vetted, treasury-backed yield opportunities engineered to match quarterly tax, dividend, or capital-expenditure schedules. Minimum subscriptions starting from NGN 1,000,000 on Time Classic also allow SMEs and growing enterprises to participate in institutional money market yields.',
      'Our advisory desk collaborates directly with finance teams to map cash-flow horizons, ensuring rapid liquidity turnarounds whenever operational deployment is required.',
    ],
    keyTakeaways: [
      'Match short-term surplus cash to 90-day and 180-day structured money market windows.',
      'Enhance treasury yield curves above standard bank deposits while maintaining high liquidity.',
      'Leverage dedicated advisory reporting for seamless audit and IFRS reconciliation.',
    ],
  },
];

export const NIGERIAN_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'GABS Financial transformed how our family office approaches fixed-income allocation. Their transparent reporting, SEC-regulated governance, and consistent quarterly returns on GABS Time Classic have given us complete peace of mind.',
    name: 'Chukwuma Nwosu',
    role: 'Managing Director, Nwosu Holdings Ltd',
    location: 'Maitama, Abuja',
    productTag: 'GABS Time Classic',
  },
  {
    id: 'test-2',
    quote:
      'What sets GABS Financial apart is the speed and clarity of their investment advisory desk. They structured our corporate treasury reserves across commercial papers and sovereign bills, significantly outperforming our previous bank deposits.',
    name: 'Funmilayo Adeyemi',
    role: 'Chief Financial Officer, Crestline Energy Services',
    location: 'Victoria Island, Lagos',
    productTag: 'GABS Fixed Income',
  },
  {
    id: 'test-3',
    quote:
      'As a retired public servant, capital preservation is my highest priority. The team at GABS Financial took the time to tailor a 24-month structured portfolio that delivers dependable income right on schedule.',
    name: 'Alhaji Ibrahim Danjuma',
    role: 'Principal Partner & Private Investor',
    location: 'Asokoro, Abuja',
    productTag: 'Asset Management',
  },
  {
    id: 'test-4',
    quote:
      'Their deep understanding of the Nigerian capital market and disciplined risk management is unmatched. Every interaction reflects integrity, speed, and a genuine commitment to growing our worth.',
    name: 'Ngozi Okafor-Eze',
    role: 'Founder & Executive Director, Zora Healthcare Group',
    location: 'Central Business District, Abuja',
    productTag: 'GABS Alternate Investment',
  },
];

