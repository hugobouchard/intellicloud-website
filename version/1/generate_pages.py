#!/usr/bin/env python3
"""
Generate all Services and Lead Generation pages for IntelliCloud website
"""

import os

# Base directory
BASE_DIR = r"C:\Users\hugo\claude\intellicloud-website\src\pages\en"

# Define all pages to create with their content
PAGES = {
    # SERVICES - Cloud Architecture
    "services/cloud-architecture/google-cloud.html": {
        "title": "Google Cloud Platform | IntelliCloud",
        "h1": "Google Cloud Platform Solutions",
        "desc": "AI-powered cloud infrastructure with BigQuery, Cloud AI, and Firestore",
        "breadcrumb": "Google Cloud",
        "color": "blue",
        "services": ["BigQuery & Analytics", "Cloud AI Platform", "Firestore Database", "Compute Engine", "Cloud Storage", "Cloud Functions"],
        "stats": ["75+ GCP Projects", "AI/ML Certified", "BigQuery Experts", "24/7 Support"]
    },
    "services/cloud-architecture/salesforce.html": {
        "title": "Salesforce Cloud Solutions | IntelliCloud",
        "h1": "Salesforce CRM Cloud",
        "desc": "World's #1 CRM with powerful customization, automation, and integration capabilities",
        "breadcrumb": "Salesforce",
        "color": "cyan",
        "services": ["CRM Implementation", "Custom Development", "Integration Services", "Automation & Workflows", "Reporting & Analytics", "Training & Support"],
        "stats": ["200+ Salesforce Projects", "Certified Experts", "Full-Stack Capabilities", "Ongoing Support"]
    },
    # SERVICES - Website Creation
    "services/website-creation/index.html": {
        "title": "Website Creation | Custom Websites & SaaS Platforms | IntelliCloud",
        "h1": "Custom Websites Built for Conversion",
        "desc": "High-performance websites and SaaS platforms with modern design and technology",
        "breadcrumb": "Website Creation",
        "color": "purple",
        "services": ["SaaS Platforms", "Responsive Design", "Performance Optimization", "SEO-Friendly", "E-commerce Ready", "Mobile-First"],
        "stats": ["300+ Websites Built", "98% Performance Score", "Mobile-Optimized", "Conversion-Focused"]
    },
    "services/website-creation/saas-platforms.html": {
        "title": "SaaS Platform Development | IntelliCloud",
        "h1": "High-Performance SaaS Applications",
        "desc": "Custom SaaS platforms with authentication, dashboards, APIs, and payment processing",
        "breadcrumb": "SaaS Platforms",
        "color": "purple",
        "services": ["User Authentication", "Real-time Dashboards", "Data Visualization", "API Integration", "Payment Processing", "Multi-tenancy"],
        "stats": ["50+ SaaS Platforms", "Node.js/React Stack", "Scalable Architecture", "Secure by Design"]
    },
    "services/website-creation/responsive-design.html": {
        "title": "Responsive Web Design | Mobile-First | IntelliCloud",
        "h1": "Mobile-First Design for All Devices",
        "desc": "Beautiful, responsive websites that work perfectly on desktop, tablet, and mobile",
        "breadcrumb": "Responsive Design",
        "color": "purple",
        "services": ["Mobile-First Approach", "Cross-Browser Compatible", "Performance Optimized", "Accessible Design", "Touch-Friendly", "Flexible Layouts"],
        "stats": ["100% Mobile-Optimized", "WCAG 2.1 AA", "Fast Load Times", "All Devices Supported"]
    },
    # SERVICES - eCommerce
    "services/ecommerce/index.html": {
        "title": "eCommerce Solutions | Shopify & Custom Platforms | IntelliCloud",
        "h1": "eCommerce Platforms That Convert",
        "desc": "Powerful eCommerce solutions on Shopify and custom platforms with conversion optimization",
        "breadcrumb": "eCommerce",
        "color": "green",
        "services": ["Shopify Development", "Custom Platforms", "Payment Integration", "Inventory Management", "Conversion Optimization", "Analytics & Reporting"],
        "stats": ["500+ Stores Launched", "35% Avg Revenue Increase", "Secure Payments", "Global Shipping"]
    },
    "services/ecommerce/shopify.html": {
        "title": "Shopify Development | Store Setup & Customization | IntelliCloud",
        "h1": "Shopify Stores Built for Growth",
        "desc": "Professional Shopify development with custom themes, app integration, and optimization",
        "breadcrumb": "Shopify",
        "color": "green",
        "services": ["Store Setup & Design", "App Integration", "Theme Customization", "Performance Optimization", "Payment Gateway Setup", "Migration Services"],
        "stats": ["500+ Shopify Stores", "Shopify Partners", "35% Revenue Increase", "Fast & Secure"]
    },
    "services/ecommerce/custom-platforms.html": {
        "title": "Custom eCommerce Development | IntelliCloud",
        "h1": "Custom eCommerce Solutions",
        "desc": "Enterprise eCommerce platforms for complex business logic and unique requirements",
        "breadcrumb": "Custom Platforms",
        "color": "green",
        "services": ["Custom Architecture", "API Development", "Advanced Features", "Integration Suite", "B2B Capabilities", "Scalable Infrastructure"],
        "stats": ["50+ Custom Platforms", "Enterprise-Grade", "High Volume Ready", "Full Customization"]
    },
    # SERVICES - Mobile Application
    "services/mobile-application/index.html": {
        "title": "Mobile App Development | iOS & Android | IntelliCloud",
        "h1": "Native & Cross-Platform Mobile Apps",
        "desc": "Professional iOS and Android app development that engages users and drives results",
        "breadcrumb": "Mobile Applications",
        "color": "orange",
        "services": ["iOS Development", "Android Development", "Push Notifications", "Offline Mode", "App Store Optimization", "Analytics Integration"],
        "stats": ["100+ Apps Launched", "4.5+ Star Rating", "Native Performance", "App Store Approved"]
    },
    "services/mobile-application/ios.html": {
        "title": "iOS App Development | Swift & SwiftUI | IntelliCloud",
        "h1": "Native iOS App Development",
        "desc": "Professional iOS apps built with Swift and SwiftUI for iPhone and iPad",
        "breadcrumb": "iOS Development",
        "color": "orange",
        "services": ["Swift Development", "SwiftUI Interfaces", "App Store Submission", "Push Notifications", "In-App Purchases", "CloudKit Integration"],
        "stats": ["75+ iOS Apps", "Swift Certified", "App Store Experts", "Regular Updates"]
    },
    "services/mobile-application/android.html": {
        "title": "Android App Development | Kotlin & Jetpack | IntelliCloud",
        "h1": "Native Android App Development",
        "desc": "High-performance Android apps built with Kotlin and Jetpack Compose",
        "breadcrumb": "Android Development",
        "color": "orange",
        "services": ["Kotlin Development", "Jetpack Compose", "Play Store Submission", "Firebase Integration", "Material Design", "Backward Compatibility"],
        "stats": ["75+ Android Apps", "Kotlin Experts", "Play Store Certified", "All Devices Supported"]
    },
    # SERVICES - API Integration
    "services/api-integration/index.html": {
        "title": "API Integration Services | REST APIs & Third-Party | IntelliCloud",
        "h1": "Seamless API Integration Solutions",
        "desc": "Expert API development and third-party integration for connected systems",
        "breadcrumb": "API Integration",
        "color": "indigo",
        "services": ["REST API Development", "Third-Party Integration", "API Documentation", "Webhook Management", "Authentication & Security", "Rate Limiting"],
        "stats": ["200+ Integrations", "Real-time APIs", "Secure & Reliable", "Full Documentation"]
    },
    "services/api-integration/rest-apis.html": {
        "title": "REST API Development | Node.js & Express | IntelliCloud",
        "h1": "Building & Integrating REST APIs",
        "desc": "Custom REST API development with Node.js, Express, and PostgreSQL",
        "breadcrumb": "REST APIs",
        "color": "indigo",
        "services": ["API Design", "Development & Testing", "Documentation", "Versioning", "Authentication", "Performance Optimization"],
        "stats": ["100+ APIs Built", "RESTful Standards", "OpenAPI/Swagger", "High Performance"]
    },
    "services/api-integration/third-party-integration.html": {
        "title": "Third-Party API Integration | IntelliCloud",
        "h1": "Third-Party API Integration",
        "desc": "Seamless integration with payment, CRM, communication, and analytics services",
        "breadcrumb": "Third-Party Integration",
        "color": "indigo",
        "services": ["Payment APIs (Stripe, PayPal)", "CRM (Salesforce, HubSpot)", "Communication (Twilio, SendGrid)", "Analytics (Google, Mixpanel)", "Storage (AWS S3, GCS)", "Social Media APIs"],
        "stats": ["50+ API Partners", "Secure Integration", "Real-time Sync", "Expert Support"]
    },
    # SERVICES - UI/UX
    "services/ui-ux/index.html": {
        "title": "UI/UX Design Services | User Research & Design Systems | IntelliCloud",
        "h1": "User-Centered Design Excellence",
        "desc": "Professional UI/UX design with user research, prototyping, and design systems",
        "breadcrumb": "UI/UX Design",
        "color": "pink",
        "services": ["User Research & Testing", "Design Systems", "Prototyping", "Wireframing", "Visual Design", "Usability Testing"],
        "stats": ["200+ Designs Created", "User-Centered", "Data-Driven", "Award-Winning"]
    },
    "services/ui-ux/user-research.html": {
        "title": "User Research & Testing | UX Research | IntelliCloud",
        "h1": "Understand Your Users Deeply",
        "desc": "Comprehensive user research with interviews, testing, and persona development",
        "breadcrumb": "User Research",
        "color": "pink",
        "services": ["User Interviews", "Usability Testing", "Competitive Analysis", "User Personas", "Journey Mapping", "A/B Testing"],
        "stats": ["100+ Research Projects", "Data-Driven Insights", "Actionable Results", "Expert Researchers"]
    },
    "services/ui-ux/design-system.html": {
        "title": "Design Systems | Component Libraries | IntelliCloud",
        "h1": "Scalable Design Systems",
        "desc": "Comprehensive design systems for consistency, efficiency, and scalability",
        "breadcrumb": "Design Systems",
        "color": "pink",
        "services": ["Component Libraries", "Style Guides", "Documentation", "Design Tokens", "Accessibility Standards", "Version Control"],
        "stats": ["25+ Design Systems", "Atomic Design", "Fully Documented", "Developer-Friendly"]
    },
}

