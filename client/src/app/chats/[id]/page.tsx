'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { ChatDetail, RiskFlag } from '@/types/chat';
import { AlertTriangle, ArrowLeft, MessageSquare, User } from 'lucide-react';
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

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'destructive';
    if (score >= 4) return 'secondary';
    return 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTranscript = () => {
    if (!chat) return null;

    const lines = chat.transcript.split('\n').filter(line => line.trim());
    const flaggedLines = new Map<number, RiskFlag>();
    
    chat.risk_flags.forEach(flag => {
      flaggedLines.set(flag.message_index, flag);
    });

    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          const flag = flaggedLines.get(index);
          const isFlagged = !!flag;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isFlagged 
                  ? 'border-destructive/20 bg-destructive/5' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {line.startsWith('Customer:') ? (
                    <User className="h-5 w-5 text-blue-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-1">
                    {line.startsWith('Customer:') ? 'Customer' : 'Agent'}
                  </div>
                  <div className="text-sm">{line.replace(/^(Customer|Agent):\s*/, '')}</div>
                  
                  {isFlagged && (
                    <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <Badge variant="destructive" className="text-xs">
                          {flag.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Severity: {flag.severity}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-destructive-foreground">
                        {flag.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading chat...</div>
        </div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">{error || 'Chat not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Chat Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTranscript()}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Agent</div>
                <div className="font-medium">{chat.agent_name}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRiskColor(chat.risk_score)} className="text-lg px-3 py-1">
                    {chat.risk_score}/10
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Flags Found</div>
                <div className="font-medium">{chat.risk_flags.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Analyzed</div>
                <div className="font-medium">{formatDate(chat.analyzed_at)}</div>
              </div>
            </CardContent>
          </Card>

          {chat.risk_flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chat.risk_flags.map((flag, index) => (
                    <div key={index} className="p-3 bg-destructive/5 rounded-md border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs">
                          {flag.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Severity: {flag.severity}/10
                        </Badge>
                      </div>
                      <p className="text-sm">{flag.description}</p>
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