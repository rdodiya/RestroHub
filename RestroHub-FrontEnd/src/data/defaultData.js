// ============================================
// DEFAULT SITE DATA
// This data is used as fallback when API fails
// ============================================

export const defaultSiteData = {
    // Theme Configuration
    theme: {
        primary: "#f59e0b",
        primaryHover: "#fbbf24",
        primaryDark: "#d97706",
        bgPrimary: "#000000",
        bgSecondary: "#0a0a0a",
        bgTertiary: "#171717",
        textPrimary: "#ffffff",
        textSecondary: "#9ca3af",
        textMuted: "#6b7280"
    },

    // Brand Information
    brand: {
        name: "RestroHub",
        fullName: "RestroHub",
        tagline: "Empowering restaurants to go digital with QR menus and contactless ordering",
        established: "Est. 2024 • India",
        logo: null
    },

    // Navigation Links
    navigation: [
        { label: "About", href: "#about" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" }
    ],

    // Hero Section
    hero: {
        title: ["RESTRO", "HUB"],
        backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
        ctaPrimary: { label: "Get Started", href: "#features" },
        ctaSecondary: { label: "Learn More", href: "#about" }
    },

    // About Section
    about: {
        subtitle: "Our Mission",
        title: ["Digital Transformation", "For Restaurants"],
        description: [
            "RestroHub is dedicated to helping Indian restaurants embrace the digital age. We provide simple, powerful tools for QR menus, payments, and order management.",
            "Our platform is built to handle everything from small dhabas to large restaurant chains, ensuring a seamless experience for both owners and customers."
        ],
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        stats: [
            { value: "500+", label: "Restaurants" },
            { value: "1.2M+", label: "Orders" },
            { value: "₹50Cr+", label: "Revenue" }
        ],
        hours: { 
            title: "Support Available", 
            time: "24/7 Digital Support" 
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
            title: "Support", 
            lines: ["Surat, Gujarat", "India"],
            mapUrl: "https://maps.google.com"
        },
        hours: { 
            title: "Support Hours", 
            lines: ["Monday - Saturday: 9AM - 8PM", "Sunday: Emergency Support Only"] 
        },
        contact: { 
            title: "Connect", 
            lines: ["Email: support@restrohub.com", "Web: www.restrohub.com"] 
        }
    },

    // Social Media Links
    social: [
        { name: "Twitter", url: "https://twitter.com/restrohub", icon: "twitter" },
        { name: "Instagram", url: "https://instagram.com/restrohub", icon: "instagram" },
        { name: "Facebook", url: "https://facebook.com/restrohub", icon: "facebook" }
    ],

    // Footer
    footer: {
        copyright: "© 2024 RestroHub. All rights reserved.",
        links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" }
        ]
    }
};

export default defaultSiteData;
