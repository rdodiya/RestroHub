package com.restroly.qrmenu.template.controller;

import com.restroly.qrmenu.common.util.ApiConstants;
import com.restroly.qrmenu.template.dto.PublicSiteConfigResponse;
import com.restroly.qrmenu.template.service.SiteConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;

@RestController
@RequestMapping(PUBLIC_API_VERSION +"/sites")
@RequiredArgsConstructor
@Tag(name = "Public Site API", description = "Public APIs for fetching site data")
public class PublicSiteController {

    private final SiteConfigService siteConfigService;

    @GetMapping("/{siteId}/config")
    @Operation(summary = "Get public site configuration with all sections")
    public ResponseEntity<PublicSiteConfigResponse> getSiteConfig(
            @Parameter(description = "Site ID") @PathVariable String siteId) {
        PublicSiteConfigResponse config = siteConfigService.getPublicSiteConfig(siteId);
        return ResponseEntity.ok(config);
    }
}
/*
{
  "templateKey": "landing_v1",
  "componentName": "LandingTemplateV1",
  "theme": {
    "primaryColor": "#f59e0b",
    "primaryHover": "#fbbf24",
    "primaryDark": "#d97706",
    "secondaryColor": "#fbbf24",
    "backgroundColor": "#000000",
    "bgSecondary": "#0a0a0a",
    "bgTertiary": "#171717",
    "textColor": "#ffffff",
    "textSecondary": "#9ca3af",
    "textMuted": "#6b7280",
    "accentColor": "#f59e0b",
    "fontFamily": "Inter, sans-serif",
    "headingFontFamily": "Playfair Display, serif",
    "borderRadius": "8px",
    "buttonStyle": "rounded",
    "isDarkMode": true
  },
  "brand": {
    "name": "ADK",
    "fullName": "Arts District Kitchen",
    "tagline": "Modern American cuisine with a creative twist",
    "established": "Est. 2019 • Los Angeles",
    "logo": "/images/logo.png",
    "favicon": "/images/favicon.ico"
  },
  "navigation": [
    { "label": "About", "href": "#about", "icon": null, "isExternal": false },
    { "label": "Menu", "href": "#menu", "icon": null, "isExternal": false },
    { "label": "Gallery", "href": "#gallery", "icon": null, "isExternal": false },
    { "label": "Contact", "href": "#contact", "icon": null, "isExternal": false }
  ],
  "sections": [
    {
      "id": "hero",
      "sectionKey": "hero",
      "sectionType": "hero_centered",
      "componentName": "HeroCenteredSection",
      "order": 1,
      "title": null,
      "subtitle": null,
      "content": {
        "title": ["ARTS DISTRICT", "KITCHEN"],
        "backgroundImage": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
        "ctaPrimary": { "label": "View Menu", "href": "#menu" },
        "ctaSecondary": { "label": "Book a Table", "href": "#reservations" }
      },
      "settings": {
        "parallax": true,
        "overlayOpacity": 0.6,
        "textAlign": "center",
        "animationType": "fade-up"
      },
      "style": {
        "isFullWidth": true,
        "paddingTop": "0",
        "paddingBottom": "0"
      },
      "isVisible": true
    },
    {
      "id": "about",
      "sectionKey": "about",
      "sectionType": "about_split",
      "componentName": "AboutSplitSection",
      "order": 2,
      "title": "Our Story",
      "subtitle": "Where Art Meets Gastronomy",
      "content": {
        "description": [
          "Nestled in the creative heart of Los Angeles...",
          "From our open kitchen..."
        ],
        "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
        "stats": [
          { "value": "15+", "label": "Awards" },
          { "value": "50k+", "label": "Happy Guests" },
          { "value": "5", "label": "Years" }
        ],
        "hours": { "title": "Open Daily", "time": "5:00 PM - 11:00 PM" }
      },
      "settings": {
        "imagePosition": "right",
        "showStats": true,
        "showHours": true
      },
      "style": {
        "backgroundColor": "#0a0a0a",
        "paddingTop": "80px",
        "paddingBottom": "80px"
      },
      "isVisible": true
    },
    {
      "id": "menu",
      "sectionKey": "menu",
      "sectionType": "menu_tabs",
      "componentName": "MenuTabsSection",
      "order": 3,
      "title": "Our Menu",
      "subtitle": "Culinary Excellence",
      "content": {
        "categories": ["starters", "mains", "desserts", "drinks"],
        "items": {
          "starters": [
            {
              "name": "Burrata & Heirloom Tomatoes",
              "description": "Fresh burrata, seasonal tomatoes, basil oil, aged balsamic",
              "price": "18",
              "image": null,
              "dietary": ["vegetarian"]
            }
          ],
          "mains": [],
          "desserts": [],
          "drinks": []
        }
      },
      "settings": {
        "layout": "tabs",
        "showImages": false,
        "showDietary": true,
        "columns": 2
      },
      "style": {
        "paddingTop": "80px",
        "paddingBottom": "80px"
      },
      "isVisible": true
    },
    {
      "id": "gallery",
      "sectionKey": "gallery",
      "sectionType": "gallery_masonry",
      "componentName": "GalleryMasonrySection",
      "order": 4,
      "title": "Gallery",
      "subtitle": "Visual Journey",
      "content": {
        "images": [
          {
            "src": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
            "alt": "Steak dish",
            "span": "large"
          }
        ]
      },
      "settings": {
        "columns": 3,
        "gap": "16px",
        "enableLightbox": true
      },
      "style": {
        "backgroundColor": "#0a0a0a"
      },
      "isVisible": true
    },
    {
      "id": "reservations",
      "sectionKey": "reservations",
      "sectionType": "reservations_form",
      "componentName": "ReservationsFormSection",
      "order": 5,
      "title": "Reservations",
      "subtitle": "Book Your Experience",
      "content": {
        "description": "Reserve your table and join us for an unforgettable dining experience",
        "backgroundImage": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80",
        "timeSlots": ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"],
        "guestOptions": ["1 Person", "2 People", "3 People", "4 People", "5 People", "6+ People"],
        "formFields": {
          "name": { "label": "Your Name", "required": true },
          "email": { "label": "Email Address", "required": true },
          "phone": { "label": "Phone Number", "required": false },
          "date": { "label": "Date", "required": true },
          "time": { "label": "Time", "required": true },
          "guests": { "label": "Number of Guests", "required": true },
          "requests": { "label": "Special Requests", "required": false }
        }
      },
      "settings": {
        "showBackgroundImage": true,
        "overlayOpacity": 0.7
      },
      "style": {
        "isFullWidth": true
      },
      "isVisible": true
    },
    {
      "id": "contact",
      "sectionKey": "contact",
      "sectionType": "contact_grid",
      "componentName": "ContactGridSection",
      "order": 6,
      "title": "Contact",
      "subtitle": "Get in Touch",
      "content": {
        "location": {
          "title": "Location",
          "lines": ["828 Traction Ave", "Los Angeles, CA 90013"],
          "mapUrl": "https://maps.google.com"
        },
        "hours": {
          "title": "Hours",
          "lines": ["Monday - Thursday: 5PM - 10PM", "Friday - Sunday: 5PM - 11PM"]
        },
*/