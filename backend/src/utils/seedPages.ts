import Page from '../models/Page';

const DEFAULT_PAGES = [
  {
    title: 'About Us',
    slug: 'about-us',
    heroSubtitle: "Building India's trusted wholesale marketplace for modern businesses and suppliers.",
    seoTitle: 'About Us - Premium Wholesale B2B Sourcing Portal',
    seoDescription: 'Find out about our history, verified suppliers network, bulk logistics, and corporate directory guidelines.',
    content: `<p>Connecting wholesale B2B buyers with verified manufacturers and direct suppliers globally. Simplify your bulk sourcing process with transparency, speed, and safety.</p>
<div class="highlight-box">
  <strong>Our Core Mission:</strong> To bridge the gap between large-scale industrial manufacturers and bulk retail buyers through state-of-the-art logistics and secure digital trade mechanisms.
</div>

<h2>Why Choose Our B2B Marketplace?</h2>
<div class="feature-grid">
  <div class="feature-card">
    <h3>Verified Factories</h3>
    <p>Every single seller on our platform undergoes a rigorous 5-step authentication process, including physical site audit and legal compliance registration checks.</p>
  </div>
  <div class="feature-card">
    <h3>Bulk Pricing Benefits</h3>
    <p>Secure direct factory pricing by cutting out middle-tier brokers. Access dynamic wholesale pricing tiers tailored to your company's monthly ordering volumes.</p>
  </div>
  <div class="feature-card">
    <h3>Secure Logistics</h3>
    <p>All bulk orders are backed by contract escrow mechanisms and cargo freight shipping guarantees, including real-time container tracking.</p>
  </div>
</div>

<blockquote>
  "We are not just a B2B platform; we are a growth engine for small-to-medium manufacturing units across the country."
  <br><span style="font-size: 14px; font-weight: normal; color: #64748b; font-style: normal; margin-top: 4px; display: inline-block;">— CEO & Founder</span>
</blockquote>

<h2>Key Achievements in Numbers</h2>
<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Stat / Volume</th>
      <th>Year-on-Year Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Verified Suppliers</td>
      <td>15,000+ Manufacturers</td>
      <td>+45% YoY</td>
    </tr>
    <tr>
      <td>Monthly Bulk Cargo Volume</td>
      <td>120,000 Metric Tons</td>
      <td>+30% YoY</td>
    </tr>
    <tr>
      <td>Active Wholesale Buyers</td>
      <td>180,000+ Business Accounts</td>
      <td>+60% YoY</td>
    </tr>
  </tbody>
</table>`,
    isActive: true,
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    heroSubtitle: "How we collect, manage, and protect your enterprise data and transaction logs.",
    seoTitle: 'Privacy Policy - Wholesale B2B Marketplace',
    seoDescription: 'Read about our ISO 27001 data protection protocols, client transaction logs privacy, and buyer information usage.',
    content: `<p>Your privacy and corporate data security are paramount. This policy documents how we collect, store, and utilize details regarding your company transactions, bulk inquiries, and operational profile.</p>

<h2>1. Data Collection Methods</h2>
<p>In order to provide wholesale matchmaking and freight logistics, we collect corporate credentials during business onboarding:</p>
<ul>
  <li><strong>Corporate Profiles:</strong> Business tax registration details (GSTIN/TIN/IEC), company legal names, and business addresses.</li>
  <li><strong>Catalog Searches:</strong> Search queries, viewed wholesale listings, and quote requests (RFQs).</li>
  <li><strong>Inquiry History:</strong> Messaging logs between buyers and suppliers, shipping requests, and payment parameters.</li>
</ul>

<div class="highlight-box">
  <strong>Enterprise Safeguards:</strong> All data is stored in ISO 27001 certified cloud environments with end-to-end TLS 1.3 encryption and role-based access management.
</div>

<h2>2. Use of Information</h2>
<p>We use collected data to simplify bulk matching processes, provide logistics suggestions, execute custom payment escrows, and maintain audit records for taxation.</p>`,
    isActive: true,
  },
  {
    title: 'Terms of Use',
    slug: 'terms-of-use',
    heroSubtitle: "General regulations, commercial contracts, and dispute resolution mechanisms.",
    seoTitle: 'Terms of Use & Commercial Trade Regulations',
    seoDescription: 'Review B2B trade laws, contract escrows guidelines, buyer eligibility standards, and dispute arbitration.',
    content: `<p>These terms govern all wholesale transaction activity, catalog listings, RFQ submission processes, and direct seller communications executed on this B2B platform.</p>

<h2>1. Wholesale Buyer Eligibility</h2>
<p>Only verified business entities (corporations, partnership firms, proprietorships) with active tax registrations (GSTIN/TIN) are allowed to execute commercial transactions on this platform. Retail consumer accounts are strictly prohibited.</p>

<h2>2. Seller Contracts & Escrows</h2>
<ul>
  <li><strong>Direct Quotation:</strong> All quotes issued by suppliers must remain valid for a minimum of 14 calendar days.</li>
  <li><strong>Escrow Terms:</strong> Buyers payment is held securely in escrow and released to the supplier only upon verified delivery confirmation from the logistics partner.</li>
</ul>

<blockquote>
  "Failure to comply with wholesale B2B trade laws or attempting bypass transactions off-platform will result in immediate company suspension."
</blockquote>`,
    isActive: true,
  },
  {
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    heroSubtitle: "LCL/FCL logistics arrangements, cargo handling times, and port-to-port guidelines.",
    seoTitle: 'Bulk Cargo Shipping & Sea Freight Delivery Policy',
    seoDescription: 'Port handling durations, domestic rail cargo logistics routes, and container clearing fees.',
    content: `<p>We partner with leading bulk freight carriers and customs clearing agents to ensure prompt delivery of your container cargo (LCL/FCL).</p>

<h2>1. Transit Speeds & Port Handling</h2>
<table>
  <thead>
    <tr>
      <th>Shipping Route</th>
      <th>Carrier Type</th>
      <th>Estimated Transit Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Domestic Rail Freight</td>
      <td>Container Train (CONCOR)</td>
      <td>3 – 5 Days</td>
    </tr>
    <tr>
      <td>Port-to-Port Sea Cargo</td>
      <td>Dry Cargo Vessel (FCL)</td>
      <td>12 – 18 Days</td>
    </tr>
    <tr>
      <td>Express Air Cargo</td>
      <td>Commercial Air Freight</td>
      <td>2 – 4 Days</td>
    </tr>
  </tbody>
</table>

<div class="highlight-box">
  <strong>Note on Customs Clearance:</strong> Export duties and customs processing fees are calculated dynamically at checkout depending on the shipping destination and HS codes.
</div>`,
    isActive: true,
  },
];

export const seedPages = async () => {
  try {
    for (const pageData of DEFAULT_PAGES) {
      const existing = await Page.findOne({ slug: pageData.slug });
      if (!existing) {
        const newPage = new Page(pageData);
        await newPage.save();
        console.log(`Seeded dynamic B2B CMS page: /${pageData.slug}`);
      } else {
        // If the page exists but is missing the new subtitle/SEO fields, update it without touching user content.
        let changed = false;
        if (existing.heroSubtitle === undefined || existing.heroSubtitle === '') {
          existing.heroSubtitle = pageData.heroSubtitle;
          changed = true;
        }
        if (existing.seoTitle === undefined || existing.seoTitle === '') {
          existing.seoTitle = pageData.seoTitle;
          changed = true;
        }
        if (existing.seoDescription === undefined || existing.seoDescription === '') {
          existing.seoDescription = pageData.seoDescription;
          changed = true;
        }
        
        if (changed) {
          await existing.save();
          console.log(`Updated legacy CMS page parameters for: /${pageData.slug}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to seed CMS pages:', error);
  }
};
