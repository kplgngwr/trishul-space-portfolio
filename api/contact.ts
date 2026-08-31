import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { isValidEmail } from '../src/shared/lib/validation';
import { renderEmail } from './emailTemplate';

interface ContactFormData {
    name: string;
    email: string;
    organization: string;
    subject: string;
    message: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValidBody(body: unknown): body is ContactFormData {
    if (!body || typeof body !== 'object') return false;
    const data = body as Record<string, unknown>;
    return (
        typeof data.name === 'string' && data.name.trim().length > 0 &&
        typeof data.email === 'string' && isValidEmail(data.email) &&
        typeof data.subject === 'string' && data.subject.trim().length > 0 &&
        typeof data.message === 'string' && data.message.trim().length > 0 &&
        (data.organization === undefined || typeof data.organization === 'string')
    );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method not allowed.' });
        return;
    }

    if (!isValidBody(req.body)) {
        res.status(400).json({ success: false, message: 'Please fill in all required fields with a valid email address.' });
        return;
    }

    const { name, email, organization, subject, message } = req.body as ContactFormData;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.NOREPLY_EMAIL;
    const teamEmail = process.env.Trishul_EMAIL;

    if (!apiKey || !fromEmail || !teamEmail) {
        console.error('[api/contact] Missing RESEND_API_KEY, NOREPLY_EMAIL, or Trishul_EMAIL env var.');
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        return;
    }

    const resend = new Resend(apiKey);
    const safeName = escapeHtml(name.trim());
    const safeOrg = organization ? escapeHtml(organization.trim()) : '';
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br />');

    try {
        const { error } = await resend.emails.send({
            from: `Trishul Website <${fromEmail}>`,
            to: teamEmail,
            replyTo: email.trim(),
            subject: `New Contact Form Submission: ${subject.trim()}`,
            html: renderEmail(`
                <h2 style="margin:0 0 16px;font-size:18px;color:#0f172a;">New contact form submission</h2>
                <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
                <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
                ${safeOrg ? `<p style="margin:0 0 8px;"><strong>Organization:</strong> ${safeOrg}</p>` : ''}
                <p style="margin:0 0 8px;"><strong>Subject:</strong> ${safeSubject}</p>
                <p style="margin:16px 0 4px;"><strong>Message:</strong></p>
                <p style="margin:0;">${safeMessage}</p>
            `),
        });

        if (error) {
            console.error('[api/contact] Failed to send team notification:', error);
            res.status(502).json({ success: false, message: 'Something went wrong. Please try again later.' });
            return;
        }
    } catch (err) {
        console.error('[api/contact] Failed to send team notification:', err);
        res.status(502).json({ success: false, message: 'Something went wrong. Please try again later.' });
        return;
    }

    try {
        const { error } = await resend.emails.send({
            from: `Trishul Space <${fromEmail}>`,
            to: email.trim(),
            subject: "We've received your message — Trishul",
            html: renderEmail(`
                <p style="margin:0 0 12px;">Hi ${safeName},</p>
                <p style="margin:0 0 12px;">Thank you for reaching out to Trishul. We've received your message and our team will get back to you shortly.</p>
                <p style="margin:16px 0 4px;"><strong>Your message:</strong></p>
                <p style="margin:0 0 12px;">${safeMessage}</p>
                <p style="margin:16px 0 0;">— Team Trishul</p>
            `),
        });
        if (error) {
            console.error('[api/contact] Failed to send visitor auto-reply:', error);
        }
    } catch (err) {
        console.error('[api/contact] Failed to send visitor auto-reply:', err);
    }

    res.status(200).json({ success: true, message: 'Thank you! Your message has been received.' });
}
