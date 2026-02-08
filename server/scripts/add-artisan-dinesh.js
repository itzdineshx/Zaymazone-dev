import mongoose from 'mongoose';
import Artisan from '../src/models/Artisan.js';
import User from '../src/models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone';

async function addArtisanDinesh() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    let user = await User.findOne({ email: 'dinesh.s@example.com' });

    if (!user) {
      // Create user
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = new User({
        name: 'DINESH S',
        email: 'dinesh.s@example.com',
        password: hashedPassword,
        role: 'user'
      });
      await user.save();
      console.log('Created user:', user.name);
    } else {
      console.log('User already exists:', user.name);
    }

    // Check if artisan already exists
    let artisan = await Artisan.findOne({ userId: user._id });

    if (artisan) {
      console.log('Artisan already exists, updating...');
    } else {
      console.log('Creating new artisan...');
    }

    // Sample data for DINESH S
    const artisanData = {
      userId: user._id,
      name: 'DINESH S',
      businessInfo: {
        businessName: 'Dinesh Handicrafts',
        sellerType: 'gst',
        gstNumber: '22AAAAA0000A1Z5',
        panNumber: 'AAAAA0000A',
        contact: {
          email: 'dinesh.s@example.com',
          phone: '+91-9876543210',
          address: {
            village: 'Kumbakonam',
            district: 'Thanjavur',
            state: 'Tamil Nadu',
            pincode: '612001'
          }
        }
      },
      location: {
        city: 'Thanjavur',
        state: 'Tamil Nadu',
        country: 'India'
      },
      specialties: ['Pottery', 'Clay Work', 'Traditional Crafts'],
      experience: 15,
      bio: 'I am Dinesh S, a master potter from Kumbakonam, Tamil Nadu. With 15 years of experience in traditional clay pottery, I specialize in creating beautiful handcrafted pots, vases, and decorative items using ancient techniques passed down through generations. My work combines traditional South Indian pottery styles with contemporary designs.',
      avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
      productInfo: {
        description: 'Authentic South Indian clay pottery including traditional pots, vases, decorative items, and custom pieces. Each item is handcrafted using natural clay and traditional firing techniques.',
        materials: 'Natural clay, traditional glazes, natural pigments',
        priceRange: {
          min: 500,
          max: 15000
        },
        stockQuantity: 50,
        photos: [
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z',
          'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z'
        ]
      },
      logistics: {
        pickupAddress: {
          sameAsMain: true,
          address: 'Kumbakonam, Thanjavur, Tamil Nadu - 612001'
        },
        dispatchTime: '2-3 business days',
        packagingType: 'Eco-friendly packaging with traditional materials'
      },
      payment: {
        upiId: 'dinesh.pottery@upi',
        paymentFrequency: 'Weekly'
      },
      documents: {
        gstCertificate: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDg4Pj4Kc3RyZWFtCmJ0CjEwMCAyMDAgMjAwIDQwMCByZQpmCjAKL0YxIDEyIFRmCjEwMCAyMDAgVEQoSGVsbG8gV29ybGQpVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwMzIgMDAwMDAgbiAKMDAwMDAwMDEwMyAwMDAwMCBuIAowMDAwMDAwMTQ4IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgozMDEKJSVFT0YK',
        aadhaarProof: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDg4Pj4Kc3RyZWFtCmJ0CjEwMCAyMDAgMjAwIDQwMCByZQpmCjAKL0YxIDEyIFRmCjEwMCAyMDAgVEQoSGVsbG8gV29ybGQpVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwMzIgMDAwMDAgbiAKMDAwMDAwMDEwMyAwMDAwMCBuIAowMDAwMDAwMTQ4IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eXRyZWYKMzAxCiUlRU9GCg==',
        craftVideo: 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAACAGlzb21tcDQyAAByZnJlZQEAAAAvbXl0cmFjawAAAAwAAAABAAABAAAAAQAAAAEAAAABAA=='
      },
      verification: {
        isVerified: false,
        documentNumber: 'AAAAA0000A',
        bankDetails: {
          accountNumber: '123456789012',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India'
        }
      },
      approvalStatus: 'pending',
      isActive: false
    };

    if (artisan) {
      // Update existing artisan
      Object.assign(artisan, artisanData);
      await artisan.save();
      console.log('Updated existing artisan:', artisan.name);
    } else {
      // Create new artisan
      artisan = new Artisan(artisanData);
      await artisan.save();
      console.log('Created new artisan:', artisan.name);
    }

    console.log('Artisan DINESH S added successfully with pending approval status');
    console.log('Artisan ID:', artisan._id);

  } catch (error) {
    console.error('Error adding artisan:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addArtisanDinesh();