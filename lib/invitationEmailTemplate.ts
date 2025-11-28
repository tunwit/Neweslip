export function invitationEmailTemplate({
  shopName,
  inviteUrl,
  invitedEmail,
}: {
  shopName: string;
  inviteUrl: string;
  invitedEmail: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
    <h2>You’ve been invited to join <strong>${shopName}</strong></h2>

    <p>Hello,</p>
    <p>
      You have been invited to join the shop <strong>${shopName}</strong>  
      using this email: <strong>${invitedEmail}</strong>.
    </p>

    <p>Please click the button below to accept the invitation:</p>

    <a href="${inviteUrl}"
       style="display: inline-block; padding: 12px 20px; background: #2563EB; color: white; 
              text-decoration: none; border-radius: 6px; font-weight: bold;">
       Accept Invitation
    </a>

    <p style="margin-top: 20px; font-size: 14px; color: #666;">
      If you didn't expect this email, you can safely ignore it.
    </p>

    <p style="margin-top: 30px; font-size: 12px; color: #888;">
      This link will expire for security reasons.
    </p>
  </div>
  `;
}
