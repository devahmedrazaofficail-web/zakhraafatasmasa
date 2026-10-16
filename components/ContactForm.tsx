'use client';

import { useRef } from 'react';

/* Contact form: opens the visitor's mail app (mailto), exactly like the
   original page. The recipient is still the placeholder address —
   replace CONTACT_EMAIL with the real one when available. */
export const CONTACT_EMAIL = 'hello@example.com';

export function ContactForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form
      className="contact-form"
      id="contactForm"
      onSubmit={(e) => {
        e.preventDefault();
        const n = nameRef.current?.value ?? '';
        const s = subjectRef.current?.value ?? '';
        const m = msgRef.current?.value ?? '';
        window.location.href =
          `mailto:${CONTACT_EMAIL}?subject=` +
          encodeURIComponent(`[زخرفة أسماء] ${s} — ${n}`) +
          `&body=` +
          encodeURIComponent(m);
      }}
    >
      <label htmlFor="cname">الاسم</label>
      <input id="cname" ref={nameRef} type="text" required placeholder="اسمك الكريم" />
      <label htmlFor="cemail">البريد الإلكتروني</label>
      <input
        id="cemail"
        type="email"
        required
        placeholder="you@example.com"
        dir="ltr"
        style={{ textAlign: 'left' }}
      />
      <label htmlFor="csubject">الموضوع</label>
      <select id="csubject" ref={subjectRef}>
        <option>اقتراح ميزة جديدة</option>
        <option>إبلاغ عن مشكلة</option>
        <option>استفسار عام</option>
      </select>
      <label htmlFor="cmsg">الرسالة</label>
      <textarea id="cmsg" ref={msgRef} required placeholder="اكتب رسالتك هنا…" />
      <button className="btn-primary" type="submit">
        إرسال الرسالة
      </button>
    </form>
  );
}
