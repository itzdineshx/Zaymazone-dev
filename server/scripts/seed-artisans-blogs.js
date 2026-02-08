import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Artisan from '../src/models/Artisan.js'
import User from '../src/models/User.js'
import BlogPost from '../src/models/BlogPost.js'
import { uploadImageToGridFS, initGridFS } from '../src/services/imageService.js'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Asset directory
const assetDir = path.join(__dirname, '../../src/assets')

console.log('Asset directory:', assetDir)

// Artisan data matching frontend mock data
const artisansData = [
	{
		name: 'Priya Sharma',
		email: 'priya@artisan.com',
		bio: 'Expert weaver creating intricate patterns using traditional Patola silk weaving techniques. Her family has been in textile arts for over three generations.',
		specialty: 'Textiles & Weaving',
		location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
		experience: 15,
		rating: 4.8,
		totalProducts: 45,
		image: 'artisan-1.jpg',
		avatar: 'artisan-avatar-1.jpg',
		achievements: ['Master Craftsman Award', 'Export Excellence', 'Traditional Textile Honor'],
		joinedYear: '2018',
		specialties: ['Patola Weaving', 'Bandhani', 'Silk Textiles']
	},
	{
		name: 'Ravi Kumar',
		email: 'ravi@artisan.com',
		bio: 'Master potter specializing in terracotta and blue pottery. Uses traditional wheel-throwing techniques to create both functional and decorative pieces.',
		specialty: 'Pottery & Ceramics',
		location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
		experience: 20,
		rating: 4.7,
		totalProducts: 56,
		image: 'artisan-2.jpg',
		avatar: 'artisan-avatar-2.jpg',
		achievements: ['Heritage Craft Award', 'UNESCO Recognition', 'National Artisan Award'],
		joinedYear: '2016',
		specialties: ['Blue Pottery', 'Terracotta', 'Ceramic Art']
	},
	{
		name: 'Meera Devi',
		email: 'meera@artisan.com',
		bio: 'Skilled artisan crafting traditional Kundan and Meenakari jewelry with contemporary designs. Known for her innovative fusion of traditional and modern styles.',
		specialty: 'Jewelry & Metalwork',
		location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
		experience: 12,
		rating: 4.9,
		totalProducts: 67,
		image: 'artisan-3.jpg',
		avatar: 'artisan-avatar-3.jpg',
		achievements: ['Young Entrepreneur Award', 'Design Innovation', 'Best Jewelry Designer 2024'],
		joinedYear: '2020',
		specialties: ['Kundan Jewelry', 'Meenakari Work', 'Silver Crafting']
	},
	{
		name: 'Ravi Kumar',
		email: 'ravi.woodcarving@artisan.com',
		bio: 'Master woodcarver specializing in intricate Mysore style furniture and decorative items. His detailed work showcases the rich heritage of South Indian woodcraft.',
		specialty: 'Wood Carving',
		location: { city: 'Mysore', state: 'Karnataka', country: 'India' },
		experience: 18,
		rating: 4.7,
		totalProducts: 34,
		image: 'artisan-4.jpg',
		avatar: 'artisan-avatar-4.jpg',
		achievements: ['Traditional Arts Award', 'Cultural Heritage', 'Master Carver Recognition'],
		joinedYear: '2017',
		specialties: ['Mysore Carving', 'Sandalwood Art', 'Temple Architecture']
	},
	{
		name: 'Sunita Jha',
		email: 'sunita@artisan.com',
		bio: 'Traditional Madhubani artist keeping alive the ancient art of Mithila paintings. Her work depicts mythological stories and nature with vibrant colors.',
		specialty: 'Madhubani Paintings',
		location: { city: 'Madhubani', state: 'Bihar', country: 'India' },
		experience: 22,
		rating: 4.9,
		totalProducts: 16,
		image: 'artisan-1.jpg',
		avatar: 'artisan-avatar-5.jpg',
		achievements: ['Folk Art Excellence', 'Cultural Ambassador', 'International Recognition'],
		joinedYear: '2019',
		specialties: ['Madhubani Art', 'Natural Pigments', 'Wall Paintings']
	},
	{
		name: 'Abdul Rahman',
		email: 'abdul@artisan.com',
		bio: 'Master craftsman in Pietra Dura stone inlay work, carrying forward a family tradition of 4 generations. Expert in creating intricate marble masterpieces.',
		specialty: 'Stone Inlay Work',
		location: { city: 'Agra', state: 'Uttar Pradesh', country: 'India' },
		experience: 25,
		rating: 4.7,
		totalProducts: 25,
		image: 'artisan-2.jpg',
		avatar: 'artisan-avatar-6.jpg',
		achievements: ['Heritage Master Craftsman', 'Taj Mahal Restoration Team', 'International Stone Art Award'],
		joinedYear: '2015',
		specialties: ['Pietra Dura', 'Marble Inlay', 'Semi-Precious Stone Work']
	},
	{
		name: 'Lakshmi Iyer',
		email: 'lakshmi@artisan.com',
		bio: 'Traditional Tanjore painting artist known for her intricate gold foil work and vibrant deity portraits. Preserves the 400-year-old Tanjore art tradition.',
		specialty: 'Tanjore Paintings',
		location: { city: 'Thanjavur', state: 'Tamil Nadu', country: 'India' },
		experience: 16,
		rating: 4.8,
		totalProducts: 28,
		image: 'artisan-3.jpg',
		avatar: 'artisan-avatar-7.jpg',
		achievements: ['Traditional Art Excellence', 'South Indian Heritage Award', 'Temple Art Recognition'],
		joinedYear: '2018',
		specialties: ['Tanjore Painting', 'Gold Foil Work', 'Religious Art']
	},
	{
		name: 'Ganesh Patil',
		email: 'ganesh@artisan.com',
		bio: 'Warli art specialist creating contemporary interpretations while maintaining traditional tribal aesthetics. His work bridges ancient and modern art.',
		specialty: 'Warli Art',
		location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
		experience: 14,
		rating: 4.6,
		totalProducts: 38,
		image: 'artisan-4.jpg',
		avatar: 'artisan-avatar-8.jpg',
		achievements: ['Tribal Art Award', 'Contemporary Folk Artist', 'International Exhibition'],
		joinedYear: '2019',
		specialties: ['Warli Painting', 'Tribal Art', 'Modern Folk Fusion']
	}
]

