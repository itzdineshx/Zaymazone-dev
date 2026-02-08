import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../src/models/User.js'
import Artisan from '../src/models/Artisan.js'
import Product from '../src/models/Product.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

// Mock data - products from frontend
const mockProducts = [
  {
    id: "1",
    name: "Handcrafted Terracotta Vase",
    description: "Beautiful traditional terracotta vase with intricate patterns, perfect for home decoration. Made using ancient pottery techniques passed down through generations.",
    price: 1299,
    originalPrice: 1599,
    images: ["/assets/terracotta-vase.jpg", "/assets/terracotta-vase.jpg", "/assets/terracotta-vase.jpg"],
    category: "pottery",
    subcategory: "vases",
    materials: ["Terracotta", "Natural Clay"],
    dimensions: "15cm x 15cm x 20cm",
    weight: "800g",
    colors: ["Terracotta", "Brown"],
    inStock: true,
    stockCount: 12,
    artisan: {
      id: "artisan-1",
      name: "Rajesh Kumar",
      location: "Khurja, Uttar Pradesh",
      bio: "Master potter with 25+ years of experience in traditional Indian pottery",
      avatar: "/assets/artisan-avatar-1.jpg",
      rating: 4.8,
      totalProducts: 24
    },
    rating: 4.6,
    reviewCount: 18,
    tags: ["traditional", "handmade", "eco-friendly"],
    isHandmade: true,
    shippingTime: "3-5 days",
    featured: true
  },
  {
    id: "2",
    name: "Kashmiri Pashmina Shawl",
    description: "Authentic hand-woven Kashmiri pashmina shawl with traditional embroidery. Soft, warm, and luxurious.",
    price: 4999,
    originalPrice: 6999,
    images: ["/assets/kashmiri-shawl.jpg", "/assets/kashmiri-shawl.jpg"],
    category: "textiles",
    subcategory: "shawls",
    materials: ["Pure Pashmina", "Silk Thread"],
    dimensions: "200cm x 70cm",
    weight: "150g",
    colors: ["Burgundy", "Gold"],
    inStock: true,
    stockCount: 5,
    artisan: {
      id: "artisan-2",
      name: "Fatima Sheikh",
      location: "Srinagar, Kashmir",
      bio: "Third-generation pashmina weaver specializing in traditional Kashmiri patterns",
      avatar: "/assets/artisan-avatar-2.jpg",
      rating: 4.9,
      totalProducts: 15
    },
    rating: 4.8,
    reviewCount: 32,
    tags: ["luxury", "handwoven", "kashmiri"],
    isHandmade: true,
    shippingTime: "5-7 days",
    featured: true
  },
  {
    id: "3",
    name: "Wooden Educational Toy Set",
    description: "Set of 12 handcrafted wooden toys designed to enhance children's learning and creativity. Made from sustainable wood.",
    price: 899,
    images: ["/assets/wooden-toys.jpg", "/assets/wooden-toys.jpg"],
    category: "crafts",
    subcategory: "toys",
    materials: ["Sustainable Wood", "Natural Paint"],
    dimensions: "25cm x 20cm x 5cm",
    weight: "400g",
    colors: ["Natural Wood", "Multi-color"],
    inStock: true,
    stockCount: 20,
    artisan: {
      id: "artisan-3",
      name: "Suresh Chandel",
      location: "Channapatna, Karnataka",
      bio: "Specialist in Channapatna wooden toys, continuing family tradition of 40+ years",
      avatar: "/assets/artisan-avatar-3.jpg",
      rating: 4.7,
      totalProducts: 31
    },
    rating: 4.5,
    reviewCount: 24,
    tags: ["educational", "eco-friendly", "children"],
    isHandmade: true,
    shippingTime: "2-4 days",
    featured: false
  },
  {
    id: "4",
    name: "Blue Pottery Dinner Set",
    description: "Complete dinner set featuring traditional Jaipur blue pottery. Includes 6 plates, 6 bowls, and serving dishes.",
    price: 2799,
    originalPrice: 3499,
    images: ["/assets/blue-pottery-set.jpg", "/assets/blue-pottery-set.jpg"],
    category: "pottery",
    subcategory: "dinnerware",
    materials: ["Ceramic", "Natural Dyes"],
    dimensions: "Set of 18 pieces",
    weight: "3.5kg",
    colors: ["Blue", "White"],
    inStock: true,
    stockCount: 8,
    artisan: {
      id: "artisan-4",
      name: "Mohan Lal",
      location: "Jaipur, Rajasthan",
      bio: "Master of Jaipur blue pottery with expertise in traditional glazing techniques",
      avatar: "/assets/artisan-avatar-4.jpg",
      rating: 4.6,
      totalProducts: 19
    },
    rating: 4.4,
    reviewCount: 15,
    tags: ["dinnerware", "traditional", "ceramic"],
    isHandmade: true,
    shippingTime: "4-6 days",
    featured: false
  },
  {
    id: "5",
    name: "Handloom Cotton Bedsheet Set",
    description: "Pure cotton bedsheet set with traditional block prints. Includes 1 bedsheet and 2 pillow covers.",
    price: 1899,
    images: ["/assets/cotton-bedsheet.jpg", "/assets/cotton-bedsheet.jpg"],
    category: "textiles",
    subcategory: "bedding",
    materials: ["Pure Cotton", "Natural Dyes"],
    dimensions: "Queen Size - 225cm x 250cm",
    weight: "800g",
    colors: ["Blue", "White"],
    inStock: true,
    stockCount: 15,
    artisan: {
      id: "artisan-5",
      name: "Anita Devi",
      location: "Sanganer, Rajasthan",
      bio: "Expert in traditional block printing with 15+ years of experience",
      avatar: "/assets/artisan-avatar-5.jpg",
      rating: 4.5,
      totalProducts: 28
    },
    rating: 4.3,
    reviewCount: 27,
    tags: ["cotton", "bedding", "block-print"],
    isHandmade: true,
    shippingTime: "3-5 days",
    featured: false
  },
  {
    id: "6",
    name: "Handcrafted Brass Bowl",
    description: "Traditional brass bowl with engraved patterns. Perfect for serving or decorative purposes. Hand-polished finish.",
    price: 799,
    images: ["/assets/brass-bowl.jpg", "/assets/brass-bowl.jpg"],
    category: "crafts",
    subcategory: "bowls",
    materials: ["Pure Brass"],
    dimensions: "20cm diameter x 8cm height",
    weight: "500g",
    colors: ["Golden Brass"],
    inStock: true,
    stockCount: 25,
    artisan: {
      id: "artisan-6",
      name: "Ramesh Thakur",
      location: "Moradabad, Uttar Pradesh",
      bio: "Traditional brass artisan specializing in hand-engraved decorative items",
      avatar: "/assets/artisan-avatar-6.jpg",
      rating: 4.4,
      totalProducts: 33
    },
    rating: 4.2,
    reviewCount: 19,
    tags: ["brass", "traditional", "decorative"],
    isHandmade: true,
    shippingTime: "4-6 days",
    featured: false
  },
  {
    id: "7",
    name: "Madhubani Painting",
    description: "Authentic Madhubani painting on handmade paper depicting traditional folk stories. Vibrant colors and intricate patterns.",
    price: 1599,
    originalPrice: 1999,
    images: ["/assets/madhubani-painting.jpg", "/assets/madhubani-painting.jpg"],
    category: "crafts",
    subcategory: "paintings",
    materials: ["Handmade Paper", "Natural Pigments"],
    dimensions: "30cm x 40cm",
    weight: "200g",
    colors: ["Multi-color"],
    inStock: true,
    stockCount: 10,
    artisan: {
      id: "artisan-7",
      name: "Sita Devi",
      location: "Madhubani, Bihar",
      bio: "Traditional Madhubani artist preserving ancient folk art traditions",
      avatar: "/assets/artisan-avatar-7.jpg",
      rating: 4.7,
      totalProducts: 16
    },
    rating: 4.6,
    reviewCount: 14,
    tags: ["madhubani", "folk-art", "painting"],
    isHandmade: true,
    shippingTime: "5-7 days",
    featured: true
  },
  {
    id: "8",
    name: "Bandhani Dupatta",
    description: "Traditional Bandhani tie-dye dupatta from Gujarat. Hand-tied and dyed using natural colors with mirror work embellishments.",
    price: 1299,
    images: ["/assets/bandhani-dupatta.jpg", "/assets/bandhani-dupatta.jpg"],
    category: "textiles",
    subcategory: "scarves",
    materials: ["Cotton Silk", "Natural Dyes"],
    dimensions: "200cm x 90cm",
    weight: "150g",
    colors: ["Red", "Gold"],
    inStock: true,
    stockCount: 18,
    artisan: {
      id: "artisan-8",
      name: "Kiran Patel",
      location: "Bhuj, Gujarat",
      bio: "Master of Bandhani technique with expertise in traditional tie-dye patterns",
      avatar: "/assets/artisan-avatar-8.jpg",
      rating: 4.6,
      totalProducts: 22
    },
    rating: 4.4,
    reviewCount: 21,
    tags: ["bandhani", "tie-dye", "dupatta"],
    isHandmade: true,
    shippingTime: "4-6 days",
    featured: false
  },
  {
    id: "9",
    name: "Kantha Embroidered Stole",
    description: "Beautiful Kantha stole with traditional running stitch embroidery. Lightweight and versatile, perfect for any season.",
    price: 999,
    images: ["/assets/kantha-stole.jpg", "/assets/kantha-stole.jpg"],
    category: "textiles",
    subcategory: "stoles",
    materials: ["Cotton", "Silk Thread"],
    dimensions: "180cm x 70cm",
    weight: "120g",
    colors: ["Multicolor"],
    inStock: true,
    stockCount: 22,
    artisan: {
      id: "artisan-9",
      name: "Malati Das",
      location: "Shantiniketan, West Bengal",
      bio: "Kantha embroidery specialist, continuing the traditional Bengali needlework",
      avatar: "/assets/artisan-avatar-9.jpg",
      rating: 4.5,
      totalProducts: 20
    },
    rating: 4.3,
    reviewCount: 16,
    tags: ["kantha", "embroidery", "stole"],
    isHandmade: true,
    shippingTime: "3-5 days",
    featured: false
  },
  {
    id: "10",
    name: "Handwoven Silk Scarf",
    description: "Luxurious handwoven silk scarf with traditional motifs. Soft texture and vibrant colors make it perfect for special occasions.",
    price: 1899,
    originalPrice: 2299,
    images: ["/assets/silk-scarf.jpg", "/assets/silk-scarf.jpg"],
    category: "textiles",
    subcategory: "scarves",
    materials: ["Pure Silk"],
    dimensions: "160cm x 50cm",
    weight: "80g",
    colors: ["Royal Blue", "Gold"],
    inStock: true,
    stockCount: 12,
    artisan: {
      id: "artisan-10",
      name: "Lakshmi Narasimhan",
      location: "Kanchipuram, Tamil Nadu",
      bio: "Traditional silk weaver with expertise in Kanchipuram silk patterns",
      avatar: "/assets/artisan-avatar-10.jpg",
      rating: 4.8,
      totalProducts: 18
    },
    rating: 4.7,
    reviewCount: 23,
    tags: ["silk", "handwoven", "luxury"],
    isHandmade: true,
    shippingTime: "4-6 days",
    featured: true
  },
  {
    id: "11",
    name: "Copper Water Bottle",
    description: "Pure copper water bottle with traditional engravings. Known for its health benefits and antimicrobial properties.",
    price: 699,
    images: ["/assets/copper-bottle.jpg", "/assets/copper-bottle.jpg"],
    category: "crafts",
    subcategory: "bottles",
    materials: ["Pure Copper"],
    dimensions: "25cm height x 7cm diameter",
    weight: "300g",
    colors: ["Copper"],
    inStock: true,
    stockCount: 30,
    artisan: {
      id: "artisan-11",
      name: "Vinod Kumar",
      location: "Jaipur, Rajasthan",
      bio: "Copper craftsman specializing in traditional water vessels and utensils",
      avatar: "/assets/artisan-avatar-11.jpg",
      rating: 4.3,
      totalProducts: 26
    },
    rating: 4.1,
    reviewCount: 34,
    tags: ["copper", "health", "traditional"],
    isHandmade: true,
    shippingTime: "2-4 days",
    featured: false
  },
  {
    id: "12",
    name: "Handcarved Incense Holder",
    description: "Intricately carved wooden incense holder with traditional Indian motifs. Perfect for meditation and aromatherapy.",
    price: 599,
    images: ["/assets/incense-holder.jpg", "/assets/incense-holder.jpg"],
    category: "crafts",
    subcategory: "holders",
    materials: ["Sandalwood", "Natural Finish"],
    dimensions: "15cm x 8cm x 3cm",
    weight: "150g",
    colors: ["Natural Wood"],
    inStock: true,
    stockCount: 40,
    artisan: {
      id: "artisan-12",
      name: "Gopal Sharma",
      location: "Udaipur, Rajasthan",
      bio: "Wood carving artisan specializing in religious and decorative items",
      avatar: "/assets/artisan-avatar-12.jpg",
      rating: 4.4,
      totalProducts: 35
    },
    rating: 4.2,
    reviewCount: 28,
    tags: ["wood", "carving", "meditation"],
    isHandmade: true,
    shippingTime: "3-5 days",
    featured: false
  },
  {
    id: "13",
    name: "Handmade Jute Bag",
    description: "Eco-friendly jute bag with traditional block prints. Spacious and durable, perfect for daily use and shopping.",
    price: 499,
    images: ["/assets/jute-bag.jpg", "/assets/jute-bag.jpg"],
    category: "textiles",
    subcategory: "bags",
    materials: ["Jute", "Cotton Lining"],
    dimensions: "40cm x 35cm x 15cm",
    weight: "200g",
    colors: ["Natural", "Blue Print"],
    inStock: true,
    stockCount: 50,
    artisan: {
      id: "artisan-13",
      name: "Shanti Mondal",
      location: "Hooghly, West Bengal",
      bio: "Jute craft specialist promoting eco-friendly products and sustainable living",
      avatar: "/assets/artisan-avatar-1.jpg",
      rating: 4.2,
      totalProducts: 29
    },
    rating: 4.0,
    reviewCount: 42,
    tags: ["jute", "eco-friendly", "bag"],
    isHandmade: true,
    shippingTime: "2-4 days",
    featured: false
  },
  {
    id: "14",
    name: "Carved Jewelry Box",
    description: "Beautifully carved wooden jewelry box with velvet lining. Features multiple compartments and traditional Indian designs.",
    price: 1199,
    images: ["/assets/jewelry-box.jpg", "/assets/jewelry-box.jpg"],
    category: "crafts",
    subcategory: "boxes",
    materials: ["Rosewood", "Velvet Lining"],
    dimensions: "20cm x 15cm x 8cm",
    weight: "400g",
    colors: ["Dark Wood"],
    inStock: true,
    stockCount: 15,
    artisan: {
      id: "artisan-14",
      name: "Prakash Verma",
      location: "Saharanpur, Uttar Pradesh",
      bio: "Master wood carver with expertise in intricate decorative woodwork",
      avatar: "/assets/artisan-avatar-2.jpg",
      rating: 4.6,
      totalProducts: 21
    },
    rating: 4.5,
    reviewCount: 18,
    tags: ["wood", "jewelry", "carved"],
    isHandmade: true,
    shippingTime: "4-6 days",
    featured: false
  },
  {
    id: "15",
    name: "Traditional Tea Set",
    description: "Handcrafted ceramic tea set with traditional Indian patterns. Includes teapot, 4 cups, and saucers with matching tray.",
    price: 1799,
    images: ["/assets/tea-set.jpg", "/assets/tea-set.jpg"],
    category: "pottery",
    subcategory: "tea-sets",
    materials: ["Ceramic", "Food-safe Glaze"],
    dimensions: "Set of 10 pieces",
    weight: "2kg",
    colors: ["Blue", "White"],
    inStock: true,
    stockCount: 10,
    artisan: {
      id: "artisan-15",
      name: "Ashok Kumhar",
      location: "Khurja, Uttar Pradesh",
      bio: "Traditional potter specializing in functional ceramics and tea sets",
      avatar: "/assets/artisan-avatar-3.jpg",
      rating: 4.4,
      totalProducts: 27
    },
    rating: 4.3,
    reviewCount: 12,
    tags: ["ceramic", "tea-set", "traditional"],
    isHandmade: true,
    shippingTime: "5-7 days",
    featured: false
  },
  {
    id: "16",
    name: "Decorative Metal Lamp",
    description: "Handcrafted metal lamp with intricate cut-out patterns. Creates beautiful light patterns and ambiance.",
    price: 2299,
    images: ["/assets/metal-lamp.jpg", "/assets/metal-lamp.jpg"],
    category: "crafts",
    subcategory: "lamps",
    materials: ["Iron", "Brass Finish"],
    dimensions: "30cm height x 15cm diameter",
    weight: "800g",
    colors: ["Antique Brass"],
    inStock: true,
    stockCount: 12,
    artisan: {
      id: "artisan-16",
      name: "Salim Khan",
      location: "Moradabad, Uttar Pradesh",
      bio: "Metal craftsman specializing in decorative lighting and home accessories",
      avatar: "/assets/artisan-avatar-4.jpg",
      rating: 4.5,
      totalProducts: 19
    },
    rating: 4.4,
    reviewCount: 11,
    tags: ["metal", "lighting", "decorative"],
    isHandmade: true,
    shippingTime: "5-7 days",
    featured: false
  },
  {
    id: "17",
    name: "Kalamkari Wall Hanging",
    description: "Traditional Kalamkari wall hanging with mythological scenes. Hand-painted using natural dyes on cotton fabric with intricate detailing.",
    price: 4599,
    originalPrice: 5999,
    images: ["/assets/kalamkari-wall.jpg", "/assets/kalamkari-wall.jpg"],
    category: "crafts",
    subcategory: "wall-art",
    materials: ["Cotton Fabric", "Natural Dyes"],
    dimensions: "60cm x 90cm",
    weight: "300g",
    colors: ["Natural", "Earth Tones"],
    inStock: true,
    stockCount: 6,
    artisan: {
      id: "artisan-17",
      name: "Venkatesh Rao",
      location: "Srikalahasti, Andhra Pradesh",
      bio: "Traditional Kalamkari artist preserving ancient storytelling through fabric art",
      avatar: "/assets/artisan-avatar-5.jpg",
      rating: 4.9,
      totalProducts: 14
    },
    rating: 4.8,
    reviewCount: 17,
    tags: ["kalamkari", "wall-art", "traditional"],
    isHandmade: true,
    shippingTime: "6-8 days",
    featured: true
  },
  {
    id: "18",
    name: "Stone Inlay Coaster Set",
    description: "Set of 6 marble coasters with semi-precious stone inlay work. Features traditional Pietra Dura technique from Agra artisans.",
    price: 1599,
    images: ["/assets/stone-coasters.jpg", "/assets/stone-coasters.jpg"],
    category: "crafts",
    subcategory: "tableware",
    materials: ["Marble", "Semi-precious Stones"],
    dimensions: "10cm x 10cm each",
    weight: "800g",
    colors: ["White Marble", "Multi-color"],
    inStock: true,
    stockCount: 20,
    artisan: {
      id: "artisan-18",
      name: "Abdul Rahman",
      location: "Agra, Uttar Pradesh",
      bio: "Master craftsman in Pietra Dura stone inlay work, family tradition of 4 generations",
      avatar: "/assets/artisan-avatar-6.jpg",
      rating: 4.7,
      totalProducts: 25
    },
    rating: 4.5,
    reviewCount: 22,
    tags: ["marble", "inlay", "tableware"],
    isHandmade: true,
    shippingTime: "4-6 days",
    featured: false
  },
  {
    id: "19",
    name: "Dhokra Art Elephant",
    description: "Traditional Dhokra metal casting elephant figurine using lost-wax technique. Beautiful tribal art piece representing good fortune and prosperity.",
    price: 2799,
    images: ["/assets/dhokra-elephant.jpg", "/assets/dhokra-elephant.jpg"],
    category: "crafts",
    subcategory: "figurines",
    materials: ["Bronze", "Traditional Alloy"],
    dimensions: "20cm x 15cm x 25cm",
    weight: "1.5kg",
    colors: ["Bronze"],
    inStock: true,
    stockCount: 8,
    artisan: {
      id: "artisan-19",
      name: "Shankar Baghel",
      location: "Bastar, Chhattisgarh",
      bio: "Traditional Dhokra artist from tribal community, expert in lost-wax metal casting",
      avatar: "/assets/artisan-avatar-7.jpg",
      rating: 4.8,
      totalProducts: 12
    },
    rating: 4.6,
    reviewCount: 9,
    tags: ["dhokra", "tribal", "figurine"],
    isHandmade: true,
    shippingTime: "5-7 days",
    featured: true
  },
  {
    id: "20",
    name: "Ikat Handloom Saree",
    description: "Pure silk Ikat saree with traditional Odisha patterns. Hand-woven with resist-dyed threads creating beautiful geometric designs.",
    price: 8999,
    originalPrice: 11999,
    images: ["/assets/ikat-saree.jpg", "/assets/ikat-saree.jpg"],
    category: "textiles",
    subcategory: "sarees",
    materials: ["Pure Silk", "Natural Dyes"],
    dimensions: "6.5 meters",
    weight: "500g",
    colors: ["Deep Blue", "Silver"],
    inStock: true,
    stockCount: 4,
    artisan: {
      id: "artisan-20",
      name: "Padma Mohapatra",
      location: "Sambalpur, Odisha",
      bio: "Master weaver specializing in traditional Ikat technique with 25+ years experience",
      avatar: "/assets/artisan-avatar-8.jpg",
      rating: 4.9,
      totalProducts: 11
    },
    rating: 4.8,
    reviewCount: 13,
    tags: ["ikat", "silk", "saree"],
    isHandmade: true,
    shippingTime: "7-10 days",
    featured: true
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await Product.deleteMany({})
    await Artisan.deleteMany({})
    await User.deleteMany({})
    console.log('Existing data cleared')

    // Create artisan users and artisans map
    const artisanUsers = []
    const artisansMap = new Map()

    console.log('Creating artisan users and artisans...')
    
    // Extract unique artisans from products
    const uniqueArtisans = new Map()
    for (const product of mockProducts) {
      if (!uniqueArtisans.has(product.artisan.id)) {
        uniqueArtisans.set(product.artisan.id, product.artisan)
      }
    }

    // Create users and artisans for each unique artisan
    for (const [artisanId, artisanData] of uniqueArtisans) {
      // Create user
      const user = await User.create({
        name: artisanData.name,
        email: `${artisanId}@artisan.com`,
        passwordHash: await bcrypt.hash('artisan123', 10),
        role: 'artisan'
      })

      // Parse location
      const locationParts = artisanData.location.split(', ')
      const city = locationParts[0] || artisanData.location
      const state = locationParts[1] || 'India'

      // Create artisan
      const artisan = await Artisan.create({
        userId: user._id,
        name: artisanData.name,
        bio: artisanData.bio,
        location: {
          city: city,
          state: state,
          country: 'India'
        },
        avatar: artisanData.avatar,
        rating: artisanData.rating,
        totalProducts: artisanData.totalProducts,
        isActive: true,
        verification: {
          isVerified: true,
          verifiedAt: new Date()
        }
      })

      artisansMap.set(artisanId, artisan._id)
      console.log(`Created artisan: ${artisanData.name}`)
    }

    // Create products
    console.log('Creating products...')
    for (const productData of mockProducts) {
      const artisanMongoId = artisansMap.get(productData.artisan.id)
      
      if (!artisanMongoId) {
        console.error(`Artisan not found for product: ${productData.name}`)
        continue
      }

      await Product.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        images: productData.images,
        artisanId: artisanMongoId,
        category: productData.category,
        subcategory: productData.subcategory,
        materials: productData.materials,
        dimensions: productData.dimensions,
        weight: productData.weight,
        colors: productData.colors,
        inStock: productData.inStock,
        stockCount: productData.stockCount,
        isHandmade: productData.isHandmade,
        shippingTime: productData.shippingTime,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        tags: productData.tags,
        featured: productData.featured,
        isActive: true
      })

      console.log(`Created product: ${productData.name}`)
    }

    console.log('Database seeded successfully!')
    console.log(`Created ${uniqueArtisans.size} artisans and ${mockProducts.length} products`)
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedDatabase()