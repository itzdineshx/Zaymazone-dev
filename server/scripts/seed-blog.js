import 'dotenv/config'
import mongoose from 'mongoose'
import BlogPost from '../src/models/BlogPost.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

// Comprehensive Blog Posts Data
function createBlogPosts() {
	return [
		{
			title: "The Art of Blue Pottery: A Journey Through Rajasthan's Most Prized Craft",
			slug: "art-of-blue-pottery-rajasthan-craft",
			excerpt: "Discover the centuries-old tradition of blue pottery making in Jaipur, from its Persian origins to modern-day artisans keeping the craft alive.",
			content: `
				<p>Blue pottery, with its distinctive cobalt blue and white aesthetic, has been a cornerstone of Rajasthani craftsmanship for over 400 years. This unique art form, which finds its origins in Persian traditions, has evolved into one of India's most recognizable and cherished crafts.</p>

				<h2>Origins and History</h2>
				<p>The art of blue pottery was brought to India by Persian potters during the Mughal era. The technique was refined and adapted by local artisans in Jaipur, who added their own cultural elements and design sensibilities to create something uniquely Indian.</p>

				<h2>The Making Process</h2>
				<p>Unlike traditional pottery, blue pottery is not made from clay. Instead, it uses a unique mixture of quartz stone powder, powdered glass, and a binding agent like katira gum. This composition gives blue pottery its distinctive lightweight feel and translucent quality.</p>

				<h2>Modern Revival</h2>
				<p>Today's artisans are finding innovative ways to keep this ancient craft relevant. From contemporary home decor items to functional kitchenware, blue pottery continues to evolve while maintaining its traditional essence.</p>

				<p>The revival of blue pottery represents more than just artistic preservation – it's about sustaining livelihoods, maintaining cultural identity, and adapting traditions for the modern world.</p>
			`,
			featuredImage: "/assets/blog-blue-pottery.jpg",
			author: {
				name: "Priya Sharma",
				avatar: "/assets/author-priya.jpg",
				role: "Craft Historian",
				bio: "Priya is a cultural researcher specializing in traditional Indian crafts with over 15 years of field experience."
			},
			category: "Traditional Crafts",
			tags: ["blue pottery", "rajasthan", "traditional crafts", "ceramics", "artisans", "jaipur"],
			status: "published",
			featured: true,
			readTime: "8 min read",
			publishedAt: new Date('2024-01-15'),
			views: 1247,
			likes: 89,
			comments: 23,
			shares: 34,
			seoTitle: "Blue Pottery of Rajasthan: Traditional Craft Guide",
			seoDescription: "Explore the history, techniques, and modern revival of Rajasthan's famous blue pottery craft. Learn about Persian origins and contemporary artisans."
		},
		{
			title: "Preserving Handloom Traditions: The Weavers of Bengal",
			slug: "preserving-handloom-traditions-weavers-bengal",
			excerpt: "Meet the master weavers who continue to create stunning handloom textiles using techniques passed down through generations.",
			content: `
				<p>In the villages of West Bengal, the rhythmic sound of handlooms continues to echo through narrow lanes, carrying forward a tradition that spans centuries. The master weavers of Bengal represent one of India's most treasured textile traditions.</p>

				<h2>The Heritage of Bengali Handloom</h2>
				<p>Bengali handloom weaving has deep historical roots, with references dating back to ancient texts. The region has been renowned for producing some of the finest cotton and silk textiles, including the legendary muslin that was once prized across the world.</p>

				<h2>Traditional Techniques</h2>
				<p>The art of handloom weaving in Bengal encompasses various techniques, from the intricate jamdani work to the geometric patterns of tangail sarees. Each technique requires years of training and represents a unique cultural expression.</p>

				<h2>Challenges and Solutions</h2>
				<p>Modern handloom weavers face numerous challenges, from competition with machine-made textiles to the exodus of young people from traditional occupations. However, innovative cooperatives and direct-to-consumer platforms are helping these artisans reach new markets.</p>

				<p>The preservation of handloom traditions is crucial not just for cultural reasons, but also for sustainable fashion and supporting rural livelihoods.</p>
			`,
			featuredImage: "/assets/blog-handloom.jpg",
			author: {
				name: "Rajesh Kumar",
				avatar: "/assets/author-rajesh.jpg",
				role: "Cultural Researcher",
				bio: "Rajesh has spent over two decades documenting traditional crafts and their socio-economic impact on rural communities."
			},
			category: "Textiles",
			tags: ["handloom", "bengal", "weaving", "textiles", "traditional", "sarees", "muslin"],
			status: "published",
			featured: true,
			readTime: "6 min read",
			publishedAt: new Date('2024-01-12'),
			views: 892,
			likes: 67,
			comments: 18,
			shares: 23
		},
		{
			title: "The Revival of Dhokra Art: Metal Casting in Modern Times",
			slug: "revival-dhokra-art-metal-casting-modern-times",
			excerpt: "Explore how the ancient lost-wax casting technique of Dhokra is finding new expression in contemporary art and design.",
			content: `
				<p>Dhokra, the ancient art of metal casting using the lost-wax technique, has been practiced in India for over 4,000 years. Today, this tribal art form is experiencing a remarkable revival as artists and designers discover its unique aesthetic appeal.</p>

				<h2>Ancient Technique, Timeless Appeal</h2>
				<p>The Dhokra technique involves creating intricate designs using beeswax, which is then covered in clay and heated to melt away the wax, leaving a perfect mold for bronze casting. This method produces the characteristic raw, textured finish that makes each piece unique.</p>

				<h2>Traditional Motifs and Modern Applications</h2>
				<p>Traditional Dhokra artisans create figurines, jewelry, and decorative items featuring tribal motifs, animals, and deities. Contemporary artists are now applying these techniques to create modern sculptures, home decor, and even fashion accessories.</p>

				<h2>Supporting Artisan Communities</h2>
				<p>The revival of Dhokra art has brought economic opportunities to tribal communities in Odisha, Chhattisgarh, and West Bengal. Fair trade initiatives and design collaborations are helping these artisans reach global markets while preserving their traditional skills.</p>
			`,
			featuredImage: "/assets/blog-dhokra.jpg",
			author: {
				name: "Meera Devi",
				avatar: "/assets/author-meera.jpg",
				role: "Art Curator",
				bio: "Meera is a contemporary art curator with expertise in traditional Indian metal crafts and tribal art forms."
			},
			category: "Metal Crafts",
			tags: ["dhokra", "metal casting", "brass", "sculpture", "tribal art", "lost-wax", "bronze"],
			status: "published",
			featured: false,
			readTime: "5 min read",
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
				<p>In an era of mass production and environmental concerns, traditional crafts offer a blueprint for sustainable manufacturing. These time-tested practices demonstrate how human creativity can flourish while respecting natural resources.</p>

				<h2>Inherently Sustainable Practices</h2>
				<p>Traditional crafts have always been sustainable by necessity. Artisans used locally available materials, developed techniques that minimized waste, and created products designed to last for generations rather than seasons.</p>

				<h2>Natural Materials and Processes</h2>
				<p>From natural dyes extracted from plants and minerals to organic cotton and bamboo, traditional crafts rely on renewable resources. These materials not only reduce environmental impact but also create unique textures and colors that cannot be replicated artificially.</p>

				<h2>Modern Eco-Innovations</h2>
				<p>Contemporary artisans are building on traditional knowledge to develop even more sustainable practices. Solar-powered kilns, rainwater harvesting for dyeing processes, and upcycling waste materials are just some examples of how tradition meets innovation.</p>

				<p>By choosing handcrafted products, consumers support not just individual artisans but an entire ecosystem of sustainable production that benefits both people and the planet.</p>
			`,
			featuredImage: "/assets/blog-sustainability.jpg",
			author: {
				name: "Anita Verma",
				avatar: "/assets/author-anita.jpg",
				role: "Sustainability Expert",
				bio: "Anita works at the intersection of traditional crafts and environmental sustainability, promoting eco-friendly artisan practices."
			},
			category: "Sustainability",
			tags: ["sustainability", "eco-friendly", "traditional crafts", "environment", "natural materials", "conservation"],
			status: "published",
			featured: false,
			readTime: "7 min read",
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
				<p>When you purchase a handcrafted item, you're not just buying a product – you're investing in a community, supporting a family, and preserving a cultural tradition. The economics of craft extends far beyond the individual transaction.</p>

				<h2>Direct Impact on Families</h2>
				<p>Unlike mass production, where profits are distributed among many stakeholders, craft purchases directly benefit the artisan and their family. This direct economic relationship ensures that the majority of the purchase price reaches the creator.</p>

				<h2>Rural Development and Employment</h2>
				<p>Craft production provides sustainable employment in rural areas where industrial jobs may be scarce. A thriving craft economy helps prevent migration to urban centers and maintains the social fabric of traditional communities.</p>

				<h2>Value Chain Benefits</h2>
				<p>The craft economy supports not just artisans but entire value chains – from raw material suppliers to local merchants, transporters, and retailers. This multiplier effect amplifies the economic impact of each purchase.</p>

				<h2>Cultural Preservation Through Economics</h2>
				<p>Economic viability is crucial for cultural preservation. When traditional crafts provide sustainable livelihoods, artisans are motivated to continue practicing and teaching these skills to the next generation.</p>
			`,
			featuredImage: "/assets/blog-economics.jpg",
			author: {
				name: "Vikram Singh",
				avatar: "/assets/author-vikram.jpg",
				role: "Economic Analyst",
				bio: "Vikram specializes in rural economics and the socio-economic impact of traditional industries on local communities."
			},
			category: "Community Impact",
			tags: ["economics", "rural development", "artisan communities", "livelihood", "economic impact", "fair trade"],
			status: "published",
			featured: false,
			readTime: "6 min read",
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
				<p>Modern artisans are reinterpreting traditional motifs and techniques through contemporary design lenses. Minimalist pottery inspired by ancient forms, geometric textiles with traditional patterns, and modern furniture incorporating classic woodworking techniques represent this evolution.</p>

				<h2>Functional Innovation</h2>
				<p>Traditional techniques are being applied to create products that meet modern lifestyle needs. Smart storage solutions using bamboo craft techniques, ergonomic furniture inspired by traditional joinery, and kitchenware that combines ancient pottery methods with contemporary functionality.</p>

				<h2>Technology as an Enabler</h2>
				<p>Rather than replacing traditional skills, technology is enhancing them. Digital design tools help artisans experiment with patterns, precision instruments improve quality control, and online platforms connect creators with global audiences.</p>

				<h2>Collaborative Approaches</h2>
				<p>The most successful modern interpretations often result from collaborations between traditional artisans and contemporary designers. These partnerships bring together generational knowledge with fresh perspectives, creating products that resonate with modern consumers while respecting traditional methods.</p>
			`,
			featuredImage: "/assets/blog-innovation.jpg",
			author: {
				name: "Kavya Patel",
				avatar: "/assets/author-kavya.jpg",
				role: "Design Researcher",
				bio: "Kavya explores the intersection of traditional crafts and contemporary design, facilitating collaborations between artisans and modern designers."
			},
			category: "Innovation",
			tags: ["innovation", "modern design", "traditional crafts", "contemporary", "collaboration", "technology"],
			status: "published",
			featured: false,
			readTime: "9 min read",
			publishedAt: new Date('2024-01-03'),
			views: 687,
			likes: 53,
			comments: 16,
			shares: 19
		},
		{
			title: "Digital Transformation in Traditional Crafts: E-commerce Opportunities for Artisans",
			slug: "digital-transformation-traditional-crafts-ecommerce-opportunities",
			excerpt: "Exploring how digital platforms are revolutionizing the way traditional artisans connect with customers and build sustainable businesses.",
			content: `
				<p>The digital revolution has opened unprecedented opportunities for traditional artisans to showcase their work, connect with customers worldwide, and build sustainable businesses without intermediaries.</p>

				<h2>Breaking Geographic Barriers</h2>
				<p>Online platforms have eliminated the geographic limitations that once confined artisans to local markets. A potter in rural Rajasthan can now sell directly to customers in New York, London, or Tokyo, accessing markets that were previously impossible to reach.</p>

				<h2>Direct Customer Relationships</h2>
				<p>E-commerce platforms enable artisans to build direct relationships with their customers, sharing the stories behind their crafts, explaining their techniques, and creating emotional connections that drive purchasing decisions.</p>

				<h2>Digital Marketing and Storytelling</h2>
				<p>Social media and content marketing have become powerful tools for artisans to showcase their processes, share their cultural heritage, and build brand recognition. Video content showing the creation process has proven particularly effective in engaging audiences.</p>

				<h2>Challenges and Solutions</h2>
				<p>While digital transformation offers many opportunities, it also presents challenges such as digital literacy, logistics, and quality photography. Various organizations and platforms are addressing these challenges through training programs and support services.</p>
			`,
			featuredImage: "/assets/blog-economics.jpg",
			author: {
				name: "Rohit Agarwal",
				avatar: "/assets/author-vikram.jpg",
				role: "Digital Strategy Consultant",
				bio: "Rohit helps traditional businesses navigate digital transformation and leverage technology for sustainable growth."
			},
			category: "Business",
			tags: ["digital transformation", "e-commerce", "online marketing", "artisan business", "technology", "digital literacy"],
			status: "published",
			featured: false,
			readTime: "8 min read",
			publishedAt: new Date('2024-01-01'),
			views: 423,
			likes: 31,
			comments: 9,
			shares: 12
		},
		{
			title: "The Art of Storytelling Through Crafts: Cultural Narratives in Handmade Objects",
			slug: "art-storytelling-through-crafts-cultural-narratives",
			excerpt: "Every handcrafted object carries stories of its culture, community, and creator. Discover how traditional crafts serve as vessels for cultural storytelling.",
			content: `
				<p>Traditional crafts are more than functional objects – they are repositories of cultural memory, storytelling devices that carry forward the narratives, beliefs, and experiences of entire communities through generations.</p>

				<h2>Symbolic Languages in Craft</h2>
				<p>Many traditional crafts employ symbolic languages where colors, patterns, and motifs carry specific meanings. The geometric patterns in tribal textiles often represent natural elements, astronomical observations, or spiritual beliefs that have been encoded in fabric for centuries.</p>

				<h2>Ritualistic and Ceremonial Significance</h2>
				<p>Crafts often play crucial roles in rituals and ceremonies, marking important life events and seasonal celebrations. Wedding textiles, ceremonial pottery, and religious artifacts serve as bridges between the material and spiritual worlds.</p>

				<h2>Oral Traditions Made Tangible</h2>
				<p>In cultures with strong oral traditions, crafts serve as tangible representations of stories, myths, and historical events. Each piece becomes a chapter in an ongoing narrative that connects past, present, and future.</p>

				<h2>Personal Stories of Artisans</h2>
				<p>Modern craft narratives also include the personal stories of individual artisans – their journeys, inspirations, and the contemporary challenges they face. These personal narratives add layers of meaning to each handcrafted piece.</p>
			`,
			featuredImage: "/assets/blog-handloom.jpg",
			author: {
				name: "Dr. Sunita Rao",
				avatar: "/assets/author-meera.jpg",
				role: "Cultural Anthropologist",
				bio: "Dr. Rao studies the intersection of material culture and storytelling traditions in South Asian communities."
			},
			category: "Traditional Crafts",
			tags: ["storytelling", "cultural narratives", "symbolism", "traditional crafts", "anthropology", "cultural heritage"],
			status: "published",
			featured: false,
			readTime: "7 min read",
			publishedAt: new Date('2023-12-28'),
			views: 356,
			likes: 28,
			comments: 7,
			shares: 10
		}
	]
}

async function seedBlogData() {
	try {
		console.log('🌱 Starting blog data seed...')
		
		// Connect to MongoDB
		await mongoose.connect(mongoUri)
		console.log('📦 Connected to MongoDB')

		// Clear existing blog data
		await BlogPost.deleteMany({})
		console.log('🗑️  Cleared existing blog data')

		// Create blog posts
		const blogPosts = createBlogPosts()
		const posts = await BlogPost.insertMany(blogPosts)
		console.log(`📝 Created ${posts.length} blog posts`)

		// Create summary statistics
		const categories = await BlogPost.aggregate([
			{ $group: { _id: '$category', count: { $sum: 1 } } },
			{ $sort: { count: -1 } }
		])

		const tags = await BlogPost.aggregate([
			{ $unwind: '$tags' },
			{ $group: { _id: '$tags', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 }
		])

		console.log('\n📊 Blog Statistics:')
		console.log(`Total Posts: ${posts.length}`)
		console.log(`Featured Posts: ${posts.filter(p => p.featured).length}`)
		console.log(`Published Posts: ${posts.filter(p => p.status === 'published').length}`)
		
		console.log('\n📂 Categories:')
		categories.forEach(cat => {
			console.log(`  - ${cat._id}: ${cat.count} posts`)
		})

		console.log('\n🏷️  Popular Tags:')
		tags.slice(0, 5).forEach(tag => {
			console.log(`  - ${tag._id}: ${tag.count} posts`)
		})

		console.log('\n✅ Blog seed completed successfully!')
		
	} catch (error) {
		console.error('❌ Error seeding blog data:', error)
		process.exit(1)
	} finally {
		await mongoose.disconnect()
		console.log('🔌 Disconnected from MongoDB')
		process.exit(0)
	}
}

seedBlogData()