# Lead Generation pages
LEAD_GEN_PAGES = {
    "lead-generation/index.html": {
        "title": "Lead Generation Services | SEM, SEO & Local Listing | IntelliCloud",
        "h1": "Drive Qualified Leads to Your Business",
        "desc": "Comprehensive lead generation services with SEM, SEO, and local listing optimization",
        "breadcrumb": "Lead Generation",
        "color": "blue",
        "services": ["Search Engine Marketing (SEM)", "Search Engine Optimization (SEO)", "Local Listing Management", "Google Ads", "Content Strategy", "Conversion Optimization"],
        "stats": ["300% Avg ROI", "$50M+ Ad Spend", "1000+ Campaigns", "Proven Results"]
    },
    "lead-generation/sem/index.html": {
        "title": "Search Engine Marketing | SEM Services | IntelliCloud",
        "h1": "Search Engine Marketing for Immediate Results",
        "desc": "Professional SEM services with Google Ads and PPC campaign management",
        "breadcrumb": "SEM",
        "color": "blue",
        "services": ["Google Ads Management", "PPC Campaign Management", "Keyword Research", "Ad Copywriting", "Bid Management", "Conversion Tracking"],
        "stats": ["300% Avg ROI", "$50M+ Managed", "500+ Campaigns", "Certified Experts"]
    },
    "lead-generation/sem/google-ads.html": {
        "title": "Google Ads Management | PPC Experts | IntelliCloud",
        "h1": "Google Ads Experts",
        "desc": "Professional Google Ads management for search, display, shopping, and video campaigns",
        "breadcrumb": "Google Ads",
        "color": "blue",
        "services": ["Search Ads", "Display Ads", "Shopping Ads", "Video Ads", "Remarketing", "Performance Max"],
        "stats": ["300% Avg ROI", "$50M+ Ad Spend", "Google Partner", "Certified Team"]
    },
    "lead-generation/sem/ppc-campaigns.html": {
        "title": "PPC Campaign Management | IntelliCloud",
        "h1": "PPC Campaign Management",
        "desc": "Full-service PPC management with landing page optimization and conversion tracking",
        "breadcrumb": "PPC Campaigns",
        "color": "blue",
        "services": ["Campaign Setup", "Landing Page Optimization", "Conversion Tracking", "A/B Testing", "Continuous Optimization", "ROI Reporting"],
        "stats": ["500+ PPC Campaigns", "Data-Driven", "Optimized Daily", "Transparent Reporting"]
    },
    "lead-generation/seo/index.html": {
        "title": "SEO Services | Search Engine Optimization | IntelliCloud",
        "h1": "Organic SEO for Long-term Growth",
        "desc": "Comprehensive SEO services with on-page, technical, and content strategy",
        "breadcrumb": "SEO",
        "color": "green",
        "services": ["On-page SEO", "Technical SEO", "Content Strategy", "Link Building", "Local SEO", "SEO Audits"],
        "stats": ["200+ SEO Projects", "Top 3 Rankings", "Organic Growth", "Sustainable Results"]
    },
    "lead-generation/seo/on-page-seo.html": {
        "title": "On-page SEO Optimization | IntelliCloud",
        "h1": "On-page SEO Optimization",
        "desc": "Comprehensive on-page SEO with title tags, meta descriptions, headers, and content optimization",
        "breadcrumb": "On-page SEO",
        "color": "green",
        "services": ["Title & Meta Tags", "Header Optimization", "Content Optimization", "Internal Linking", "Image Optimization", "Schema Markup"],
        "stats": ["500+ Pages Optimized", "Top Rankings", "Higher CTR", "Better Conversions"]
    },
    "lead-generation/seo/technical-seo.html": {
        "title": "Technical SEO Services | IntelliCloud",
        "h1": "Technical SEO Foundation",
        "desc": "Technical SEO optimization for site speed, mobile, crawlability, and indexing",
        "breadcrumb": "Technical SEO",
        "color": "green",
        "services": ["Site Speed Optimization", "Mobile Optimization", "Crawlability", "Indexing", "Structured Data", "Core Web Vitals"],
        "stats": ["100+ Technical Audits", "90+ Page Speed", "Mobile-First", "Search Console Experts"]
    },
    "lead-generation/seo/content-strategy.html": {
        "title": "SEO Content Strategy | IntelliCloud",
        "h1": "SEO Content Strategy",
        "desc": "Data-driven content strategy with keyword research, topic clustering, and editorial planning",
        "breadcrumb": "Content Strategy",
        "color": "green",
        "services": ["Keyword Research", "Topic Clustering", "Content Calendar", "Editorial Standards", "Performance Monitoring", "Content Updates"],
        "stats": ["1000+ Content Pieces", "Top Rankings", "Organic Traffic", "Engagement Focus"]
    },
    "lead-generation/local-listing/index.html": {
        "title": "Local Listing Services | Google Business Profile | IntelliCloud",
        "h1": "Local Business Visibility",
        "desc": "Local listing optimization with Google Business Profile and local SEO strategy",
        "breadcrumb": "Local Listing",
        "color": "orange",
        "services": ["Google Business Profile", "Local SEO Strategy", "Citation Management", "Review Generation", "Local Content", "Map Pack Optimization"],
        "stats": ["300+ Local Businesses", "Map Pack Rankings", "More Calls & Visits", "Review Management"]
    },
    "lead-generation/local-listing/google-business.html": {
        "title": "Google Business Profile Optimization | IntelliCloud",
        "h1": "Google Business Profile Optimization",
        "desc": "Complete Google Business Profile setup, verification, and optimization",
        "breadcrumb": "Google Business Profile",
        "color": "orange",
        "services": ["Profile Setup & Verification", "Category Optimization", "Photo Management", "Review Monitoring", "Post Publishing", "Insights Analysis"],
        "stats": ["500+ Profiles Optimized", "42% More Clicks", "Higher Visibility", "Review Management"]
    },
    "lead-generation/local-listing/local-seo.html": {
        "title": "Local SEO Strategy | IntelliCloud",
        "h1": "Local SEO Strategy",
        "desc": "Comprehensive local SEO with keywords, citations, link building, and content",
        "breadcrumb": "Local SEO",
        "color": "orange",
        "services": ["Local Keywords", "Citations & Directories", "Local Link Building", "Review Generation", "Local Content", "NAP Consistency"],
        "stats": ["200+ Local SEO Projects", "Map Pack Rankings", "More Foot Traffic", "Phone Calls Increase"]
    },
}

