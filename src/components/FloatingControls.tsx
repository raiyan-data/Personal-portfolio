import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function FloatingControls() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isContactInView, setIsContactInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Back-to-top appears after 600px of scroll
      setShowBackToTop(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver to hide floating contact button when Contact is in viewport
    const contactSection = document.getElementById('contact');
    let observer: IntersectionObserver | null = null;

    if (contactSection && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsContactInView(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observer.observe(contactSection);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer && contactSection) {
        observer.unobserve(contactSection);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="floating-controls pointer-events-none">
      {/* Floating contact button: hidden on phone, visible on md+, scrolls to form */}
      {!isContactInView && (
        <button
          type="button"
          onClick={scrollToContact}
          className="pointer-events-auto fixed bottom-[calc(var(--s-6)+env(safe-area-inset-bottom))] left-[var(--s-6)] md:bottom-[var(--s-8)] md:left-[var(--s-8)] z-30 hidden md:inline-flex items-center justify-center min-h-[44px] px-[var(--s-5)] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 rounded-[4px] font-mono-plex text-[12px] uppercase tracking-[0.08em] shadow-none swiss-focus cursor-pointer"
          aria-label="Scroll to contact form"
        >
          Contact
        </button>
      )}

      {/* Back-to-top button: appears after 600px of scroll, 44px tap target, safe area inset bottom */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="pointer-events-auto fixed bottom-[calc(var(--s-6)+env(safe-area-inset-bottom))] right-[var(--s-6)] md:bottom-[var(--s-8)] md:right-[var(--s-8)] z-30 w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] transition-colors duration-150 rounded-[4px] shadow-none swiss-focus cursor-pointer"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