// Blog data matching frontend mock data
const blogPostsData = [
	{
		title: "The Art of Blue Pottery: A Journey Through Rajasthan's Most Prized Craft",
		slug: "art-of-blue-pottery-rajasthan-craft",
		excerpt: "Discover the centuries-old tradition of blue pottery making in Jaipur, from its Persian origins to modern-day artisans keeping the craft alive.",
		content: `
			<p>Blue pottery, with its distinctive cobalt blue and white aesthetic, has been a cornerstone of Rajasthani craftsmanship for over 400 years. This unique art form, which finds its origins in Persian traditions, has evolved into one of India's most recognizable and cherished crafts.</p>

			<h2>Origins and History</h2>
			<p>The technique of blue pottery came to India via Persia and Afghanistan, eventually finding its home in Jaipur during the reign of Maharaja Ram Singh II in the late 19th century. The royal patronage helped establish and refine the craft, making it an integral part of Rajasthani cultural identity.</p>

			<h2>The Unique Technique</h2>
			<p>What sets blue pottery apart is its distinctive manufacturing process. Unlike traditional pottery that uses clay, blue pottery employs a special mixture of quartz stone powder, powdered glass, Multani mitti (Fuller's earth), borax, gum, and water. This mixture is rolled out, shaped, and then painted with vibrant colors.</p>

			<p>The characteristic blue dye comes from copper oxide, while other colors are achieved through various mineral-based pigments. Each piece is hand-painted with intricate floral and geometric patterns before being fired in a kiln at low temperatures.</p>

			<h2>Modern Revival</h2>
			<p>In recent decades, blue pottery has experienced a renaissance thanks to dedicated artisans and supportive organizations. Contemporary designers have helped introduce fresh patterns and forms while maintaining the traditional essence of the craft.</p>

			<p>Today's blue pottery includes both traditional items like vases, plates, and jars, as well as modern products such as coasters, tiles, and decorative accessories. This adaptation has helped make the craft commercially viable while preserving its cultural significance.</p>

			<h2>Supporting the Artisan Community</h2>
			<p>When you purchase authentic blue pottery, you're not just acquiring a beautiful piece of art – you're supporting a community of skilled artisans who have dedicated their lives to preserving this traditional craft. Each piece represents hours of careful work and generations of inherited knowledge.</p>

			<p>As consumers become more conscious of the origin and impact of their purchases, traditional crafts like blue pottery offer a meaningful alternative to mass-produced goods. They represent sustainability, cultural preservation, and direct support for artisan communities.</p>
		`,
		featuredImage: 'blog-blue-pottery.jpg',
		author: {
			name: 'Priya Sharma',
			avatar: 'author-priya.jpg',
			role: 'Craft Historian',
			bio: 'Priya is a cultural researcher and craft historian with over 15 years of experience documenting traditional Indian arts.'
		},
		category: 'Traditional Crafts',
		tags: ['blue pottery', 'rajasthan', 'traditional crafts', 'ceramics', 'artisans', 'jaipur'],
		featured: true,
		readTime: '8 min read',
		publishedAt: new Date('2024-01-15'),
		views: 1247,
		likes: 89,
		comments: 23,
		shares: 34
	},
	{
		title: "Preserving Handloom Traditions: The Weavers of Bengal",
		slug: "preserving-handloom-traditions-weavers-bengal",
		excerpt: "Meet the master weavers who continue to create stunning handloom textiles using techniques passed down through generations.",
		content: `
			<p>In the villages of West Bengal, the rhythmic sound of handlooms continues to echo through narrow lanes, carrying forward a tradition that spans centuries. The master weavers of Bengal represent one of India's most treasured textile traditions.</p>

			<h2>The Heritage of Bengali Handloom</h2>
			<p>Bengali handloom weaving dates back over a thousand years, with references found in ancient texts and archaeological evidence. The Jamdani, Tant, and Baluchari sarees produced here are world-renowned for their intricate patterns and fine craftsmanship.</p>

			<h2>The Weaving Process</h2>
			<p>Creating a single piece of traditional Bengali handloom fabric is a labor-intensive process that can take weeks or even months. Weavers use wooden handlooms, carefully interlacing warp and weft threads to create complex patterns. The Jamdani technique, in particular, involves supplementary weft technique where patterns are woven directly into the fabric.</p>

			<h2>Challenges and Hope</h2>
			<p>Like many traditional crafts, handloom weaving faces challenges from mechanized textile production. However, increased awareness and government support initiatives have helped revitalize the sector. Organizations working with weavers have introduced contemporary designs while maintaining traditional techniques, making handloom products more appealing to younger generations.</p>

			<p>The global fashion industry's growing interest in sustainable and handcrafted textiles has also created new opportunities for Bengali weavers to showcase their skills on international platforms.</p>
		`,
		featuredImage: 'blog-handloom.jpg',
		author: {
			name: 'Rajesh Kumar',
			avatar: 'author-rajesh.jpg',
			role: 'Cultural Researcher',
			bio: 'Rajesh documents traditional textile arts and works with weaving communities across India.'
		},
		category: 'Textiles',
		tags: ['handloom', 'bengal', 'weaving', 'textiles', 'jamdani', 'traditional crafts'],
		featured: true,
		readTime: '6 min read',
		publishedAt: new Date('2024-01-12'),
		views: 892,
		likes: 67,
		comments: 12,
		shares: 18
	},
	{
		title: "The Revival of Dhokra Art: Metal Casting in Modern Times",
		slug: "revival-dhokra-art-metal-casting",
		excerpt: "Explore the ancient lost-wax casting technique that creates unique brass and bronze sculptures, and how it's finding new relevance today.",
		content: `
			<p>Dhokra, one of the oldest forms of metal casting in India, continues to captivate art enthusiasts with its primitive simplicity and rustic beauty. This 4,000-year-old craft is experiencing a renaissance as contemporary collectors and designers discover its unique aesthetic.</p>

			<h2>The Ancient Technique</h2>
			<p>Dhokra artisans use the lost-wax casting method, where a clay core is covered with a layer of wax, then coated again with clay. When heated, the wax melts away, leaving a mold into which molten metal is poured. Each piece is unique – the wax model is destroyed in the process, making replication impossible.</p>

			<h2>Cultural Significance</h2>
			<p>Traditionally created by tribal communities in states like West Bengal, Odisha, and Chhattisgarh, Dhokra artifacts often depict folk motifs, deities, animals, and tribal life. These pieces serve not just as decorative items but as cultural narratives preserving tribal heritage.</p>

			<h2>Modern Applications</h2>
			<p>Contemporary designers are collaborating with Dhokra artisans to create modern interpretations – from jewelry and home decor to installations and sculptures. This fusion of traditional technique with contemporary design sensibilities has opened new markets while keeping the craft relevant.</p>
		`,
		featuredImage: 'blog-dhokra.jpg',
		author: {
			name: 'Meera Devi',
			avatar: 'author-meera.jpg',
			role: 'Art Curator',
			bio: 'Meera is a contemporary art curator with expertise in traditional Indian metal crafts and tribal art forms.'
		},
		category: 'Metal Crafts',
		tags: ['dhokra', 'metal casting', 'brass', 'sculpture', 'tribal art', 'lost-wax'],
		featured: false,
		readTime: '5 min read',
		publishedAt: new Date('2024-01-10'),
		views: 654,
		likes: 45,
		comments: 12,
		shares: 18
	},
	{
		title: "Sustainable Crafting: How Traditional Arts Support Environmental Conservation",
		slug: "sustainable-crafting-traditional-arts-environmental-conservation",
		excerpt: "Discover how traditional crafts are inherently sustainable and how modern artisans are leading the way in eco-friendly practices.",
		content: `
			<p>In an era of environmental consciousness, traditional crafts offer valuable lessons in sustainability. These age-old practices, developed long before modern environmental movements, embody principles of resource conservation, minimal waste, and harmony with nature.</p>

			<h2>Natural Materials and Processes</h2>
			<p>Traditional artisans primarily use locally sourced, natural materials – clay from nearby riverbeds, natural dyes from plants, wood from sustainable forests. The production processes typically have minimal carbon footprints, relying on human skill rather than energy-intensive machinery.</p>

			<h2>Zero-Waste Philosophy</h2>
			<p>Many traditional crafts incorporate practices that minimize waste. Textile weavers use every thread, potters recycle clay scraps, and wood carvers repurpose offcuts into smaller items. This zero-waste approach stems from both economic necessity and cultural values of resourcefulness.</p>

			<h2>Biodegradable Products</h2>
			<p>Unlike plastic and synthetic materials that persist in the environment for centuries, traditional craft products are typically biodegradable. A terracotta pot, a cotton textile, or a wooden sculpture will eventually return to the earth without leaving toxic residues.</p>

			<h2>Modern Eco-Innovations</h2>
			<p>Contemporary artisans are taking sustainability further by incorporating recycled materials, using solar energy for production, and obtaining environmental certifications. Some are experimenting with eco-friendly alternatives to traditional materials that might be scarce or protected.</p>

			<p>By choosing handcrafted products, consumers support not just individual artisans but an entire ecosystem of sustainable production that benefits both people and the planet.</p>
		`,
		featuredImage: 'blog-sustainability.jpg',
		author: {
			name: 'Anita Verma',
			avatar: 'author-anita.jpg',
			role: 'Sustainability Expert',
			bio: 'Anita works at the intersection of traditional crafts and environmental sustainability.'
		},
		category: 'Sustainability',
		tags: ['sustainability', 'eco-friendly', 'traditional crafts', 'environment', 'conservation'],
		featured: false,
		readTime: '7 min read',
		publishedAt: new Date('2024-01-08'),
		views: 743,
		likes: 56,
		comments: 15,
		shares: 21
	},
	{
		title: "The Economics of Craft: Supporting Artisan Communities",
		slug: "economics-craft-supporting-artisan-communities",
		excerpt: "Understanding the economic impact of purchasing traditional crafts and how it directly supports rural artisan communities.",
		content: `
			<p>When you purchase a handcrafted item, you're not just buying a product – you're investing in a community, preserving cultural heritage, and supporting sustainable livelihoods. Understanding the economics behind traditional crafts reveals their profound impact on rural India.</p>

			<h2>Direct Economic Impact</h2>
			<p>Unlike mass-produced goods where profits are distributed across long supply chains and corporate structures, purchasing directly from artisans ensures that a much larger portion of the payment reaches the maker. This direct economic benefit can significantly improve an artisan family's quality of life.</p>

			<h2>Employment Generation</h2>
			<p>The craft sector is one of India's largest employment providers after agriculture. Millions of families, particularly in rural areas, depend on traditional crafts for their primary or supplementary income. Supporting these crafts helps maintain this crucial employment base.</p>

			<h2>Skill Preservation</h2>
			<p>Economic viability encourages younger generations to learn traditional skills. When crafts provide sustainable livelihoods, knowledge is passed down through families, ensuring these ancient techniques survive for future generations.</p>

			<h2>Community Development</h2>
			<p>The craft economy supports not just artisans but entire value chains – from raw material suppliers to local merchants, transporters, and retailers. This multiplier effect amplifies the economic impact of each purchase.</p>
		`,
		featuredImage: 'blog-economics.jpg',
		author: {
			name: 'Vikram Singh',
			avatar: 'author-vikram.jpg',
			role: 'Economic Analyst',
			bio: 'Vikram specializes in rural economics and the socio-economic impact of traditional industries.'
		},
		category: 'Community Impact',
		tags: ['economics', 'rural development', 'artisan communities', 'livelihood', 'fair trade'],
		featured: false,
		readTime: '6 min read',
		publishedAt: new Date('2024-01-05'),
		views: 534,
		likes: 42,
		comments: 11,
		shares: 16
	},
	{
		title: "Modern Interpretations of Ancient Crafts: Where Tradition Meets Innovation",
		slug: "modern-interpretations-ancient-crafts-tradition-meets-innovation",
		excerpt: "How contemporary artisans are reimagining traditional crafts for modern homes while preserving cultural essence.",
		content: `
			<p>The challenge for modern artisans lies in balancing respect for tradition with the demands of contemporary aesthetics and functionality. This delicate balance has led to exciting innovations that honor the past while embracing the future.</p>

			<h2>Contemporary Design Sensibilities</h2>
			<p>Today's artisans are collaborating with designers to create products that fit modern lifestyles. Traditional Warli art appears on contemporary furniture, blue pottery takes the form of minimalist home decor, and heritage textiles are reimagined as fashion accessories.</p>

			<h2>Function Meets Form</h2>
			<p>While maintaining traditional techniques, artisans are creating products with modern functionality – terracotta planters with drainage systems, handwoven bags with laptop compartments, or traditional lamps fitted with LED bulbs. These innovations make traditional crafts more practical for contemporary use.</p>

			<h2>Global Influences</h2>
			<p>International exposure has introduced new perspectives while enriching traditional practices. Artisans are incorporating global design trends, color palettes, and forms while retaining their craft's core identity.</p>

			<p>This evolution demonstrates that tradition and innovation need not be opposites. By thoughtfully adapting to changing times, traditional crafts remain relevant and continue to captivate new generations of admirers.</p>
		`,
		featuredImage: 'blog-innovation.jpg',
		author: {
			name: 'Kavya Patel',
			avatar: 'author-kavya.jpg',
			role: 'Design Researcher',
			bio: 'Kavya explores the intersection of traditional crafts and contemporary design.'
		},
		category: 'Innovation',
		tags: ['innovation', 'modern design', 'traditional crafts', 'contemporary', 'fusion'],
		featured: false,
		readTime: '9 min read',
		publishedAt: new Date('2024-01-03'),
		views: 687,
		likes: 53,
		comments: 16,
		shares: 19
	}
]

async function seedDatabase() {
	try {
		console.log('Connecting to MongoDB...')
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone')
		console.log('Connected to MongoDB')

		// Initialize GridFS
		console.log('Initializing GridFS...')
		await initGridFS()
		console.log('GridFS initialized')

		// Clear existing data
		console.log('Clearing existing artisans and blogs...')
		await Artisan.deleteMany({})
		await BlogPost.deleteMany({})
		// Clean up artisan users
		await User.deleteMany({ role: 'artisan' })
		console.log('Cleared existing data')

		// Upload all images first
		console.log('\n=== Uploading Images to GridFS ===')
		const imageMap = new Map()

		// Upload artisan images
		for (const artisan of artisansData) {
			if (artisan.image) {
				const imagePath = path.join(assetDir, artisan.image)
				if (fs.existsSync(imagePath)) {
					console.log(`Uploading ${artisan.image}...`)
					const result = await uploadImageToGridFS(imagePath, artisan.image, 'artisan')
					imageMap.set(artisan.image, result.filename)
				}
			}
			if (artisan.avatar) {
				const avatarPath = path.join(assetDir, artisan.avatar)
				if (fs.existsSync(avatarPath)) {
					console.log(`Uploading ${artisan.avatar}...`)
					const result = await uploadImageToGridFS(avatarPath, artisan.avatar, 'artisan')
					imageMap.set(artisan.avatar, result.filename)
				}
			}
		}

		// Upload blog images
		for (const post of blogPostsData) {
			if (post.featuredImage) {
				const imagePath = path.join(assetDir, post.featuredImage)
				if (fs.existsSync(imagePath)) {
					console.log(`Uploading ${post.featuredImage}...`)
					const result = await uploadImageToGridFS(imagePath, post.featuredImage, 'blog')
					imageMap.set(post.featuredImage, result.filename)
				}
			}
			if (post.author.avatar) {
				const avatarPath = path.join(assetDir, post.author.avatar)
				if (fs.existsSync(avatarPath)) {
					console.log(`Uploading ${post.author.avatar}...`)
					const result = await uploadImageToGridFS(avatarPath, post.author.avatar, 'blog')
					imageMap.set(post.author.avatar, result.filename)
				}
			}
		}

		console.log(`\nUploaded ${imageMap.size} images to GridFS`)

		// Create artisans
		console.log('\n=== Creating Artisans ===')
		for (const artisanData of artisansData) {
			// Create user account for artisan
			const user = await User.create({
				name: artisanData.name,
				email: artisanData.email,
				passwordHash: await bcrypt.hash('artisan123', 10),
				role: 'artisan',
				isEmailVerified: true
			})

			// Create artisan profile
			const artisan = await Artisan.create({
				userId: user._id,
				name: artisanData.name,
				bio: artisanData.bio,
				location: artisanData.location,
				avatar: imageMap.get(artisanData.avatar) || '',
				coverImage: imageMap.get(artisanData.image) || '',
				specialties: artisanData.specialties || [artisanData.specialty],
				experience: artisanData.experience,
				rating: artisanData.rating,
				totalProducts: artisanData.totalProducts,
				totalRatings: Math.floor(artisanData.totalProducts * artisanData.rating),
				verification: {
					isVerified: true,
					verifiedAt: new Date()
				},
				isActive: true,
				joinedDate: new Date(artisanData.joinedYear || '2020', 0, 1)
			})

			console.log(`✓ Created artisan: ${artisan.name}`)
		}

		// Create blog posts
		console.log('\n=== Creating Blog Posts ===')
		for (const postData of blogPostsData) {
			const post = await BlogPost.create({
				title: postData.title,
				slug: postData.slug,
				excerpt: postData.excerpt,
				content: postData.content,
				featuredImage: imageMap.get(postData.featuredImage) || '',
				author: {
					name: postData.author.name,
					avatar: imageMap.get(postData.author.avatar) || '',
					role: postData.author.role,
					bio: postData.author.bio
				},
				category: postData.category,
				tags: postData.tags,
				status: 'published',
				featured: postData.featured,
				readTime: postData.readTime,
				publishedAt: postData.publishedAt,
				views: postData.views,
				likes: postData.likes,
				comments: postData.comments,
				shares: postData.shares,
				isActive: true
			})

			console.log(`✓ Created blog post: ${post.title}`)
		}

		console.log('\n✅ Database seeded successfully!')
		console.log(`\nCreated:`)
		console.log(`- ${artisansData.length} artisans`)
		console.log(`- ${blogPostsData.length} blog posts`)
		console.log(`- ${imageMap.size} images in GridFS`)

	} catch (error) {
		console.error('Error seeding database:', error)
		throw error
	} finally {
		await mongoose.disconnect()
		console.log('\nDisconnected from MongoDB')
	}
}

// Run the seed
seedDatabase()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Seed failed:', error)
		process.exit(1)
	})
