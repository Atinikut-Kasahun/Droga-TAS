import { useEffect, useMemo, useState } from 'react';

const VercelGlobe = () => {
  const R = 400;
  const cx = 500;
  const cy = 450;

  // Horizontal lines (Latitudes)
  const latitudes = [];
  for (let i = 1; i <= 10; i++) {
    const yOffset = i * 40;
    if (cy - yOffset >= cy - R) {
      const w = Math.sqrt(R * R - yOffset * yOffset);
      latitudes.push(`M ${cx - w} ${cy - yOffset} L ${cx + w} ${cy - yOffset}`);
    }
    if (cy + yOffset <= cy + R) {
      const w = Math.sqrt(R * R - yOffset * yOffset);
      latitudes.push(`M ${cx - w} ${cy + yOffset} L ${cx + w} ${cy + yOffset}`);
    }
  }
  latitudes.push(`M ${cx - R} ${cy} L ${cx + R} ${cy}`);

  // Vertical lines (Longitudes)
  const longitudes = [];
  longitudes.push(`M ${cx} ${cy - R} L ${cx} ${cy + R}`);
  const numLongitudes = 8;
  for (let i = 1; i <= numLongitudes; i++) {
    const rx = (R / numLongitudes) * i;
    longitudes.push(`M ${cx} ${cy - R} A ${rx} ${R} 0 0 1 ${cx} ${cy + R}`);
    longitudes.push(`M ${cx} ${cy - R} A ${rx} ${R} 0 0 0 ${cx} ${cy + R}`);
  }

  const allLines = [...latitudes, ...longitudes];

  const animatedLines = [];
  const addAnimatedLine = (d, duration, delay, color, reverse) => {
    animatedLines.push({ d, duration: `${duration}s`, delay: `${delay}s`, color, reverse });
  };

  longitudes.forEach((d, i) => {
    if (i % 2 === 0 || i === 1) {
      const r1 = (i * 17) % 10 / 10;
      const r2 = (i * 23) % 10 / 10;
      const reverse1 = r1 > 0.5;
      const reverse2 = r2 > 0.5;
      const color1 = reverse1 ? 'url(#glow-gradient-2)' : 'url(#glow-gradient-1)';
      const color2 = reverse2 ? 'url(#glow-gradient-1)' : 'url(#glow-gradient-2)';
      addAnimatedLine(d, 3 + r1 * 4, r2 * 5, color1, reverse1);
      addAnimatedLine(d, 4 + r2 * 4, r1 * 8 + 3, color2, reverse2);
    }
  });

  latitudes.forEach((d, i) => {
    if (i % 3 === 0 || i === 2) {
      const r1 = (i * 13) % 10 / 10;
      const r2 = (i * 19) % 10 / 10;
      const reverse1 = r2 > 0.5;
      const reverse2 = r1 > 0.5;
      const color1 = reverse1 ? 'url(#glow-gradient-2)' : 'url(#glow-gradient-1)';
      const color2 = reverse2 ? 'url(#glow-gradient-1)' : 'url(#glow-gradient-2)';
      addAnimatedLine(d, 4 + r1 * 4, r2 * 6, color1, reverse1);
      addAnimatedLine(d, 3 + r2 * 4, r1 * 8 + 4, color2, reverse2);
    }
  });

  return (
    <div className="globe-container">
      <svg className="globe-svg" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMin slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="glow-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="glow-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="globe-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="60%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask="url(#globe-fade-mask)">
          <mask id="globe-fade-mask">
            <rect x="0" y="0" width="1000" height="800" fill="url(#globe-fade)" />
          </mask>
          <circle cx={cx} cy={cy} r={R} fill="var(--bg)" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth="1" />
          {allLines.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--border)" strokeWidth="1" />
          ))}

          {animatedLines.map((line, i) => (
            <path
              key={`anim-${i}`}
              d={line.d}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              className={`animated-glow-line ${line.reverse ? 'reverse' : ''}`}
              style={{
                animationDuration: line.duration,
                animationDelay: line.delay,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
const locationOptions = [
  { label: 'All locations', value: 'all' },
  { label: 'Megenagna', value: 'Megenagna' },
  { label: 'Bole', value: 'Bole' },
  { label: 'Kebena', value: 'Kebena' },
  { label: 'Summit', value: 'Summit' },
  { label: 'Rufael', value: 'Rufael' },
  { label: 'Shola', value: 'Shola' },
  { label: 'Bambis', value: 'Bambis' },
  { label: 'Jemo', value: 'Jemo' },
  { label: 'Kazanchis', value: 'Kazanchis' }
];

const deptOptions = [
  { label: 'All departments', value: 'all' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Legal', value: 'Legal' },
  { label: 'Design', value: 'Design' }
];
const allJobs = [
  {
    title: 'Customer Success Manager, Enterprise (US)',
    location: 'Megenagna, Bole, Kazanchis',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Customer Success Manager, Enterprise (US) to drive adoption and growth within our top US enterprise accounts, serving as a strategic partner throughout the customer lifecycle.',
    whatYouDo: [
      'Manage a book of enterprise accounts, driving adoption and retention',
      'Lead executive business reviews and quarterly success planning',
      'Identify and develop expansion opportunities within your portfolio',
      'Serve as the primary point of contact for escalations and strategic initiatives',
      'Partner with Sales to develop account growth plans',
      'Advocate for customer needs with product and engineering teams'
    ],
    aboutYou: [
      '5+ years in enterprise customer success, account management, or technical consulting',
      'Proven ability to manage large, strategic accounts',
      'Excellent presentation and communication skills',
      'Comfort engaging C-suite and technical stakeholders',
      'Data-driven approach to measuring and improving customer outcomes'
    ],
    bonus: [
      'Experience with developer tools, cloud infrastructure, or platform products',
      'Familiarity with Gainsight or Salesforce',
      'Background working with Fortune 500 companies'
    ],
    salary:
      'The base pay range for this role is $110,000 – $150,000. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Customer Success Manager, Startups',
    location: 'Bole',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Customer Success Manager, Startups to help our startup customers achieve their goals on the Droga Group platform, driving adoption, satisfaction, and growth at scale.',
    whatYouDo: [
      'Manage a high-velocity portfolio of startup accounts',
      'Proactively reach out to customers at risk of churn',
      'Drive product adoption through onboarding, training, and enablement',
      'Identify expansion opportunities and collaborate with sales to close',
      'Track and report on key health metrics and customer outcomes',
      'Serve as the voice of the customer to internal product and engineering teams'
    ],
    aboutYou: [
      '2–4 years in customer success, ideally in a startup or high-growth environment',
      'Strong organizational skills and ability to manage a large account portfolio',
      'Empathetic communicator with a customer-first mindset',
      'Comfort with technical concepts and developer workflows',
      'Located in or willing to relocate to San Francisco'
    ],
    bonus: [
      'Experience with developer tools or cloud platforms',
      'Familiarity with CRM and CS tooling (Gainsight, Salesforce, etc.)',
      'Background working with early-stage startups'
    ],
    salary:
      'The San Francisco base pay range for this role is $90,000 – $120,000. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Director, Sales Development',
    location: 'Kebena',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a <strong>"Director of Sales Development, EMEA"</strong> to build, scale, and lead our EMEA SDR organization. This role is ideal for a seasoned leader with deep experience creating outbound programs, developing talent, and driving meaningful pipeline across multiple regions. You will be responsible for setting the strategy, building operational excellence, and developing leaders who empower SDRs to engage CTOs, CIOs, technical stakeholders, developers & engineering leaders at the world\'s most innovative enterprise companies.',
    whatYouDo: [
      'Build, scale, and manage an EMEA SDR team',
      'Recruit, train, and develop SDRs to consistently exceed pipeline targets',
      'Design and implement outbound strategy, processes, and enablement programs to drive top-of-funnel excellence',
      'Establish and monitor KPIs, providing visibility into performance and pipeline contribution for executive leadership',
      'Partner closely with Sales, Marketing, and Operations leadership to ensure alignment and pipeline coverage',
      'Foster a culture of coaching, feedback, and professional growth across the team'
    ],
    aboutYou: [
      '7+ years of sales development experience, including 3+ years in a leadership role',
      'Proven track record building and scaling SDR teams in high-growth B2B SaaS companies',
      'Deep expertise in outbound sales methodologies and pipeline generation',
      'Strong data-driven mindset with experience using sales analytics to drive decisions',
      'Exceptional coaching and mentorship skills with a passion for developing talent'
    ],
    bonus: [
      'Leading SDR organizations in high-growth environments',
      'Sales technology (Salesforce and Outreach preferred)',
      'Building and scaling SDR operations across multiple regions in EMEA (and APAC optional)'
    ],
    salary:
      'The London base pay range for this role is £210,000 – £266,000. Actual salary will be based on job-related skills, experience, and location. Compensation outside of San Francisco may be adjusted based on employee location. The total compensation package may include benefits, equity-based compensation, and eligibility for a performance bonus.'
  },
  {
    title: 'Enterprise Account Executive',
    location: 'Megenagna, Kebena, Summit',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking an Enterprise Account Executive to drive new business and expansion within our largest enterprise accounts, engaging with technical buyers at Fortune 500 companies.',
    whatYouDo: [
      'Own a territory of enterprise accounts and drive net-new revenue',
      'Lead complex, multi-stakeholder sales cycles from discovery to close',
      'Engage C-suite, VP, and Director-level buyers across engineering, product, and IT',
      'Partner with Solutions Engineering to deliver tailored demonstrations and POCs',
      'Develop account plans and maintain accurate pipeline forecasting',
      'Represent Droga Group at industry events and executive briefings'
    ],
    aboutYou: [
      '6+ years of enterprise SaaS sales with a consistent track record of exceeding quota',
      'Experience selling to technical buyers (engineering, DevOps, platform teams)',
      'Strong executive presence and ability to navigate complex organizations',
      'Excellent discovery, negotiation, and closing skills',
      'Self-starter with high level of accountability'
    ],
    bonus: [
      'Experience with developer tools, cloud infrastructure, or PaaS products',
      'Familiarity with MEDDIC or similar enterprise sales methodologies',
      'Existing relationships with Fortune 500 technology leaders'
    ],
    salary:
      'The base pay range for this role is $150,000 – $220,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Enterprise Account Executive (EMEA)',
    location: 'Summit',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking an Enterprise Account Executive (EMEA) to lead strategic sales efforts across our largest EMEA enterprise accounts, building lasting partnerships with global technology companies.',
    whatYouDo: [
      'Own a portfolio of strategic enterprise accounts across EMEA',
      'Drive complex, consultative sales cycles involving multiple stakeholders',
      'Build and maintain executive relationships across customer organizations',
      'Collaborate with pre-sales, legal, and finance teams to close large deals',
      'Develop and execute detailed territory and account plans',
      'Attend executive briefings, summits, and strategic customer events'
    ],
    aboutYou: [
      '6+ years of enterprise SaaS sales experience in EMEA markets',
      'Demonstrated ability to close seven-figure deals',
      'Strong understanding of the enterprise technology landscape',
      'Excellent cross-cultural communication and relationship-building skills',
      'Based in or near London'
    ],
    bonus: [
      'Experience selling developer infrastructure or cloud platforms',
      'Multilingual abilities across EMEA languages',
      'Existing senior relationships with European enterprise technology leaders'
    ],
    salary:
      'The London base pay range for this role is £140,000 – £200,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Partner Manager, GSI',
    location: 'Megenagna, Rufael, Shola',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Partner Manager, GSI to build and manage strategic partnerships with Global System Integrators, driving co-sell and go-to-market alignment to accelerate Droga Group\'s enterprise growth.',
    whatYouDo: [
      'Develop and manage relationships with key GSI partners (Accenture, Deloitte, KPMG, etc.)',
      'Drive co-sell motions and joint pipeline development with partner teams',
      'Execute joint GTM initiatives, enablement programs, and co-marketing campaigns',
      'Track and report on partner-sourced and partner-influenced pipeline',
      'Align internally with Sales, Marketing, and Legal on partner deals',
      'Represent Droga Group at partner summits and industry events'
    ],
    aboutYou: [
      '5+ years of channel or partner management experience, ideally with GSIs',
      'Deep understanding of GSI business models and how they generate revenue',
      'Strong ability to build relationships at senior levels inside partner organizations',
      'Experience driving co-sell programs in enterprise SaaS environments',
      'Excellent project management and cross-functional collaboration skills'
    ],
    bonus: [
      'Existing relationships with major GSI practices',
      'Experience with cloud or developer infrastructure platforms',
      'Familiarity with Salesforce PRM tools'
    ],
    salary:
      'The base pay range for this role is $120,000 – $170,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Renewals Manager',
    location: 'Bambis, Jemo, Kazanchis',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Renewals Manager to drive on-time renewals and net revenue retention across our commercial and enterprise customer base, working closely with Customer Success and Sales teams.',
    whatYouDo: [
      'Own the renewal process for a large portfolio of customer accounts',
      'Forecast renewal outcomes accurately and identify at-risk accounts early',
      'Negotiate renewal contracts and resolve commercial objections',
      'Partner with CSMs to align on account health and expansion opportunities',
      'Maintain accurate records in Salesforce and renewal dashboards',
      'Develop playbooks and best practices for the renewals function'
    ],
    aboutYou: [
      '3+ years in renewals management, customer success, or sales operations',
      'Proven track record of achieving high renewal rates',
      'Strong negotiation and objection-handling skills',
      'Data-driven and highly organized with excellent attention to detail',
      'Comfortable working in a fast-paced, high-volume environment'
    ],
    bonus: [
      'Experience with Salesforce or Gainsight renewals workflows',
      'Background in SaaS or cloud infrastructure',
      'Familiarity with usage-based pricing models'
    ],
    salary:
      'The base pay range for this role is $90,000 – $120,000. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Sales Development Representative',
    location: 'Shola',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Sales Development Representative to generate qualified pipeline for our sales team by engaging developers, engineering leaders, and technical decision-makers at innovative companies.',
    whatYouDo: [
      'Prospect and qualify new business opportunities through outbound outreach',
      'Research target accounts and personalize messaging for key buyers',
      'Engage developers, CTOs, and engineering managers through email, LinkedIn, and phone',
      'Book qualified meetings for Account Executives',
      'Meet and exceed weekly and monthly pipeline targets',
      'Track activity and pipeline accurately in Salesforce'
    ],
    aboutYou: [
      '1–2 years of SDR or BDR experience in B2B SaaS',
      'Curiosity about technology and developer tools',
      'Strong written communication skills',
      'Resilience and coachability with a growth mindset',
      'Located in or willing to relocate to San Francisco'
    ],
    bonus: [
      'Experience using Outreach, Salesloft, or similar sales engagement tools',
      'Familiarity with cloud infrastructure or developer platforms',
      'Background prospecting into technical audiences'
    ],
    salary:
      'The San Francisco base pay range for this role is $70,000 – $95,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Startups Accelerator Manager',
    location: 'Kazanchis',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Startups Accelerator Manager to build and operate our startup accelerator program, helping early-stage companies succeed on the Droga Group platform while driving long-term pipeline.',
    whatYouDo: [
      'Design and run Droga Group\'s startup accelerator program from end to end',
      'Recruit, onboard, and manage cohorts of early-stage startup companies',
      'Build relationships with top-tier VCs, accelerators, and incubators',
      'Deliver educational content, workshops, and events for program participants',
      'Track program performance and startup conversion to paid accounts',
      'Collaborate with Sales and Marketing on program positioning and growth'
    ],
    aboutYou: [
      '4+ years in startup ecosystem, venture, or developer community roles',
      'Deep network within the startup and VC community',
      'Passion for entrepreneurship and building communities',
      'Strong program management and event execution skills',
      'Based in San Francisco'
    ],
    bonus: [
      'Experience building accelerator or incubator programs',
      'Relationships with top-tier early-stage VCs',
      'Background in developer-focused ecosystem roles'
    ],
    salary:
      'The San Francisco base pay range for this role is $100,000 – $140,000. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Startups Program Lead',
    location: 'Jemo',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Startups Program Lead to scale our startup engagement programs, driving awareness, adoption, and long-term growth within the startup ecosystem.',
    whatYouDo: [
      'Develop and scale Droga Group\'s startup engagement strategy',
      'Build and maintain partnerships with VCs, accelerators, and startup communities',
      'Create and execute programs that drive developer adoption among startups',
      'Measure program effectiveness and iterate based on data',
      'Represent Droga Group at startup conferences and ecosystem events',
      'Produce content, events, and resources tailored for early-stage teams'
    ],
    aboutYou: [
      '3–5 years in developer relations, community, or startup ecosystem roles',
      'Strong understanding of the startup landscape and startup GTM needs',
      'Experience creating and managing community programs',
      'Excellent written and verbal communication skills',
      'Located in San Francisco'
    ],
    bonus: [
      'Technical background or experience with developer tools',
      'Existing network in the startup or VC community',
      'Background in content creation or developer marketing'
    ],
    salary:
      'The San Francisco base pay range for this role is $95,000 – $135,000. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Strategic Account Executive',
    location: 'Megenagna, Bole, Shola',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Strategic Account Executive to manage and grow our most valuable enterprise relationships, acting as a trusted partner to the world\'s leading technology companies.',
    whatYouDo: [
      'Own a focused portfolio of strategic accounts and drive significant revenue growth',
      'Build and maintain executive-level relationships across customer organizations',
      'Lead strategic account planning and multi-year deal negotiation',
      'Partner with Product, Engineering, and CS to deliver exceptional customer outcomes',
      'Identify and develop new use cases and expansion opportunities',
      'Represent Droga Group at key industry events and executive roundtables'
    ],
    aboutYou: [
      '8+ years of enterprise SaaS sales with a strong record of exceeding quota',
      'Experience managing and growing $1M+ ARR accounts',
      'Board-level executive presence and executive selling skills',
      'Deep understanding of enterprise procurement and contract processes',
      'Ability to navigate complex, multi-stakeholder organizations'
    ],
    bonus: [
      'Experience selling developer infrastructure or platform products',
      'Existing relationships with Fortune 100 technology leaders',
      'Track record of closing multi-year, multi-million dollar agreements'
    ],
    salary:
      'The base pay range for this role is $180,000 – $260,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'VDR, Majors [APAC]',
    location: 'Rufael',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a VDR, Majors (APAC) to drive pipeline generation and new business development for our major accounts segment across the Asia-Pacific region.',
    whatYouDo: [
      'Generate and qualify pipeline for major accounts across APAC',
      'Conduct outbound prospecting targeting engineering and technical decision-makers',
      'Partner with Account Executives to drive top-of-funnel activity',
      'Research and identify target accounts and key personas',
      'Execute multi-channel outreach campaigns tailored to APAC markets',
      'Track and report on activity and pipeline metrics in Salesforce'
    ],
    aboutYou: [
      '2–4 years of SDR or BDR experience in APAC markets',
      'Understanding of the APAC enterprise technology landscape',
      'Strong outbound prospecting and communication skills',
      'Curiosity about developer tools and cloud platforms',
      'Based in Australia'
    ],
    bonus: [
      'Experience in a developer-focused or cloud infrastructure company',
      'Fluency in additional APAC languages (Japanese, Mandarin, etc.)',
      'Background prospecting into engineering or technical audiences'
    ],
    salary:
      'The Australia base pay range for this role is AU$80,000 – AU$110,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Vercel Development Representative – APAC',
    location: 'Bambis',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Development Representative – APAC to drive developer awareness and pipeline generation across the Asia-Pacific region, engaging technical communities and early-stage companies.',
    whatYouDo: [
      'Engage with developers and technical founders across the APAC region',
      'Drive awareness of Droga Group\'s platform through community and outbound activity',
      'Qualify and convert inbound leads from developer communities',
      'Partner with the APAC sales team on pipeline generation initiatives',
      'Attend and represent Droga Group at developer meetups and tech events',
      'Track developer engagement and report on key metrics'
    ],
    aboutYou: [
      '1–3 years in developer relations, technical sales development, or community roles',
      'Passion for developer tools and cloud-native technology',
      'Strong written and verbal communication skills',
      'Comfortable engaging technical audiences',
      'Based in Australia'
    ],
    bonus: [
      'Experience with open-source developer communities',
      'Technical background (coding skills or computer science background)',
      'Existing developer community network in APAC'
    ],
    salary:
      'The Australia base pay range for this role is AU$75,000 – AU$100,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  },
  {
    title: 'Vercel Development Representative, Startups',
    location: 'Kebena',
    dept: 'Sales',
    type: 'Full Time',
    about:
      'We are seeking a Development Representative, Startups to generate pipeline and drive developer engagement among early-stage startup companies, helping them discover and adopt the Droga Group platform.',
    whatYouDo: [
      'Identify and engage early-stage startups with high growth potential',
      'Drive outbound outreach to founders, CTOs, and engineering teams',
      'Qualify inbound leads from startup-focused channels',
      'Book qualified meetings for startup Account Executives',
      'Participate in startup events, hackathons, and demo days',
      'Track activity and pipeline in Salesforce'
    ],
    aboutYou: [
      '1–3 years of SDR or developer community experience',
      'Strong interest in startups and the early-stage ecosystem',
      'Comfort engaging technical founders and engineering leaders',
      'High energy, resilient, and coachable',
      'Located in or willing to relocate to San Francisco'
    ],
    bonus: [
      'Experience with developer tools or startup-focused platforms',
      'Existing network in the SF startup ecosystem',
      'Technical background or familiarity with web development'
    ],
    salary:
      'The San Francisco base pay range for this role is $70,000 – $100,000 OTE. Actual salary will be based on job-related skills, experience, and location.'
  }
];

function App() {

  const [page, setPage] = useState('listing');
  const [locationFilter, setLocationFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [locOpen, setLocOpen] = useState(true);
  const [deptOpen, setDeptOpen] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Auth States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('at_token') || '');
  const [currentUser, setCurrentUser] = useState(null);

  // Dashboard Data States
  const [dashboardTab, setDashboardTab] = useState('users'); // 'users' or 'companies'
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [resetUser, setResetUser] = useState(null);

  // Forms
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'hr', company_id: '' });
  const [companyForm, setCompanyForm] = useState({ name: '', website: '' });
  const [resetPasswordVal, setResetPasswordVal] = useState('');

  const API_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };
    applyTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const filteredJobs = useMemo(
    () =>
      allJobs.filter((job) => {
        const locMatch = locationFilter === 'all' || job.location.includes(locationFilter);
        const deptMatch = deptFilter === 'all' || job.dept === deptFilter;
        return locMatch && deptMatch;
      }),
    [locationFilter, deptFilter]
  );

  const openJob = (job) => {
    setSelectedJob(job);
    setPage('detail');
  };

  const selectedJobIndex = selectedJob ? allJobs.indexOf(selectedJob) : -1;

  const handleNavClick = (event, destination) => {
    event.preventDefault();
    setPage(destination);
  };

  // Fetch all dashboard data helper
  const fetchDashboardData = async (token = authToken) => {
    if (!token) return;
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // Fetch companies
      const compRes = await fetch(`${API_URL}/admin/companies`, { headers });
      if (compRes.ok) {
        const compData = await compRes.json();
        setCompanies(compData);
      }

      // Fetch users
      const userRes = await fetch(`${API_URL}/admin/users`, { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData);
      }

      // Fetch activity logs
      const logRes = await fetch(`${API_URL}/admin/logs`, { headers });
      if (logRes.ok) {
        const logData = await logRes.json();
        setLogs(logData.data || []);
      }
    } catch (err) {
      console.error("Error loading admin data: ", err);
    }
  };

  // Perform login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await res.json();
      setAuthToken(data.access_token);
      setCurrentUser(data.user);
      localStorage.setItem('at_token', data.access_token);
      
      // Load and redirect
      await fetchDashboardData(data.access_token);
      setPage('admin');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
    } catch (e) {
      console.error(e);
    }
    setAuthToken('');
    setCurrentUser(null);
    localStorage.removeItem('at_token');
    setPage('listing');
  };

  // Check login on load
  useEffect(() => {
    const checkMe = async () => {
      if (authToken) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json'
            }
          });
          if (res.ok) {
            const user = await res.json();
            setCurrentUser(user);
            fetchDashboardData(authToken);
          } else {
            // Token expired
            setAuthToken('');
            localStorage.removeItem('at_token');
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkMe();
  }, [authToken]);

  // Create or Update User
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingUser;
      const url = isEdit ? `${API_URL}/admin/users/${editingUser.id}` : `${API_URL}/admin/users`;
      const method = isEdit ? 'PUT' : 'POST';

      const body = { ...userForm };
      if (isEdit) {
        delete body.password; // Do not send empty password on update
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(JSON.stringify(err));
        return;
      }

      setUserModalOpen(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'hr', company_id: '' });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger User Edit Modal
  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id || ''
    });
    setUserModalOpen(true);
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to delete user');
        return;
      }
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Password for User
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetPasswordVal) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${resetUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password: resetPasswordVal })
      });
      if (res.ok) {
        alert('Password updated successfully!');
        setResetModalOpen(false);
        setResetPasswordVal('');
        setResetUser(null);
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create or Update Company
  const handleCompanyFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingCompany;
      const url = isEdit ? `${API_URL}/admin/companies/${editingCompany.id}` : `${API_URL}/admin/companies`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(companyForm)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(JSON.stringify(err));
        return;
      }

      setCompanyModalOpen(false);
      setEditingCompany(null);
      setCompanyForm({ name: '', website: '' });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Company Edit
  const openEditCompany = (company) => {
    setEditingCompany(company);
    setCompanyForm({
      name: company.name,
      website: company.website || ''
    });
    setCompanyModalOpen(true);
  };

  // Delete Company
  const handleDeleteCompany = async (id) => {
    if (!confirm('Are you sure you want to remove this sister company?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to delete company');
        return;
      }
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {page !== 'admin' && (
        <nav>
        <a className="nav-logo" href="#" onClick={(event) => handleNavClick(event, 'listing')}>
          <div className="nav-logo-mark">
            <img src="/logo.svg" alt="Droga Group" />
          </div>
          Droga Group
        </a>

        <div className="nav-links">
          <div className="dropdown">
            <button className="nav-link" type="button">
              Products
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="dropdown-menu">
              <div>
                <div className="dd-section-title">AI Cloud</div>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">AI Gateway</div>
                    <div className="dd-item-desc">One endpoint, all your models</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Sandbox</div>
                    <div className="dd-item-desc">Isolated, safe code execution</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v4M12 18v4" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Droga Agent</div>
                    <div className="dd-item-desc">An agent that knows your stack</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">AI SDK</div>
                    <div className="dd-item-desc">The AI Toolkit for TypeScript</div>
                  </div>
                </a>
              </div>
              <div>
                <div className="dd-section-title">Core Platform</div>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">CI/CD</div>
                    <div className="dd-item-desc">Helping teams ship 6× faster</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Content Delivery</div>
                    <div className="dd-item-desc">Fast, scalable, and reliable</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Fluid Compute</div>
                    <div className="dd-item-desc">Servers, in serverless form</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Workflow</div>
                    <div className="dd-item-desc">Long-running workflows at scale</div>
                  </div>
                </a>
              </div>
              <div>
                <div className="dd-section-title">Security</div>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Bot Management</div>
                    <div className="dd-item-desc">Scalable bot protection</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">BotID</div>
                    <div className="dd-item-desc">Invisible CAPTCHA</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Web App Firewall</div>
                    <div className="dd-item-desc">Granular, custom protection</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="dropdown">
            <button className="nav-link" type="button">
              Candidates
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="dropdown-menu">
              <div>
                <div className="dd-section-title">How to Apply</div>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Application Process</div>
                    <div className="dd-item-desc">Steps to submit your application</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Interview Process</div>
                    <div className="dd-item-desc">What to expect in interviews</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Benefits</div>
                    <div className="dd-item-desc">Compensation and perks</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">FAQ</div>
                    <div className="dd-item-desc">Common questions for candidates</div>
                  </div>
                </a>
              </div>
              <div>
                <div className="dd-section-title">Resources</div>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Resume Tips</div>
                    <div className="dd-item-desc">How to make your application stand out</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Interview Prep</div>
                    <div className="dd-item-desc">Practice guides and sample questions</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Contact Recruiter</div>
                    <div className="dd-item-desc">Connect with our recruiting team</div>
                  </div>
                </a>
              </div>
              <div>
                <div className="dd-section-title">For Hiring Managers</div>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Hiring Resources</div>
                    <div className="dd-item-desc">Guides and templates for managers</div>
                  </div>
                </a>
                <a className="dd-item" href="#">
                  <div className="dd-item-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="dd-item-name">Interview Panel</div>
                    <div className="dd-item-desc">Best practices for interviewing</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#how-to-apply">How to Apply</a>
        </div>

        <div className="nav-right">
          {currentUser ? (
            <>
              <button className="btn-signup" style={{ marginRight: 8 }} onClick={() => setPage('admin')}>Dashboard</button>
              <button className="btn-login" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => setPage('login')}>Log In</button>
              <button className="btn-signup" onClick={() => setPage('login')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
      )}

      <div id="listing-page" style={{ display: page === 'listing' ? 'block' : 'none' }}>
        <section className="hero" style={{ position: 'relative' }}>
          <div className="hero-grid" />
          <VercelGlobe />
          
          {/* Intersection Markers */}
          <div style={{ position: 'absolute', inset: 0, width: '100%', maxWidth: 1280, margin: '0 auto', pointerEvents: 'none', zIndex: 10 }}>
            <div className="plus-mark" style={{ top: -7, left: 41 }} />
            <div className="plus-mark" style={{ bottom: -7, left: 321 }} />
          </div>

          <div className="hero-content">
            <h1 className="hero-title">Join us<br />to Ship what's Next.</h1>
            <a className="btn-open-positions" href="#positions">
              Open Positions
            </a>
          </div>
        </section>

        <section className="jobs-section" id="positions">
          <div className="jobs-container">
            <aside className="filters-col">
              <div className="filter-group">
              <div className={`filter-header ${locOpen ? 'open' : ''}`} onClick={() => setLocOpen((open) => !open)}>
                Location
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`filter-options ${locOpen ? 'open' : ''}`}>
                {locationOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`filter-option ${option.sub ? 'sub' : ''} ${locationFilter === option.value ? 'active' : ''}`}
                    onClick={() => setLocationFilter(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <div className={`filter-header ${deptOpen ? 'open' : ''}`} onClick={() => setDeptOpen((open) => !open)}>
                Department
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`filter-options ${deptOpen ? 'open' : ''}`}>
                {deptOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`filter-option ${deptFilter === option.value ? 'active' : ''}`}
                    onClick={() => setDeptFilter(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="jobs-col">
            <div className="jobs-header">Open Positions at Droga Group</div>
            <div id="job-list">
              {filteredJobs.length === 0 ? (
                <div style={{ padding: 48, color: '#888', fontSize: 15 }}>
                  No positions match your filters.
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const index = allJobs.indexOf(job);
                  return (
                    <div key={`${job.title}-${job.location}`} className="job-item" onClick={() => openJob(job)}>
                      <div>
                        <div className="job-title">{job.title}</div>
                        <div className="job-location">{job.location}</div>
                      </div>
                      <button
                        className="btn-read-more"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openJob(job);
                        }}
                      >
                        Read more
                      </button>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          </div>
        </section>

        {/* Breathing space between jobs and footer */}
        <div className="footer-spacer" />

        <footer>
          <div className="footer-grid">
            <div>
              <div className="footer-col-title">Get Started</div>
              <a className="footer-link" href="#">Templates</a>
              <a className="footer-link" href="#">Supported frameworks</a>
              <a className="footer-link" href="#">Marketplace</a>
              <a className="footer-link" href="#">Domains</a>
            </div>
            <div>
              <div className="footer-col-title">Build</div>
              <a className="footer-link" href="#">Next.js on Droga</a>
              <a className="footer-link" href="#">Turborepo</a>
              <a className="footer-link" href="#">v0</a>
            </div>
            <div>
              <div className="footer-col-title">Scale</div>
              <a className="footer-link" href="#">Content delivery network</a>
              <a className="footer-link" href="#">Fluid compute</a>
              <a className="footer-link" href="#">CI/CD</a>
              <a className="footer-link" href="#">Observability</a>
              <a className="footer-link" href="#">AI Gateway <span className="badge-new">NEW</span></a>
              <a className="footer-link" href="#">Droga Agent <span className="badge-new">NEW</span></a>
            </div>
            <div>
              <div className="footer-col-title">Secure</div>
              <a className="footer-link" href="#">Platform security</a>
              <a className="footer-link" href="#">Web Application Firewall</a>
              <a className="footer-link" href="#">Bot management</a>
              <a className="footer-link" href="#">BotID</a>
              <a className="footer-link" href="#">Sandbox <span className="badge-new">NEW</span></a>
            </div>
            <div>
              <div className="footer-col-title">Learn</div>
              <a className="footer-link" href="#">Docs</a>
              <a className="footer-link" href="#">Blog</a>
              <a className="footer-link" href="#">Changelog</a>
              <a className="footer-link" href="#">Knowledge Base</a>
              <a className="footer-link" href="#">Academy</a>
              <a className="footer-link" href="#">Community</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Droga Group. All rights reserved.
            </div>
            <div className="theme-toggle">
              <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')} title="Light Mode">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
              <button className={`theme-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => setTheme('system')} title="System Default">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </button>
              <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')} title="Dark Mode">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </div>

      <div id="job-detail" style={{ display: page === 'detail' ? 'block' : 'none' }}>
        {selectedJob && (
          <>
            <div className="jd-hero">
              <div className="jd-grid-bg" />
              <div className="jd-hero-inner">
                <button className="btn-back" type="button" onClick={() => setPage('listing')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to Careers
                </button>
                <div className="jd-meta">
                  <div className="jd-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    {selectedJob.dept}
                  </div>
                  <div className="jd-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 010 20" />
                      <path d="M12 2a15.3 15.3 0 000 20" />
                    </svg>
                    {selectedJob.location.split(',')[0]}
                  </div>
                  <div className="jd-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {selectedJob.type}
                  </div>
                </div>
                <h1 className="jd-title">{selectedJob.title}</h1>
                <div className="jd-breadcrumb">
                  <a href="#" onClick={(event) => handleNavClick(event, 'listing')}>
                    Careers
                  </a>{' '}
                  / <strong>{selectedJob.dept}</strong>
                </div>
              </div>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div className="jd-body">
                <div className="jd-content">
                  <div className="jd-section" style={{ borderTop: 'none', paddingTop: 40 }}>
                    <div className="jd-section-title">About Droga Group:</div>
                    <p className="jd-text">
                      Droga Group gives developers the tools and cloud infrastructure to build, scale, and secure a
                      faster, more personalized web. As the team behind v0, Next.js, and AI SDK, Droga Group helps customers
                      like Ramp, Supreme, PayPal, and Under Armour build for the AI-native web.
                    </p>
                    <p className="jd-text">
                      Our mission is to enable the world to ship the best products. That starts with creating a place where
                      everyone can do their best work. Whether you're building on our platform, supporting our customers, or
                      shaping our story: You can just ship things.
                    </p>
                  </div>

                  <div className="jd-section">
                    <div className="jd-section-title">About the Role:</div>
                    <p className="jd-text" dangerouslySetInnerHTML={{ __html: selectedJob.about }} />
                    <p className="jd-text">
                      If you're based within a pre-determined commuting distance of one of our offices (SF, NY, London, or
                      Berlin), the role includes in-office anchor days on Monday, Tuesday, and Friday. If you're located
                      beyond that distance, the role is fully remote. For location-specific details, please connect with our
                      recruiting team.
                    </p>
                  </div>

                  <div className="jd-section">
                    <div className="jd-section-title">What You Will Do:</div>
                    <ul className="jd-list">
                      {selectedJob.whatYouDo.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="jd-section">
                    <div className="jd-section-title">About You:</div>
                    <ul className="jd-list">
                      {selectedJob.aboutYou.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="jd-section">
                    <div className="jd-section-title">Bonus If You:</div>
                    <ul className="jd-list">
                      {selectedJob.bonus.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="jd-section">
                    <div className="jd-section-title">Benefits:</div>
                    <ul className="jd-list">
                      <li>Competitive compensation package, including equity.</li>
                      <li>Inclusive Healthcare Package.</li>
                      <li>Learn and Grow – we provide mentorship and send you to events that help you build your network and skills.</li>
                      <li>Flexible Time Off.</li>
                      <li>We will provide you the gear you need to do your role, and a WFH budget for you to outfit your space as needed.</li>
                    </ul>
                    <p className="jd-text" style={{ marginTop: 20 }}>
                      {selectedJob.salary}
                    </p>
                  </div>

                  <div className="apply-section">
                    <div className="apply-title">Apply Now.</div>
                    <div className="apply-subtitle">Tell us why you'd be a good fit for the {selectedJob.title} role.</div>

                    <div className="form-wrapper">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">First Name</label>
                          <input className="form-input" type="text" placeholder="First Name" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Last Name</label>
                          <input className="form-input" type="text" placeholder="Last Name" />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Email Address</label>
                          <input className="form-input" type="email" placeholder="tammytriangle@email.com" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <div className="phone-wrap">
                            <div className="phone-flag">🇺🇸</div>
                            <input className="phone-input" type="tel" placeholder="(201) 555-0123" />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Resume (Optional)</label>
                        <div className="upload-box">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload your resume
                        </div>
                        <div className="upload-hint">Resume should be a PDF under 3.5MB.</div>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="form-question">
                          Are you currently based in any of these countries? Please note these are the only countries where we are accepting applications
                        </div>
                        <div className="radio-grid">
                          {['United States', 'Germany', 'United Kingdom', 'Argentina', 'Australia', 'Canada', 'India', 'Japan', 'Other'].map((country) => (
                            <label key={country} className="radio-opt">
                              <input type="radio" name="country" /> {country}
                            </label>
                          ))}
                        </div>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="form-question">Will you require Visa Sponsorship now, or in the future?</div>
                        <div className="radio-grid">
                          {['Yes', 'No'].map((answer) => (
                            <label key={answer} className="radio-opt">
                              <input type="radio" name="visa" /> {answer}
                            </label>
                          ))}
                        </div>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="form-question">
                          Your authorization to work in the country where you live. Please choose the option that describes your work authorization.
                        </div>
                        <div className="radio-grid-col">
                          {[
                            'I am authorized to work in the country due to my nationality',
                            'I am authorized to work in the country based on a valid work permit and do not need a company to sponsor my visa',
                            'I am authorized to work in the country based on a valid work permit which needs to be sponsored by the company I work for',
                            'I am not authorized to work in the country and need visa support',
                            'Other'
                          ].map((option) => (
                            <label key={option} className="radio-opt">
                              <input type="radio" name="auth" /> {option}
                            </label>
                          ))}
                        </div>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="privacy-note">
                          By submitting my application, I acknowledge that I have read and understand Droga Group's{' '}
                          <a className="privacy-link" href="#">Job Applicant Privacy Notice ↗</a>
                        </div>
                        <label className="radio-opt" style={{ marginTop: 10 }}>
                          <input type="checkbox" /> Acknowledge/Confirm
                        </label>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="form-question">
                          Please double-check all the information provided above. Ensuring accuracy is crucial, as any errors or omissions may impact the review of your application.
                        </div>
                        <label className="radio-opt">
                          <input type="checkbox" /> I have reviewed and confirmed that all the information provided is accurate and complete.
                        </label>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="form-question">Where did you first hear about this role?</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                          {[
                            'Other job boards',
                            'LLMs (ChatGPT, etc.)',
                            "I'm a Droga Group customer",
                            'Referral from a Droga customer',
                            'Referral from a Droga team member',
                            'Social media (X, Instagram, YouTube, etc.)',
                            'Other Content (news articles, podcasts, blogs)',
                            'Developer communities (GitHub, Hacker News, Reddit, etc.)',
                            'Other'
                          ].map((source) => (
                            <label key={source} className="radio-opt">
                              <input type="radio" name="source" /> {source}
                            </label>
                          ))}
                        </div>
                      </div>

                      <hr className="form-divider" />

                      <div className="form-group">
                        <div className="form-question">Optionally, include links to your social media profiles.</div>
                        <div className="form-row" style={{ marginTop: 8 }}>
                          <div className="form-group">
                            <label className="form-label">LinkedIn</label>
                            <div className="linkedin-wrap">
                              <div className="linkedin-prefix">linkedin.com/in/</div>
                              <input className="linkedin-input" type="text" placeholder="handle" />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Portfolio</label>
                            <div className="portfolio-wrap">
                              <div className="portfolio-prefix">https://</div>
                              <input className="portfolio-input" type="text" placeholder="portfolio.com" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="form-divider" />

                      <div className="submit-row">
                        <button
                          className="btn-submit"
                          type="button"
                          onClick={() => alert('Application submitted! Thank you.')}
                        >
                          Submit Application
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="jd-sidebar">
                  <a
                    className="btn-apply"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      document.querySelector('.apply-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Apply for Role
                  </a>
                </div>
              </div>
            </div>

            <footer style={{ marginTop: 40 }}>
              <div className="footer-grid">
                <div>
                  <div className="footer-col-title">Get Started</div>
                  <a className="footer-link" href="#">Templates</a>
                  <a className="footer-link" href="#">Supported frameworks</a>
                  <a className="footer-link" href="#">Marketplace</a>
                  <a className="footer-link" href="#">Domains</a>
                </div>
                <div>
                  <div className="footer-col-title">Build</div>
                  <a className="footer-link" href="#">Next.js on Droga</a>
                  <a className="footer-link" href="#">Turborepo</a>
                  <a className="footer-link" href="#">v0</a>
                </div>
                <div>
                  <div className="footer-col-title">Scale</div>
                  <a className="footer-link" href="#">Content delivery network</a>
                  <a className="footer-link" href="#">Fluid compute</a>
                  <a className="footer-link" href="#">CI/CD</a>
                  <a className="footer-link" href="#">Observability</a>
                  <a className="footer-link" href="#">AI Gateway <span className="badge-new">NEW</span></a>
                </div>
                <div>
                  <div className="footer-col-title">Secure</div>
                  <a className="footer-link" href="#">Platform security</a>
                  <a className="footer-link" href="#">Web Application Firewall</a>
                  <a className="footer-link" href="#">Bot management</a>
                  <a className="footer-link" href="#">BotID</a>
                </div>
                <div>
                  <div className="footer-col-title">Resources</div>
                  <a className="footer-link" href="#">Pricing</a>
                  <a className="footer-link" href="#">Customers</a>
                  <a className="footer-link" href="#">Enterprise</a>
                  <a className="footer-link" href="#">Articles</a>
                  <a className="footer-link" href="#">Startups</a>
                </div>
                <div>
                  <div className="footer-col-title">Learn</div>
                  <a className="footer-link" href="#">Docs</a>
                  <a className="footer-link" href="#">Blog</a>
                  <a className="footer-link" href="#">Changelog</a>
                  <a className="footer-link" href="#">Knowledge Base</a>
                  <a className="footer-link" href="#">Community</a>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* LOGIN PAGE */}
      {page === 'login' && (
        <div style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #1D2125 0%, #0c0d0e 100%)',
          color: '#C7D1DB',
          padding: '40px 20px',
          fontFamily: 'inherit'
        }}>
          <div style={{
            background: '#22272B',
            border: '1px solid #30363D',
            borderRadius: '12px',
            padding: '40px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#579DFF" strokeWidth="2.5" style={{ width: '40px', height: '40px' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Sign in to Droga TAS</h2>
            <p style={{ color: '#8C9BAB', fontSize: '14px', marginBottom: '28px' }}>Enter your administrator credentials below</p>
            
            {loginError && (
              <div style={{
                background: 'rgba(255, 86, 48, 0.15)',
                color: '#FF5630',
                border: '1px solid rgba(255, 86, 48, 0.3)',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#8C9BAB', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@droga-group.com"
                  required
                  style={{
                    width: '100%',
                    background: '#1D2125',
                    border: '1px solid #30363D',
                    borderRadius: '6px',
                    color: '#C7D1DB',
                    padding: '12px 14px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#8C9BAB', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    background: '#1D2125',
                    border: '1px solid #30363D',
                    borderRadius: '6px',
                    color: '#C7D1DB',
                    padding: '12px 14px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#579DFF',
                  color: '#1D2125',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                Sign In
              </button>
            </form>

            <div style={{ marginTop: '24px', background: 'rgba(87, 157, 255, 0.08)', borderRadius: '6px', padding: '12px', textAlign: 'left', fontSize: '12px' }}>
              <strong style={{ color: '#579DFF', display: 'block', marginBottom: '4px' }}>💡 Quick Credentials:</strong>
              <div style={{ color: '#8C9BAB' }}>Admin Email: <span style={{ color: '#fff' }}>admin@droga-group.com</span></div>
              <div style={{ color: '#8C9BAB' }}>Admin Password: <span style={{ color: '#fff' }}>password</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ATLASSIAN JIRA ADMIN DASHBOARD */}
      {page === 'admin' && (
        <div className="atlassian-dashboard">
          {/* Top Bar */}
          <div className="at-topbar">
            <div className="at-topbar-left">
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="at-nav-item active" style={{ borderLeft: 'none', padding: '4px 10px', borderRadius: '3px' }}>For you</span>
                <span className="at-nav-item" style={{ borderLeft: 'none', padding: '4px 10px', borderRadius: '3px' }}>Recent</span>
                <span className="at-nav-item" style={{ borderLeft: 'none', padding: '4px 10px', borderRadius: '3px' }}>Starred</span>
                <span className="at-nav-item" style={{ borderLeft: 'none', padding: '4px 10px', borderRadius: '3px' }}>Projects</span>
              </div>
              <button className="btn-at-create" onClick={() => {
                if (dashboardTab === 'users') {
                  setUserForm({ name: '', email: '', password: '', role: 'hr', company_id: '' });
                  setEditingUser(null);
                  setUserModalOpen(true);
                } else {
                  setCompanyForm({ name: '', website: '' });
                  setEditingCompany(null);
                  setCompanyModalOpen(true);
                }
              }}>+ Create</button>
            </div>

            <div className="at-topbar-right">
              <div className="at-search-wrap">
                <svg className="at-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users or companies..."
                  className="at-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="at-icon-btn" title="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              <button className="at-icon-btn" title="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <div className="at-avatar" title={currentUser?.name} onClick={handleLogout}>
                {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="at-body">
            {/* Left Jira Navigation Sidebar */}
            <div className="at-sidebar">
              <div className="at-sidebar-nav">
                {/* COMPANIES Section */}
                <div className="at-sidebar-section-title">Companies</div>
                <div className={`at-nav-item ${dashboardTab === 'companies' ? 'active' : ''}`} onClick={() => setDashboardTab('companies')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>Sister Companies</span>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px', opacity: 0.6 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>

                {/* RECRUITMENT Section */}
                <div className="at-sidebar-section-title">Recruitment</div>
                <div className="at-nav-item" onClick={() => setPage('listing')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="7" width="18" height="13" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    <span>Job Posts</span>
                  </div>
                </div>

                <div className="at-nav-item" onClick={() => alert('Applicants module is actively synchronizing with the candidate portal.')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Applicants</span>
                  </div>
                </div>

                <div className="at-nav-item" onClick={() => alert('Interview Schedule: Real-time candidate interview calendar.')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="12" cy="16" r="3" />
                      <polyline points="12 14 12 16 13 16" />
                    </svg>
                    <span>Interview Schedule</span>
                  </div>
                </div>

                <div className="at-nav-item" onClick={() => alert('Hiring Plan is configured in collaboration with Sister Company HRs.')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span>Hiring Plan</span>
                  </div>
                </div>

                {/* ORGANIZATION Section */}
                <div className="at-sidebar-section-title">Organization</div>
                <div className={`at-nav-item ${dashboardTab === 'users' ? 'active' : ''}`} onClick={() => setDashboardTab('users')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>Team Members</span>
                  </div>
                </div>

                <div className="at-nav-item" onClick={() => setPage('listing')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>Site Editor</span>
                  </div>
                </div>

                <div className="at-nav-item" onClick={() => alert('Corporate TAS Events calendar.')}>
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <circle cx="12" cy="16" r="3" />
                      <polyline points="12 14 12 16 13 16" />
                    </svg>
                    <span>Events</span>
                  </div>
                </div>

                <div className="at-sidebar-section-title">Views</div>
                <div className="at-nav-item">
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
                    <span>Done Issues</span>
                  </div>
                  <span style={{ background: '#2C333A', color: '#8C9BAB', fontSize: '11px', padding: '2px 6px', borderRadius: '10px' }}>4</span>
                </div>
                <div className="at-nav-item">
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
                    <span>Open Issues</span>
                  </div>
                </div>
                <div className="at-nav-item">
                  <div className="at-nav-item-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                    <span>KAN Board</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 16px' }}>
                <div style={{ fontSize: '12px', color: '#8C9BAB' }}>Powered by</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff', marginTop: '2px' }}>Droga Group TAS</div>
              </div>
            </div>

            {/* Main Panel Area */}
            <div className="at-main-container">
              {/* Inner Center Sidebar (Sister Companies List) */}
              <div className="at-center-sidebar">
                <div className="at-cs-title">Companies</div>
                <div className="at-cs-list">
                  <div
                    className={`at-cs-item ${selectedCompanyFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCompanyFilter('all')}
                  >
                    <span>All Companies</span>
                  </div>
                  {companies.map(c => (
                    <div
                      key={c.id}
                      className={`at-cs-item ${selectedCompanyFilter === c.id ? 'active' : ''}`}
                      onClick={() => setSelectedCompanyFilter(c.id)}
                    >
                      <span className={`at-cs-item-dot ${c.is_active ? '' : 'inactive'}`} />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="at-content">
                {/* Confluence Callout Card (matching Atlassian Screenshot) */}
                <div className="at-confluence-card">
                  <div className="at-confluence-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                    <span>Confluence Integration</span>
                  </div>
                  <div className="at-confluence-desc">
                    Get everyone on the same page. Create a centralized workspace to organize company profiles, employee databases, password records, and branch locations together.
                  </div>
                  <div className="at-confluence-actions">
                    <button className="btn-at-primary" onClick={() => alert('Confluence integration configured successfully!')}>Try it now</button>
                    <button className="btn-at-secondary" onClick={() => setPage('listing')}>Back to Careers</button>
                  </div>
                </div>

                {/* Grid */}
                <div className="at-grid">
                  {/* Users Tab */}
                  {dashboardTab === 'users' && (
                    <div className="at-card">
                      <div className="at-card-header">
                        <div className="at-card-title">Active Users ({
                          users.filter(u => {
                            const matchesComp = selectedCompanyFilter === 'all' || u.company_id === selectedCompanyFilter;
                            const matchesQuery = searchQuery === '' || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
                            return matchesComp && matchesQuery;
                          }).length
                        })</div>
                        <button className="btn-at-primary" onClick={() => {
                          setUserForm({ name: '', email: '', password: '', role: 'hr', company_id: '' });
                          setEditingUser(null);
                          setUserModalOpen(true);
                        }}>+ Add User</button>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="at-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Sister Company</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.filter(u => {
                              const matchesComp = selectedCompanyFilter === 'all' || u.company_id === selectedCompanyFilter;
                              const matchesQuery = searchQuery === '' || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
                              return matchesComp && matchesQuery;
                            }).map(u => (
                              <tr key={u.id}>
                                <td><strong style={{ color: '#fff' }}>{u.name}</strong></td>
                                <td>{u.email}</td>
                                <td>{u.company?.name || <span style={{ color: '#8C9BAB', fontStyle: 'italic' }}>None</span>}</td>
                                <td>
                                  <span className={`at-badge ${u.role}`}>{u.role}</span>
                                </td>
                                <td>
                                  <span style={{ color: u.is_active ? '#36B37E' : '#FF5630', fontSize: '13px' }}>
                                    {u.is_active ? 'Active' : 'Suspended'}
                                  </span>
                                </td>
                                <td>
                                  <div className="at-actions-cell">
                                    <button className="btn-at-icon" title="Reset Password" onClick={() => {
                                      setResetUser(u);
                                      setResetPasswordVal('');
                                      setResetModalOpen(true);
                                    }}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                      </svg>
                                    </button>
                                    <button className="btn-at-icon" title="Edit User" onClick={() => openEditUser(u)}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                      </svg>
                                    </button>
                                    <button className="btn-at-icon" title="Delete User" style={{ color: '#FF5630' }} onClick={() => handleDeleteUser(u.id)}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Companies Tab */}
                  {dashboardTab === 'companies' && (
                    <div className="at-card">
                      <div className="at-card-header">
                        <div className="at-card-title">Sister Companies ({companies.length})</div>
                        <button className="btn-at-primary" onClick={() => {
                          setCompanyForm({ name: '', website: '' });
                          setEditingCompany(null);
                          setCompanyModalOpen(true);
                        }}>+ Add Company</button>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="at-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Slug</th>
                              <th>Website</th>
                              <th>Status</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies.filter(c => searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                              <tr key={c.id}>
                                <td><strong style={{ color: '#fff' }}>{c.name}</strong></td>
                                <td><code>{c.slug}</code></td>
                                <td>
                                  {c.website ? (
                                    <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ color: '#579DFF', textDecoration: 'none' }}>
                                      {c.website}
                                    </a>
                                  ) : '-'}
                                </td>
                                <td>
                                  <span style={{ color: c.is_active ? '#36B37E' : '#FF5630', fontSize: '13px' }}>
                                    {c.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td>
                                  <div className="at-actions-cell">
                                    <button className="btn-at-icon" title="Edit Company" onClick={() => openEditCompany(c)}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                      </svg>
                                    </button>
                                    <button className="btn-at-icon" title="Delete Company" style={{ color: '#FF5630' }} onClick={() => handleDeleteCompany(c.id)}>
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Audit Trail Sidebar (Activity Logs matching Confluence panel side) */}
            <div className="at-right-sidebar">

              <div className="at-confluence-promo">
                <div className="at-confluence-promo-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#579DFF" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                  <span>Droga Group</span>
                </div>
                <div className="at-confluence-promo-desc">
                  Keep your entire branch architecture and user policies documented in a unified space.
                </div>
                <button className="btn-at-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={() => alert('Confluence integrated!')}>Learn more</button>
              </div>
            </div>
          </div>

          {/* MODALS */}
          
          {/* Add / Edit User Modal */}
          {userModalOpen && (
            <div className="at-modal-overlay">
              <div className="at-modal">
                <div className="at-modal-header">
                  <div className="at-modal-title">{editingUser ? 'Edit User Details' : 'Create New User Account'}</div>
                  <button className="at-icon-btn" onClick={() => setUserModalOpen(false)}>×</button>
                </div>
                <form onSubmit={handleUserFormSubmit}>
                  <div className="at-modal-body">
                    <div className="at-form-group">
                      <label className="at-form-label">Full Name</label>
                      <input
                        type="text"
                        className="at-form-input"
                        required
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="at-form-group">
                      <label className="at-form-label">Email Address</label>
                      <input
                        type="email"
                        className="at-form-input"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="john@droga-group.com"
                      />
                    </div>

                    {!editingUser && (
                      <div className="at-form-group">
                        <label className="at-form-label">Initial Password</label>
                        <input
                          type="password"
                          className="at-form-input"
                          required
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                    )}

                    <div className="at-form-group">
                      <label className="at-form-label">System Role</label>
                      <select
                        className="at-form-select"
                        value={userForm.role}
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="hr">HR Manager</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <div className="at-form-group">
                      <label className="at-form-label">Associate with Sister Company</label>
                      <select
                        className="at-form-select"
                        value={userForm.company_id}
                        onChange={(e) => setUserForm({ ...userForm, company_id: e.target.value })}
                      >
                        <option value="">None / Independent</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="at-modal-footer">
                    <button type="button" className="btn-at-secondary" onClick={() => setUserModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn-at-primary">Save User</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add / Edit Company Modal */}
          {companyModalOpen && (
            <div className="at-modal-overlay">
              <div className="at-modal">
                <div className="at-modal-header">
                  <div className="at-modal-title">{editingCompany ? 'Edit Company Profile' : 'Add Sister Company'}</div>
                  <button className="at-icon-btn" onClick={() => setCompanyModalOpen(false)}>×</button>
                </div>
                <form onSubmit={handleCompanyFormSubmit}>
                  <div className="at-modal-body">
                    <div className="at-form-group">
                      <label className="at-form-label">Company Name</label>
                      <input
                        type="text"
                        className="at-form-input"
                        required
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        placeholder="Droga Pharma"
                      />
                    </div>
                    
                    <div className="at-form-group">
                      <label className="at-form-label">Website URL</label>
                      <input
                        type="url"
                        className="at-form-input"
                        value={companyForm.website}
                        onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                        placeholder="https://pharma.droga-group.com"
                      />
                    </div>
                  </div>
                  <div className="at-modal-footer">
                    <button type="button" className="btn-at-secondary" onClick={() => setCompanyModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn-at-primary">Save Company</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Password Reset Modal */}
          {resetModalOpen && (
            <div className="at-modal-overlay">
              <div className="at-modal">
                <div className="at-modal-header">
                  <div className="at-modal-title">Reset User Password</div>
                  <button className="at-icon-btn" onClick={() => setResetModalOpen(false)}>×</button>
                </div>
                <form onSubmit={handleResetPasswordSubmit}>
                  <div className="at-modal-body">
                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#8C9BAB' }}>
                      Change password for <strong style={{ color: '#fff' }}>{resetUser?.name}</strong> ({resetUser?.email})
                    </div>
                    <div className="at-form-group">
                      <label className="at-form-label">New Password</label>
                      <input
                        type="password"
                        className="at-form-input"
                        required
                        value={resetPasswordVal}
                        onChange={(e) => setResetPasswordVal(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                      />
                    </div>
                  </div>
                  <div className="at-modal-footer">
                    <button type="button" className="btn-at-secondary" onClick={() => setResetModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn-at-primary">Update Password</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
