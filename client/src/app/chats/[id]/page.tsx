'use client';

import { ChatTranscript } from '@/components/ChatTranscript';
import { RiskBadge } from '@/components/RiskBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ChatDetail } from '@/types/chat';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatDetailPage() {
  const params = useParams();
  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadChat(Number(params.id));
    }
  }, [params.id]);

  const loadChat = async (id: number) => {
    try {
      setLoading(true);
      const data = await api.getChat(id);
      setChat(data);
    } catch (err) {
      setError('Failed to load chat');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4 sm:p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading chat...</div>
        </div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className='container mx-auto p-4 sm:p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg text-destructive'>{error || 'Chat not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 max-w-7xl'>
      <div className='mb-6'>
        <Link href='/' className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back to Dashboard
        </Link>
      </div>

      <div className='grid gap-4 sm:gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Chat Transcript</CardTitle>
            </CardHeader>
            <CardContent className='overflow-hidden'>
              <ChatTranscript transcript={chat.transcript} riskFlags={chat.risk_flags} />
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4 sm:space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <div className='text-sm text-muted-foreground'>Agent</div>
                <div className='font-medium break-words'>{chat.agent_name}</div>
              </div>

              <div>
                <div className='text-sm text-muted-foreground'>Risk Score</div>
                <div className='flex items-center gap-2'>
                  <RiskBadge score={chat.risk_score} className='text-lg px-3 py-1' showIcon={false} />
                </div>
              </div>

              <div>
                <div className='text-sm text-muted-foreground'>Flags Found</div>
                <div className='font-medium'>{chat.risk_flags.length}</div>
              </div>

              <div>
                <div className='text-sm text-muted-foreground'>Analyzed</div>
                <div className='font-medium text-sm break-words'>{formatDate(chat.analyzed_at, 'long')}</div>
              </div>
            </CardContent>
          </Card>

          {chat.risk_flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {chat.risk_flags.map((flag, index) => (
                    <div key={index} className='p-3 bg-destructive/5 rounded-md border border-destructive/20'>
                      <div className='flex flex-wrap items-center gap-2 mb-2'>
                        <Badge variant='destructive' className='text-xs'>
                          {flag.type}
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                          Severity: {flag.severity}/10
                        </Badge>
                      </div>
                      <p className='text-sm text-destructive break-words'>{flag.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 