# Combine all pages
ALL_PAGES = {**PAGES, **LEAD_GEN_PAGES}

def generate_html(config):
    """Generate HTML content for a page"""
    color = config.get("color", "blue")

    # Color mapping
    color_map = {
        "blue": {"from": "from-blue-600", "to": "to-blue-700", "text": "text-blue-600", "bg": "bg-blue-100", "border": "border-blue-200"},
        "purple": {"from": "from-purple-600", "to": "to-purple-700", "text": "text-purple-600", "bg": "bg-purple-100", "border": "border-purple-200"},
        "green": {"from": "from-green-600", "to": "to-green-700", "text": "text-green-600", "bg": "bg-green-100", "border": "border-green-200"},
        "orange": {"from": "from-orange-600", "to": "to-orange-700", "text": "text-orange-600", "bg": "bg-orange-100", "border": "border-orange-200"},
        "indigo": {"from": "from-indigo-600", "to": "to-indigo-700", "text": "text-indigo-600", "bg": "bg-indigo-100", "border": "border-indigo-200"},
        "pink": {"from": "from-pink-600", "to": "to-pink-700", "text": "text-pink-600", "bg": "bg-pink-100", "border": "border-pink-200"},
        "cyan": {"from": "from-cyan-600", "to": "to-cyan-700", "text": "text-cyan-600", "bg": "bg-cyan-100", "border": "border-cyan-200"},
    }

    colors = color_map.get(color, color_map["blue"])

    services_html = ""
    for i, service in enumerate(config.get("services", [])):
        services_html += f'''<li class="flex items-start"><svg class="w-5 h-5 {colors['text']} mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="paragraph paragraph-small">{service}</span></li>'''

    stats_html = ""
    for stat in config.get("stats", []):
        stats_html += f'''<div class="text-center"><div class="text-4xl font-bold {colors['text']} mb-2">{stat.split()[0]}</div><p class="text-gray-600">{' '.join(stat.split()[1:])}</p></div>'''

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{config["title"]}</title>
  <meta name="description" content="{config["desc"]}">
  <link rel="stylesheet" href="/src/styles/tailwind.css">
