// ============================================
// DEFAULT SITE DATA
// This data is used as fallback when API fails
// ============================================

import { defaultTheme } from "./defaultTheme";

export const defaultSiteData = {
  // ==========================================
  // Website
  // ==========================================
  templateKey: "modern_v2",

  // ==========================================
  // Theme
  // ==========================================
  theme: defaultTheme,

  // ==========================================
  // navigation
  // ==========================================
  navigation: {
    name: "SpiceRoute",
    fullName: "Spice Route Indian Restaurant",
    tagline: "Authentic Indian Cuisine",
    established: "Est. 2018",
    logo: "https://cdn.restroly.com/logo.png"
  },

  // ==========================================
  // Hero
  // ==========================================
  hero: {
    title: [
      "Taste The",
      "Difference"
    ],

    backgroundImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",

    ctaPrimary: {
      label: "View Menu",
      href: "#menu"
    },

    ctaSecondary: {
      label: "Book Table",
      href: "#reservations"
    }
  },

  // ==========================================
  // About
  // ==========================================
  about: {
    subtitle: "Our Story",

    title: [
      "Authentic",
      "Indian Cuisine"
    ],

    description: [
      "At Spice Route, every dish is prepared using authentic Indian spices and traditional recipes handed down through generations.",
      "Our chefs combine fresh ingredients with rich flavors to create an unforgettable dining experience for every guest."
    ],

    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9",

    stats: [
      {
        value: "25+",
        label: "Expert Chefs"
      },
      {
        value: "10K+",
        label: "Happy Customers"
      },
      {
        value: "100+",
        label: "Signature Dishes"
      }
    ],

    hours: {
      title: "Opening Hours",
      time: "11:00 AM - 11:00 PM"
    }
  },

  // ==========================================
  // Menu (Backend Menu DTO)
  // ==========================================
  menu: {
    menuId: 1,

    menuName: "Main Menu",

    menuDesc: "Explore our delicious dishes.",

    categoryCount: 2,

    categories: [
      {
        categoryId: 1,

        name: "Starters",

        description: "Delicious starters",

        foodCount: 2,

        foods: [
          {
            foodId: 1,

            name: "Paneer Tikka",

            description: "Marinated cottage cheese grilled to perfection.",

            price: 250,

            imageUrl:
              "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",

            isAvailable: true,

            isVeg: true
          },
          {
            foodId: 2,

            name: "Veg Spring Roll",

            description: "Crispy spring rolls with vegetables.",

            price: 180,

            imageUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947",

            isAvailable: true,

            isVeg: true
          }
        ]
      },
      {
        categoryId: 2,

        name: "Main Course",

        description: "Authentic Indian dishes",

        foodCount: 2,

        foods: [
          {
            foodId: 3,

            name: "Butter Chicken",

            description: "Creamy tomato gravy with grilled chicken.",

            price: 380,

            imageUrl:
              "https://images.unsplash.com/photo-1604908176997-43179b8c5b7c",

            isAvailable: true,

            isVeg: false
          },
          {
            foodId: 4,

            name: "Dal Makhani",

            description: "Slow cooked black lentils.",

            price: 220,

            imageUrl:
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d",

            isAvailable: true,

            isVeg: true
          }
        ]
      }
    ]
  },

  // ==========================================
  // Gallery
  // ==========================================
  gallery: {
    subtitle: "Gallery",

    title: "Restaurant Moments",

    images: [
      {
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        alt: "Restaurant",
        span: "large"
      },
      {
        src: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        alt: "Food",
        span: "normal"
      },
      {
        src: "https://images.unsplash.com/photo-1544025162-d76694265947",
        alt: "Dish",
        span: "normal"
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        alt: "Dinner",
        span: "wide"
      }
    ]
  },

  // ==========================================
  // Reservation
  // ==========================================
  reservations: {
    subtitle: "Reserve",

    title: "Book Your Table",

    description:
      "Reserve your table online in less than a minute.",

    backgroundImage:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b",

    timeSlots: [
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM"
    ],

    guestOptions: [
      1,
      2,
      3,
      4,
      5,
      6,
      8,
      10
    ],

    formFields: [
      "name",
      "phone",
      "email",
      "date",
      "time",
      "guests"
    ]
  },

  // ==========================================
  // Contact
  // ==========================================
  contact: {
    location: {
      title: "Location",

      lines: [
        "123 Curry Street",
        "Ahmedabad, Gujarat"
      ]
    },

    hours: {
      title: "Opening Hours",

      lines: [
        "Monday - Friday : 11 AM - 11 PM",
        "Saturday - Sunday : 10 AM - Midnight"
      ]
    },

    contact: {
      title: "Contact",

      lines: [
        "+91 9876543210",
        "info@spiceroute.com"
      ]
    }
  },

  // ==========================================
  // Social Links
  // ==========================================
  social: [
    {
      platform: "facebook",
      url: "https://facebook.com/spiceroute",
      icon: "facebook"
    },
    {
      platform: "instagram",
      url: "https://instagram.com/spiceroute",
      icon: "instagram"
    },
    {
      platform: "twitter",
      url: "https://twitter.com/spiceroute",
      icon: "twitter"
    }
  ],

  // ==========================================
  // Footer
  // ==========================================
  footer: {
    copyright:
      "© 2026 Spice Route. All Rights Reserved.",

    links: [
      {
        label: "Privacy Policy",
        href: "#privacy"
      },
      {
        label: "Terms & Conditions",
        href: "#terms"
      },
      {
        label: "Contact",
        href: "#contact"
      }
    ]
  },

  // ==========================================
  // Floating Action Buttons
  // ==========================================
  serviceFab: [
    {
      icon: "bell",
      label: "Call Waiter"
    },
    {
      icon: "receipt",
      label: "Request Bill"
    },
    {
      icon: "phone",
      label: "Call Restaurant"
    }
  ]
};

export default defaultSiteData;
