import express from 'express';
import { verifyFirebaseToken } from '../lib/firebase-admin.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/firebase-auth.js';

const router = express.Router();

/**
 * POST /api/firebase-auth/sync
 * Sync Firebase user with MongoDB
 */
router.post('/sync', async (req, res) => {
  try {
    const { idToken, role = 'user' } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Firebase ID token is required' });
    }
    
    // Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(idToken);
    
    // Find existing user or create new one
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });
    
    if (user) {
      // Update existing user with latest Firebase data
      user.email = firebaseUser.email;
      user.name = firebaseUser.name || user.name;
      user.avatar = firebaseUser.picture || user.avatar;
      user.isEmailVerified = firebaseUser.emailVerified;
      user.lastLogin = new Date();
      
      await user.save();
    } else {
      // Create new user
      user = new User({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name || firebaseUser.email.split('@')[0],
        avatar: firebaseUser.picture || '',
        role: role,
        authProvider: 'firebase',
        isEmailVerified: firebaseUser.emailVerified,
        lastLogin: new Date()
      });
      
      await user.save();
    }
    
    // Return user data (without sensitive fields)
    const userResponse = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider,
      preferences: user.preferences,
      createdAt: user.createdAt
    };
    
    res.json({
      message: 'User synced successfully',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Firebase sync error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to sync Firebase user' 
    });
  }
});

/**
 * GET /api/firebase-auth/me
 * Get current user info
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    const userResponse = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
    
    res.json({ user: userResponse });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

/**
 * PATCH /api/firebase-auth/profile
 * Update user profile
 */
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    const user = req.user;
    
    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = { ...user.address, ...address };
    if (preferences !== undefined) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    const userResponse = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * DELETE /api/firebase-auth/account
 * Delete user account (soft delete)
 */
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Soft delete - mark as inactive
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();
    
    res.json({ message: 'Account deleted successfully' });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;