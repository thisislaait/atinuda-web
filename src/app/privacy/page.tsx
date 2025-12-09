// pages/privacy.tsx  (Next.js pages router)
// or app/privacy/page.tsx (Next.js app router)
import type { NextPage } from 'next';

const Privacy: NextPage = () => (
  <main style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px', fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a', lineHeight: 1.6 }}>
    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Privacy Policy</h1>
    <p style={{ color: '#475569', marginBottom: 24 }}>Effective: {new Date().toISOString().slice(0, 10)}</p>

    <section>
      <h2>Who We Are</h2>
      <p>Atinuda (“we”, “us”, or “our”) provides event and ticketing experiences for Atinuda events through our mobile and web apps.</p>
    </section>

    <section>
      <h2>Information We Collect</h2>
      <ul>
        <li>Account info: name, email, password (hashed via Firebase Auth).</li>
        <li>Profile details you add (company, interests, avatar).</li>
        <li>Event and ticket data: purchases, QR codes, check-ins, RSVPs.</li>
        <li>Device and usage data: app interactions, device type, OS, diagnostics.</li>
        <li>Payments: processed by Flutterwave; we store transaction references, not card details.</li>
        <li>Uploads you provide (e.g., photos, speaker assets).</li>
      </ul>
    </section>

    <section>
      <h2>How We Use Information</h2>
      <ul>
        <li>Authenticate you and manage your account.</li>
        <li>Process ticket purchases and issue QR passes.</li>
        <li>Show event content (schedule, guides, lookbooks, speakers).</li>
        <li>Provide admin tooling for authorized staff (attendees, speakers, analytics).</li>
        <li>Improve app performance, security, and support.</li>
        <li>Send service-related updates about events and tickets.</li>
      </ul>
    </section>

    <section>
      <h2>Sharing & Disclosure</h2>
      <ul>
        <li>Service providers: Firebase (Auth/Firestore/Storage), Flutterwave (payments), hosting/analytics vendors.</li>
        <li>Event operations: authorized Atinuda staff for attendee management.</li>
        <li>Legal/safety: if required by law or to protect rights and security.</li>
        <li>No sale of personal data; no third-party advertising networks.</li>
      </ul>
    </section>

    <section>
      <h2>Data Security</h2>
      <p>We use HTTPS/TLS and industry-standard controls. No proprietary encryption is implemented.</p>
    </section>

    <section>
      <h2>Data Retention</h2>
      <p>We retain data for as long as needed to provide services and meet legal obligations. You may request deletion of your account and associated personal data, subject to legal requirements.</p>
    </section>

    <section>
      <h2>Your Choices</h2>
      <ul>
        <li>Access/update your profile in-app.</li>
        <li>Request account deletion or data export by contacting support.</li>
        <li>Control notifications via device settings and in-app preferences.</li>
      </ul>
    </section>

    <section>
      <h2>International Transfers</h2>
      <p>Data may be processed in regions where our providers operate. We use reputable providers with appropriate safeguards.</p>
    </section>

    <section>
      <h2>Children</h2>
      <p>Our services are not directed to children under 13. We do not knowingly collect their data.</p>
    </section>

    <section>
      <h2>Changes</h2>
      <p>We may update this policy and will post the effective date above. Material changes will be communicated where required.</p>
    </section>

    <section>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:support@atinuda.africa">hello@atinuda.africa</a></p>
      <p>Website: <a href="https://www.atinuda.africa">https://www.atinuda.africa</a></p>
      
    </section>
  </main>
);

export default Privacy;
