'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadForm } from '@/components/UploadForm';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className='container mx-auto p-6 max-w-2xl'>
      <div className='mb-6'>
        <Link href='/' className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='h-4 w-4 mr-1' />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Upload className='h-5 w-5 mr-2' />
            Upload Chat for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
} 