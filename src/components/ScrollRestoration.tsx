import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if this is a navigation (not a page reload)
    // We can detect this by checking if the page was just loaded
    const isPageReload = performance.getEntriesByType('navigation')[0] &&
      (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'reload';

    if (!isPageReload) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollRestoration;