const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send team lead invitation email (for company onboarding)
const sendTeamLeadInvitationEmail = async (email, token, companyName, inviterName = null) => {
  try {
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation/${token}`;
    
    let subject = '';
    let introText = '';
    
    if (inviterName) {
      subject = `${inviterName} invited you as Team Lead at ${companyName} on Planyty`;
      introText = `<p><strong>${inviterName}</strong> has designated you as a <strong>Team Lead</strong> at <strong>${companyName}</strong>.</p>`;
    } else {
      subject = `You've been made a Team Lead at ${companyName} on Planyty`;
      introText = `<p>You have been designated as a <strong>Team Lead</strong> at <strong>${companyName}</strong>.</p>`;
    }

    const mailOptions = {
      from: `"Planyty" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🏆 Team Lead Invitation</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Welcome to ${companyName}</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">You're invited to lead! 🚀</h2>
            
            ${introText}
            
            <p>As a Team Lead on Planyty, you'll have the ability to:</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5CF6;">
              <ul style="margin: 0; padding-left: 20px;">
                <li>Create and manage projects for your team</li>
                <li>Invite and manage team members</li>
                <li>Assign tasks and track progress</li>
                <li>Access team analytics and reports</li>
                <li>Set up workflows and automations</li>
              </ul>
            </div>
            
            <p><strong>Ready to get started?</strong> Click below to set up your Team Lead account:</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${invitationLink}" 
                 style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); 
                        color: white; padding: 16px 32px; 
                        text-decoration: none; border-radius: 8px; 
                        font-weight: bold; font-size: 16px;
                        display: inline-block; border: none;
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
                        transition: all 0.3s ease;">
                Accept Team Lead Role
              </a>
              <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                Valid for 7 days • One-time secure link
              </div>
            </div>
            
            <!-- Alternative link -->
            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #4b5563; font-size: 14px;">
                <strong>Or copy this secure link:</strong><br>
                <code style="background: #f1f1f1; padding: 8px 12px; border-radius: 4px; word-break: break-all; display: inline-block; margin-top: 8px;">
                  ${invitationLink}
                </code>
              </p>
            </div>
            
            <!-- What to expect -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <h3 style="color: #374151; margin-bottom: 10px;">What happens next?</h3>
              <ol style="color: #6b7280; padding-left: 20px;">
                <li>Click the link above to create your account</li>
                <li>Set up your password and profile</li>
                <li>You'll be taken to your team dashboard</li>
                <li>Start inviting your team members</li>
              </ol>
            </div>
            
            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
              <p style="margin: 0;">
                Powered by <strong style="color: #8B5CF6;">Planyty</strong> • Plan with clarity. Achieve with Planyty.
              </p>
              <p style="margin: 10px 0 0;">
                If you didn't expect this invitation or have questions, please contact your company administrator.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Team Lead invitation email sent to ${email} for ${companyName}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending team lead invitation email:', error);
    return false;
  }
};

// Send admin invitation email (for company owner)
const sendAdminInvitationEmail = async (email, token, companyName) => {
  try {
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation/${token}`;
    
    const mailOptions = {
      from: `"Planyty" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to ${companyName}! You're the Admin`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">👑 Welcome, Company Admin!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Your ${companyName} workspace is ready</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Congratulations! 🎉</h2>
            
            <p>Your company <strong>${companyName}</strong> has been successfully registered on Planyty.</p>
            <p>As the <strong>Company Admin</strong>, you have full access to:</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 25px 0;">
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border: 1px solid #e0f2fe;">
                <div style="font-weight: bold; color: #0369a1;">Team Management</div>
                <div style="font-size: 14px; color: #475569;">Create teams, assign roles, manage permissions</div>
              </div>
              <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; border: 1px solid #ede9fe;">
                <div style="font-weight: bold; color: #7c3aed;">Billing & Settings</div>
                <div style="font-size: 14px; color: #475569;">Manage subscription, workspace settings</div>
              </div>
              <div style="background: #fefce8; padding: 15px; border-radius: 8px; border: 1px solid #fef9c3;">
                <div style="font-weight: bold; color: #a16207;">Analytics</div>
                <div style="font-size: 14px; color: #475569;">View company-wide metrics and reports</div>
              </div>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #dcfce7;">
                <div style="font-weight: bold; color: #166534;">Security</div>
                <div style="font-size: 14px; color: #475569;">Configure SSO, 2FA, and access controls</div>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 10px; font-weight: bold; color: #1e40af;">📬 Invitations Sent</p>
              <p style="margin: 0; color: #4b5563;">
                Your Team Lead invitations have been sent. They'll be able to join and start setting up their teams once they accept.
              </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${invitationLink}" 
                 style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); 
                        color: white; padding: 16px 32px; 
                        text-decoration: none; border-radius: 8px; 
                        font-weight: bold; font-size: 16px;
                        display: inline-block; border: none;
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
                        transition: all 0.3s ease;">
                Setup Your Admin Account
              </a>
            </div>
            
            <!-- Quick Start Guide -->
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 30px;">
              <h3 style="color: #374151; margin-top: 0;">🚀 Quick Start Guide</h3>
              <ol style="color: #6b7280; padding-left: 20px;">
                <li>Accept this invitation to create your admin account</li>
                <li>Review your company settings</li>
                <li>Check on your Team Lead invitations</li>
                <li>Create your first project template</li>
                <li>Explore the admin dashboard</li>
              </ol>
            </div>
            
            <!-- Support Info -->
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Need help? Reply to this email or visit our 
                <a href="${process.env.FRONTEND_URL}/help" style="color: #8B5CF6; text-decoration: none;">Help Center</a>.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin invitation email sent to ${email} for ${companyName}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending admin invitation email:', error);
    return false;
  }
};

