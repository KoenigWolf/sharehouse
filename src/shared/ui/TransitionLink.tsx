"use client";

/**
 * TransitionLink Component
 * Link with View Transitions API for smooth page transitions
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, type ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, children, ...props }: LinkProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClick?.(e);

      const url = typeof href === "string" ? href : href.pathname || "/";

      // Use View Transitions API if available
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push(url);
        });
      } else {
        router.push(url);
      }
    },
    [href, onClick, router]
  );

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
