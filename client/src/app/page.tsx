'use client';

import { ChatCard } from '@/components/ChatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { ChatSummary } from '@/types/chat';
import { Plus } from 'lucide-react';
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
            <ChatCard key={chat.id} chat={chat} />
          ))}
        </div>
      )}
    </div>
  );
}
