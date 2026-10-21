import { PolicyPageData } from '@/types/policyPage';

export const defaultPolicyPages: Record<string, PolicyPageData> = {
  'terms-and-conditions': {
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80',
    heroTitle: 'Terms Of Use',
    heroSubtitle: 'Legal terms, service conditions, and client rights governing the use of Mighty Warner enterprise solutions.',
    heroBadge: 'Legal Agreement',
    metaTitle: 'Terms and Conditions | Mighty Warner',
    metaDescription: 'Read the official Terms and Conditions of Mighty Warner Inc. Understand client rights, service terms, and operational guidelines.',
    isActive: true,
    order: 1,
    content: `
      <h2>Terms Of Use:</h2>
      <p>Mighty Warner provides free, fast and transparent terms and conditions. Mighty Warner provides a legal contract to you with all the Terms and Conditions, limited exchange period, and refund rights. The right to apply and amend our models or request a refund applies within thirty (30) calendar days from the agreed terms &amp; conditions (reclamation period) starting from the date of purchase. If you opt out, the right under client privileges automatically terminates as per selected services and signed terms &amp; conditions you can ask for refund. Third party changed or non-refundable items; plugins or integrations or shipping / courier charges are non-refundable. Terms will not depend on service usage measures.</p>
      
      <p>Like many other Websites, Mighty Warner makes use of <a href="/privacy-policy">log files</a>. The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user movement around the site, and gather demographic information. IP addresses and other such information are not linked to any information that is personally identifiable.</p>
      
      <h3>Remember:</h3>
      <p>This clause applies to Third Party Advertisers systems/agencies/servers/associates which are in agreement of third party rights notice. Consulting others or third party will not invalidate/delay this clause. You agree to follow policy/court states jurisdiction of <strong>INDIA, UAE, and/or USA</strong>.</p>
      
      <h3>Concept:</h3>
      <p>Certain Terms defined in these Terms and Conditions are referable to the <a href="/privacy-policy">Privacy Policy</a> and are integrated by reference to these Terms and Conditions.</p>
      
      <h3>COMPONENTS or Service:</h3>
      <p><strong>Content:</strong> Software, Materials, Services and other related information are collectively referred to as Content.</p>
      <p><strong>You:</strong> "You" means you individually, any person, including any employer that you are acting on behalf of.</p>
      <p><strong>Terms that are applicable to you:</strong> Subscribed or single service or project fees paid to Mighty Warner are considered non-refundable or refundable strictly as per signed terms &amp; conditions. After the standard 7 days (maximum 15 days) initial review period: No refund is permitted if haven't signed/agreed to our Conditions/Clarifications. If module creation or deployment has occurred for a client, customer, or "YOU" side after contract signing or agreement to terms &amp; conditions, then for the covered period, all charges or equivalent percentage from the agreed amount apply.</p>
      <p><em>Remember:</em> Mighty Warner's submitted complimentary services for contracts—such as images, contents, UI/UX designs, or components for website development and designing—are not payable on replacement against your discrepancy or comments. Complimentary services can be suspended, stopped, or become chargeable under circumstances as per signed terms &amp; conditions, and we will inform the customer/client by email or phone.</p>
      
      <h3>Materials:</h3>
      <p>Any materials, showcases, sample work, content, or website designs of your business or focus, productions, or rights to work agreed upon between you and MW enterprise channel or authorized custodians will be subject to this agreement.</p>
      
      <h3>Payment Process:</h3>
      <p>Payment for selection or hiring services or project is applicable when the customer, client or "YOU" consent. Alternatively, refund eligibility is applicable after consent and receipt of written notice given via signed agreement of terms &amp; conditions. If payment is to be done between the date of start or start of work as agreed in writing by Mighty Warner, unpaid payment past due will result in cessation of services or contract termination. If payment is delayed past 10 days of the agreed milestone date, Mighty Warner may initiate termination for the service or contract.</p>
      
      <h3>Billing Process:</h3>
      <p>All billing from Mighty Warner regarding services, work, or orders applies as per quotation agreed or signed agreement. When credit card information is provided, you authorize the merchant invoice to process the mentioned amount. If there are any charges for extra services, changes in scope, or additional criteria in a later phase, formal calculated details for the scope change will be provided. Where calculations involve electronic card tax or statutory levies, charges will be accounted according to applicable financial rules.</p>
      
      <h3>Renewal Process:</h3>
      <p>We at Mighty Warner always prioritize maximum client satisfaction. Ongoing hiring and renewal services are non-ceasing if Mighty Warner is satisfied with the terms of the focused service and project. Accounts process automatically for the renewal period ordered in the recurring contract. In case you wish to adjust the format of the contract or renewal cycle (from 1 year up to 5 years), please contact Mighty Warner directly.</p>
      
      <h3>Termination of Policy or Contract:</h3>
      <p>The services available are governed under the guidelines of our <a href="/privacy-policy">Privacy Policy</a> entered into with Mighty Warner, which is considered an integral part of this contract.</p>
      <p>If it is determined that a customer, client, or YOU have engaged in harmful activity or violated core contract principles, we reserve the right to terminate and take legal action without further notice. Temporary suspension may occur due to circumstances beyond reasonable control, including acts of God, global network disruptions, or infrastructure failures.</p>
      <p>While receiving technical support and installing authorized diagnostic tools, necessary system telemetry may be transferred for analysis, including scan metrics, environment resources, and security status. Such data is protected under strict organizational controls and compliance standards.</p>
      
      <h3>Third Party Products and Services:</h3>
      <p>We use trusted third-party tools, cloud integrations, and APIs to fulfill client workforce commands. By using these features, you agree to comply with third-party tool terms and conditions. Mighty Warner holds no direct liability for deliberate external platform faults or third-party service deprecations, but will provide suitable migration paths and enterprise alternatives.</p>
    `,
  },

  'disclaimer': {
    slug: 'disclaimer',
    title: 'Disclaimer',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    heroTitle: 'Legal Disclaimer',
    heroSubtitle: 'Important disclosures regarding our digital consulting, technology platforms, and advisory representations.',
    heroBadge: 'Legal Notice',
    metaTitle: 'Legal Disclaimer | Mighty Warner',
    metaDescription: 'Read the official Disclaimer for Mighty Warner Inc. Understand limitations of liability, professional disclosures, and technological representations.',
    isActive: true,
    order: 2,
    content: `
      <h2>Website & Services Disclaimer</h2>
      <p>The information provided by Mighty Warner Inc. ("we," "us," or "our") on our website and through our digital services is for general informational and enterprise consulting purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site or our associated software systems.</p>

      <h3>1. Professional Advice Disclaimer</h3>
      <p>Our website cannot and does not contain legal, financial, or tax advice. The technology, growth strategy, engineering, and digital marketing insights are provided for general educational and informational purposes only and are not a substitute for formal professional consultation. Before taking any actions based upon such information, we encourage you to consult with the appropriate enterprise specialists and legal advisors.</p>

      <h3>2. External Links & Integrations Disclaimer</h3>
      <p>The site may contain (or you may be sent through the site to) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
      <p>We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through our site or any website or feature linked in any banner or other advertising.</p>

      <h3>3. Performance & Results Disclaimer</h3>
      <p>Any statements, case study metrics, revenue forecasts, or client growth statistics displayed on this site represent historical client outcomes or projected capabilities under specific conditions. They do not constitute a guarantee, warranty, or prediction regarding the outcome of your specific project, campaign, or software deployment. Individual business results vary depending on execution, market conditions, budget, and business models.</p>

      <h3>4. Technological "As-Is" Representation</h3>
      <p>All custom web applications, software code demonstrations, calculators, and interactive widgets are provided "as is" and "as available" without any warranties of uninterrupted uptime or error-free execution. While Mighty Warner adheres to top-tier cybersecurity and continuous integration standards, we make no guarantees against unforeseen third-party API deprecations or internet service disruptions.</p>

      <h3>5. Limitation of Liability</h3>
      <p>Under no circumstance shall Mighty Warner Inc., its executives, engineers, or partners be liable to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
    `,
  },

  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80',
    heroTitle: 'Privacy Policy',
    heroSubtitle: 'How Mighty Warner collects, encrypts, processes, and protects your personal and enterprise data.',
    heroBadge: 'Data Protection & Privacy',
    metaTitle: 'Privacy Policy | Mighty Warner',
    metaDescription: 'Learn how Mighty Warner Inc. safeguards your personal information, complies with GDPR and CCPA, and manages website telemetry.',
    isActive: true,
    order: 3,
    content: `
      <h2>Privacy & Data Governance Policy</h2>
      <p>Mighty Warner Inc. ("Mighty Warner", "we", "our", or "us") is dedicated to protecting your personal data and ensuring transparent digital operations. This Privacy Policy details the types of personal data we collect, how it is processed and secured, and your rights concerning your personal information under applicable global privacy regulations, including GDPR, CCPA, and statutory frameworks.</p>

      <h3>1. Information We Collect</h3>
      <p>We collect information to provide high-performance engineering, digital consulting, and talent solutions:</p>
      <ul>
        <li><strong>Direct Inquiries & Contact:</strong> Full name, professional email address, phone number, corporate organization, project requirements, and lead form inputs.</li>
        <li><strong>Automated Telemetry & Cookies:</strong> IP addresses, browser types, operating systems, page load times, referrer URLs, and interaction patterns tracked via encrypted session cookies.</li>
        <li><strong>Client Onboarding Information:</strong> Billing contacts, contractual milestones, technical architecture diagrams, and authorized developer credentials shared under signed Non-Disclosure Agreements (NDAs).</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>Your data is processed strictly for legitimate business and contractual purposes:</p>
      <ul>
        <li>To architect, develop, deploy, and maintain custom technology products and client services.</li>
        <li>To communicate project milestones, diagnostic assessments, sprint updates, and invoices.</li>
        <li>To optimize website UX, analyze performance bottlenecks, and protect against malicious cyber attacks.</li>
        <li>To deliver relevant corporate insights, case studies, and engineering updates with explicit opt-out privileges.</li>
      </ul>

      <h3>3. Sharing & Third-Party Processors</h3>
      <p>Mighty Warner does not sell, lease, or monetize your personal or corporate data under any circumstances. We share data only with trusted enterprise infrastructure providers under strict Data Processing Agreements (DPAs):</p>
      <ul>
        <li>Cloud hosting and database infrastructures (e.g., AWS, Neon PostgreSQL, Cloudinary, Vercel).</li>
        <li>CRM and transactional communication providers (e.g., SendGrid, HubSpot).</li>
        <li>Authorized legal or statutory authorities when strictly mandated by enforceable court orders or law.</li>
      </ul>

      <h3>4. Data Security & Storage</h3>
      <p>We implement end-to-end encryption protocols (TLS 1.3 in transit and AES-256 at rest) to safeguard your information against unauthorized intrusion, alteration, or disclosure. Access to client databases and production credentials is strictly gated through Multi-Factor Authentication (MFA) and least-privilege role boundaries.</p>

      <h3>5. Your Rights (GDPR & CCPA)</h3>
      <p>Depending on your jurisdiction, you hold sovereign data rights, including:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a full copy of the personal data we hold about you.</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete records.</li>
        <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> Request complete deletion of your records subject to legal retention obligations.</li>
        <li><strong>Right to Restrict or Object:</strong> Object to processing of your personal information for direct marketing.</li>
      </ul>
      <p>To exercise any of these privileges, contact our data protection team directly at <a href="mailto:privacy@mightywarner.com">privacy@mightywarner.com</a>.</p>
    `,
  },

  'refund-policy': {
    slug: 'refund-policy',
    title: 'Refund Policy',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2000&q=80',
    heroTitle: 'Refund & Cancellation Policy',
    heroSubtitle: 'Clear, milestone-based refund parameters and service cancellation terms across all client engagements.',
    heroBadge: 'Payment & Billing',
    metaTitle: 'Refund Policy | Mighty Warner',
    metaDescription: 'Review Mighty Warner’s official Refund and Cancellation Policy. Understand milestone signoffs, retainer parameters, and dispute resolution.',
    isActive: true,
    order: 4,
    content: `
      <h2>Refund and Cancellation Terms</h2>
      <p>At Mighty Warner Inc., we pride ourselves on building durable, high-impact business relationships. Our billing and refund policies are structured to maintain clarity, accountability, and fair business practices for custom engineering, digital marketing, and talent staffing contracts.</p>

      <h3>1. Custom Engineering & Development Projects</h3>
      <p>Custom software development, web applications, and platform builds are executed under structured milestone schedules outlined in your Statement of Work (SOW):</p>
      <ul>
        <li><strong>Discovery & Architecture Phase:</strong> Upfront discovery, wireframing, and architecture design deposits are non-refundable once sprint kickoff meetings have commenced and architecture documents have been delivered.</li>
        <li><strong>Milestone Deliverables:</strong> Invoices are billed upon completion of predefined milestone phases (e.g., Alpha Release, QA Staging, Final Production Deployment). Once a milestone has been reviewed, tested, and signed off by the client, the corresponding milestone payment is non-refundable.</li>
        <li><strong>Defect Remediation:</strong> If deliverables fail to meet agreed technical specifications during the acceptance testing window, Mighty Warner will remediate, refactor, and correct identified defects at zero additional cost within our warranty window.</li>
      </ul>

      <h3>2. Retainers & Growth Marketing Services</h3>
      <p>Recurring digital growth, SEO campaigns, and continuous engineering retainers are billed on a monthly cycle in advance:</p>
      <ul>
        <li>Retainer cancellation requires thirty (30) calendar days written notice sent to your dedicated account executive or via email to <a href="mailto:billing@mightywarner.com">billing@mightywarner.com</a>.</li>
        <li>Services rendered during an active billing cycle are non-refundable. If notice is received midway through a cycle, work continues through the remainder of the paid period with no renewal charges thereafter.</li>
      </ul>

      <h3>3. Talent Solutions & Staff Augmentation</h3>
      <p>For dedicated contingent staffing and engineering pods:</p>
      <ul>
        <li>Staffing retainers are billed based on verified talent hours and SOW sprint commitments.</li>
        <li>If an assigned specialist does not align with your technical expectations, Mighty Warner provides a 14-day replacement guarantee, substituting qualified talent with expedited onboarding at no replacement fee.</li>
      </ul>

      <h3>4. Non-Refundable Items</h3>
      <p>The following items are strictly non-refundable under all circumstances:</p>
      <ul>
        <li>Third-party platform fees, API licenses, cloud hosting compute (AWS, Google Cloud, Azure, Vercel), and domain acquisitions.</li>
        <li>Paid advertising budgets spent directly with media platforms (Google Ads, Meta Ads, LinkedIn Campaign Manager).</li>
        <li>Completed strategy audits, security scans, and custom codebase handovers.</li>
      </ul>

      <h3>5. Dispute Resolution</h3>
      <p>If you have any questions or disputes regarding an invoice or project milestone, please contact our billing administration at <a href="mailto:billing@mightywarner.com">billing@mightywarner.com</a> within fifteen (15) calendar days of invoice generation. We will review all logs, commit histories, and milestone documents to reach a prompt and equitable resolution.</p>
    `,
  },
};
