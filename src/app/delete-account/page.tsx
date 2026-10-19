import type { Metadata } from 'next';
import PolicyPage, { Contact } from '@/components/policy/PolicyPage';
import { BRAND } from '@/config/brand';
export const metadata: Metadata = { title: 'Account & data deletion', description: `How to delete your ${BRAND.name} data.` };

export default function Page() {
  return (
    <PolicyPage title="Account & data deletion"
      intro={<p>The {BRAND.name} app (in.jagaly.app) currently has <strong>no user accounts</strong>, and everything you enter is stored only on your own device. You can delete it yourself at any time, instantly.</p>}
      sections={[
        { id: 'in-app', t: 'Delete your data in the app', b: <ol className="ml-5 list-decimal space-y-1"><li>Open the {BRAND.name} app.</li><li>Go to the <strong>Profile</strong> tab.</li><li>Under Settings, tap <strong>Delete my data</strong>, then <strong>Delete</strong>.</li></ol> },
        { id: 'what', t: 'What is deleted', b: <p>Saved homes, visit requests, draft listings (including any phone number you typed), Verified Tenant demo details and settings. Deletion is immediate and permanent. Uninstalling the app also removes all of it.</p> },
        { id: 'server', t: 'Data held by us', b: <p>In this version {BRAND.name} keeps no personal data on its servers, so there is nothing further to delete. If you believe we hold data about you, or once accounts launch, email <Contact /> with the subject “Delete my data” and the phone number or email you used. We will confirm and delete it within 30 days, except records we must keep by law (we will tell you which, and for how long).</p> },
      ]} />
  );
}
