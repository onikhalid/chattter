import { cn } from '@/utils/classNames';

interface FormErrorProps {
  errorMessage?: string;
  className?: string;
}

export default function FormError({ errorMessage, className }: FormErrorProps) {
  return (
    <p
      className={cn(
        'mt-1.5 rounded-md bg-red-100 px-5 py-1.5 text-xs text-red-600 animate-in fade-in-40',
        className
      )}
    >
      {errorMessage || 'This is required'}
    </p>
  );
}
