import * as React from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

/** Link item for the nav bar. */
export interface NavigationLink {
  label: string;
  href: string;
}

/** Call-to-action button shown in the nav (e.g. "Get started"). */
export interface NavigationCTA {
  label: string;
  href: string;
}

/** Props for the Navigation component. */
export interface NavigationProps {
  logo: React.ReactNode;
  logoHref?: string;
  links: NavigationLink[];
  cta?: NavigationCTA;
  className?: string;
}

/**
 * Marketing site header with logo, nav links, optional CTA, and mobile drawer.
 * Uses a portaled overlay on small screens; locks body scroll when open.
 */
export function Navigation({ logo, logoHref, links, cta, className }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full border-b border-border/60 bg-background/90 shadow-[0_8px_30px_-12px_color-mix(in_oklch,var(--foreground)_12%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-background/55",
          className,
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-full items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center">
            {typeof logo === "string" ? (
              logoHref ? (
                <a
                  href={logoHref}
                  aria-label="Go to top"
                  className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
                >
                  {logo}
                </a>
              ) : (
                <span className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {logo}
                </span>
              )
            ) : (
              logo
            )}
          </div>
          <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {cta && (
              <div className="hidden md:flex">
                <Button asChild variant="default" size="sm" className="ds-mkt-btn-primary">
                  <a href={cta.href}>{cta.label}</a>
                </Button>
              </div>
            )}
            {/* Mobile hamburger - far right */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden min-h-[44px] min-w-[44px]"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed inset-0 top-0 z-[100] md:hidden",
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        <div
          className={cn(
            "fixed inset-y-0 right-0 top-0 z-[101] flex h-full w-[min(320px,85vw)] max-w-full flex-col shadow-2xl transition-transform duration-300 ease-out",
            "bg-[linear-gradient(180deg,hsl(0_0%_100%)_0%,hsl(199_50%_97%)_50%,hsl(199_60%_94%)_100%)]",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-5">
            <div onClick={() => setMobileMenuOpen(false)}>
              {typeof logo === "string" ? (
                logoHref ? (
                  <a
                    href={logoHref}
                    aria-label="Go to top"
                    className="text-xl font-extrabold tracking-tight text-foreground"
                  >
                    {logo}
                  </a>
                ) : (
                  <span className="text-xl font-extrabold tracking-tight text-foreground">
                    {logo}
                  </span>
                )
              ) : (
                logo
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-4 py-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {cta && (
              <div className="mt-6 px-4">
                <Button
                  asChild
                  variant="default"
                  className="ds-mkt-btn-primary w-full min-h-[48px]"
                  size="lg"
                >
                  <a
                    href={cta.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cta.label}
                  </a>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
