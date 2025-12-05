"use client";

/**
 * TransitionLink Component
 * Link with View Transitions API for smooth page transitions
 * Includes navigation progress indicator
 */

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect, type ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, children, ...props }: LinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const targetUrl = typeof href === "string" ? href : href.pathname || "/";

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Skip if same page
      if (targetUrl === pathname) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      onClick?.(e);
      setIsNavigating(true);

      // Use View Transitions API if available
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push(targetUrl);
        });
      } else {
        router.push(targetUrl);
      }
    },
    [href, onClick, router, targetUrl, pathname]
  );

  return (
    <Link
      href={href}
      onClick={handleClick}
      data-navigating={isNavigating || undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
