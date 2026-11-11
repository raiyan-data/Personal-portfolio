import { useState, useEffect, useRef, FormEvent, FocusEvent } from 'react';
import { Copy, Check, ArrowUpRight, ArrowRight, ArrowDown, X } from 'lucide-react';
import SectionHeader from './SectionHeader.tsx';
import Card from './Card.tsx';
import Stack from './Stack.tsx';

const WEB3FORMS_ACCESS_KEY = '84e10ff3-28b7-4e01-a728-e05de6f250ba';
const RATE_LIMIT_SECONDS = 30;

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface UtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

interface ContactSectionProps {
  onOpenCvModal?: () => void;
}

export default function ContactSection({ onOpenCvModal }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [copyAnnouncement, setCopyAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [utmData, setUtmData] = useState<UtmData>({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
  });

  const emailAddress = 'rmhislam@gmail.com';
  const linkedInUrl = 'https://www.linkedin.com/in/raiyan-islam-/';

  // Read and store UTM parameters in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source');
      const medium = params.get('utm_medium');
      const campaign = params.get('utm_campaign');

      if (source || medium || campaign) {
        const stored = {
          utm_source: source || '',
          utm_medium: medium || '',
          utm_campaign: campaign || '',
        };
        sessionStorage.setItem('portfolio_utm', JSON.stringify(stored));
        setUtmData(stored);
      } else {
        const existing = sessionStorage.getItem('portfolio_utm');
        if (existing) {
          try {
            setUtmData(JSON.parse(existing));
          } catch {}
        }
      }
    }
  }, []);

  // Warn on page navigation if message is filled but unsent
  useEffect(() => {
    const isDirty = formData.name.trim() || formData.email.trim() || formData.message.trim();
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSuccess) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, isSuccess]);

  // Validation logic
  const validateField = (field: 'name' | 'email' | 'message', value: string): string | undefined => {
    const val = value.trim();
    if (field === 'name') {
      if (!val) return 'Name is required.';
      if (val.length < 2) return 'Name must be at least 2 characters.';
      if (val.length > 80) return 'Name must be 80 characters or fewer.';
    }
    if (field === 'email') {
      if (!val) return 'Email is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) return 'Please enter a valid email address.';
    }
    if (field === 'message') {
      if (!val) return 'Message is required.';
      if (val.length < 10) return 'Message must be at least 10 characters.';
      if (val.length > 2000) return 'Message must be 2000 characters or fewer.';
    }
    return undefined;
  };

  const handleBlur = (field: 'name' | 'email' | 'message') => (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, e.target.value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: 'name' | 'email' | 'message', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Rate limit check: one submission per 30 seconds per browser
    const lastSubmit = sessionStorage.getItem('portfolio_contact_last_submit');
    if (lastSubmit) {
      const elapsedSeconds = (Date.now() - Number(lastSubmit)) / 1000;
      if (elapsedSeconds < RATE_LIMIT_SECONDS) {
        const remainingSeconds = Math.ceil(RATE_LIMIT_SECONDS - elapsedSeconds);
        setSubmitError(`Please wait ${remainingSeconds}s before sending another message.`);
        return;
      }
    }

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const messageErr = validateField('message', formData.message);

    const newErrors: FormErrors = {
      name: nameErr,
      email: emailErr,
      message: messageErr,
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });

    if (nameErr || emailErr || messageErr) {
      if (nameErr) document.getElementById('contact-name')?.focus();
      else if (emailErr) document.getElementById('contact-email')?.focus();
      else if (messageErr) document.getElementById('contact-message')?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          subject: 'New message from your portfolio',
          from_name: 'Portfolio contact form',
          botcheck: botcheck,
          utm_source: utmData.utm_source,
          utm_medium: utmData.utm_medium,
          utm_campaign: utmData.utm_campaign,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        sessionStorage.setItem('portfolio_contact_last_submit', String(Date.now()));
        setIsSuccess(true);
        setSubmitError('');
      } else {
        setSubmitError(
          'Something went wrong. Your message was not sent. Try again, or email me at rmhislam@gmail.com.'
        );
      }
    } catch {
      setSubmitError(
        'Something went wrong. Your message was not sent. Try again, or email me at rmhislam@gmail.com.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setCopyAnnouncement('Email address copied to clipboard');
      setTimeout(() => {
        setCopied(false);
        setCopyAnnouncement('');
      }, 2000);
    } catch {
      setCopied(true);
      setCopyAnnouncement('Email address copied to clipboard');
      setTimeout(() => {
        setCopied(false);
        setCopyAnnouncement('');
      }, 2000);
    }
  };

  const hasContent = formData.name.trim() || formData.email.trim() || formData.message.trim();

  const handleClearClick = () => {
    if (hasContent) {
      setShowDiscardModal(true);
    }
  };

  const handleConfirmDiscard = () => {
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTouched({ name: false, email: false, message: false });
    setSubmitError('');
    setBotcheck(false);
    setShowDiscardModal(false);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setFormData({ name: '', email: '', message: '' });
    setTouched({ name: false, email: false, message: false });
    setErrors({});
    setSubmitError('');
    setBotcheck(false);
  };

  return (
    <section id="contact" className="section-padding bg-[var(--bg)] border-t border-[var(--rule)]">
      <div className="content-container">
        {/* Section Heading Block */}
        <SectionHeader
          number="05"
          label="Contact"
          title="Direct inquiries"
          intro="Reach out regarding software opportunities, student internships, or data questions."
        />

        {/* 12-Column Grid, 32px desktop, 24px tablet/phone gutter */}
        <div className="grid grid-cols-12 gap-[var(--s-6)] lg:gap-[var(--s-7)] items-start">
          {/* Left Column (7 cols): Contact Form with Card component */}
          <div className="col-span-12 lg:col-span-7">
            <Card gap={6}>
              <div className="border-b border-[var(--rule)] pb-[var(--s-4)] flex items-center justify-between">
                <span className="label-mono">Send a message</span>
                {hasContent && !isSuccess && (
                  <button
                    type="button"
                    onClick={handleClearClick}
                    className="min-h-[44px] inline-flex items-center font-mono-plex text-[12px] text-[var(--muted)] hover:text-[var(--accent)] underline underline-offset-4 swiss-focus cursor-pointer"
                  >
                    Clear draft
                  </button>
                )}
              </div>

              {isSuccess ? (
                /* Success Confirmation Panel */
                <Stack gap={4} className="py-[var(--s-7)]" role="status" aria-live="polite">
                  <h3 className="editorial-h3 text-[var(--ink)]">
                    Message sent
                  </h3>
                  <p className="editorial-body text-[var(--muted)]">
                    Thanks for reaching out. I will reply to the email you gave me.
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="btn-secondary min-h-[44px] w-full sm:w-auto"
                    >
                      <span>Send another message</span>
                    </button>
                  </div>
                </Stack>
              ) : (
                /* Form: label to input 8px, field to field 24px, last field to submit row 32px */
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot field for spam prevention */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    id="botcheck"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden sr-only"
                    style={{ display: 'none' }}
                    checked={botcheck}
                    onChange={(e) => setBotcheck(e.target.checked)}
                  />

                  {/* Hidden UTM fields */}
                  <input type="hidden" name="utm_source" value={utmData.utm_source} />
                  <input type="hidden" name="utm_medium" value={utmData.utm_medium} />
                  <input type="hidden" name="utm_campaign" value={utmData.utm_campaign} />

                  <Stack gap={6}>
                    {/* Name field: label -> 8px -> input */}
                    <Stack gap={2}>
                      <label htmlFor="contact-name" className="label-mono">
                        Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={80}
                        readOnly={isSubmitting}
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={handleBlur('name')}
                        aria-invalid={Boolean(touched.name && errors.name)}
                        aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                        placeholder="Your full name"
                        className={`w-full px-[var(--s-4)] py-[var(--s-3)] text-[16px] font-mono-plex bg-[var(--bg)] text-[var(--ink)] border rounded-[4px] placeholder:text-[var(--muted)]/60 swiss-focus transition-colors duration-150 ${
                          touched.name && errors.name
                            ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                            : 'border-[var(--rule)]'
                        } ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                      />
                      {touched.name && errors.name && (
                        <p id="name-error" className="editorial-small text-[var(--accent)] font-mono-plex">
                          {errors.name}
                        </p>
                      )}
                    </Stack>

                    {/* Email field: label -> 8px -> input */}
                    <Stack gap={2}>
                      <label htmlFor="contact-email" className="label-mono">
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        readOnly={isSubmitting}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={handleBlur('email')}
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                        placeholder="your.email@example.com"
                        className={`w-full px-[var(--s-4)] py-[var(--s-3)] text-[16px] font-mono-plex bg-[var(--bg)] text-[var(--ink)] border rounded-[4px] placeholder:text-[var(--muted)]/60 swiss-focus transition-colors duration-150 ${
                          touched.email && errors.email
                            ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                            : 'border-[var(--rule)]'
                        } ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                      />
                      {touched.email && errors.email && (
                        <p id="email-error" className="editorial-small text-[var(--accent)] font-mono-plex">
                          {errors.email}
                        </p>
                      )}
                    </Stack>

                    {/* Message field: label -> 8px -> textarea with live character counter in Plex Mono 12px */}
                    <Stack gap={2}>
                      <div className="flex items-center justify-between">
                        <label htmlFor="contact-message" className="label-mono">
                          Message *
                        </label>
                        <span className="font-mono-plex text-[12px] text-[var(--muted)] tabular-nums" aria-live="off">
                          {formData.message.length} / 2000
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        rows={5}
                        maxLength={2000}
                        required
                        readOnly={isSubmitting}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        onBlur={handleBlur('message')}
                        aria-invalid={Boolean(touched.message && errors.message)}
                        aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
                        placeholder="Write your note or inquiry..."
                        className={`w-full px-[var(--s-4)] py-[var(--s-3)] text-[16px] bg-[var(--bg)] text-[var(--ink)] border rounded-[4px] placeholder:text-[var(--muted)]/60 swiss-focus transition-colors duration-150 ${
                          touched.message && errors.message
                            ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                            : 'border-[var(--rule)]'
                        } ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                      />
                      {touched.message && errors.message && (
                        <p id="message-error" className="editorial-small text-[var(--accent)] font-mono-plex">
                          {errors.message}
                        </p>
                      )}
                    </Stack>

                    {/* Failure or Rate limit error message above Send button with 14px and 1px --accent border */}
                    {submitError && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="p-[var(--s-3)] border border-[var(--accent)] rounded-[4px] bg-[var(--bg)] text-[14px] text-[var(--ink)] leading-normal"
                      >
                        {submitError ===
                        'Something went wrong. Your message was not sent. Try again, or email me at rmhislam@gmail.com.' ? (
                          <p className="text-[14px] leading-normal m-0">
                            Something went wrong. Your message was not sent. Try again, or email me at{' '}
                            <a href="mailto:rmhislam@gmail.com" className="swiss-link font-medium">
                              rmhislam@gmail.com
                            </a>
                            .
                          </p>
                        ) : (
                          <p className="text-[14px] leading-normal m-0">{submitError}</p>
                        )}
                      </div>
                    )}

                    {/* Submit row: 32px above submit row */}
                    <div className="pt-[var(--s-7)] border-t border-[var(--rule)] flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn-primary w-full sm:w-auto h-[48px] sm:h-auto min-h-[44px] ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="relative z-10">{isSubmitting ? 'Sending' : 'Send'}</span>
                        <ArrowRight size={14} strokeWidth={2} className="relative z-10" />
                      </button>
                    </div>
                  </Stack>
                </form>
              )}
            </Card>
          </div>

          {/* Right Column (5 cols): Direct Channels with Card component */}
          <div className="col-span-12 lg:col-span-5">
            <Card gap={6}>
              <div className="border-b border-[var(--rule)] pb-[var(--s-4)]">
                <span className="label-mono">Direct channels</span>
              </div>

              {/* Pairs: 8px between label & value, 24px between pairs */}
              <Stack gap={6}>
                {/* Email address with copy button */}
                <Stack gap={2}>
                  <span className="label-mono">Email address</span>
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-[var(--s-3)]">
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-[16px] sm:text-[17px] text-[var(--ink)] swiss-link font-medium break-all"
                    >
                      {emailAddress}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="min-h-[44px] px-[var(--s-4)] py-[var(--s-2)] border border-[var(--rule)] rounded-[4px] text-[12px] font-mono-plex text-[var(--ink)] hover:bg-[var(--bg)] transition-colors duration-150 swiss-focus inline-flex items-center gap-[var(--s-2)] shrink-0 cursor-pointer"
                      aria-label="Copy email address"
                    >
                      {copied ? (
                        <>
                          <Check size={13} strokeWidth={2.5} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} strokeWidth={2} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div aria-live="polite" className="sr-only">
                    {copyAnnouncement}
                  </div>
                </Stack>

                {/* LinkedIn Link */}
                <div className="border-t border-[var(--rule)] pt-[var(--s-6)]">
                  <Stack gap={2}>
                    <span className="label-mono">Professional profile</span>
                    <div>
                      <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-[var(--s-2)] text-[15px] swiss-link font-mono-plex"
                      >
                        <span>LinkedIn Profile</span>
                        <ArrowUpRight size={14} strokeWidth={2} />
                      </a>
                    </div>
                  </Stack>
                </div>

                {/* Download resume link */}
                <div className="border-t border-[var(--rule)] pt-[var(--s-6)]">
                  <Stack gap={2}>
                    <span className="label-mono">Curriculum vitae</span>
                    <div>
                      <button
                        type="button"
                        onClick={onOpenCvModal}
                        className="min-h-[44px] inline-flex items-center gap-[var(--s-2)] text-[15px] swiss-link font-mono-plex cursor-pointer"
                      >
                        <span>Download resume</span>
                        <ArrowDown size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </Stack>
                </div>

                {/* Location context */}
                <div className="border-t border-[var(--rule)] pt-[var(--s-6)]">
                  <Stack gap={2}>
                    <span className="label-mono">Location</span>
                    <p className="editorial-small text-[var(--ink)]">
                      Silver Spring, MD (Washington, D.C. Metropolitan Area)
                    </p>
                  </Stack>
                </div>
              </Stack>
            </Card>
          </div>
        </div>
      </div>

      {/* Discard Draft Modal */}
      {showDiscardModal && (
        <DiscardModal
          onConfirm={handleConfirmDiscard}
          onCancel={() => setShowDiscardModal(false)}
        />
      )}
    </section>
  );
}

interface DiscardModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function DiscardModal({ onConfirm, onCancel }: DiscardModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    cancelBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--s-6)] sm:p-[var(--s-8)] bg-black/60"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discard-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[460px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] rounded-[4px] p-[var(--s-7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Stack gap={6}>
          <div className="flex items-start justify-between border-b border-[var(--rule)] pb-[var(--s-4)]">
            <h3 id="discard-title" className="editorial-h3 text-[var(--ink)]">
              Discard this message?
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="w-[44px] h-[44px] flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] swiss-focus"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>

          <p className="editorial-body text-[var(--muted)]">
            You have unsent text in your message. If you discard now, your input will be cleared.
          </p>

          <div className="flex items-center justify-end gap-[var(--s-3)] border-t border-[var(--rule)] pt-[var(--s-4)]">
            <button
              ref={cancelBtnRef}
              type="button"
              onClick={onCancel}
              className="btn-secondary min-h-[44px]"
            >
              <span>Cancel</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="btn-primary min-h-[44px]"
            >
              <span className="relative z-10">Discard</span>
            </button>
          </div>
        </Stack>
      </div>
    </div>
  );
}
