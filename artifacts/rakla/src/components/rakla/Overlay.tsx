import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function Drawer({ open, onOpenChange, title, children, footer, side = 'end', testId }: { open: boolean; onOpenChange: (b: boolean) => void; title: ReactNode; children: ReactNode; footer?: ReactNode; side?: 'end' | 'start'; testId?: string }) {
  const { t, dir } = useLang();
  const fromRight = (side === 'end') === (dir === 'ltr');
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <D.Content
          dir={dir}
          data-testid={testId}
          className={cn(
            'fixed top-0 bottom-0 z-50 flex w-full max-w-[420px] flex-col bg-chalk shadow-2xl outline-none duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out',
            fromRight ? 'right-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right' : 'left-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
          )}
        >
          <div className="flex items-center justify-between border-b border-ink/10 bg-pitch px-5 py-4 text-chalk">
            <D.Title className="font-display text-lg font-extrabold">{title}</D.Title>
            <D.Description className="sr-only">{typeof title === 'string' ? title : ''}</D.Description>
            <D.Close aria-label={t('close')} data-testid="button-close-drawer" className="grid h-9 w-9 place-items-center rounded-full bg-chalk/10 transition hover:bg-volt hover:text-ink focus-visible:outline-2 focus-visible:outline-volt">
              <X className="h-5 w-5" />
            </D.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="border-t border-ink/10 bg-chalk p-5">{footer}</div>}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

export function Modal({ open, onOpenChange, title, children, className, hideTitle, testId }: { open: boolean; onOpenChange: (b: boolean) => void; title: string; children: ReactNode; className?: string; hideTitle?: boolean; testId?: string }) {
  const { t, dir } = useLang();
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <D.Content
          dir={dir}
          data-testid={testId}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-chalk shadow-2xl outline-none duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className,
          )}
        >
          <D.Title className={cn('px-6 pt-6 font-display text-xl font-extrabold text-ink', hideTitle && 'sr-only')}>{title}</D.Title>
          <D.Description className="sr-only">{title}</D.Description>
          <D.Close aria-label={t('close')} data-testid="button-close-modal" className="absolute end-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/80 text-chalk transition hover:bg-volt hover:text-ink focus-visible:outline-2 focus-visible:outline-volt">
            <X className="h-5 w-5" />
          </D.Close>
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
