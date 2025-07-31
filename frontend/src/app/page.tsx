'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { ChatSummary } from '@/types/chat';
import { AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await api.getChats();
      setChats(data);
    } catch (err) {
      setError('Failed to load chats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'destructive';
    if (score >= 4) return 'secondary';
    return 'default';
  };

  const getRiskIcon = (score: number) => {
    if (score >= 7) return <AlertTriangle className='h-4 w-4' />;
    if (score >= 4) return <Clock className='h-4 w-4' />;
    return <CheckCircle className='h-4 w-4' />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg'>Loading chats...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-lg text-destructive'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>ChatAudit Dashboard</h1>
          <p className='text-muted-foreground mt-2'>Monitor and analyze customer support chat compliance</p>
        </div>
        <Link href='/upload'>
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            Upload Chat
          </Button>
        </Link>
      </div>

      {chats.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center h-64'>
            <div className='text-lg text-muted-foreground mb-4'>No chats analyzed yet</div>
            <Link href='/upload'>
              <Button>Upload Your First Chat</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chats/${chat.id}`}>
              <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
                <CardHeader className='pb-3'>
                  <div className='flex justify-between items-start'>
                    <CardTitle className='text-lg'>{chat.agent_name}</CardTitle>
                    <Badge variant={getRiskColor(chat.risk_score)}>
                      {getRiskIcon(chat.risk_score)}
                      <span className='ml-1'>{chat.risk_score}</span>
                    </Badge>
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
                      <span>{formatDate(chat.analyzed_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
