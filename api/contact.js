// POST /api/contact — demo request intake for d-contact.html.
//
// This is the Gallop team's own route.ts, ported from Next.js to a plain
// Vercel function: this site is static HTML/CSS, so there is no Next.js
// runtime and `app/api/contact/route.ts` would never be picked up. Vercel
// maps any file under /api to a URL, so this file *is* /api/contact.
//
// Only two things changed from their original — `NextResponse.json(...)`
// became the standard `Response.json(...)`, and the `next/server` import is
// gone. All validation, both allowlists, and the Resend call are unchanged.
//
// Requires RESEND_API_KEY in the Vercel project's environment variables.

import { Resend } from 'resend';

// Lazy-initialize to avoid build-time throw when key is absent
let resend = null;
function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY is not configured. Set it in the hosting environment to enable contact email delivery.',
      );
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_COMPANY = 200;
const MAX_FIELD = 100;
const MAX_MESSAGE = 5000;

// These must stay byte-identical to the <select> values in d-contact.html.
// A mismatched arrow (→ is U+2192) is coerced below rather than rejected, so
// it would silently drop lead metadata instead of surfacing an error.
const VALID_SYSTEM_TYPES = [
    'On-Prem → Public Cloud',
    'Monolith → Microservices',
    'Java Android → Flutter',
    'Vendor SaaS → In-House',
    'Oracle → PostgreSQL',
    'Hadoop → BigQuery',
    'Other',
];

const VALID_TIMELINES = [
    'Immediate (1 month)',
    'Within 3 months',
    '3-6 months',
    'Strategic planning (6+ months)',
];

function truncate(str, max) {
    return typeof str === 'string' ? str.slice(0, max) : '';
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, company, systemType, timeline, message } = body;

        // Validate required fields
        if (!name || !email || !company) {
            return Response.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate types
        if (typeof name !== 'string' || typeof email !== 'string' || typeof company !== 'string') {
            return Response.json(
                { error: 'Invalid field types' },
                { status: 400 }
            );
        }

        // Validate lengths
        if (name.length < 2 || name.length > MAX_NAME) {
            return Response.json(
                { error: 'Name must be between 2 and 100 characters' },
                { status: 400 }
            );
        }

        if (company.length < 2 || company.length > MAX_COMPANY) {
            return Response.json(
                { error: 'Company name must be between 2 and 200 characters' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > MAX_EMAIL) {
            return Response.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Validate dropdowns (accept valid values or silently default)
        const safeSystemType = VALID_SYSTEM_TYPES.includes(systemType) ? systemType : 'Other';
        const safeTimeline = VALID_TIMELINES.includes(timeline) ? timeline : '';

        // Truncate optional message
        const safeMessage = truncate(message || '', MAX_MESSAGE);

        const { error } = await getResend().emails.send({
            from: 'Gallop Leads <support@gallopintelligence.ai>',
            to: 'support@gallopintelligence.ai',
            replyTo: email,
            subject: `New Lead: ${truncate(name, MAX_NAME)} (${truncate(company, MAX_FIELD)})`,
            text: [
                `Name: ${name}`,
                `Company: ${company}`,
                `Email: ${email}`,
                safeSystemType ? `Modernization Type: ${safeSystemType}` : '',
                safeTimeline ? `Timeline: ${safeTimeline}` : '',
                safeMessage ? `\nMessage:\n${safeMessage}` : '',
                `\nReply to this email to contact the user directly.`,
            ].filter(Boolean).join('\n'),
        });

        if (error) {
            console.error('Resend error:', error);
            return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error processing contact request:', error);
        return Response.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
