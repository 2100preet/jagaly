import type { Metadata } from 'next';
import PostWizard from './PostWizard';
export const metadata: Metadata = { title: 'Post your property free' };
export default function Page() { return <PostWizard />; }
