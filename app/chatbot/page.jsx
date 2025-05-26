import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import FlowBuilder from '../components/FlowBuilder';

export default async function ChatbotFlowPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login?callbackUrl=/chatbot');
  }
  return <FlowBuilder />;
}
