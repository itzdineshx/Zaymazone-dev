import { useQuery } from '@tanstack/react-query'
import { api, getImageUrl } from '@/lib/api'

export interface Artisan {
  _id: string
  name: string
  bio: string
  location: {
    city: string
    state: string
    country: string
  }
  avatar: string
  coverImage: string
  specialties: string[]
  experience: number
  rating: number
  totalRatings: number
  totalProducts: number
  totalSales: number
  verification: {
    isVerified: boolean
    verifiedAt?: Date
  }
  isActive: boolean
  joinedDate: Date
}

export interface ArtisanForDisplay {
  id: string
  name: string
  specialty: string
  location: string
  experience: string
  rating: number
  products: number
  image: string
  avatar: string
  description: string
  achievements: string[]
  joinedYear?: string
  specialties?: string[]
}

// Transform backend artisan to frontend format
function transformArtisan(artisan: Artisan): ArtisanForDisplay {
  return {
    id: artisan._id,
    name: artisan.name,
    specialty: artisan.specialties[0] || 'Artisan',
    location: `${artisan.location.city}, ${artisan.location.state}`,
    experience: `${artisan.experience} years`,
    rating: artisan.rating,
    products: artisan.totalProducts,
    image: getImageUrl(artisan.coverImage),
    avatar: getImageUrl(artisan.avatar),
    description: artisan.bio,
    achievements: ['Verified Artisan', `${artisan.totalProducts} Products`, `${artisan.experience}+ Years Experience`],
    joinedYear: new Date(artisan.joinedDate).getFullYear().toString(),
    specialties: artisan.specialties
  }
}

export const useArtisans = () => {
  return useQuery({
    queryKey: ['artisans'],
    queryFn: async () => {
      const response = await api.getArtisans() as any; // API returns { artisans: [...] }
      // API returns { artisans: [...] }, extract the artisans array
      const artisans = response.artisans || response || [];
      if (artisans && artisans.length > 0) {
        // Check if artisans are already transformed (have 'id' field instead of '_id')
        const firstArtisan = artisans[0] as any;
        if (firstArtisan.id && !firstArtisan._id) {
          // Artisans are already transformed by the API
          return artisans;
        } else {
          // Artisans need frontend transformation
          return artisans.map(transformArtisan);
        }
      }
      return artisans || [];
    }
  })
}

export const useArtisan = (id: string) => {
  return useQuery({
    queryKey: ['artisan', id],
    queryFn: async () => {
      const artisan = await api.getArtisan(id)
      return transformArtisan(artisan)
    },
    enabled: !!id
  })
}
