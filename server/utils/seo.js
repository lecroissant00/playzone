/**
 * SEO Utilities
 * Generate meta tags, sitemap, and SEO-friendly content
 */

class SEOUtil {
  /**
   * Generate meta tags for a page
   */
  static generateMetaTags({
    title = 'PlayZone',
    description = 'Portail de jeux HTML5 gratuits et modernes',
    image = 'https://playzone.local/images/og-image.jpg',
    url = 'https://playzone.local',
    keywords = 'jeux, html5, gratuit, gaming',
    author = 'PlayZone Team'
  } = {}) {
    return {
      title,
      description,
      image,
      url,
      keywords,
      author,
      ogTags: {
        'og:title': title,
        'og:description': description,
        'og:image': image,
        'og:url': url,
        'og:type': 'website',
        'og:site_name': 'PlayZone'
      },
      twitterTags: {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': image
      }
    };
  }

  /**
   * Generate sitemap.xml content
   */
  static generateSitemap(games = [], categories = [], pages = []) {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage
    sitemap += this.getUrlEntry('/', '1.0', 'daily');

    // Add categories
    categories.forEach(cat => {
      sitemap += this.getUrlEntry(`/category/${cat.slug}`, '0.9', 'weekly');
    });

    // Add games
    games.forEach(game => {
      sitemap += this.getUrlEntry(`/game/${game.slug}`, '0.8', 'weekly');
    });

    // Add static pages
    pages.forEach(page => {
      sitemap += this.getUrlEntry(`/page/${page.slug}`, '0.7', 'monthly');
    });

    // Add static pages
    const staticPages = ['about', 'contact', 'privacy', 'terms', 'dmca'];
    staticPages.forEach(slug => {
      sitemap += this.getUrlEntry(`/${slug}`, '0.7', 'monthly');
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  /**
   * Generate a single URL entry for sitemap
   */
  static getUrlEntry(loc, priority = '0.5', changefreq = 'weekly') {
    const lastmod = new Date().toISOString().split('T')[0];
    return `  <url>\n    <loc>https://playzone.local${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }

  /**
   * Generate robots.txt content
   */
  static generateRobotsTxt() {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /private/
Disallow: /temp/

Sitemap: https://playzone.local/sitemap.xml
Crawl-delay: 1
`;
  }

  /**
   * Create SEO-friendly slug from text
   */
  static createSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Truncate text for meta descriptions
   */
  static truncateDescription(text, maxLength = 160) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

module.exports = SEOUtil;
