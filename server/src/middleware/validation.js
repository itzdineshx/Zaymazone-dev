// Validation middleware for common schemas
import { z } from 'zod'

// Common validation schemas
export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')

export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	sort: z.string().optional(),
	order: z.enum(['asc', 'desc']).default('desc')
})

export const searchSchema = z.object({
	q: z.string().min(1).max(100).optional(),
	category: z.string().optional(),
	minPrice: z.coerce.number().min(0).optional(),
	maxPrice: z.coerce.number().min(0).optional(),
	artisanId: idSchema.optional(),
	inStock: z.coerce.boolean().optional()
})

// Middleware factory for validation
export const validate = (schema, source = 'body') => {
	return (req, res, next) => {
		const data = source === 'query' ? req.query : 
					 source === 'params' ? req.params : req.body

		const result = schema.safeParse(data)
		
		if (!result.success) {
			const errors = result.error.errors.map(err => ({
				field: err.path.join('.'),
				message: err.message
			}))
			return res.status(400).json({ 
				error: 'Validation failed', 
				details: errors 
			})
		}
		
		// Attach validated data to request
		if (source === 'query') req.validatedQuery = result.data
		else if (source === 'params') req.validatedParams = result.data
		else req.validatedBody = result.data
		
		next()
	}
}

// Input sanitization
export const sanitize = (req, res, next) => {
	// Remove any potentially dangerous characters
	const sanitizeString = (str) => {
		if (typeof str !== 'string') return str
		return str
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
			.replace(/javascript:/gi, '') // Remove javascript: protocols
			.replace(/on\w+\s*=/gi, '') // Remove event handlers
			.trim()
	}

	const sanitizeObject = (obj) => {
		if (obj === null || typeof obj !== 'object') return obj
		
		if (Array.isArray(obj)) {
			return obj.map(sanitizeObject)
		}
		
		const sanitized = {}
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') {
				sanitized[key] = sanitizeString(value)
			} else if (typeof value === 'object') {
				sanitized[key] = sanitizeObject(value)
			} else {
				sanitized[key] = value
			}
		}
		return sanitized
	}

	req.body = sanitizeObject(req.body)
	req.query = sanitizeObject(req.query)
	
	next()
}