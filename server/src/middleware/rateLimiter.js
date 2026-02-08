import rateLimit from 'express-rate-limit'

// General rate limiting
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: { error: 'Too many requests, please try again later' },
	standardHeaders: true,
	legacyHeaders: false,
})

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
	message: { error: 'Too many authentication attempts, please try again later' },
	standardHeaders: true,
	legacyHeaders: false,
})

// API rate limiting
export const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 60, // limit each IP to 60 requests per minute
	message: { error: 'API rate limit exceeded' },
	standardHeaders: true,
	legacyHeaders: false,
})