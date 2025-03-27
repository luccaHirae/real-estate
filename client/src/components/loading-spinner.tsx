import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Loader2 className='animate-spin w-10 h-10 text-secondary-600' />
    </div>
  );
}