</head>
<body class="bg-white">
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <a href="/src/pages/en/index.html" class="text-2xl font-bold">IntelliCloud</a>
        <div class="hidden md:flex items-center space-x-8">
          <a href="/src/pages/en/index.html" class="paragraph hover:text-blue-600">Home</a>
          <a href="/src/pages/en/services/index.html" class="paragraph hover:text-blue-600">Services</a>
          <a href="/src/pages/en/lead-generation/index.html" class="paragraph hover:text-blue-600">Lead Generation</a>
          <a href="#contact" class="paragraph hover:text-blue-600">Contact</a>
        </div>
        <a href="#contact" class="btn btn-primary btn-sm hidden md:inline-flex">Get Started</a>
      </div>
    </nav>
  </header>

  <section class="bg-gradient-to-br {colors['from']} {colors['to']} text-white py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">{config["h1"]}</h1>
        <p class="text-xl text-white/90 mb-8">{config["desc"]}</p>
      </div>
    </div>
  </section>

  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="heading heading-2 mb-8 text-center">Our Services</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">{services_html}</ul>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">{stats_html}</div>
      </div>
    </div>
  </section>

  <section id="contact" class="py-16 bg-gradient-to-br {colors['from']} {colors['to']} text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">Get Started Today</h2>
        <p class="text-xl text-white/90 mb-8">Let's discuss how we can help your business grow</p>
        <a href="/src/pages/en/index.html#contact" class="btn btn-primary btn-lg bg-white {colors['text']} hover:bg-gray-100">Contact Us</a>
      </div>
    </div>
  </section>

  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4 text-center text-gray-400">
      <p>&copy; 2025 IntelliCloud. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>'''

# Generate all pages
for path, config in ALL_PAGES.items():
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(generate_html(config))

    print(f"Created: {path}")

print(f"\n✓ Successfully generated {len(ALL_PAGES)} pages")
