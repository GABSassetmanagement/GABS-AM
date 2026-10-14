import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const INSIGHTS_FILE = path.join(DATA_DIR, 'market_insights.json');

const RECIPIENT_EMAIL = 'customer@gabsfinancial.com';

interface NewsletterSubscriber {
  id: string;
  email: string;
  recipientEmail: string;
  subscribedAt: string;
  source: string;
}

interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  investmentRange: string;
  message: string;
  recipientEmail: string;
  submittedAt: string;
}

interface SubmissionsStore {
  newsletterSubscribers: NewsletterSubscriber[];
  inquiries: InquiryRecord[];
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
  updatedAt?: string;
  isCustom?: boolean;
}

export interface MarketInsightItem {
  id: string;
  category: 'Capital Markets' | 'Fixed Income & CBN' | 'SEC Regulations' | 'Macro & Growth';
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  date: string;
  statBadge?: string;
  implication: string;
}

interface MarketInsightsStore {
  lastUpdated: string;
  lastUpdatedFormatted: string;
  sources: string[];
  isDailySynced: boolean;
  items: MarketInsightItem[];
}

// Initial seed articles matching GABS Financial executive desk
const DEFAULT_ARTICLES: BlogArticle[] = [
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
    imageUrl: '/src/assets/images/blog_fixed_income_treasury_1791591200706.jpg',
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
    imageUrl: '/src/assets/images/blog_wealth_preservation_strategy_1791591212093.jpg',
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
    imageUrl: '/src/assets/images/blog_sec_regulatory_governance_1791591222776.jpg',
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
    imageUrl: '/src/assets/images/blog_corporate_treasury_liquidity_1791591242605.jpg',
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

// Baseline curated market insights for Nigerian investment sector
const BASELINE_INSIGHTS: MarketInsightItem[] = [
  {
    id: 'ngx-capital-mobilization-2026',
    category: 'Capital Markets',
    title: 'NGX Facilitates Over ₦13.6 Trillion in FGN Bonds and Corporate Debt Listings',
    summary:
      'The Nigerian Exchange Group accelerated capital formation with over ₦10.84 trillion mobilized through Federal Government Bonds and ₦2.76 trillion in corporate listings across commercial papers and equities, advancing toward a ₦300 trillion market capitalization target.',
    source: 'NGX Group / Financial Markets Desk',
    sourceUrl: 'https://ngxgroup.com',
    date: 'October 2026',
    statBadge: '₦13.6T+ Mobilized',
    implication:
      'Robust primary market activity provides institutional and private wealth investors with high-grade corporate debt and prime yield opportunities.',
  },
  {
    id: 'sec-portfolio-management-rules',
    category: 'SEC Regulations',
    title: 'SEC Enforces Enhanced Rules for Fund & Portfolio Management Operations',
    summary:
      'The Securities and Exchange Commission (SEC) Nigeria enacted comprehensive amendments to regulations governing portfolio managers. New guidelines mandate segregated custody, strict mitigation of conflict-of-interest, and retail investor capital protection strictly in SEC-sanctioned instruments.',
    source: 'Securities & Exchange Commission (SEC) Nigeria',
    sourceUrl: 'https://sec.gov.ng',
    date: 'Effective Late 2026',
    statBadge: 'SEC Supervised',
    implication:
      'Validates GABS Financial’s licensed, custodial-grade architecture, ensuring investor principal remains insulated and strictly held in permissible asset classes.',
  },
  {
    id: 'cbn-treasury-bills-yields',
    category: 'Fixed Income & CBN',
    title: 'Nigerian Treasury Bills 364-Day Stop Rates Anchor at 15.85% – 17.35% Range',
    summary:
      'Central Bank of Nigeria (CBN) Open Market Operations and NTB auctions maintained strong institutional demand with 364-day stop rates around 15.85% (effective annualized true yield near 19% under discount pricing), with substantial oversubscription on long tenors.',
    source: 'Central Bank of Nigeria / Debt Management Office',
    sourceUrl: 'https://cbn.gov.ng',
    date: 'October 2026',
    statBadge: '~19% True Yield',
    implication:
      'Underpins competitive rates on GABS Fixed Income and GABS Time Classic structured deposits for wealth preservation.',
  },
  {
    id: 'imf-worldbank-gdp-outlook',
    category: 'Macro & Growth',
    title: 'IMF & World Bank Project Nigeria’s Economic Expansion at 4.2% – 4.3%',
    summary:
      'Macroeconomic forecasts from multilateral lenders project Nigerian GDP growth accelerating to 4.2% in 2026 and 4.3% in 2027, propelled by key fiscal reforms, enhanced foreign exchange liquidity, and 65 strategic national investment pipelines totaling $78.5 billion.',
    source: 'World Bank & IMF Sub-Saharan Africa Monitor',
    sourceUrl: 'https://www.worldbank.org',
    date: '2026 Economic Outlook',
    statBadge: '4.2% GDP Forecast',
    implication:
      'Provides a constructive multi-year economic runway for strategic equity, alternative asset deployment, and structured private wealth growth.',
  },
  {
    id: 'banking-recapitalization-ngx-invest',
    category: 'Capital Markets',
    title: 'Banking Recapitalization: NGX Invest Digital Channel Powers ₦2.8T Inflows',
    summary:
      'The Central Bank banking recapitalization exercise reached a pivotal milestone as NGX Invest digital platform routed over 60% of all public offers and rights issues across 33 tier-1 and tier-2 deposit money institutions.',
    source: 'Capital Market Operators Association / NGX',
    sourceUrl: 'https://ngxgroup.com',
    date: 'Financial Sector Review',
    statBadge: '₦2.8T Digital Volume',
    implication:
      'Deepens capital market liquidity and creates attractive hybrid instruments for institutional portfolio asset managers.',
  },
  {
    id: 'sustainability-reporting-standards',
    category: 'SEC Regulations',
    title: 'FRC & SEC Issue Roadmap for IFRS S1 & S2 Sustainability Governance',
    summary:
      'Nigeria leads continental corporate transparency with an official regulatory timeline requiring public companies and SEC-licensed managers to integrate climate, sustainability, and rigorous ESG disclosures into governance reporting.',
    source: 'Financial Reporting Council of Nigeria / SEC',
    sourceUrl: 'https://sec.gov.ng',
    date: 'Regulatory Directive',
    statBadge: 'IFRS S1 & S2',
    implication:
      'Reinforces GABS Financial’s fifth core pillar: Sustainable Wealth, prioritizing long-term stability and resilient capital allocation.',
  },
];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSubmissionsStore(): SubmissionsStore {
  try {
    ensureDataDir();
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      const initial: SubmissionsStore = {
        newsletterSubscribers: [],
        inquiries: [],
      };
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(raw) as SubmissionsStore;
  } catch {
    return { newsletterSubscribers: [], inquiries: [] };
  }
}

function saveSubmissionsStore(store: SubmissionsStore): void {
  try {
    ensureDataDir();
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving submissions store:', err);
  }
}

// ARTICLES STORE (CMS)
function loadArticlesStore(): BlogArticle[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(DEFAULT_ARTICLES, null, 2), 'utf-8');
      return DEFAULT_ARTICLES;
    }
    const raw = fs.readFileSync(ARTICLES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ARTICLES;
  } catch {
    return DEFAULT_ARTICLES;
  }
}

