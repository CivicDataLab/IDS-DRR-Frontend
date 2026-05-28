import { forwardRef } from 'react';

import { Link as NextLink } from '@/i18n/navigation';
import { onStart } from '../events';
import { shouldTriggerStartEvent } from './should-trigger-start-event';

export const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
  function Link({ href, onClick, ...rest }, ref) {
    const useLink = href && href.startsWith('/');
    if (!useLink) return <a href={href} onClick={onClick} {...rest} />;

    return (
      <NextLink
        href={href}
        onClick={(event) => {
          if (shouldTriggerStartEvent(href, event)) onStart();
          if (onClick) onClick(event);
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);
