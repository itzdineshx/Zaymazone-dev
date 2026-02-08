import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './src/models/User.js'
import Artisan from './src/models/Artisan.js'
import Product from './src/models/Product.js'
import Order from './src/models/Order.js'
import Review from './src/models/Review.js'
import Cart from './src/models/Cart.js'
import Wishlist from './src/models/Wishlist.js'

dotenv.config()

async function testDatabase() {
	try {
		console.log('🔌 Connecting to MongoDB...')
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone')
		console.log('✅ Connected to MongoDB successfully')
		
		console.log('\n📋 Testing database models...')
		
		// Test each model by creating the collection (if it doesn't exist)
		const models = [
			{ name: 'User', model: User },
			{ name: 'Artisan', model: Artisan },
			{ name: 'Product', model: Product },
			{ name: 'Order', model: Order },
			{ name: 'Review', model: Review },
			{ name: 'Cart', model: Cart },
			{ name: 'Wishlist', model: Wishlist }
		]
		
		for (const { name, model } of models) {
			try {
				await model.init() // Initialize indexes
				console.log(`✅ ${name} model initialized successfully`)
			} catch (error) {
				console.error(`❌ ${name} model failed:`, error.message)
			}
		}
		
		console.log('\n🏗️  Database schema validation complete!')
		console.log('\n📊 Database statistics:')
		
		// Get collection stats
		const db = mongoose.connection.db
		const collections = await db.listCollections().toArray()
		console.log(`Collections created: ${collections.length}`)
		collections.forEach(col => {
			console.log(`  - ${col.name}`)
		})
		
		console.log('\n✅ Database test completed successfully!')
		
	} catch (error) {
		console.error('❌ Database test failed:', error.message)
	} finally {
		await mongoose.disconnect()
		console.log('🔌 Disconnected from MongoDB')
		process.exit(0)
	}
}

// Run the test
testDatabase()