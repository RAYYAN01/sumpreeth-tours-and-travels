import { clsx } from "clsx";

type Bleed = "page" | "surface" | "forest";
type Size = "sm" | "md" | "lg";

/** Background treatment for the full-bleed band. */
const BLEED: Record<Bleed, string> = {
  page: "bg-page",
  surface: "bg-surface",
  forest: "bg-forest-900 text-forest-100",
};

/** The single source of vertical rhythm for marketing sections. */
const SIZE: Record<Size, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-20 lg:py-28",
  lg: "py-20 sm:py-28 lg:py-36",
};

type Props = {
  children: React.ReactNode;
  /** Band background. Defaults to the page colour. */
  bleed?: Bleed;
  /** Vertical padding step. Defaults to `md`. */
  size?: Size;
  /** Wrap children in `.container-page`. Set false for custom inner layout. */
  container?: boolean;
  /** Extra classes for the inner container (or the section when `container` is false). */
  className?: string;
  id?: string;
};

/**
 * One primitive for every marketing section so vertical spacing, max-width and
 * background bands stay consistent across the site.
 */
export default function Section({
  children,
  bleed = "page",
  size = "md",
  container = true,
  className,
  id,
}: Props) {
  return (
    <section
      id={id}
      className={clsx(BLEED[bleed], SIZE[size], !container && className)}
    >
      {container ? (
        <div className={clsx("container-page", className)}>{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