// Original sendInvitationEmail (keep for backward compatibility)
const sendInvitationEmail = async (email, token, role, inviterName) => {
  if (role === 'team_lead' && inviterName && inviterName.includes('company:')) {
    const companyName = inviterName.replace('company:', '');
    return sendTeamLeadInvitationEmail(email, token, companyName);
  }
  
  try {
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation/${token}`;
    
    const mailOptions = {
      from: `"Planyty" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `You're invited to join Planyty as ${role}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">You're Invited! 🎉</h2>
          <p>Hello,</p>
          <p><strong>${inviterName}</strong> has invited you to join <strong>Planyty</strong> as a <strong>${role.replace('_', ' ')}</strong>.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This invitation will expire in 7 days.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Invitation email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending invitation email:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name, role = null, companyName = null) => {
  try {
    let subject = 'Welcome to Planyty!';
    let welcomeText = '';
    
    if (companyName) {
      subject = `Welcome to ${companyName} on Planyty!`;
      if (role === 'admin') {
        welcomeText = `<p>You are now the <strong>Admin</strong> of <strong>${companyName}</strong>.</p>`;
      } else if (role === 'team_lead') {
        welcomeText = `<p>You are now a <strong>Team Lead</strong> at <strong>${companyName}</strong>.</p>`;
      }
    }

    const mailOptions = {
      from: `"Planyty" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to Planyty, ${name}! 👋</h2>
          ${welcomeText}
          <p>Your account has been successfully created.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Getting Started:</h3>
            <ul>
              <li>${role === 'team_lead' ? 'Create your team workspace' : 'Explore your dashboard'}</li>
              <li>${role === 'admin' ? 'Configure company settings' : 'Invite team members'}</li>
              <li>Create your first project</li>
              <li>Add tasks and assign them</li>
              <li>Track progress with our dashboard</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); 
                      color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          
          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Happy Project Managing! 🚀</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error);
    return false;
  }
};

module.exports = {
  sendInvitationEmail,
  sendTeamLeadInvitationEmail,
  sendAdminInvitationEmail,
  sendWelcomeEmail,
  verifyEmailConfig,
  transporter
};