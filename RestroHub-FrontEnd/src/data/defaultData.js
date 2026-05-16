// ============================================
// DEFAULT SITE DATA
// This data is used as fallback when API fails
// ============================================

export const defaultSiteData = {
    // Theme Configuration
    theme: {
        mode: "dark",
        primary: "#f59e0b",
        primaryHover: "#fbbf24",
        primaryDark: "#d97706",
        bgPrimary: "#000000",
        bgSecondary: "#0a0a0a",
        bgTertiary: "#171717",
        bgCard: "#1a1a1a",
        textPrimary: "#ffffff",
        textSecondary: "#9ca3af",
        textMuted: "#6b7280",
        borderPrimary: "#374151",
        borderSecondary: "#1f2937",
        overlayDark: "rgba(0,0,0,0.5)",
        overlayDarker: "rgba(0,0,0,0.6)",
        overlayLight: "rgba(0,0,0,0.2)"
    },

    // Brand Information
    brand: {
        name: "ADK",
        fullName: "Arts District Kitchen",
        tagline: "Modern American cuisine with a creative twist, served in the heart of LA's vibrant Arts District",
        established: "Est. 2019 • Los Angeles",
        logo: null
    },

    // Navigation Links
    navigation: [
       { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" }
    ],

    // Hero Section
    hero: {
        title: ["ARTS DISTRICT", "KITCHEN"],
        backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
        ctaPrimary: { label: "View Menu", href: "#menu" },
        ctaSecondary: { label: "Book a Table", href: "#reservations" }
    },

    // About Section
    about: {
        subtitle: "Our Story",
        title: ["Where Art Meets", "Gastronomy"],
        description: [
            "Nestled in the creative heart of Los Angeles, Arts District Kitchen brings together culinary innovation and artistic expression. Our chefs craft each dish as a masterpiece, using locally-sourced ingredients and time-honored techniques.",
            "From our open kitchen, witness the passion and precision that goes into every plate. Whether you're here for an intimate dinner or a celebration, expect an experience that engages all your senses."
        ],
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
        stats: [
            { value: "15+", label: "Awards" },
            { value: "50k+", label: "Happy Guests" },
            { value: "5", label: "Years" }
        ],
        hours: { 
            title: "Open Daily", 
            time: "5:00 PM - 11:00 PM" 
        }
    },

    // Menu Section
    menu: {
        subtitle: "Culinary Excellence",
        title: "Our Menu",
        categories: ["starters", "mains", "desserts", "drinks"],
        items: {
            starters: [
                { 
                    name: "Burrata & Heirloom Tomatoes", 
                    description: "Fresh burrata, seasonal tomatoes, basil oil, aged balsamic", 
                    price: "18",
                    image: null,
                    dietary: ["vegetarian"]
                },
                { 
                    name: "Tuna Tartare", 
                    description: "Sushi-grade ahi, avocado, sesame, citrus ponzu, wonton crisps", 
                    price: "22",
                    image: null,
                    dietary: ["gluten-free"]
                },
                { 
                    name: "Crispy Calamari", 
                    description: "Lightly fried, lemon aioli, marinara, fresh herbs", 
                    price: "16",
                    image: null,
                    dietary: []
                },
                { 
                    name: "Roasted Bone Marrow", 
                    description: "Herb gremolata, grilled sourdough, sea salt", 
                    price: "19",
                    image: null,
                    dietary: []
                }
            ],
            mains: [
                { 
                    name: "Prime Ribeye Steak", 
                    description: "14oz USDA Prime, truffle butter, roasted garlic, seasonal vegetables", 
                    price: "58",
                    image: null,
                    dietary: ["gluten-free"]
                },
                { 
                    name: "Pan-Seared Chilean Sea Bass", 
                    description: "Miso glaze, bok choy, ginger-scallion oil, jasmine rice", 
                    price: "45",
                    image: null,
                    dietary: ["gluten-free"]
                },
                { 
                    name: "Braised Short Rib", 
                    description: "Red wine reduction, creamy polenta, caramelized onions", 
                    price: "42",
                    image: null,
                    dietary: []
                },
                { 
                    name: "Roasted Free-Range Chicken", 
                    description: "Herb-stuffed, wild mushroom risotto, pan jus", 
                    price: "36",
                    image: null,
                    dietary: ["gluten-free"]
                }
            ],
            desserts: [
                { 
                    name: "Chocolate Lava Cake", 
                    description: "Molten center, vanilla bean gelato, raspberry coulis", 
                    price: "14",
                    image: null,
                    dietary: ["vegetarian"]
                },
                { 
                    name: "Crème Brûlée", 
                    description: "Classic vanilla custard, caramelized sugar, fresh berries", 
                    price: "12",
                    image: null,
                    dietary: ["vegetarian", "gluten-free"]
                },
                { 
                    name: "Tiramisu", 
                    description: "Espresso-soaked ladyfingers, mascarpone, cocoa", 
                    price: "13",
                    image: null,
                    dietary: ["vegetarian"]
                },
                { 
                    name: "Seasonal Fruit Tart", 
                    description: "Pastry cream, fresh fruits, apricot glaze", 
                    price: "11",
                    image: null,
                    dietary: ["vegetarian"]
                }
            ],
            drinks: [
                { 
                    name: "Arts District Old Fashioned", 
                    description: "Bourbon, orange bitters, demerara, smoked cherry", 
                    price: "16",
                    image: null,
                    dietary: []
                },
                { 
                    name: "Lavender Martini", 
                    description: "Vodka, lavender syrup, lemon, butterfly pea flower", 
                    price: "15",
                    image: null,
                    dietary: []
                },
                { 
                    name: "Smoky Mezcal Margarita", 
                    description: "Mezcal, lime, agave, chili salt rim", 
                    price: "14",
                    image: null,
                    dietary: []
                },
                { 
                    name: "Sommelier's Wine Selection", 
                    description: "Ask about our rotating selection of fine wines", 
                    price: "varies",
                    image: null,
                    dietary: []
                }
            ]
        }
    },

    // Gallery Section
    gallery: {
        subtitle: "Visual Journey",
        title: "Gallery",
        images: [
            { 
                src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", 
                alt: "Steak dish", 
                span: "large" 
            },
            { 
                src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", 
                alt: "Pizza", 
                span: "normal" 
            },
            { 
                src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", 
                alt: "Pancakes", 
                span: "normal" 
            },
            { 
                src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80", 
                alt: "Restaurant interior", 
                span: "normal" 
            },
            { 
                src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", 
                alt: "Cocktail", 
                span: "normal" 
            },
            { 
                src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", 
                alt: "Food spread", 
                span: "wide" 
            },
            { 
                src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", 
                alt: "Restaurant ambiance", 
                span: "wide" 
            }
        ]
    },

    // Reservations Section
    reservations: {
        subtitle: "Book Your Experience",
        title: "Reservations",
        description: "Reserve your table and join us for an unforgettable dining experience",
        backgroundImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80",
        timeSlots: ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"],
        guestOptions: ["1 Person", "2 People", "3 People", "4 People", "5 People", "6+ People"],
        formFields: {
            name: { label: "Your Name", required: true },
            email: { label: "Email Address", required: true },
            phone: { label: "Phone Number", required: false },
            date: { label: "Date", required: true },
            time: { label: "Time", required: true },
            guests: { label: "Number of Guests", required: true },
            requests: { label: "Special Requests", required: false }
        }
    },

    // Contact Section
    contact: {
        location: { 
            title: "Location", 
            lines: ["828 Traction Ave", "Los Angeles, CA 90013"],
            mapUrl: "https://maps.google.com"
        },
        hours: { 
            title: "Hours", 
            lines: ["Monday - Thursday: 5PM - 10PM", "Friday - Sunday: 5PM - 11PM"] 
        },
        contact: { 
            title: "Contact", 
            lines: ["Phone: (213) 555-0128", "info@artsdistrictkitchen.com"] 
        }
    },

    // Social Media Links
    social: [
        { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
        { name: "Instagram", url: "https://instagram.com", icon: "instagram" },
        { name: "Facebook", url: "https://facebook.com", icon: "facebook" }
    ],

    // Footer
   footer: {
  copyright: "© 2026 Restroly. All rights reserved.",
  links: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" }
  ]
},
    };

export default defaultSiteData;
