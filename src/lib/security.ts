import { z } from "zod";

export function enforceHttpsInProduction(): void {
	if (import.meta.env.PROD && typeof window !== "undefined") {
		const isLocalhost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
		if (!isLocalhost && window.location.protocol !== "https:") {
			const httpsUrl = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
			window.location.replace(httpsUrl);
		}
	}
}

export function sanitizeString(input: string, maxLength = 2000): string {
	const trimmed = (input ?? "").toString().slice(0, maxLength).trim();
	// Remove control chars except tab/newline
	const noControls = trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
	// Escape HTML special characters
	return noControls
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}


export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
	const out: Record<string, unknown> = {};
	Object.entries(obj).forEach(([key, value]) => {
		if (typeof value === "string") {
			out[key] = sanitizeString(value);
		} else if (value && typeof value === "object") {
			// For nested objects only; arrays are returned as-is
			if (!Array.isArray(value)) {
				out[key] = sanitizeObject(value as Record<string, unknown>);
			} else {
				out[key] = value;
			}
		} else {
			out[key] = value;
		}
	});
	return out as T;
}

export const authSchemas = {
	signIn: z.object({
		email: z.string().email().max(254),
		password: z.string().min(6).max(128),
	}),
	signUp: z.object({
		name: z.string().min(1).max(120),
		email: z.string().email().max(254),
		password: z.string().min(8).max(128),
		confirmPassword: z.string().min(8).max(128),
	}).refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	}),
};

export const startSellingSchema = z.object({
	name: z.string().min(1).max(120),
	email: z.string().email().max(254),
	phone: z.string().max(30).optional().or(z.literal("")),
	location: z.string().min(1).max(120),
	craftType: z.string().min(1).max(120),
	experience: z.string().regex(/^\d+$/, "Must be a number"),
	description: z.string().min(10).max(2000),
	socialMedia: z.string().url().max(2048).optional().or(z.literal("")),
});

export class ClientRateLimiter {
	private requests: Map<string, number[]> = new Map();

	constructor(private maxRequests: number, private perMs: number) {}

	allow(key: string): boolean {
		const now = Date.now();
		const windowStart = now - this.perMs;
		const queue = this.requests.get(key)?.filter((ts) => ts > windowStart) ?? [];
		if (queue.length >= this.maxRequests) return false;
		queue.push(now);
		this.requests.set(key, queue);
		return true;
	}
}

export type LogEvent = {
	level: "info" | "warn" | "error";
	message: string;
	context?: Record<string, unknown>;
};

export function logEvent(event: LogEvent): void {
	const payload = {
		...event,
		timestamp: new Date().toISOString(),
		url: typeof window !== "undefined" ? window.location.href : undefined,
	};
	if (import.meta.env.DEV) {
		// eslint-disable-next-line no-console
		console[event.level]("[app]", payload);
	}
	const endpoint = import.meta.env.VITE_LOG_ENDPOINT as string | undefined;
	if (typeof navigator !== "undefined" && endpoint) {
		try {
			navigator.sendBeacon?.(endpoint, new Blob([JSON.stringify(payload)], { type: "application/json" }));
		} catch {
			// ignore
		}
	}
}


