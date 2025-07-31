import { Badge } from '@/components/ui/badge';
import { RiskFlag } from '@/types/chat';
import { AlertTriangle, MessageSquare, User } from 'lucide-react';

interface ChatTranscriptProps {
  transcript: string;
  riskFlags: RiskFlag[];
}

export function ChatTranscript({ transcript, riskFlags }: ChatTranscriptProps) {
  const lines = transcript.split('\n').filter((line) => line.trim());
  const flaggedLines = new Map<number, RiskFlag>();

  riskFlags.forEach((flag) => {
    flaggedLines.set(flag.message_index, flag);
  });

  return (
    <div className='space-y-4'>
      {lines.map((line, index) => {
        const flag = flaggedLines.get(index);
        const isFlagged = !!flag;

        return (
          <div
            key={index}
            className={`p-3 sm:p-4 rounded-lg border ${
              isFlagged ? 'border-destructive/20 bg-destructive/5' : 'border-border bg-card'
            }`}
          >
            <div className='flex items-start gap-2 sm:gap-3'>
              <div className='flex-shrink-0 mt-0.5'>
                {line.startsWith('Customer:') ? (
                  <User className='h-4 w-4 sm:h-5 sm:w-5 text-blue-500' />
                ) : (
                  <MessageSquare className='h-4 w-4 sm:h-5 sm:w-5 text-green-500' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium mb-1'>
                  {line.startsWith('Customer:') ? 'Customer' : 'Agent'}
                </div>
                <div className='text-sm break-words whitespace-pre-wrap'>
                  {line.replace(/^(Customer|Agent):\s*/, '')}
                </div>

                {isFlagged && (
                  <div className='mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20'>
                    <div className='flex flex-wrap items-center gap-2 mb-2'>
                      <AlertTriangle className='h-4 w-4 text-destructive flex-shrink-0' />
                      <Badge variant='destructive' className='text-xs'>
                        {flag.type}
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        Severity: {flag.severity}/10
                      </Badge>
                    </div>
                    <p className='text-sm text-destructive break-words'>{flag.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 