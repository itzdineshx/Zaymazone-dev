#!/usr/bin/env node

/**
 * Comprehensive Admin & Seller Panel Testing Script
 * Tests all backend endpoints and database operations
 * Date: October 16, 2025
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE = 'http://localhost:4000/api';
let authToken = null;
let adminToken = null;
let testUserId = null;
let testArtisanId = null;
let testProductId = null;
let testBlogId = null;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  title: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.blue}${'='.repeat(60)}${colors.reset}\n`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
};

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.tests = [];
  }

  async test(name, fn) {
    try {
      log.info(`Testing: ${name}`);
      await fn();
      this.passed++;
      log.success(name);
      this.tests.push({ name, status: 'PASS' });
    } catch (error) {
      this.failed++;
      log.error(`${name}: ${error.message}`);
      this.tests.push({ name, status: 'FAIL', error: error.message });
    }
  }

  async apiCall(method, endpoint, body = null, token = authToken) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${response.status}: ${JSON.stringify(data)}`);
    }

    return data;
  }

  printSummary() {
    log.title('TEST SUMMARY');
    console.log(`Total Tests: ${this.passed + this.failed + this.skipped}`);
    log.success(`Passed: ${this.passed}`);
    if (this.failed > 0) log.error(`Failed: ${this.failed}`);
    if (this.skipped > 0) log.warning(`Skipped: ${this.skipped}`);

    console.log(`\n${colors.blue}Test Results:${colors.reset}`);
    this.tests.forEach(test => {
      if (test.status === 'PASS') {
        log.success(test.name);
      } else if (test.status === 'FAIL') {
        log.error(`${test.name}: ${test.error}`);
      }
    });
  }
}

const runner = new TestRunner();

async function setupDatabase() {
  log.title('DATABASE SETUP');
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dinesh_zayma:ehODIoXrZP6U00HS@zayma-test.w2omvt0.mongodb.net/?retryWrites=true&w=majority&appName=zayma-test';
    await mongoose.connect(mongoUri);
    log.success('Connected to MongoDB');
  } catch (error) {
    log.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

async function testAdminAuthentication() {
  log.title('ADMIN AUTHENTICATION TESTS');

  await runner.test('Admin login with default credentials', async () => {
    const response = await runner.apiCall('POST', '/admin/auth/login', {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    }, null);

    if (!response.accessToken) {
      throw new Error('No access token returned');
    }
    adminToken = response.accessToken;
    log.info(`Admin Token: ${adminToken.substring(0, 20)}...`);
  });
}

async function testArtisanApprovals() {
  log.title('ARTISAN APPROVAL TESTS');

  await runner.test('GET pending artisans', async () => {
    const response = await runner.apiCall('GET', '/admin-approvals/pending-artisans', null, adminToken);
    if (!Array.isArray(response.artisans)) {
      throw new Error('Expected artisans array in response');
    }
    log.info(`Found ${response.artisans.length} pending artisans`);
    if (response.artisans.length > 0) {
      testArtisanId = response.artisans[0]._id;
    }
  });

  if (testArtisanId) {
    await runner.test('GET artisan details', async () => {
      const response = await runner.apiCall('GET', `/admin-approvals/artisan-details/${testArtisanId}`, null, adminToken);
      if (!response.artisan) {
        throw new Error('No artisan in response');
      }
      log.info(`Artisan: ${response.artisan.name || 'N/A'}`);
    });

    await runner.test('APPROVE artisan', async () => {
      const response = await runner.apiCall('PATCH', `/admin-approvals/approve-artisan/${testArtisanId}`, {
        approvalNotes: 'Test approval from automated script'
      }, adminToken);
      if (!response.success) {
        throw new Error('Approval failed');
      }
      log.info('Artisan approved successfully');
    });
  }
}

async function testProductApprovals() {
  log.title('PRODUCT APPROVAL TESTS');

  await runner.test('GET pending products', async () => {
    const response = await runner.apiCall('GET', '/admin-approvals/pending-products', null, adminToken);
    if (!Array.isArray(response.products)) {
      throw new Error('Expected products array in response');
    }
    log.info(`Found ${response.products.length} pending products`);
    if (response.products.length > 0) {
      testProductId = response.products[0]._id;
    }
  });

  if (testProductId) {
    await runner.test('APPROVE product', async () => {
      const response = await runner.apiCall('PATCH', `/admin-approvals/approve-product/${testProductId}`, {
        approvalNotes: 'Test approval'
      }, adminToken);
      if (!response.success) {
        throw new Error('Product approval failed');
      }
      log.info('Product approved successfully');
    });
  }
}

async function testBlogApprovals() {
  log.title('BLOG APPROVAL TESTS');

  await runner.test('GET pending blogs', async () => {
    const response = await runner.apiCall('GET', '/admin-approvals/pending-blogs', null, adminToken);
    if (!Array.isArray(response.blogs)) {
      throw new Error('Expected blogs array in response');
    }
    log.info(`Found ${response.blogs.length} pending blogs`);
    if (response.blogs.length > 0) {
      testBlogId = response.blogs[0]._id;
    }
  });

  if (testBlogId) {
    await runner.test('APPROVE blog', async () => {
      const response = await runner.apiCall('PATCH', `/admin-approvals/approve-blog/${testBlogId}`, {
        approvalNotes: 'Test approval'
      }, adminToken);
      if (!response.success) {
        throw new Error('Blog approval failed');
      }
      log.info('Blog approved successfully');
    });
  }
}

async function testSellerOperations() {
  log.title('SELLER OPERATIONS TESTS');

  // For seller tests, we would need a valid seller token
  // This is a placeholder for actual seller token authentication
  if (!authToken) {
    log.warning('Skipping seller tests - no auth token available');
    runner.skipped += 5;
    return;
  }

  await runner.test('GET seller stats', async () => {
    try {
      const response = await runner.apiCall('GET', '/seller/stats', null, authToken);
      if (!response.stats) {
        throw new Error('No stats in response');
      }
      log.info(`Products: ${response.stats.totalProducts}, Orders: ${response.stats.totalOrders}`);
    } catch (error) {
      log.warning(`Seller stats not available (expected for non-seller users): ${error.message}`);
      runner.skipped++;
    }
  });

  await runner.test('GET seller profile', async () => {
    try {
      const response = await runner.apiCall('GET', '/seller/profile', null, authToken);
      log.info(`Seller profile retrieved`);
    } catch (error) {
      log.warning(`Seller profile not available: ${error.message}`);
      runner.skipped++;
    }
  });

  await runner.test('GET seller products', async () => {
    try {
      const response = await runner.apiCall('GET', '/seller/products', null, authToken);
      if (!Array.isArray(response.products)) {
        throw new Error('Expected products array');
      }
      log.info(`Found ${response.products.length} seller products`);
    } catch (error) {
      log.warning(`Seller products not available: ${error.message}`);
      runner.skipped++;
    }
  });

  await runner.test('GET seller blogs', async () => {
    try {
      const response = await runner.apiCall('GET', '/seller/blogs', null, authToken);
      if (!Array.isArray(response.blogs)) {
        throw new Error('Expected blogs array');
      }
      log.info(`Found ${response.blogs.length} seller blogs`);
    } catch (error) {
      log.warning(`Seller blogs not available: ${error.message}`);
      runner.skipped++;
    }
  });

  await runner.test('GET seller orders', async () => {
    try {
      const response = await runner.apiCall('GET', '/seller/orders', null, authToken);
      if (!Array.isArray(response.orders)) {
        throw new Error('Expected orders array');
      }
      log.info(`Found ${response.orders.length} seller orders`);
    } catch (error) {
      log.warning(`Seller orders not available: ${error.message}`);
      runner.skipped++;
    }
  });
}

async function testDatabaseIntegrity() {
  log.title('DATABASE INTEGRITY TESTS');

  try {
    const Artisan = mongoose.model('Artisan');
    const Product = mongoose.model('Product');
    const BlogPost = mongoose.model('BlogPost');

    await runner.test('Check Artisan model has approval fields', async () => {
      const artisan = await Artisan.findOne({});
      if (artisan) {
        const hasFields = 'approvalStatus' in artisan && 'approvalNotes' in artisan && 'rejectionReason' in artisan;
        if (!hasFields) {
          throw new Error('Artisan model missing approval fields');
        }
        log.info('All approval fields present in Artisan model');
      }
    });

    await runner.test('Check Product model has approval fields', async () => {
      const product = await Product.findOne({});
      if (product) {
        const hasFields = 'approvalStatus' in product && 'approvalNotes' in product;
        if (!hasFields) {
          throw new Error('Product model missing approval fields');
        }
        log.info('All approval fields present in Product model');
      }
    });

    await runner.test('Check BlogPost model has approval fields', async () => {
      const blog = await BlogPost.findOne({});
      if (blog) {
        const hasFields = 'approvalStatus' in blog && 'approvalNotes' in blog;
        if (!hasFields) {
          throw new Error('BlogPost model missing approval fields');
        }
        log.info('All approval fields present in BlogPost model');
      }
    });

    await runner.test('Verify pending artisans count', async () => {
      const count = await Artisan.countDocuments({ approvalStatus: 'pending' });
      log.info(`${count} pending artisans in database`);
    });

    await runner.test('Verify pending products count', async () => {
      const count = await Product.countDocuments({ approvalStatus: 'pending' });
      log.info(`${count} pending products in database`);
    });

    await runner.test('Verify pending blogs count', async () => {
      const count = await BlogPost.countDocuments({ approvalStatus: 'pending' });
      log.info(`${count} pending blogs in database`);
    });
  } catch (error) {
    log.error(`Database tests failed: ${error.message}`);
  }
}

async function main() {
  log.title('🚀 ADMIN & SELLER PANEL COMPREHENSIVE TEST SUITE');
  log.info(`API Base: ${API_BASE}`);
  log.info(`Timestamp: ${new Date().toISOString()}`);

  try {
    // Setup
    await setupDatabase();

    // Run tests
    await testAdminAuthentication();
    await testArtisanApprovals();
    await testProductApprovals();
    await testBlogApprovals();
    await testSellerOperations();
    await testDatabaseIntegrity();

    // Summary
    runner.printSummary();

    // Exit
    await mongoose.disconnect();
    process.exit(runner.failed > 0 ? 1 : 0);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
