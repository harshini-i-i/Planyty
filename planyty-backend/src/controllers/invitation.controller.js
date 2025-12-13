const { Invitation, User } = require('../models');
const { sendInvitationEmail } = require('../services/email.service');
const { sendInvitationEvent } = require('../services/kafka.producer');
const { generateToken, calculateExpiryDate } = require('../utils/helpers');
const crypto = require('crypto');

exports.sendInvitation = async (req, res) => {
  try {
    const { email, role } = req.body;
    const invitedBy = req.user.id;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check for pending invitation
    const existingInvitation = await Invitation.findOne({
      where: { 
        email, 
        status: 'pending',
        expires_at: { $gt: new Date() }
      }
    });

    if (existingInvitation) {
      return res.status(400).json({ error: 'Pending invitation already exists for this email' });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = calculateExpiryDate(7); // 7 days expiry

    // Create invitation
    const invitation = await Invitation.create({
      email,
      token,
      role,
      expires_at: expiresAt,
      invited_by: invitedBy,
      status: 'pending'
    });

    // Send invitation email
    const emailSent = await sendInvitationEmail(
      email, 
      token, 
      role, 
      req.user.name
    );

    if (!emailSent) {
      console.warn(`⚠️ Invitation created but email failed to send to ${email}`);
    }

    // Send Kafka event
    await sendInvitationEvent('INVITATION_SENT', invitation);

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
        status: invitation.status
      }
    });

  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    // Find invitation
    const invitation = await Invitation.findOne({
      where: { 
        token,
        status: 'pending'
      }
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found or already used' });
    }

    // Check expiry
    if (new Date() > invitation.expires_at) {
      await invitation.update({ status: 'expired' });
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Check if user already exists (just in case)
    const existingUser = await User.findOne({ where: { email: invitation.email } });
    if (existingUser) {
      await invitation.update({ status: 'accepted' });
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user with invited role
    const user = await User.create({
      email: invitation.email,
      name,
      password,
      role: invitation.role,
      is_active: true
    });

    // Update invitation status
    await invitation.update({ status: 'accepted' });

    // Send Kafka events
    await sendInvitationEvent('INVITATION_ACCEPTED', invitation);
    const { sendUserEvent } = require('../services/kafka.producer');
    await sendUserEvent('USER_REGISTERED_VIA_INVITATION', user);

    res.status(201).json({
      message: 'Account created successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
};

exports.getInvitations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    // If not admin, only show invitations sent by this user
    if (req.user.role !== 'admin') {
      where.invited_by = req.user.id;
    }

    const { count, rows: invitations } = await Invitation.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'inviter',
        attributes: ['id', 'name', 'email']
      }],
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']]
    });

    res.json({
      invitations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ error: 'Failed to get invitations' });
  }
};

exports.getInvitationByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({
      where: { token },
      include: [{
        model: User,
        as: 'inviter',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Check if expired
    if (new Date() > invitation.expires_at) {
      await invitation.update({ status: 'expired' });
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Check if already used
    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already used' });
    }

    res.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
        invited_by: invitation.inviter,
        created_at: invitation.created_at
      }
    });

  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({ error: 'Failed to get invitation' });
  }
};

exports.cancelInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await Invitation.findByPk(id);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && invitation.invited_by !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this invitation' });
    }

    // Can only cancel pending invitations
    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Can only cancel pending invitations' });
    }

    await invitation.update({ status: 'expired' });

    // Send Kafka event
    await sendInvitationEvent('INVITATION_CANCELLED', invitation);

    res.json({
      message: 'Invitation cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel invitation error:', error);
    res.status(500).json({ error: 'Failed to cancel invitation' });
  }
};
// Add to src/controllers/invitation.controller.js
// src/controllers/invitation.controller.js - Update the create() calls
exports.sendCompanyInvitations = async (req, res) => {
  try {
    const { companyName, adminEmails, ownerEmail } = req.body;
    const crypto = require('crypto');
    const { Invitation } = require('../models');
    
    console.log('🚀 Creating invitations for:', companyName);
    
    // Process team leads
    for (const email of adminEmails.filter(e => e.trim())) {
      const token = crypto.randomBytes(32).toString('hex');
      
      await Invitation.create({
        email,
        token,
        role: 'team_lead',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invited_by: 'system', // ← ADD THIS (NOT null)
        company_name: companyName,
        metadata: { companyOwner: ownerEmail }
      });
      
      console.log(`✅ Team lead invitation: ${email}`);
    }
    
    // Process owner
    const ownerToken = crypto.randomBytes(32).toString('hex');
    await Invitation.create({
      email: ownerEmail,
      token: ownerToken,
      role: 'admin',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      invited_by: 'system', // ← ADD THIS (NOT null)
      company_name: companyName,
      metadata: { companyName }
    });
    
    console.log(`✅ Admin invitation: ${ownerEmail}`);
    
    res.json({
      success: true,
      message: 'Invitations created successfully!',
      companyName
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};