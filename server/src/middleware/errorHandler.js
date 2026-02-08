// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
	console.error('Error:', err)
	
	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const errors = Object.values(err.errors).map(error => ({
			field: error.path,
			message: error.message
		}))
		return res.status(400).json({
			error: 'Validation failed',
			details: errors
		})
	}
	
	// Mongoose cast error (invalid ObjectId)
	if (err.name === 'CastError') {
		return res.status(400).json({
			error: 'Invalid ID format'
		})
	}
	
	// MongoDB duplicate key error
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0]
		return res.status(409).json({
			error: `${field} already exists`
		})
	}
	
	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'Invalid token'
		})
	}
	
	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			error: 'Token expired'
		})
	}
	
	// Default server error
	res.status(500).json({
		error: 'Internal server error',
		...(process.env.NODE_ENV === 'development' && { details: err.message })
	})
}

// 404 handler for undefined routes
export const notFoundHandler = (req, res) => {
	res.status(404).json({
		error: 'Route not found',
		path: req.path,
		method: req.method
	})
}

// Request logging middleware
export const requestLogger = (req, res, next) => {
	const start = Date.now()
	
	res.on('finish', () => {
		const duration = Date.now() - start
		const log = {
			method: req.method,
			url: req.url,
			status: res.statusCode,
			duration: `${duration}ms`,
			userAgent: req.get('User-Agent'),
			ip: req.ip || req.connection.remoteAddress,
			timestamp: new Date().toISOString()
		}
		
		// Log to console (in production, you might want to use a proper logger)
		if (res.statusCode >= 400) {
			console.error('HTTP Error:', log)
		} else {
			console.log('HTTP Request:', log)
		}
	})
	
	next()
}