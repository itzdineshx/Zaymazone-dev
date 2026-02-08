import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

const SEO = ({
  title = "Zaymazone - Crafting Culture. Empowering Artisans.",
  description = "Discover authentic handcrafted products from talented artisans. Zaymazone connects you with local creators, supporting traditional crafts and cultural heritage.",
  keywords = "handcrafted, artisans, traditional crafts, Indian handicrafts, sustainable shopping, cultural heritage, handmade products",
  image = "/assets/logo.png",
  url = window.location.href,
  type = 'website',
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Update standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${window.location.origin}${image}`);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = url;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = url;
      document.head.appendChild(canonicalLink);
    }

    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (script) {
        script.textContent = JSON.stringify(structuredData);
      } else {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }
  }, [title, description, keywords, image, url, type, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;