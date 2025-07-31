import { RiskBadge } from '@/components/RiskBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { ChatSummary } from '@/types/chat';
import Link from 'next/link';

interface ChatCardProps {
  chat: ChatSummary;
}

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <Link href={`/chats/${chat.id}`}>
      <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
        <CardHeader className='pb-3'>
          <div className='flex justify-between items-start'>
            <CardTitle className='text-lg'>{chat.agent_name}</CardTitle>
            <RiskBadge score={chat.risk_score} />
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>Flags:</span>
              <span>{chat.flag_count}</span>
            </div>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>Analyzed:</span>
              <span>{formatDate(chat.analyzed_at, 'short')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
