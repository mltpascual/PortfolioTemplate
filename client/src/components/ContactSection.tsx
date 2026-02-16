/*
 * DESIGN: Warm Monochrome Editorial
 * Split layout: text left, form right.
 * Contact form sends messages via the backend notifyOwner API.
 */

import { useEffect, useRef, useState } from "react";
import { Send, MapPin, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { PortfolioData } from "@/hooks/usePortfolio";

interface ContactSectionProps {
  profile: PortfolioData["profile"];
  customTitle?: string;
}

export default function ContactSection({ profile, customTitle }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const contactMutation = trpc.system.notifyOwner.useMutation({
    onSuccess: () => {
      toast.success("Message sent! I'll get back to you soon.");
      setName("");
      setEmailInput("");
      setSubject("");
      setMessage("");
    },
    onError: () => {
      toast.error("Failed to send message. Please try again or email me directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name.trim() || !emailInput.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    contactMutation.mutate({
      title: `Portfolio Contact: ${subject || "New Message"}`,
      content: `From: ${name.trim()} <${emailInput.trim()}>\nSubject: ${subject.trim() || "N/A"}\n\n${message.trim()}`,
    });
  };

  const email = profile?.email || "alex@example.com";
  const phone = profile?.phone || "+1 (555) 123-4567";
  const location = profile?.location || "San Francisco, CA";

  return (
    <section id="contact" ref={sectionRef} className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase text-terracotta mb-4 block"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {customTitle || "Get in Touch"}
          </span>
          <h2
            className="text-4xl md:text-5xl text-charcoal leading-tight max-w-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Let's build something
            <br />
            <span className="text-terracotta italic">together.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p
              className="text-charcoal-light leading-relaxed text-base md:text-lg mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              I'm always interested in hearing about new projects, creative
              ideas, or opportunities to be part of your vision. Whether you
              have a question or just want to say hi, my inbox is open.
            </p>

            <div className="space-y-5">
              {email && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      Email
                    </p>
                    <a href={`mailto:${email}`} className="text-charcoal font-medium hover:text-terracotta transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      Phone
                    </p>
                    <span className="text-charcoal font-medium text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      {phone}
                    </span>
                  </div>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-light uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      Location
                    </p>
                    <span className="text-charcoal font-medium text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      {location}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <form onSubmit={handleSubmit} className="warm-card p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>
                    Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={200}
                    className="w-full px-5 py-3 rounded-full bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>
                    Email <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    required
                    maxLength={320}
                    className="w-full px-5 py-3 rounded-full bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this about?"
                  maxLength={300}
                  className="w-full px-5 py-3 rounded-full bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>
                  Message <span className="text-terracotta">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  required
                  maxLength={5000}
                  className="w-full px-5 py-4 rounded-2xl bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm resize-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="pill-primary gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {contactMutation.isPending ? (
                  <>
                    Sending...
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
