"use client";

/**
 * TransitionLink Component
 * Link with View Transitions API for smooth page transitions
 * Includes navigation progress indicator
 */

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition, type ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, children, ...props }: LinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, startTransition] = useTransition();

  const targetUrl = typeof href === "string" ? href : href.pathname || "/";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Skip if same page
      if (targetUrl === pathname) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      onClick?.(e);

      startTransition(() => {
        if (document.startViewTransition) {
          document.startViewTransition(() => router.push(targetUrl));
        } else {
          router.push(targetUrl);
        }
      });
    },
    [onClick, router, targetUrl, pathname, startTransition]
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
