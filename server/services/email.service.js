import nodemailer from "nodemailer"

// ── Transporter ───────────────────────────────────────────────────────────────

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const baseWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cogniva</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f3f3;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f3f3;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:28px 40px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Cogniva</span>
              <span style="color:#4ade80;font-size:22px;font-weight:700;">.</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} Cogniva. All rights reserved.<br/>
                This email was sent to you because you created or manage a Cogniva account.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

const primaryBtn = (href, label) =>
    `<a href="${href}" style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600;margin:20px 0;">${label}</a>`

// ── Templates ─────────────────────────────────────────────────────────────────



const welcomeEmailTemplate = (name) => ({
    subject: "Welcome to Cogniva 🎉",
    html: baseWrapper(`
        <h2 style="margin:0 0 8px;font-size:24px;color:#111827;">Welcome aboard, ${name}! 🚀</h2>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 16px;">
            Your account is ready. We've added 100 free credits to help you get started with AI-powered mock interviews.

Good luck with your interview preparation! 🚀
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:0;margin:0 0 24px;">
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#15803d;">What you can do with Cogniva:</p>
              <ul style="margin:0;padding-left:20px;color:#4b5563;font-size:14px;line-height:2;">
                <li>Practice unlimited AI mock interviews</li>
                <li>Get instant, detailed feedback reports</li>
                <li>Track your progress over time</li>
                <li>Prepare for any role or industry</li>
              </ul>
            </td>
          </tr>
        </table>
        <div style="text-align:center;">
            ${primaryBtn(process.env.FRONTEND_URL + "/interview", "Start Your First Interview")}
        </div>
    `),
})

const passwordResetEmailTemplate = (name, resetUrl) => ({
    subject: "Reset your Cogniva password",
    html: baseWrapper(`
        <h2 style="margin:0 0 8px;font-size:24px;color:#111827;">Password reset request</h2>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 16px;">
            Hi <strong>${name}</strong>, we received a request to reset the password for your Cogniva account.
            Click the button below to choose a new password.
        </p>
        <p style="color:#6b7280;font-size:14px;margin:0 0 4px;">This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:8px 0 24px;">
            ${primaryBtn(resetUrl, "Reset Password")}
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef9c3;border:1px solid #fde68a;border-radius:12px;padding:0;">
          <tr>
            <td style="padding:16px;">
              <p style="margin:0;font-size:13px;color:#92400e;">
                ⚠️ If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
        </table>
    `),
})

const passwordChangedEmailTemplate = (name) => ({
    subject: "Your Cogniva password was changed",
    html: baseWrapper(`
        <h2 style="margin:0 0 8px;font-size:24px;color:#111827;">Password updated ✅</h2>
        <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 16px;">
            Hi <strong>${name}</strong>, your Cogniva account password was successfully changed.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:0;margin:0 0 24px;">
          <tr>
            <td style="padding:16px;">
              <p style="margin:0;font-size:14px;color:#15803d;">
                ✓ Your account is secure. You can now log in with your new password.
              </p>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:0;">
          <tr>
            <td style="padding:16px;">
              <p style="margin:0;font-size:13px;color:#991b1b;">
                🔒 If you did NOT make this change, please <a href="${process.env.FRONTEND_URL}/auth" style="color:#dc2626;font-weight:600;">contact us immediately</a> and reset your password right away.
              </p>
            </td>
          </tr>
        </table>
    `),
})

// ── Send helpers ──────────────────────────────────────────────────────────────

const sendEmail = async ({ to, subject, html }) => {
    const transporter = createTransporter()
    await transporter.sendMail({
        from: `"Cogniva" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    })
}

// ── Public API ────────────────────────────────────────────────────────────────

export const sendVerificationEmail = async (user, verifyUrl) => {
    const template = verificationEmailTemplate(user.name, verifyUrl)
    await sendEmail({ to: user.email, ...template })
}

export const sendWelcomeEmail = async (user) => {
    const template = welcomeEmailTemplate(user.name)
    await sendEmail({ to: user.email, ...template })
}

export const sendPasswordResetEmail = async (user, resetUrl) => {
    const template = passwordResetEmailTemplate(user.name, resetUrl)
    await sendEmail({ to: user.email, ...template })
}

export const sendPasswordChangedEmail = async (user) => {
    const template = passwordChangedEmailTemplate(user.name)
    await sendEmail({ to: user.email, ...template })
}
