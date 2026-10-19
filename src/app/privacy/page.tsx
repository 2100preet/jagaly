import type { Metadata } from 'next';
import PolicyPage, { Contact, Placeholder } from '@/components/policy/PolicyPage';
import { BRAND } from '@/config/brand';
export const metadata: Metadata = { title: 'Privacy policy', description: `How ${BRAND.name} handles your data on the website and mobile app.` };

export default function Page() {
  return (
    <PolicyPage title="Privacy policy"
      intro={<><p>{BRAND.name} is an early-access real-estate app for {BRAND.city}. In this version, <strong>all listings are sample data</strong> and the app has <strong>no user accounts and no servers that receive your personal data</strong>. What you enter stays on your device. We will update this policy, and ask for your consent where required, before any feature starts sending personal data to us.</p></>}
      sections={[
        { id: 'who', t: 'Who we are', b: <p>{BRAND.legalEntity}, {BRAND.city}, Karnataka, India <Placeholder>company name and address to be confirmed</Placeholder>. Contact: <Contact />.</p> },
        { id: 'app', t: 'What the app stores, and where', b: <>
          <p>The app saves the following <strong>only on your device</strong> (local app storage), so it works between sessions:</p>
          <ul><li>Homes you save, and visit requests you create (name, date and time slot you type)</li><li>Draft listings you create in “Post property”, including the phone number you type for the demo OTP step (no SMS is sent; the demo code is shown in the app)</li><li>The optional Verified Tenant demo: the name and optional employer you type (no ID document, Aadhaar number or image is collected)</li><li>Settings such as language and alert preferences</li></ul>
          <p>None of this is sent to {BRAND.name} or to third parties. Uninstalling the app, or using <strong>Profile → Delete my data</strong>, removes it.</p></> },
        { id: 'collect', t: 'Data we collect', b: <p>In this version we do not collect personal data through the app: no account, no analytics or advertising SDKs, no location tracking, no contacts, camera, microphone or photo access. The app does not track you across other companies’ apps or websites.</p> },
        { id: 'third', t: 'Third-party services you may open', b: <ul><li><strong>Maps</strong>: on iOS the map is drawn by Apple Maps, which receives standard technical data (such as IP address) to load map tiles. On Android the app uses a built-in schematic map with no external service. The website map loads tiles from OpenStreetMap.</li><li><strong>WhatsApp, email, phone and share sheet</strong>: if you tap “Send on WhatsApp”, “Share” or “Support”, the text is handed to that app and that provider’s privacy policy applies.</li></ul> },
        { id: 'web', t: 'Website', b: <p>The website is a static site hosted on GitHub Pages. GitHub may log technical data such as IP address for security. We do not use cookies for tracking, advertising or analytics. Tools such as the agreement scan and the deposit calculator run in your browser; the text you paste is not uploaded.</p> },
        { id: 'future', t: 'When real features launch', b: <p>Planned features (real listings, masked calling, verified tenant KYC through a licensed partner, deposit escrow through a regulated partner) will process personal data. Before they go live we will update this policy, show in-app notices, ask for consent under India’s Digital Personal Data Protection Act, 2023, and update the store privacy disclosures. We will never sell your phone number or share it with brokers.</p> },
        { id: 'rights', t: 'Your choices and rights', b: <p>You can delete all app data at any time (see <a className="text-brand-700 underline" href="../delete-account/">Account &amp; data deletion</a>). Once we hold personal data about you, you will be able to access, correct and erase it, withdraw consent, and raise a grievance by writing to <Contact />.</p> },
        { id: 'children', t: 'Children', b: <p>{BRAND.name} is meant for adults looking for a home. It is not directed at children under 18 and we do not knowingly collect their data.</p> },
        { id: 'changes', t: 'Changes', b: <p>We will post changes here with a new “last updated” date, and tell you in the app if a change is significant.</p> },
      ]} />
  );
}
