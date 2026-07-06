export default function PrivacyPage() {
  return (
    <div className="main-container fade-in-up" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Last updated: July 2026</p>
        
        <div style={{ lineHeight: 1.8, color: '#e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>1. Introduction</h2>
          <p style={{ marginBottom: '24px' }}>
            Welcome to ContentMultiplier. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>2. Data We Collect</h2>
          <p style={{ marginBottom: '24px' }}>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
            <li><strong>Identity Data</strong> includes email address and profile information.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, specifically the YouTube URLs you submit and the content packs generated.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>3. How We Use Your Data</h2>
          <p style={{ marginBottom: '24px' }}>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., generating AI content).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>4. Data Security</h2>
          <p style={{ marginBottom: '24px' }}>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </div>
      </div>
    </div>
  );
}
