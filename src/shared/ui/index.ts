/**
 * Shared UI Components barrel export
 *
 * Usage:
 * import { Input, Modal } from "@/src/shared/ui";
 * import { Button } from "@/components/ui/button"; // shadcn/ui
 */

export { Input, type InputProps } from "./Input";
export { Modal, type ModalProps } from "./Modal";
export { Spinner, type SpinnerProps } from "./Spinner";
export { Avatar, type AvatarProps } from "./Avatar";
export { Badge, type BadgeProps } from "./Badge";
export {
  Skeleton,
  SkeletonCard,
  SkeletonAvatar,
  type SkeletonProps,
} from "./Skeleton";
export { RoutePreloader } from "./RoutePreloader";
export { TransitionLink } from "./TransitionLink";
export { SkipLink } from "./SkipLink";
