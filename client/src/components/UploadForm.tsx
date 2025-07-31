import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UploadForm() {
  const router = useRouter();
  const [agentName, setAgentName] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agentName.trim() || !transcript.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await api.createChat({
        agent_name: agentName.trim(),
        transcript: transcript.trim(),
      });

      // Redirect to the chat detail page
      router.push(`/chats/${result.id}`);
    } catch (err) {
      setError('Failed to upload chat. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='agent-name'>Agent Name</Label>
        <Input
          id='agent-name'
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder='e.g., Sarah Johnson, Mike Chen, or Agent ID'
          disabled={loading}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='transcript'>Chat Transcript</Label>
        <Textarea
          id='transcript'
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder='Paste the chat transcript here...'
          rows={12}
          disabled={loading}
        />
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground'>
            Include the full conversation between the agent and customer. Each message should start with
            &quot;Customer:&quot; or &quot;Agent:&quot; followed by the message content.
          </p>
          <div className='text-xs text-muted-foreground bg-muted/50 p-3 rounded-md'>
            <p className='font-medium mb-1'>Format example:</p>
            <p>Customer: [customer message]</p>
            <p>Agent: [agent response]</p>
            <p>Customer: [next customer message]</p>
            <p>Agent: [next agent response]</p>
          </div>
        </div>
      </div>

      {error && <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>{error}</div>}

      <div className='flex gap-3'>
        <Button type='submit' disabled={loading} className='flex-1'>
          {loading ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Analyzing...
            </>
          ) : (
            'Analyze Chat'
          )}
        </Button>
        <Link href='/'>
          <Button type='button' variant='outline' disabled={loading}>
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
} 