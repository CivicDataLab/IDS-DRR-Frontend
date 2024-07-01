import { useRouter } from 'next/navigation';

import { onStart } from '@/lib/router-events/events';

export const usePRouter = () => {
  const router = useRouter();

  const { push, replace } = router;

  router.replace = (href, options) => {
    onStart();
    replace(href, options);
  };

  router.push = (href, options) => {
    onStart();
    push(href, options);
  };

  return router;
};