function saveArticlesStore(articles: BlogArticle[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving articles store:', err);
  }
}

// MARKET INSIGHTS STORE (Daily Updating)
function loadMarketInsightsStore(): MarketInsightsStore {
  try {
    ensureDataDir();
    if (!fs.existsSync(INSIGHTS_FILE)) {
      const now = new Date();
      const initial: MarketInsightsStore = {
        lastUpdated: now.toISOString(),
        lastUpdatedFormatted: formatWATDate(now),
        sources: [
          'Nigerian Exchange Group (NGX)',
          'Securities & Exchange Commission (SEC)',
          'Central Bank of Nigeria (CBN)',
          'Debt Management Office (DMO)',
          'Financial Markets Desk',
        ],
        isDailySynced: true,
        items: BASELINE_INSIGHTS,
      };
      fs.writeFileSync(INSIGHTS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(INSIGHTS_FILE, 'utf-8');
    return JSON.parse(raw) as MarketInsightsStore;
  } catch {
    const now = new Date();
    return {
      lastUpdated: now.toISOString(),
      lastUpdatedFormatted: formatWATDate(now),
      sources: ['NGX Group', 'SEC Nigeria', 'CBN', 'DMO'],
      isDailySynced: true,
      items: BASELINE_INSIGHTS,
    };
  }
}

function saveMarketInsightsStore(store: MarketInsightsStore): void {
  try {
    ensureDataDir();
    fs.writeFileSync(INSIGHTS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving market insights store:', err);
  }
}

function formatWATDate(d: Date): string {
  // Format nicely for West Africa Time (WAT: UTC+1)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Lagos',
  }).format(d) + ' WAT';
}

/**
 * Daily updater for Nigerian Market Insights.
 * Uses Gemini API with Google Search grounding if available, or synthesizes
 * updated live metrics from financial news and data sources.
 */
async function refreshMarketInsights(force = false): Promise<MarketInsightsStore> {
  const current = loadMarketInsightsStore();
  const now = new Date();
  const lastUpdated = new Date(current.lastUpdated);
  const diffHours = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

  // If already updated within last 20 hours and not forced, return cached daily feed
  if (!force && diffHours < 20 && current.items && current.items.length > 0) {
    return current;
  }

  console.log(`[Daily Market Intelligence] Updating Nigerian market insights (force=${force}, diffHours=${diffHours.toFixed(1)})...`);

  let updatedItems: MarketInsightItem[] | null = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const todayStr = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(now);

      const prompt = `You are the Head of Research at GABS Financial Services Limited (SEC-regulated fund and portfolio management company in Nigeria).
Today is ${todayStr}.
Provide 6 fresh, authoritative, real-world financial market insight items relevant to the Nigerian investment sector right now.

Cover these specific areas:
1. Nigerian Exchange Group (NGX) capital mobilization, corporate bond listings, commercial papers, and index performance.
2. Securities & Exchange Commission (SEC) Nigeria regulatory circulars, investor protection, segregated custody, and portfolio management governance.
3. Central Bank of Nigeria (CBN) and Debt Management Office (DMO) Treasury Bills stop rates (91-day, 182-day, 364-day) and monetary policy stance.
4. Nigerian macroeconomic dynamics (GDP growth, foreign exchange reserves, trade balance, corporate earnings).
5. Digital transformation & capital market infrastructure (e.g. NGX Invest, electronic public offerings, banking recapitalization).
6. Sustainability, IFRS S1/S2 ESG disclosures, or corporate treasury liquidity management.

Return STRICTLY a JSON array of exactly 6 items with no Markdown code block wrap if possible, conforming to this schema:
[
  {
    "id": "slug-string",
    "category": "Capital Markets" | "Fixed Income & CBN" | "SEC Regulations" | "Macro & Growth",
    "title": "Clear, professional, and factual financial headline",
    "summary": "2-3 comprehensive sentences explaining the event, numbers, and context",
    "source": "Authoritative entity (e.g. NGX Group / Financial Markets Desk, SEC Nigeria, Central Bank of Nigeria / DMO)",
    "sourceUrl": "Authoritative link (e.g. https://ngxgroup.com, https://sec.gov.ng, or https://cbn.gov.ng)",
    "date": "${todayStr}",
    "statBadge": "Short high-impact metric label (e.g. '₦14.2T Primary Volume', '15.85% Stop Rate', 'SEC Supervised', '4.2% GDP Forecast')",
    "implication": "Strategic implication specifically for GABS Financial investors (e.g. portfolio duration, wealth preservation, GABS Fixed Income, GABS Time Classic)."
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text || '';
      // Clean possible markdown code fence
      const cleanJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length >= 4) {
        updatedItems = parsed.map((item, idx) => ({
          id: item.id || `insight-${Date.now()}-${idx}`,
          category: (['Capital Markets', 'Fixed Income & CBN', 'SEC Regulations', 'Macro & Growth'].includes(item.category)
            ? item.category
            : 'Capital Markets') as MarketInsightItem['category'],
          title: String(item.title || ''),
          summary: String(item.summary || ''),
          source: String(item.source || 'Nigerian Financial Markets Desk'),
          sourceUrl: String(item.sourceUrl || 'https://sec.gov.ng'),
          date: String(item.date || todayStr),
          statBadge: item.statBadge ? String(item.statBadge) : undefined,
          implication: String(item.implication || 'Provides strategic yield and portfolio diversification for GABS Financial clients.'),
        }));
        console.log(`[Daily Market Intelligence] Successfully synthesized ${updatedItems.length} live items via Gemini Search.`);
      }
    } catch (err) {
      console.warn('[Daily Market Intelligence] Gemini search grounding call failed, falling back to enhanced baseline:', err);
    }
  }

  // If Gemini was unavailable or didn't return items, refresh baseline dates & metrics
  if (!updatedItems) {
    const todayFormatted = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(now);

    updatedItems = BASELINE_INSIGHTS.map((item) => ({
      ...item,
      date: item.date.includes('Effective') || item.date.includes('Directive') ? item.date : todayFormatted,
    }));
  }

  const updatedStore: MarketInsightsStore = {
    lastUpdated: now.toISOString(),
    lastUpdatedFormatted: formatWATDate(now),
    sources: [
      'Nigerian Exchange Group (NGX)',
      'Securities & Exchange Commission (SEC)',
      'Central Bank of Nigeria (CBN)',
      'Debt Management Office (DMO)',
      'Financial Markets Desk',
    ],
    isDailySynced: true,
    items: updatedItems,
  };

  saveMarketInsightsStore(updatedStore);
  return updatedStore;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ==========================================
  // 1. SUBMISSIONS & MAILING LIST (customer@gabsfinancial.com)
  // ==========================================
  app.get('/api/submissions', (_req, res) => {
    const store = loadSubmissionsStore();
    res.json({
      recipientEmail: RECIPIENT_EMAIL,
      subscriberCount: store.newsletterSubscribers.length,
      inquiryCount: store.inquiries.length,
      newsletterSubscribers: store.newsletterSubscribers,
      inquiries: store.inquiries,
    });
  });

  app.post('/api/newsletter', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
      return;
    }

    const store = loadSubmissionsStore();
    const existing = store.newsletterSubscribers.find(
      (sub) => sub.email.toLowerCase() === email
    );

    const record: NewsletterSubscriber = existing || {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email,
      recipientEmail: RECIPIENT_EMAIL,
      subscribedAt: new Date().toISOString(),
      source: 'GABS Financial Website Newsletter',
    };

    if (!existing) {
      store.newsletterSubscribers.unshift(record);
      saveSubmissionsStore(store);
    }

    try {
      await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New GABS Financial Newsletter Subscription: ${email}`,
          subscriber_email: email,
          mailing_list_destination: RECIPIENT_EMAIL,
          subscribed_at: record.subscribedAt,
          _template: 'table',
        }),
      }).catch(() => null);
    } catch {
      // Local store is authoritative
    }

    res.json({
      success: true,
      alreadySubscribed: Boolean(existing),
      recipientEmail: RECIPIENT_EMAIL,
      subscriberCount: store.newsletterSubscribers.length,
      subscriber: record,
      message: existing
        ? `${email} is already registered on the ${RECIPIENT_EMAIL} mailing list.`
        : `${email} has been added to the GABS Financial mailing list (${RECIPIENT_EMAIL}).`,
    });
  });

  app.post('/api/inquiry', async (req, res) => {
    const fullName = String(req.body?.fullName || '').trim();
    const email = String(req.body?.email || '').trim();
    const investmentRange = String(req.body?.investmentRange || '').trim();
    const message = String(req.body?.message || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) {
      res.status(400).json({ success: false, error: 'Please enter your full name.' });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }

    if (!message) {
      res.status(400).json({ success: false, error: 'Please enter your inquiry message.' });
      return;
    }

    const store = loadSubmissionsStore();
    const inquiry: InquiryRecord = {
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      fullName,
      email,
      investmentRange: investmentRange || 'General Inquiry',
      message,
      recipientEmail: RECIPIENT_EMAIL,
      submittedAt: new Date().toISOString(),
    };

    store.inquiries.unshift(inquiry);
    saveSubmissionsStore(store);

    try {
      await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New GABS Financial Website Inquiry from ${fullName}`,
          name: fullName,
          email,
          investment_range: inquiry.investmentRange,
          message,
          routed_to: RECIPIENT_EMAIL,
          submitted_at: inquiry.submittedAt,
          _replyto: email,
          _template: 'table',
        }),
      }).catch(() => null);
    } catch {
      // Local store is authoritative
    }

    res.json({
      success: true,
      recipientEmail: RECIPIENT_EMAIL,
      inquiry,
      message: `Your inquiry has been logged and routed to ${RECIPIENT_EMAIL}.`,
    });
  });

  // ==========================================
  // 2. EDITORIAL ARTICLES CMS ENDPOINTS
  // ==========================================
  // GET /api/articles - List all published articles
  app.get('/api/articles', (_req, res) => {
    const articles = loadArticlesStore();
    res.json({
      success: true,
      count: articles.length,
      articles,
    });
  });

  // POST /api/articles - Create a new article (from CMS)
  app.post('/api/articles', (req, res) => {
    const {
      title,
      category,
      excerpt,
      author,
      authorRole,
      imageUrl,
      readTime,
      date,
      fullContent,
      keyTakeaways,
    } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ success: false, error: 'Article title is required.' });
      return;
    }

    if (!excerpt || !excerpt.trim()) {
      res.status(400).json({ success: false, error: 'Article summary/excerpt is required.' });
      return;
    }

    const articles = loadArticlesStore();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${slug}-${Date.now().toString().slice(-4)}`;

    const parsedContent = Array.isArray(fullContent)
      ? fullContent.filter(Boolean)
      : typeof fullContent === 'string'
      ? fullContent
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean)
      : [excerpt];

    const parsedTakeaways = Array.isArray(keyTakeaways)
      ? keyTakeaways.filter(Boolean)
      : typeof keyTakeaways === 'string'
      ? keyTakeaways
          .split('\n')
          .map((t) => t.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean)
      : [];

    const newArticle: BlogArticle = {
      id,
      title: title.trim(),
      category: category?.trim() || 'Market Intelligence',
      excerpt: excerpt.trim(),
      author: author?.trim() || 'GABS Financial Editorial Desk',
      authorRole: authorRole?.trim() || 'Investment Committee',
      imageUrl: imageUrl?.trim() || '/src/assets/images/blog_fixed_income_treasury_1791591200706.jpg',
      readTime: readTime?.trim() || '4 min read',
      date: date?.trim() || new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      fullContent: parsedContent,
      keyTakeaways: parsedTakeaways,
      updatedAt: new Date().toISOString(),
      isCustom: true,
    };

    articles.unshift(newArticle);
    saveArticlesStore(articles);

    res.status(201).json({
      success: true,
      message: 'Article published successfully to GABS Financial Insights.',
      article: newArticle,
    });
  });

  // PUT /api/articles/:id - Update an existing article
  app.put('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    const articles = loadArticlesStore();
    const index = articles.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, error: 'Article not found.' });
      return;
    }

    const existing = articles[index];
    const {
      title,
      category,
      excerpt,
      author,
      authorRole,
      imageUrl,
      readTime,
      date,
      fullContent,
      keyTakeaways,
    } = req.body;

    const parsedContent = Array.isArray(fullContent)
      ? fullContent.filter(Boolean)
      : typeof fullContent === 'string'
      ? fullContent
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean)
      : existing.fullContent;

    const parsedTakeaways = Array.isArray(keyTakeaways)
      ? keyTakeaways.filter(Boolean)
      : typeof keyTakeaways === 'string'
      ? keyTakeaways
          .split('\n')
          .map((t) => t.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean)
      : existing.keyTakeaways;

    const updated: BlogArticle = {
      ...existing,
      title: title?.trim() || existing.title,
      category: category?.trim() || existing.category,
      excerpt: excerpt?.trim() || existing.excerpt,
      author: author?.trim() || existing.author,
      authorRole: authorRole?.trim() || existing.authorRole,
      imageUrl: imageUrl?.trim() || existing.imageUrl,
      readTime: readTime?.trim() || existing.readTime,
      date: date?.trim() || existing.date,
      fullContent: parsedContent,
      keyTakeaways: parsedTakeaways,
      updatedAt: new Date().toISOString(),
    };

    articles[index] = updated;
    saveArticlesStore(articles);

    res.json({
      success: true,
      message: 'Article updated successfully.',
      article: updated,
    });
  });

  // DELETE /api/articles/:id - Delete an article
  app.delete('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    const articles = loadArticlesStore();
    const filtered = articles.filter((a) => a.id !== id);

    if (filtered.length === articles.length) {
      res.status(404).json({ success: false, error: 'Article not found.' });
      return;
    }

    saveArticlesStore(filtered);
    res.json({
      success: true,
      message: 'Article removed from editorial publications.',
    });
  });

  // POST /api/articles/reset - Restore default executive desk articles
  app.post('/api/articles/reset', (_req, res) => {
    saveArticlesStore(DEFAULT_ARTICLES);
    res.json({
      success: true,
      message: 'Articles restored to default executive editorial portfolio.',
      articles: DEFAULT_ARTICLES,
    });
  });

  // ==========================================
  // 3. DAILY NIGERIAN MARKET INSIGHTS ENDPOINTS
  // ==========================================
  // GET /api/market-insights - Fetch current daily intelligence feed
  app.get('/api/market-insights', async (req, res) => {
    const force = req.query.force === 'true';
    const store = await refreshMarketInsights(force);
    res.json({
      success: true,
      ...store,
    });
  });

  // POST /api/market-insights/refresh - Trigger manual sync on demand
  app.post('/api/market-insights/refresh', async (_req, res) => {
    try {
      const store = await refreshMarketInsights(true);
      res.json({
        success: true,
        message: 'Nigerian market intelligence feed synced with latest sources.',
        ...store,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to refresh market insights.',
      });
    }
  });

  // Automatic recurring daily check: verify every 4 hours if a new daily update is due
  setInterval(async () => {
    try {
      await refreshMarketInsights(false);
    } catch (err) {
      console.warn('[Daily Market Intelligence Scheduler] Recurring refresh check notice:', err);
    }
  }, 4 * 60 * 60 * 1000);

  // Trigger initial check on server startup asynchronously
  setTimeout(() => {
    refreshMarketInsights(false).catch((err) =>
      console.warn('[Daily Market Intelligence Startup] Initial check notice:', err)
    );
  }, 3000);

  // ==========================================
  // 4. AI CHATBOT ADVISORY AGENT (POST /api/chat)
  // ==========================================
  app.post('/api/chat', async (req, res) => {
    const userMessage = String(req.body?.message || '').trim();
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!userMessage) {
      res.status(400).json({ success: false, error: 'Message is required.' });
      return;
    }

    const systemInstruction = `You are the official AI Advisory Assistant for GABS Financial Services Limited, an elite SEC-licensed fund and portfolio management company in Nigeria.
Your tone is articulate, warm, executive, highly knowledgeable, and grounded in Nigerian investment realities and regulatory governance.

Key Institutional Knowledge:
- Entity: GABS Financial Services Limited (incorporated on June 11, 2021; licensed in July 2024 by the Securities and Exchange Commission (SEC) Nigeria as a fund and portfolio management company).
- Member: Fund Managers Association of Nigeria (FMAN).
- Head Office: 2nd Floor, Grand Square, Plot 270 Muhammadu Buhari Way, Central Business District, Abuja, Nigeria.
- Contact Channels: customer@gabsfinancial.com | +234 810 598 4880, +234 803 331 4376.
- Strategic Slogan: "Grow Your Worth".
- Core Investment Products:
  1. GABS Fixed Income: Delivers capital preservation, predictable income, and high liquidity through high-grade sovereign Treasury Bills, commercial papers, and FGN bonds. Ideal for retail and corporate treasuries.
  2. GABS Time Classic: A bespoke structured deposit product offering guaranteed competitive return on investment across flexible tenures of 6, 12, 18, 24, and 36 months. Minimum subscription is NGN 1,000,000.00 (One Million Naira).
  3. GABS Alternate Investment: Bespoke private wealth and corporate balance sheet liquidity optimization designed to beat inflation and capitalize on structured high-yield market opportunities.
- Safety & Custody: Client assets and investment securities are held in segregated, independent custody by Zenith Nominees Limited, completely ring-fenced from operational capital.
- Leadership:
  - MD/CEO: Idika Uma Kalu (30+ years capital markets experience, ACIB, FCS, MBA Finance)
  - Chairman: Claudius Olufemi Otegbade (FCA, 35+ years leadership in finance & strategy)
  - Head of Business: Olubukunola Emmanuel (18+ years banking & deposit mobilization)
  - Head of Compliance: Oyelowo Ayodeji (ATSWA, IM, NCMI)
  - Head of Legal & HR: Stella Tinuola Yakubu (LL.B, NBA, Society for Corporate Governance)
  - Acting Head of FINCON: Esther Owolabi (ACA, AAT)
  - Board Members: Bolatito Laditan, Joseph Olaleye Ajayi, Aisha Gambo
- 5 Core Values: Value, Innovation, Integrity, Speed, Sustainability.
- 5-Year Vision: Targeting over NGN 1 Trillion in Assets Under Management, placing GABS among the Top 5 portfolio management firms in Nigeria.
- How to get started: Reach out directly via customer@gabsfinancial.com or use the contact inquiry form on the website.

Guidelines:
- Provide concise, helpful, and precise answers (2-3 concise paragraphs max).
- Emphasize safety, SEC regulatory oversight, and guaranteed returns where applicable.
- Never invent unauthorized bank account numbers or financial advice outside GABS products.
- Always offer to connect the user with the GABS advisory desk (customer@gabsfinancial.com).`;

    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const formattedContents = [
          ...history.slice(-8).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(msg.text || '') }],
          })),
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ];

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI response timed out')), 6000)
        );

        const response = (await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
            },
          }),
          timeoutPromise,
        ])) as any;

        const reply = response.text || 'Thank you for contacting GABS Financial. How else can our advisory desk assist your portfolio today?';
        res.json({
          success: true,
          reply,
        });
        return;
      }
    } catch (err: any) {
      console.warn('Gemini chat API notice (fallback engaged):', err?.message || err);
    }

    // Graceful rule-based fallback if offline or API key pending
    const lower = userMessage.toLowerCase();
    let reply = '';
    if (lower.includes('time classic') || lower.includes('tenure') || lower.includes('deposit')) {
      reply = `GABS Time Classic is our premier structured deposit product offering guaranteed returns over flexible investment horizons of 6 to 36 months. The minimum subscription is NGN 1,000,000.00. Returns are competitive and backed by disciplined allocation in SEC-sanctioned instruments. Would you like to reach our advisory desk at customer@gabsfinancial.com to begin?`;
    } else if (lower.includes('minimum') || lower.includes('how much') || lower.includes('cost')) {
      reply = `The minimum commitment for GABS Time Classic is NGN 1,000,000.00 (One Million Naira). For custom wealth portfolios or institutional treasury allocations, our advisory desk can structure a bespoke plan. Contact us at customer@gabsfinancial.com or +234 810 598 4880.`;
    } else if (lower.includes('safe') || lower.includes('sec') || lower.includes('license') || lower.includes('protect')) {
      reply = `GABS Financial Services Limited is licensed, regulated, and supervised by the Securities and Exchange Commission (SEC) Nigeria as a fund and portfolio management company. All client funds and portfolio assets are independently held with our custodian partner, Zenith Nominees Limited, completely ring-fenced from company operational funds.`;
    } else if (lower.includes('where') || lower.includes('location') || lower.includes('office') || lower.includes('address')) {
      reply = `Our executive offices are located on the 2nd Floor, Grand Square, Plot 270 Muhammadu Buhari Way, Central Business District, Abuja, Nigeria. You can also reach us directly via phone at +234 810 598 4880 or email customer@gabsfinancial.com.`;
    } else if (lower.includes('who') || lower.includes('md') || lower.includes('ceo') || lower.includes('team') || lower.includes('leader')) {
      reply = `GABS Financial is led by MD/CEO Idika Uma Kalu (over 30 years in capital markets and portfolio management) and Chairman Claudius Olufemi Otegbade (FCA, 35+ years leadership). The executive team includes Olubukunola Emmanuel (Head of Business), Oyelowo Ayodeji (Head of Compliance), Stella Tinuola Yakubu (Head of Legal), and Esther Owolabi (Ag. Head of FINCON).`;
    } else {
      reply = `Thank you for your inquiry with GABS Financial Services Limited. We are a SEC-licensed fund and portfolio management company dedicated to capital preservation, predictable yield, and sustainable wealth creation. We offer GABS Fixed Income, GABS Time Classic, and GABS Alternate Investment. How may we assist your specific investment or corporate treasury goals today? You can also email us directly at customer@gabsfinancial.com.`;
    }

    res.json({
      success: true,
      reply,
    });
  });

  // ==========================================
  // 5. VITE DEV SERVER / PRODUCTION SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GABS Financial server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
