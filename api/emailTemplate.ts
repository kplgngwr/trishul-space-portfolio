/**
 * Shared HTML email shell (header + branded footer) for transactional
 * emails sent via Resend. Uses inline styles + table layout for
 * compatibility across email clients (Gmail/Outlook strip <style> blocks).
 */

const BRAND = {
    name: 'Trishul Space',
    tagline: 'Propelling the future of space propulsion',
    website: 'https://www.trishulspace.com',
    logo: 'https://www.trishulspace.com/logo.png',
    linkedin: 'https://linkedin.com/company/trishul-space',
    email: 'info@trishulspace.com',
    legalName: 'Trishul Technology Private Limited',
    primary: '#1e40af',
} as const;

function renderFooter(): string {
    const year = new Date().getFullYear();
    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #e2e8f0;">
            <tr>
                <td style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;">
                    <img src="${BRAND.logo}" alt="${BRAND.name}" width="150" height="52" style="display:block;margin-bottom:10px;border:0;" />
                    <div style="font-size:14px;font-weight:700;color:#0f172a;">${BRAND.name}</div>
                    <div style="font-size:12px;color:#64748b;margin:2px 0 10px;">${BRAND.tagline}</div>
                    <div style="font-size:12px;color:#334155;">
                        <a href="mailto:${BRAND.email}" style="color:${BRAND.primary};text-decoration:none;">${BRAND.email}</a>
                        &nbsp;&middot;&nbsp;
                        <a href="${BRAND.website}" style="color:${BRAND.primary};text-decoration:none;">www.trishulspace.com</a>
                        &nbsp;&middot;&nbsp;
                        <a href="${BRAND.linkedin}" style="color:${BRAND.primary};text-decoration:none;">LinkedIn</a>
                    </div>
                    <div style="font-size:11px;color:#94a3b8;margin-top:12px;">
                        &copy; ${year} ${BRAND.legalName}. All rights reserved.
                    </div>
                </td>
            </tr>
        </table>
    `;
}

export function renderEmail(bodyHtml: string): string {
    return `
        <div style="background-color:#f1f5f9;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:560px;">
                            <tr>
                                <td style="background:${BRAND.primary};padding:18px 28px;">
                                    <span style="font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-size:17px;font-weight:700;letter-spacing:0.5px;">TRISHUL SPACE</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:28px;color:#0f172a;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
                                    ${bodyHtml}
                                    ${renderFooter()}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    `;
}
