package com.restroly.qrmenu.template.controller;

import com.restroly.qrmenu.template.dto.SiteConfigDTO;
import com.restroly.qrmenu.template.dto.UpdateSiteConfigRequest;
import com.restroly.qrmenu.template.entity.SectionType;
import com.restroly.qrmenu.template.service.SiteConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static com.restroly.qrmenu.common.util.ApiConstants.PUBLIC_API_VERSION;

@RestController
@RequestMapping(PUBLIC_API_VERSION +"/sites")
@RequiredArgsConstructor
@Tag(name = "Public Site API", description = "Public APIs for fetching site data")
public class PublicSiteController {

    private final SiteConfigService siteConfigService;

    @GetMapping("/{siteId}/config")
    @Operation(summary = "Get public site configuration with all sections")
    public ResponseEntity<SiteConfigDTO> getSiteConfig(
            @Parameter(description = "Site ID") @PathVariable String siteId) {
        SiteConfigDTO config = siteConfigService.getPublicSiteConfig(siteId);
        return ResponseEntity.ok(config);
    }

    @PatchMapping("/{siteId}/config")
    public ResponseEntity<SiteConfigDTO> updateSiteConfig(
            @PathVariable String siteId,
            @RequestBody UpdateSiteConfigRequest request) {

        return ResponseEntity.ok(
                siteConfigService.updateSiteConfig(siteId, request));
    }

}
/*
{
    "id": 1,
    "siteId": "spice-route",
    "restaurantId": 101,
    "siteName": "Spice Route",
    "pageSlug": "spice-route",
    "templateKey": "modern_v2",
    "theme": {
        "id": 4,
        "name": "Ocean Blue Dark",
        "themeKey": "OCEAN_BLUE_DARK",
        "description": "Default dark theme with ocean blue accents",
        "primaryColor": "#3b82f6",
        "colorPrimaryHover": "#60a5fa",
        "colorPrimaryDark": "#2563eb",
        "secondaryColor": "#2563eb",
        "colorAccent": "#3b82f6",
        "bgPrimary": "#0a0a0a",
        "bgSecondary": "#111111",
        "bgTertiary": "#1a1a1a",
        "primaryTextColor": "#ffffff",
        "secondaryTextColor": "#9ca3af",
        "textMuted": "#6b7280",
        "headerBackground": "#0a0a0a",
        "footerBackground": "#0a0a0a",
        "buttonBackground": "#3b82f6",
        "buttonText": "#ffffff",
        "borderColor": "#374151",
        "fontPrimary": "Inter, sans-serif",
        "fontHeading": "Playfair Display, serif",
        "fontSizeBase": "16px",
        "customStylesJson": "{}",
        "isActive": true,
        "isDefault": true,
        "isDarkMode": true,
        "createdAt": "2026-07-15T13:24:28.649626",
        "updatedAt": "2026-07-15T13:24:28.649626"
    },
    "menu": {
        "menuId": 1,
        "menuName": "Day1 Menu",
        "menuDesc": "Day1 Menu for lunch.",
        "createdDate": "2026-07-15",
        "updatedDate": "2026-07-15",
        "branch": {
            "branchId": 1,
            "name": "Rajkot Dhaba  Main Branch",
            "description": "Rajkot Dhaba\n\nMain Branch"
        },
        "categories": [
            {
                "categoryId": 1,
                "name": "Main Course",
                "description": "Main Course...",
                "foods": [
                    {
                        "foodId": 1,
                        "name": "Panner Tickka",
                        "description": "Panner Tickka",
                        "price": 250.00,
                        "imageUrl": "https://th.bing.com/th/id/OIP.YwE4XKRTg-2DN1IRlTW63wHaHa?w=208&h=208&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
                        "isAvailable": true,
                        "isVeg": true
                    }
                ],
                "foodCount": 1
            }
        ],
        "categoryCount": 1,
        "isDeleted": false
    },
    "sections": [
        {
            "id": 1,
            "sectionKey": "NAVIGATION",
            "displayOrder": 1,
            "isVisible": true,
            "content": {
                "links": [
                    {
                        "href": "#",
                        "label": "Home"
                    },
                    {
                        "href": "#how-it-works",
                        "label": "Menu"
                    },
                    {
                        "href": "#about",
                        "label": "About"
                    },
                    {
                        "href": "#contact",
                        "label": "Contact"
                    }
                ]
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 2,
            "sectionKey": "HERO",
            "displayOrder": 2,
            "isVisible": true,
            "content": {
                "title": [
                    "Taste The",
                    "Difference"
                ],
                "ctaPrimary": {
                    "href": "#how-it-works",
                    "label": "View Menu"
                },
                "ctaSecondary": {
                    "href": "#reservations",
                    "label": "Reserve a Table"
                },
                "backgroundImage": "https://cdn.restroly.com/sites/spice-route/hero-bg.jpg"
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 3,
            "sectionKey": "ABOUT",
            "displayOrder": 3,
            "isVisible": true,
            "content": {
                "hours": [],
                "image": "https://cdn.restroly.com/sites/spice-route/about.jpg",
                "stats": [],
                "title": "About Us",
                "subtitle": "Our Story",
                "description": "Tell your customers what makes your restaurant special."
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 4,
            "sectionKey": "GALLERY",
            "displayOrder": 4,
            "isVisible": true,
            "content": {
                "title": "Gallery",
                "images": [],
                "subtitle": "A Glimpse Inside"
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 5,
            "sectionKey": "RESERVATION",
            "displayOrder": 5,
            "isVisible": true,
            "content": {
                "title": "Reserve a Table",
                "subtitle": "Book Your Visit",
                "timeSlots": [
                    "18:00",
                    "18:30",
                    "19:00",
                    "19:30",
                    "20:00"
                ],
                "formFields": [
                    "name",
                    "phone",
                    "email",
                    "date",
                    "time",
                    "guests"
                ],
                "description": "Book your table online in seconds.",
                "guestOptions": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "backgroundImage": ""
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 6,
            "sectionKey": "CONTACT",
            "displayOrder": 6,
            "isVisible": true,
            "content": {
                "hours": "Mon-Sun: 11am - 11pm",
                "contact": {
                    "email": "hello@spiceroute.com",
                    "phone": "+1 555 123 4567"
                },
                "location": "123 Curry Lane, Flavor Town"
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 7,
            "sectionKey": "FOOTER",
            "displayOrder": 7,
            "isVisible": true,
            "content": {
                "text": "© 2026 Spice Route. All rights reserved.",
                "socialLinks": [
                    {
                        "url": "https://instagram.com/spiceroute",
                        "platform": "instagram"
                    },
                    {
                        "url": "https://facebook.com/spiceroute",
                        "platform": "facebook"
                    }
                ]
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        },
        {
            "id": 8,
            "sectionKey": "SERVICE_FAB",
            "displayOrder": 8,
            "isVisible": true,
            "content": {
                "actions": [
                    {
                        "icon": "bell",
                        "label": "Call Waiter"
                    },
                    {
                        "icon": "receipt",
                        "label": "Request Bill"
                    }
                ]
            },
            "styles": {},
            "createdAt": "2026-07-15T13:24:28.649626",
            "updatedAt": "2026-07-15T13:24:28.649626"
        }
    ],
    "isPublished": true,
    "createdAt": "2026-07-15T13:24:28.649626",
    "updatedAt": "2026-07-15T13:24:28.649626"
}
*/