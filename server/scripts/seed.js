import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../src/models/User.js'
import Artisan from '../src/models/Artisan.js'
import Product from '../src/models/Product.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

async function createSampleUsers() {
	return [
		// Admin users
		{
			name: 'Admin User',
			email: 'admin@zaymazone.com',
			passwordHash: await bcrypt.hash('admin123', 10),
			role: 'admin'
		},
		// Regular users
		{
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: await bcrypt.hash('password123', 10),
			role: 'user'
		},
		{
			name: 'Sarah Wilson',
			email: 'sarah@example.com',
			passwordHash: await bcrypt.hash('password123', 10),
			role: 'user'
		},
		{
			name: 'Michael Chen',
			email: 'michael@example.com',
			passwordHash: await bcrypt.hash('password123', 10),
			role: 'user'
		},
		{
			name: 'Priya Sharma',
			email: 'priya@example.com',
			passwordHash: await bcrypt.hash('password123', 10),
			role: 'user'
		},
		{
			name: 'David Kumar',
			email: 'david@example.com',
			passwordHash: await bcrypt.hash('password123', 10),
			role: 'user'
		},
		// Artisan users
		{
			name: 'Rajesh Kumar',
			email: 'rajesh@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Meera Singh',
			email: 'meera@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Vikram Joshi',
			email: 'vikram@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Anita Patel',
			email: 'anita@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Kavya Reddy',
			email: 'kavya@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Arjun Nair',
			email: 'arjun@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Sunita Gupta',
			email: 'sunita@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Ravi Shankar',
			email: 'ravi@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Maya Krishnan',
			email: 'maya@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		},
		{
			name: 'Deepak Verma',
			email: 'deepak@artisan.com',
			passwordHash: await bcrypt.hash('artisan123', 10),
			role: 'artisan'
		}
	]
}

function createSampleArtisans(artisanUsers) {
	return [
		{
			userId: artisanUsers[0]._id,
			name: 'Rajesh Kumar',
			bio: 'Master potter with 20+ years of experience in traditional blue pottery from Jaipur. Specializes in intricate floral and geometric patterns.',
			specialties: ['pottery', 'ceramics'],
			location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
			avatar: '/assets/artisan-avatar-1.jpg',
			rating: 4.8,
			totalRatings: 156,
			joinedDate: new Date('2020-01-15'),
			verification: { isVerified: true },
			isActive: true,
			experience: 20,
			workshops: ['Blue Pottery Techniques', 'Clay Preparation'],
			achievements: ['National Award for Craft Excellence 2022', 'UNESCO Heritage Craft Recognition']
		},
		{
			userId: artisanUsers[1]._id,
			name: 'Meera Singh',
			bio: 'Traditional textile weaver from Varanasi specializing in handloom fabrics, silk sarees, and block-printed bed sheets.',
			specialties: ['textiles', 'weaving', 'block-printing'],
			location: { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India' },
			avatar: '/assets/artisan-avatar-2.jpg',
			rating: 4.7,
			totalRatings: 89,
			joinedDate: new Date('2019-06-10'),
			verification: { isVerified: true },
			isActive: true,
			experience: 15,
			workshops: ['Traditional Weaving', 'Natural Dye Techniques'],
			achievements: ['State Level Weaver Award 2021']
		},
		{
			userId: artisanUsers[2]._id,
			name: 'Vikram Joshi',
			bio: 'Skilled metalwork craftsman from Moradabad creating beautiful brass, copper, and bronze items with traditional engraving techniques.',
			specialties: ['metalwork', 'brass-work', 'copper-work'],
			location: { city: 'Moradabad', state: 'Uttar Pradesh', country: 'India' },
			avatar: '/assets/artisan-avatar-3.jpg',
			rating: 4.6,
			totalRatings: 124,
			joinedDate: new Date('2018-03-22'),
			verification: { isVerified: true },
			isActive: true,
			experience: 18,
			workshops: ['Metal Engraving', 'Brass Polishing Techniques'],
			achievements: ['Excellence in Metal Craft 2020']
		},
		{
			userId: artisanUsers[3]._id,
			name: 'Anita Patel',
			bio: 'Wood carving artisan specializing in traditional temple carvings, furniture, and decorative wooden items from Gujarat.',
			specialties: ['woodwork', 'carving', 'furniture'],
			location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
			avatar: '/assets/artisan-avatar-4.jpg',
			rating: 4.9,
			totalRatings: 203,
			joinedDate: new Date('2017-08-12'),
			verification: { isVerified: true },
			isActive: true,
			experience: 25,
			workshops: ['Wood Carving Basics', 'Traditional Temple Design'],
			achievements: ['Master Craftsman Award 2019', 'Heritage Craft Preservation Award']
		},
		{
			userId: artisanUsers[4]._id,
			name: 'Kavya Reddy',
			bio: 'Bidriware artisan creating intricate silver inlay work on blackened metal surfaces, a traditional craft from Karnataka.',
			specialties: ['bidriware', 'metal-inlay', 'silver-work'],
			location: { city: 'Bidar', state: 'Karnataka', country: 'India' },
			avatar: '/assets/artisan-avatar-5.jpg',
			rating: 4.8,
			totalRatings: 167,
			joinedDate: new Date('2019-11-05'),
			verification: { isVerified: true },
			isActive: true,
			experience: 12,
			workshops: ['Bidriware Techniques', 'Silver Inlay Art'],
			achievements: ['Young Artisan Excellence Award 2023']
		},
		{
			userId: artisanUsers[5]._id,
			name: 'Arjun Nair',
			bio: 'Traditional jewelry maker specializing in gold and silver filigree work, temple jewelry, and contemporary fusion designs.',
			specialties: ['jewelry', 'filigree', 'gold-work', 'silver-work'],
			location: { city: 'Thrissur', state: 'Kerala', country: 'India' },
			avatar: '/assets/artisan-avatar-6.jpg',
			rating: 4.7,
			totalRatings: 145,
			joinedDate: new Date('2018-09-18'),
			verification: { isVerified: true },
			isActive: true,
			experience: 16,
			workshops: ['Filigree Jewelry Making', 'Traditional Kerala Designs'],
			achievements: ['Kerala State Craft Award 2021']
		},
		{
			userId: artisanUsers[6]._id,
			name: 'Sunita Gupta',
			bio: 'Madhubani painting artist creating traditional folk art on walls, paper, and fabric with natural colors and intricate patterns.',
			specialties: ['madhubani', 'folk-art', 'painting', 'natural-colors'],
			location: { city: 'Madhubani', state: 'Bihar', country: 'India' },
			avatar: '/assets/artisan-avatar-7.jpg',
			rating: 4.9,
			totalRatings: 198,
			joinedDate: new Date('2016-12-03'),
			verification: { isVerified: true },
			isActive: true,
			experience: 22,
			workshops: ['Madhubani Painting', 'Natural Color Preparation'],
			achievements: ['UNESCO Intangible Heritage Recognition', 'National Award for Folk Art 2022']
		},
		{
			userId: artisanUsers[7]._id,
			name: 'Ravi Shankar',
			bio: 'Dhokra artisan specializing in lost-wax casting technique to create intricate brass figurines and decorative items.',
			specialties: ['dhokra', 'lost-wax-casting', 'brass-casting'],
			location: { city: 'Bastar', state: 'Chhattisgarh', country: 'India' },
			avatar: '/assets/artisan-avatar-8.jpg',
			rating: 4.6,
			totalRatings: 134,
			joinedDate: new Date('2019-04-27'),
			verification: { isVerified: true },
			isActive: true,
			experience: 14,
			workshops: ['Lost Wax Casting', 'Traditional Dhokra Techniques'],
			achievements: ['Tribal Art Excellence Award 2020']
		},
		{
			userId: artisanUsers[8]._id,
			name: 'Maya Krishnan',
			bio: 'Kalamkari artist creating hand-painted cotton fabrics with vegetable dyes, specializing in mythological themes and contemporary designs.',
			specialties: ['kalamkari', 'hand-painting', 'vegetable-dyes', 'cotton-fabrics'],
			location: { city: 'Machilipatnam', state: 'Andhra Pradesh', country: 'India' },
			avatar: '/assets/artisan-avatar-9.jpg',
			rating: 4.8,
			totalRatings: 176,
			joinedDate: new Date('2018-07-14'),
			verification: { isVerified: true },
			isActive: true,
			experience: 17,
			workshops: ['Kalamkari Painting', 'Vegetable Dye Preparation'],
			achievements: ['Andhra Pradesh State Award 2021']
		},
		{
			userId: artisanUsers[9]._id,
			name: 'Deepak Verma',
			bio: 'Stone craftsman specializing in marble inlay work, pietra dura, and traditional stone carving techniques.',
			specialties: ['stone-work', 'marble-inlay', 'pietra-dura', 'stone-carving'],
			location: { city: 'Agra', state: 'Uttar Pradesh', country: 'India' },
			avatar: '/assets/artisan-avatar-10.jpg',
			rating: 4.7,
			totalRatings: 152,
			joinedDate: new Date('2017-05-09'),
			verification: { isVerified: true },
			isActive: true,
			experience: 19,
			workshops: ['Marble Inlay Techniques', 'Stone Carving Basics'],
			achievements: ['Heritage Craft Master Award 2019']
		}
	]
}

async function seedDatabase() {
	try {
		console.log('🌱 Starting database seed...')
		
		// Connect to MongoDB
		await mongoose.connect(mongoUri)
		console.log('📦 Connected to MongoDB')

		// Clear existing data
		await Promise.all([
			User.deleteMany({}),
			Artisan.deleteMany({}),
			Product.deleteMany({})
		])
		console.log('🗑️  Cleared existing data')

		// Create users
		const sampleUsers = await createSampleUsers()
		const users = await User.insertMany(sampleUsers)
		console.log(`👥 Created ${users.length} users`)

		// Create artisans (link to the last 10 users which are artisans)
		const artisanUsers = users.slice(-10) // Get last 10 users (the artisan users)
		const sampleArtisans = createSampleArtisans(artisanUsers)
		const artisans = await Artisan.insertMany(sampleArtisans)
		console.log(`🎨 Created ${artisans.length} artisans`)

		// Create sample products
		const sampleProducts = [
			// Pottery Products (Rajesh Kumar)
			{
				name: 'Traditional Blue Pottery Vase',
				description: 'Handcrafted blue pottery vase with intricate floral patterns, perfect for home decoration. Each piece is unique and made using traditional techniques passed down through generations.',
				price: 1250,
				originalPrice: 1500,
				images: ['/assets/blue-pottery-set.jpg'],
				artisanId: artisans[0]._id,
				category: 'pottery',
				subcategory: 'vases',
				materials: ['clay', 'ceramic glaze'],
				dimensions: '15cm x 15cm x 25cm',
				weight: 800,
				colors: ['blue', 'white'],
				tags: ['handmade', 'traditional', 'home-decor', 'floral'],
				stockCount: 5,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.8,
				reviewCount: 23,
				featured: true
			},
			{
				name: 'Blue Pottery Tea Set',
				description: 'Complete tea set including teapot, cups, and saucers in traditional blue pottery design. Perfect for special occasions and daily use.',
				price: 2850,
				originalPrice: 3200,
				images: ['/assets/tea-set.jpg'],
				artisanId: artisans[0]._id,
				category: 'pottery',
				subcategory: 'tableware',
				materials: ['clay', 'ceramic glaze'],
				dimensions: '25cm x 20cm x 15cm',
				weight: 1200,
				colors: ['blue', 'white'],
				tags: ['handmade', 'tea-set', 'ceramics', 'traditional'],
				stockCount: 3,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.9,
				reviewCount: 31,
				featured: true
			},
			{
				name: 'Miniature Pottery Figurines Set',
				description: 'Set of 6 miniature pottery figurines depicting traditional Rajasthani dancers and musicians. Beautiful collectible items.',
				price: 850,
				images: ['/assets/terracotta-vase.jpg'],
				artisanId: artisans[0]._id,
				category: 'pottery',
				subcategory: 'figurines',
				materials: ['clay', 'natural pigments'],
				dimensions: '8cm x 6cm x 12cm',
				weight: 300,
				colors: ['terracotta', 'blue'],
				tags: ['handmade', 'figurines', 'collectible', 'traditional'],
				stockCount: 8,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.7,
				reviewCount: 18
			},
			{
				name: 'Blue Pottery Wall Hanging',
				description: 'Decorative wall hanging with intricate blue pottery patterns and brass accents. Adds traditional charm to any space.',
				price: 1650,
				images: ['/assets/incense-holder.jpg'],
				artisanId: artisans[0]._id,
				category: 'pottery',
				subcategory: 'wall-decor',
				materials: ['clay', 'brass', 'ceramic glaze'],
				dimensions: '30cm x 5cm x 40cm',
				weight: 600,
				colors: ['blue', 'gold'],
				tags: ['handmade', 'wall-decor', 'traditional', 'brass'],
				stockCount: 4,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.6,
				reviewCount: 12
			},

			// Textile Products (Meera Singh)
			{
				name: 'Handwoven Cotton Bedsheet Set',
				description: 'Pure cotton bedsheet set with traditional block prints, includes 1 bedsheet and 2 pillowcases. Made with love in Varanasi.',
				price: 899,
				images: ['/assets/cotton-bedsheet.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'bedding',
				materials: ['cotton'],
				dimensions: '220cm x 150cm x 1cm',
				weight: 600,
				colors: ['white', 'blue', 'red'],
				tags: ['cotton', 'bedding', 'block-print', 'handwoven'],
				stockCount: 8,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.6,
				reviewCount: 18
			},
			{
				name: 'Silk Kantha Stole',
				description: 'Beautiful silk stole with kantha embroidery work. Lightweight and perfect for all seasons.',
				price: 1250,
				images: ['/assets/kantha-stole.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'scarves',
				materials: ['silk'],
				dimensions: '200cm x 50cm x 1cm',
				weight: 150,
				colors: ['cream', 'gold', 'red'],
				tags: ['silk', 'kantha', 'embroidery', 'handmade'],
				stockCount: 12,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.8,
				reviewCount: 27,
				featured: true
			},
			{
				name: 'Batik Print Cotton Saree',
				description: 'Traditional batik print saree made from pure cotton with hand-drawn wax patterns. Unique design for special occasions.',
				price: 1850,
				images: ['/assets/ikat-saree.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'sarees',
				materials: ['cotton', 'wax'],
				dimensions: '550cm x 110cm x 1cm',
				weight: 400,
				colors: ['indigo', 'white', 'gold'],
				tags: ['cotton', 'batik', 'saree', 'traditional'],
				stockCount: 6,
				isHandmade: true,
				shippingTime: '7-10 days',
				rating: 4.9,
				reviewCount: 34,
				featured: true
			},
			{
				name: 'Handloom Cotton Table Runner',
				description: 'Beautiful handloom table runner with traditional motifs. Perfect for dining table decoration.',
				price: 650,
				images: ['/assets/silk-scarf.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'table-linen',
				materials: ['cotton'],
				dimensions: '180cm x 35cm x 1cm',
				weight: 200,
				colors: ['cream', 'brown', 'red'],
				tags: ['cotton', 'handloom', 'table-runner', 'traditional'],
				stockCount: 15,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.5,
				reviewCount: 22
			},

			// Metalwork Products (Vikram Joshi)
			{
				name: 'Brass Decorative Bowl',
				description: 'Elegant brass bowl with engraved patterns, perfect for serving or decoration. Handcrafted with traditional techniques.',
				price: 675,
				images: ['/assets/brass-bowl.jpg'],
				artisanId: artisans[2]._id,
				category: 'metalwork',
				subcategory: 'bowls',
				materials: ['brass'],
				dimensions: '20cm x 20cm x 8cm',
				weight: 450,
				colors: ['gold'],
				tags: ['brass', 'decorative', 'serving', 'handcrafted'],
				stockCount: 12,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.7,
				reviewCount: 31,
				featured: true
			},
			{
				name: 'Copper Water Bottle',
				description: 'Traditional copper water bottle with intricate engraving. Keeps water cool and has health benefits.',
				price: 450,
				images: ['/assets/copper-bottle.jpg'],
				artisanId: artisans[2]._id,
				category: 'metalwork',
				subcategory: 'bottles',
				materials: ['copper'],
				dimensions: '8cm x 8cm x 25cm',
				weight: 300,
				colors: ['copper'],
				tags: ['copper', 'water-bottle', 'health', 'traditional'],
				stockCount: 20,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.6,
				reviewCount: 45,
				featured: true
			},
			{
				name: 'Brass Incense Holder',
				description: 'Beautiful brass incense holder with traditional design. Perfect for home pooja rooms and meditation spaces.',
				price: 350,
				images: ['/assets/incense-holder.jpg'],
				artisanId: artisans[2]._id,
				category: 'metalwork',
				subcategory: 'religious',
				materials: ['brass'],
				dimensions: '12cm x 8cm x 15cm',
				weight: 200,
				colors: ['gold'],
				tags: ['brass', 'incense-holder', 'religious', 'pooja'],
				stockCount: 18,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.4,
				reviewCount: 28
			},
			{
				name: 'Metal Lamp Stand',
				description: 'Elegant metal lamp stand with brass finish and traditional design. Adds warmth to any room.',
				price: 1250,
				images: ['/assets/metal-lamp.jpg'],
				artisanId: artisans[2]._id,
				category: 'metalwork',
				subcategory: 'lighting',
				materials: ['brass', 'iron'],
				dimensions: '20cm x 20cm x 45cm',
				weight: 800,
				colors: ['gold', 'black'],
				tags: ['brass', 'lamp', 'lighting', 'decorative'],
				stockCount: 7,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.8,
				reviewCount: 19
			},

			// Woodwork Products (Anita Patel)
			{
				name: 'Wooden Jewelry Box',
				description: 'Intricately carved wooden jewelry box with brass inlay work. Perfect for storing precious jewelry and accessories.',
				price: 1850,
				images: ['/assets/jewelry-box.jpg'],
				artisanId: artisans[3]._id,
				category: 'woodwork',
				subcategory: 'storage',
				materials: ['wood', 'brass'],
				dimensions: '25cm x 15cm x 12cm',
				weight: 600,
				colors: ['brown', 'gold'],
				tags: ['wood', 'jewelry-box', 'carved', 'brass-inlay'],
				stockCount: 6,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.9,
				reviewCount: 42,
				featured: true
			},
			{
				name: 'Temple Carving Wall Panel',
				description: 'Beautiful wooden wall panel with traditional temple carvings. Adds spiritual and aesthetic value to your space.',
				price: 3200,
				images: ['/assets/kalamkari-wall.jpg'],
				artisanId: artisans[3]._id,
				category: 'woodwork',
				subcategory: 'wall-decor',
				materials: ['teak wood'],
				dimensions: '60cm x 5cm x 40cm',
				weight: 1200,
				colors: ['brown'],
				tags: ['wood', 'temple-carving', 'wall-panel', 'spiritual'],
				stockCount: 3,
				isHandmade: true,
				shippingTime: '7-10 days',
				rating: 4.9,
				reviewCount: 15
			},
			{
				name: 'Wooden Spice Box Set',
				description: 'Traditional wooden spice box with multiple compartments. Handcrafted with precision and care.',
				price: 950,
				images: ['/assets/jute-bag.jpg'],
				artisanId: artisans[3]._id,
				category: 'woodwork',
				subcategory: 'kitchen',
				materials: ['wood'],
				dimensions: '30cm x 20cm x 10cm',
				weight: 400,
				colors: ['brown'],
				tags: ['wood', 'spice-box', 'kitchen', 'traditional'],
				stockCount: 9,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.6,
				reviewCount: 33
			},

			// Bidriware Products (Kavya Reddy)
			{
				name: 'Bidriware Silver Inlay Box',
				description: 'Exquisite bidriware box with intricate silver inlay work. A masterpiece of traditional Karnataka craftsmanship.',
				price: 2850,
				images: ['/assets/jewelry-box.jpg'],
				artisanId: artisans[4]._id,
				category: 'metalwork',
				subcategory: 'bidriware',
				materials: ['alloy', 'silver'],
				dimensions: '15cm x 10cm x 8cm',
				weight: 350,
				colors: ['black', 'silver'],
				tags: ['bidriware', 'silver-inlay', 'traditional', 'karnataka'],
				stockCount: 4,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.8,
				reviewCount: 26
			},
			{
				name: 'Bidriware Hookah Base',
				description: 'Traditional bidriware hookah base with silver inlay patterns. A collector\'s item for enthusiasts.',
				price: 4200,
				images: ['/assets/brass-bowl.jpg'],
				artisanId: artisans[4]._id,
				category: 'metalwork',
				subcategory: 'bidriware',
				materials: ['alloy', 'silver'],
				dimensions: '20cm x 20cm x 25cm',
				weight: 800,
				colors: ['black', 'silver'],
				tags: ['bidriware', 'hookah', 'silver-inlay', 'collectible'],
				stockCount: 2,
				isHandmade: true,
				shippingTime: '7-10 days',
				rating: 4.9,
				reviewCount: 12
			},

			// Jewelry Products (Arjun Nair)
			{
				name: 'Gold Filigree Earrings',
				description: 'Delicate gold filigree earrings with traditional Kerala design. Perfect for weddings and special occasions.',
				price: 1250,
				images: ['/assets/jewelry-box.jpg'],
				artisanId: artisans[5]._id,
				category: 'jewelry',
				subcategory: 'earrings',
				materials: ['gold'],
				dimensions: '3cm x 2cm x 4cm',
				weight: 8,
				colors: ['gold'],
				tags: ['gold', 'filigree', 'earrings', 'traditional'],
				stockCount: 8,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.7,
				reviewCount: 38
			},
			{
				name: 'Silver Temple Chain',
				description: 'Beautiful silver chain with temple design motifs. Traditional Kerala jewelry craftsmanship.',
				price: 850,
				images: ['/assets/silk-scarf.jpg'],
				artisanId: artisans[5]._id,
				category: 'jewelry',
				subcategory: 'necklaces',
				materials: ['silver'],
				dimensions: '45cm x 1cm x 1cm',
				weight: 25,
				colors: ['silver'],
				tags: ['silver', 'chain', 'temple-design', 'traditional'],
				stockCount: 12,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.6,
				reviewCount: 29
			},

			// Painting Products (Sunita Gupta)
			{
				name: 'Madhubani Wall Painting',
				description: 'Traditional Madhubani painting on handmade paper depicting folk themes and natural motifs.',
				price: 2200,
				images: ['/assets/madhubani-painting.jpg'],
				artisanId: artisans[6]._id,
				category: 'paintings',
				subcategory: 'madhubani',
				materials: ['paper', 'natural colors'],
				dimensions: '40cm x 30cm x 1cm',
				weight: 100,
				colors: ['multicolor'],
				tags: ['madhubani', 'folk-art', 'natural-colors', 'traditional'],
				stockCount: 5,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.9,
				reviewCount: 41,
				featured: true
			},
			{
				name: 'Miniature Madhubani Set',
				description: 'Set of 3 miniature Madhubani paintings perfect for gifting or small space decoration.',
				price: 950,
				images: ['/assets/madhubani-painting.jpg'],
				artisanId: artisans[6]._id,
				category: 'paintings',
				subcategory: 'madhubani',
				materials: ['paper', 'natural colors'],
				dimensions: '15cm x 12cm x 1cm',
				weight: 50,
				colors: ['multicolor'],
				tags: ['madhubani', 'miniature', 'gift-set', 'traditional'],
				stockCount: 10,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.7,
				reviewCount: 23
			},

			// Dhokra Products (Ravi Shankar)
			{
				name: 'Dhokra Elephant Figurine',
				description: 'Beautiful dhokra elephant figurine created using ancient lost-wax casting technique. Tribal art from Chhattisgarh.',
				price: 1650,
				images: ['/assets/dhokra-elephant.jpg'],
				artisanId: artisans[7]._id,
				category: 'metalwork',
				subcategory: 'dhokra',
				materials: ['brass', 'wax'],
				dimensions: '20cm x 15cm x 18cm',
				weight: 400,
				colors: ['gold'],
				tags: ['dhokra', 'elephant', 'lost-wax', 'tribal-art'],
				stockCount: 6,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.8,
				reviewCount: 34
			},
			{
				name: 'Dhokra Tribal Mask',
				description: 'Intricate dhokra mask depicting traditional tribal designs. Perfect for wall decoration or collection.',
				price: 1200,
				images: ['/assets/dhokra-elephant.jpg'],
				artisanId: artisans[7]._id,
				category: 'metalwork',
				subcategory: 'dhokra',
				materials: ['brass', 'wax'],
				dimensions: '25cm x 5cm x 30cm',
				weight: 300,
				colors: ['gold'],
				tags: ['dhokra', 'mask', 'tribal', 'wall-decor'],
				stockCount: 8,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.6,
				reviewCount: 27
			},

			// Kalamkari Products (Maya Krishnan)
			{
				name: 'Kalamkari Wall Hanging',
				description: 'Hand-painted kalamkari wall hanging with mythological themes using vegetable dyes on cotton fabric.',
				price: 2800,
				images: ['/assets/kalamkari-wall.jpg'],
				artisanId: artisans[8]._id,
				category: 'textiles',
				subcategory: 'kalamkari',
				materials: ['cotton', 'vegetable dyes'],
				dimensions: '50cm x 40cm x 1cm',
				weight: 200,
				colors: ['multicolor'],
				tags: ['kalamkari', 'hand-painted', 'vegetable-dyes', 'mythological'],
				stockCount: 4,
				isHandmade: true,
				shippingTime: '7-10 days',
				rating: 4.9,
				reviewCount: 31
			},
			{
				name: 'Kalamkari Table Runner',
				description: 'Beautiful kalamkari table runner with traditional motifs and natural vegetable dyes.',
				price: 1450,
				images: ['/assets/kalamkari-wall.jpg'],
				artisanId: artisans[8]._id,
				category: 'textiles',
				subcategory: 'kalamkari',
				materials: ['cotton', 'vegetable dyes'],
				dimensions: '180cm x 35cm x 1cm',
				weight: 150,
				colors: ['multicolor'],
				tags: ['kalamkari', 'table-runner', 'vegetable-dyes', 'traditional'],
				stockCount: 7,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.7,
				reviewCount: 19
			},

			// Stone Work Products (Deepak Verma)
			{
				name: 'Marble Inlay Coasters Set',
				description: 'Set of 6 marble inlay coasters with intricate pietra dura work. Traditional Agra craftsmanship.',
				price: 1850,
				images: ['/assets/stone-coasters.jpg'],
				artisanId: artisans[9]._id,
				category: 'crafts',
				subcategory: 'coasters',
				materials: ['marble', 'semi-precious stones'],
				dimensions: '10cm x 10cm x 1cm',
				weight: 200,
				colors: ['white', 'multicolor'],
				tags: ['marble', 'inlay', 'pietra-dura', 'coasters'],
				stockCount: 9,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.8,
				reviewCount: 36
			},
			{
				name: 'Stone Carved Vase',
				description: 'Beautiful stone vase with traditional carving patterns. Perfect for floral arrangements or decoration.',
				price: 3200,
				images: ['/assets/terracotta-vase.jpg'],
				artisanId: artisans[9]._id,
				category: 'crafts',
				subcategory: 'vases',
				materials: ['sandstone'],
				dimensions: '20cm x 20cm x 35cm',
				weight: 1500,
				colors: ['beige'],
				tags: ['stone', 'carved', 'vase', 'traditional'],
				stockCount: 5,
				isHandmade: true,
				shippingTime: '7-10 days',
				rating: 4.7,
				reviewCount: 22
			},

			// Additional Products for Variety
			{
				name: 'Kashmiri Shawl',
				description: 'Luxurious pashmina shawl with intricate embroidery work. Perfect for winter and special occasions.',
				price: 4500,
				images: ['/assets/kashmiri-shawl.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'shawls',
				materials: ['pashmina wool'],
				dimensions: '200cm x 100cm x 1cm',
				weight: 250,
				colors: ['cream', 'gold'],
				tags: ['pashmina', 'shawl', 'kashmiri', 'winter'],
				stockCount: 6,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.9,
				reviewCount: 28
			},
			{
				name: 'Bandhani Dupatta',
				description: 'Traditional bandhani dupatta with tie-dye patterns. Vibrant colors and unique designs.',
				price: 1200,
				images: ['/assets/bandhani-dupatta.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'dupattas',
				materials: ['silk'],
				dimensions: '250cm x 90cm x 1cm',
				weight: 180,
				colors: ['red', 'yellow', 'blue'],
				tags: ['bandhani', 'dupatta', 'tie-dye', 'traditional'],
				stockCount: 10,
				isHandmade: true,
				shippingTime: '5-7 days',
				rating: 4.6,
				reviewCount: 24
			},
			{
				name: 'Jute Shopping Bag',
				description: 'Eco-friendly jute bag with traditional weaving patterns. Perfect for shopping and daily use.',
				price: 250,
				images: ['/assets/jute-bag.jpg'],
				artisanId: artisans[1]._id,
				category: 'textiles',
				subcategory: 'bags',
				materials: ['jute'],
				dimensions: '35cm x 25cm x 30cm',
				weight: 150,
				colors: ['natural', 'brown'],
				tags: ['jute', 'eco-friendly', 'bag', 'shopping'],
				stockCount: 25,
				isHandmade: true,
				shippingTime: '3-5 days',
				rating: 4.3,
				reviewCount: 67
			}
		]

		const products = await Product.insertMany(sampleProducts)
		console.log(`🛍️  Created ${products.length} products`)

		console.log('✅ Database seeded successfully!')
		
	} catch (error) {
		console.error('❌ Error seeding database:', error)
		process.exit(1)
	} finally {
		await mongoose.disconnect()
		console.log('🔌 Disconnected from MongoDB')
		process.exit(0)
	}
}

seedDatabase()