import React, { useRef } from "react";
import {
  Sparkles,
  Building2,
  Flame,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Phone,
  Globe,
  Upload,
  Trash2,
  Layers,
  MapPin,
  Clock,
  Mail,
  Plus
} from "lucide-react";
import { useSiteData } from "@context/SiteContext";

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve({
        fileName: file.name,
        contentType: file.type,
        base64,
      });
    };
    reader.onerror = reject;
  });

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all";
const labelClass = "mb-1.5 block text-xs font-medium text-gray-600";
const textareaClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-vertical";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-4 flex items-center gap-2.5">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
      <Icon className="h-4 w-4 text-blue-600" />
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const SectionEditor = () => {
  const { siteData, updateSection } = useSiteData();
  const logoInputRef = useRef(null);
  const heroBgInputRef = useRef(null);
  const aboutImageInputRef = useRef(null);
  const reservationBgInputRef = useRef(null);

  if (!siteData) return null;

  const navigation = siteData.navigation || {};
  const hero = siteData.hero || {};
  const about = siteData.about || {};
  const gallery = siteData.gallery || { images: [] };
  const reservations = siteData.reservations || { timeSlots: [], guestOptions: [] };
  const contact = siteData.contact || {};
  const footer = siteData.footer || { links: [] };

  const handleChange = (sectionName, field, value) => {
    updateSection(sectionName, {
      [field]: value,
    });
  };

  const handleFileUpload = async (e, sectionName, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const image = await fileToBase64(file);
    updateSection(sectionName, {
      [field]: image,
    });
  };

  const getImageSrc = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    if (image.base64) return `data:${image.contentType};base64,${image.base64}`;
    return "";
  };

  const handleNestedArrayChange = (section, object, field, value) => {
    updateSection(section, {
      [object]: {
        ...siteData[section]?.[object],
        [field]: value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });
  };

  return (
    <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ============================= */}
      {/* MAIN HEADER                   */}
      {/* ============================= */}
      <div className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Layers className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
              Content & Section Editor
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm">
              Customize your brand identity, hero banner, about story, gallery, and contact information
            </p>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* BODY SECTIONS (SCROLLABLE)   */}
      {/* ============================= */}
      <div className="flex-1 overflow-y-auto space-y-8 px-4 py-5 sm:px-6 sm:py-6">
        {/* ========================================== */}
        {/* 1. BRAND & NAVIGATION                      */}
        {/* ========================================== */}
        <div>
          <SectionHeader
            icon={Building2}
            title="Brand & Identity"
            subtitle="Restaurant name, tagline, established year, and logo"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Inputs */}
            <div className="space-y-4 lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Restaurant Name</label>
                  <input
                    type="text"
                    value={navigation.name || ""}
                    onChange={(e) => handleChange("navigation", "name", e.target.value)}
                    className={inputClass}
                    placeholder="Spice Route"
                  />
                </div>

                <div>
                  <label className={labelClass}>Full Display Name</label>
                  <input
                    type="text"
                    value={navigation.fullName || ""}
                    onChange={(e) => handleChange("navigation", "fullName", e.target.value)}
                    className={inputClass}
                    placeholder="Spice Route Indian Restaurant"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input
                    type="text"
                    value={navigation.tagline || ""}
                    onChange={(e) => handleChange("navigation", "tagline", e.target.value)}
                    className={inputClass}
                    placeholder="Authentic Indian Cuisine"
                  />
                </div>

                <div>
                  <label className={labelClass}>Established</label>
                  <input
                    type="text"
                    value={navigation.established || ""}
                    onChange={(e) => handleChange("navigation", "established", e.target.value)}
                    className={inputClass}
                    placeholder="Est. 2018"
                  />
                </div>
              </div>
            </div>

            {/* Right Logo Upload */}
            <div className="lg:col-span-5">
              <label className={labelClass}>Brand Logo</label>
              <div
                onClick={() => logoInputRef.current?.click()}
                className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50/30"
              >
                {navigation.logo ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={getImageSrc(navigation.logo)}
                      alt="Logo"
                      className="h-20 w-20 rounded-lg border border-gray-200 bg-white object-contain p-2 shadow-sm"
                    />
                    <p className="mt-2 text-xs font-medium text-gray-500">Click to change logo</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Upload className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Upload Logo</p>
                    <p className="text-[11px] text-gray-400">PNG, JPG, or SVG</p>
                  </>
                )}
              </div>

              <input
                ref={logoInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "navigation", "logo")}
              />

              {navigation.logo && (
                <button
                  type="button"
                  onClick={() => handleChange("navigation", "logo", "")}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. HERO SECTION                            */}
        {/* ========================================== */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={Flame}
            title="Hero Banner"
            subtitle="Headline titles, call-to-action buttons, and hero background image"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Title Line 1</label>
                  <input
                    type="text"
                    value={Array.isArray(hero.title) ? hero.title[0] || "" : hero.title || ""}
                    onChange={(e) => {
                      const t = Array.isArray(hero.title) ? [...hero.title] : [hero.title || "", ""];
                      t[0] = e.target.value;
                      handleChange("hero", "title", t);
                    }}
                    className={inputClass}
                    placeholder="Taste The"
                  />
                </div>

                <div>
                  <label className={labelClass}>Title Line 2</label>
                  <input
                    type="text"
                    value={Array.isArray(hero.title) ? hero.title[1] || "" : ""}
                    onChange={(e) => {
                      const t = Array.isArray(hero.title) ? [...hero.title] : [hero.title || "", ""];
                      t[1] = e.target.value;
                      handleChange("hero", "title", t);
                    }}
                    className={inputClass}
                    placeholder="Difference"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Primary Button Text</label>
                  <input
                    type="text"
                    value={hero.ctaPrimary?.label || ""}
                    onChange={(e) =>
                      handleChange("hero", "ctaPrimary", {
                        ...hero.ctaPrimary,
                        label: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="View Menu"
                  />
                </div>

                <div>
                  <label className={labelClass}>Secondary Button Text</label>
                  <input
                    type="text"
                    value={hero.ctaSecondary?.label || ""}
                    onChange={(e) =>
                      handleChange("hero", "ctaSecondary", {
                        ...hero.ctaSecondary,
                        label: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Book Table"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <label className={labelClass}>Hero Background Image</label>
              <div
                onClick={() => heroBgInputRef.current?.click()}
                className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50/30"
              >
                {hero.backgroundImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={getImageSrc(hero.backgroundImage)}
                      alt="Hero Bg"
                      className="h-20 w-full max-w-[200px] rounded-lg border border-gray-200 object-cover shadow-sm"
                    />
                    <p className="mt-2 text-xs font-medium text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Upload className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Upload Hero Image</p>
                    <p className="text-[11px] text-gray-400">High resolution JPG or WEBP</p>
                  </>
                )}
              </div>

              <input
                ref={heroBgInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "hero", "backgroundImage")}
              />

              {hero.backgroundImage && (
                <button
                  type="button"
                  onClick={() => handleChange("hero", "backgroundImage", "")}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Background
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 3. ABOUT SECTION                           */}
        {/* ========================================== */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={BookOpen}
            title="About Section"
            subtitle="Restaurant story, opening hours, key metrics, and photo"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  type="text"
                  value={about.subtitle || ""}
                  onChange={(e) => handleChange("about", "subtitle", e.target.value)}
                  className={inputClass}
                  placeholder="Our Story"
                />
              </div>

              <div>
                <label className={labelClass}>Title Line 1</label>
                <input
                  type="text"
                  value={Array.isArray(about.title) ? about.title[0] || "" : about.title || ""}
                  onChange={(e) => {
                    const t = Array.isArray(about.title) ? [...about.title] : [about.title || "", ""];
                    t[0] = e.target.value;
                    handleChange("about", "title", t);
                  }}
                  className={inputClass}
                  placeholder="Authentic"
                />
              </div>

              <div>
                <label className={labelClass}>Title Line 2</label>
                <input
                  type="text"
                  value={Array.isArray(about.title) ? about.title[1] || "" : ""}
                  onChange={(e) => {
                    const t = Array.isArray(about.title) ? [...about.title] : [about.title || "", ""];
                    t[1] = e.target.value;
                    handleChange("about", "title", t);
                  }}
                  className={inputClass}
                  placeholder="Indian Cuisine"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Story Paragraph 1</label>
                <textarea
                  rows={3}
                  value={Array.isArray(about.description) ? about.description[0] || "" : about.description || ""}
                  onChange={(e) => {
                    const d = Array.isArray(about.description) ? [...about.description] : [about.description || "", ""];
                    d[0] = e.target.value;
                    handleChange("about", "description", d);
                  }}
                  className={textareaClass}
                  placeholder="At Spice Route, every dish is prepared with authentic ingredients..."
                />
              </div>

              <div>
                <label className={labelClass}>Story Paragraph 2</label>
                <textarea
                  rows={3}
                  value={Array.isArray(about.description) ? about.description[1] || "" : ""}
                  onChange={(e) => {
                    const d = Array.isArray(about.description) ? [...about.description] : [about.description || "", ""];
                    d[1] = e.target.value;
                    handleChange("about", "description", d);
                  }}
                  className={textareaClass}
                  placeholder="Our chefs combine fresh ingredients with rich flavors..."
                />
              </div>
            </div>

            {/* Hours and About Image */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Hours Title</label>
                    <input
                      type="text"
                      value={about.hours?.title || ""}
                      onChange={(e) =>
                        handleChange("about", "hours", {
                          ...about.hours,
                          title: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Opening Hours"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Hours Schedule</label>
                    <input
                      type="text"
                      value={about.hours?.time || ""}
                      onChange={(e) =>
                        handleChange("about", "hours", {
                          ...about.hours,
                          time: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="11:00 AM - 11:00 PM"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <label className={labelClass}>Restaurant Highlights & Stats</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/50 p-2.5">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder={idx === 0 ? "25+" : idx === 1 ? "10K+" : "100+"}
                          value={about.stats?.[idx]?.value || ""}
                          onChange={(e) => {
                            const stats = Array.isArray(about.stats) ? [...about.stats] : [];
                            stats[idx] = { ...stats[idx], value: e.target.value };
                            handleChange("about", "stats", stats);
                          }}
                        />
                        <input
                          type="text"
                          className={inputClass}
                          placeholder={idx === 0 ? "Expert Chefs" : idx === 1 ? "Happy Customers" : "Signature Dishes"}
                          value={about.stats?.[idx]?.label || ""}
                          onChange={(e) => {
                            const stats = Array.isArray(about.stats) ? [...about.stats] : [];
                            stats[idx] = { ...stats[idx], label: e.target.value };
                            handleChange("about", "stats", stats);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Image Upload */}
              <div className="lg:col-span-5">
                <label className={labelClass}>About Section Image</label>
                <div
                  onClick={() => aboutImageInputRef.current?.click()}
                  className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50/30"
                >
                  {about.image ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={getImageSrc(about.image)}
                        alt="About"
                        className="h-24 w-full max-w-[220px] rounded-lg border border-gray-200 object-cover shadow-sm"
                      />
                      <p className="mt-2 text-xs font-medium text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Upload className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">Upload About Photo</p>
                      <p className="text-[11px] text-gray-400">PNG, JPG, or WEBP</p>
                    </>
                  )}
                </div>

                <input
                  ref={aboutImageInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "about", "image")}
                />

                {about.image && (
                  <button
                    type="button"
                    onClick={() => handleChange("about", "image", "")}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 4. GALLERY SECTION                         */}
        {/* ========================================== */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={ImageIcon}
            title="Photo Gallery"
            subtitle="Showcase your food, ambiance, and dining moments"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  type="text"
                  value={gallery.subtitle || ""}
                  onChange={(e) => handleChange("gallery", "subtitle", e.target.value)}
                  className={inputClass}
                  placeholder="Gallery"
                />
              </div>

              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={gallery.title || ""}
                  onChange={(e) => handleChange("gallery", "title", e.target.value)}
                  className={inputClass}
                  placeholder="Restaurant Moments"
                />
              </div>
            </div>

            {/* Gallery Image Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(gallery.images || []).map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 bg-gray-50/40 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div
                      onClick={() => document.getElementById(`gallery-input-${idx}`)?.click()}
                      className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-2 transition-all hover:border-blue-400"
                    >
                      {img.src ? (
                        <img
                          src={getImageSrc(img.src)}
                          alt={img.alt || "Gallery Item"}
                          className="h-full w-full rounded object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-5 w-5 text-gray-400" />
                          <span className="mt-1 block text-xs font-medium text-gray-600">Select Image</span>
                        </div>
                      )}
                    </div>

                    <input
                      id={`gallery-input-${idx}`}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const base64 = await fileToBase64(file);
                        const updated = [...gallery.images];
                        updated[idx] = { ...updated[idx], src: base64 };
                        handleChange("gallery", "images", updated);
                      }}
                    />

                    <div>
                      <label className={labelClass}>Alt Description</label>
                      <input
                        type="text"
                        value={img.alt || ""}
                        onChange={(e) => {
                          const updated = [...gallery.images];
                          updated[idx] = { ...updated[idx], alt: e.target.value };
                          handleChange("gallery", "images", updated);
                        }}
                        className={inputClass}
                        placeholder="Food item description"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Grid Span</label>
                      <select
                        value={img.span || "normal"}
                        onChange={(e) => {
                          const updated = [...gallery.images];
                          updated[idx] = { ...updated[idx], span: e.target.value };
                          handleChange("gallery", "images", updated);
                        }}
                        className={inputClass}
                      >
                        <option value="normal">Normal</option>
                        <option value="large">Large</option>
                        <option value="wide">Wide</option>
                      </select>
                    </div>

                    {img.src && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...gallery.images];
                          updated[idx] = { ...updated[idx], src: "" };
                          handleChange("gallery", "images", updated);
                        }}
                        className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear Photo
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 5. RESERVATIONS SECTION                    */}
        {/* ========================================== */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={Calendar}
            title="Reservations"
            subtitle="Table booking copy, available time slots, party size options, and backdrop"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Subtitle</label>
                  <input
                    type="text"
                    value={reservations.subtitle || ""}
                    onChange={(e) => handleChange("reservations", "subtitle", e.target.value)}
                    className={inputClass}
                    placeholder="Reservations"
                  />
                </div>

                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    value={reservations.title || ""}
                    onChange={(e) => handleChange("reservations", "title", e.target.value)}
                    className={inputClass}
                    placeholder="Reserve Your Table"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={2}
                  value={reservations.description || ""}
                  onChange={(e) => handleChange("reservations", "description", e.target.value)}
                  className={textareaClass}
                  placeholder="Experience unforgettable dining with handcrafted dishes..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Time Slots (One Per Line)</label>
                  <textarea
                    rows={4}
                    value={(reservations.timeSlots || []).join("\n")}
                    onChange={(e) => {
                      const slots = e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      handleChange("reservations", "timeSlots", slots);
                    }}
                    className={textareaClass}
                    placeholder={`11:30 AM\n12:30 PM\n01:30 PM\n07:00 PM`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Party Sizes (One Per Line)</label>
                  <textarea
                    rows={4}
                    value={(reservations.guestOptions || []).join("\n")}
                    onChange={(e) => {
                      const guests = e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      handleChange("reservations", "guestOptions", guests);
                    }}
                    className={textareaClass}
                    placeholder={`1 Person\n2 People\n4 People\n6+ People`}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <label className={labelClass}>Reservation Background Image</label>
              <div
                onClick={() => reservationBgInputRef.current?.click()}
                className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50/30"
              >
                {reservations.backgroundImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={getImageSrc(reservations.backgroundImage)}
                      alt="Reservation Bg"
                      className="h-24 w-full max-w-[200px] rounded-lg border border-gray-200 object-cover shadow-sm"
                    />
                    <p className="mt-2 text-xs font-medium text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Upload className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Upload Background</p>
                    <p className="text-[11px] text-gray-400">PNG, JPG, or WEBP</p>
                  </>
                )}
              </div>

              <input
                ref={reservationBgInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "reservations", "backgroundImage")}
              />

              {reservations.backgroundImage && (
                <button
                  type="button"
                  onClick={() => handleChange("reservations", "backgroundImage", "")}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Background
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 6. CONTACT & LOCATION                      */}
        {/* ========================================== */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={Phone}
            title="Contact & Location"
            subtitle="Address, opening hours, contact numbers, and embedded Google Maps"
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Section Title</label>
                <input
                  type="text"
                  value={contact.sectionTitle || ""}
                  onChange={(e) => handleChange("contact", "sectionTitle", e.target.value)}
                  className={inputClass}
                  placeholder="Get in Touch"
                />
              </div>

              <div>
                <label className={labelClass}>Section Subtitle</label>
                <input
                  type="text"
                  value={contact.sectionSubtitle || ""}
                  onChange={(e) => handleChange("contact", "sectionSubtitle", e.target.value)}
                  className={inputClass}
                  placeholder="We'd love to hear from you."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Location Card */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-3.5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Address Info
                </div>
                <div>
                  <label className={labelClass}>Location Title</label>
                  <input
                    type="text"
                    value={contact.location?.title || ""}
                    onChange={(e) => handleNestedArrayChange("contact", "location", "title", e.target.value)}
                    className={inputClass}
                    placeholder="Our Location"
                  />
                </div>
                <div>
                  <label className={labelClass}>Address Lines (One Per Line)</label>
                  <textarea
                    rows={3}
                    value={(contact.location?.lines || []).join("\n")}
                    onChange={(e) => handleNestedArrayChange("contact", "location", "lines", e.target.value)}
                    className={textareaClass}
                    placeholder={`123 Main Street\nNew York, NY 10001`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Google Maps URL</label>
                  <input
                    type="text"
                    value={contact.location?.mapUrl || ""}
                    onChange={(e) => handleNestedArrayChange("contact", "location", "mapUrl", e.target.value)}
                    className={inputClass}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              {/* Hours Card */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-3.5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Operating Hours
                </div>
                <div>
                  <label className={labelClass}>Hours Title</label>
                  <input
                    type="text"
                    value={contact.hours?.title || ""}
                    onChange={(e) => handleNestedArrayChange("contact", "hours", "title", e.target.value)}
                    className={inputClass}
                    placeholder="Opening Hours"
                  />
                </div>
                <div>
                  <label className={labelClass}>Schedule (One Per Line)</label>
                  <textarea
                    rows={6}
                    value={(contact.hours?.lines || []).join("\n")}
                    onChange={(e) => handleNestedArrayChange("contact", "hours", "lines", e.target.value)}
                    className={textareaClass}
                    placeholder={`Monday - Friday : 10 AM - 10 PM\nSaturday : 9 AM - 11 PM`}
                  />
                </div>
              </div>

              {/* Contact Card */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-3.5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Phone & Email
                </div>
                <div>
                  <label className={labelClass}>Contact Title</label>
                  <input
                    type="text"
                    value={contact.contact?.title || ""}
                    onChange={(e) => handleNestedArrayChange("contact", "contact", "title", e.target.value)}
                    className={inputClass}
                    placeholder="Contact Us"
                  />
                </div>
                <div>
                  <label className={labelClass}>Details (One Per Line)</label>
                  <textarea
                    rows={6}
                    value={(contact.contact?.lines || []).join("\n")}
                    onChange={(e) => handleNestedArrayChange("contact", "contact", "lines", e.target.value)}
                    className={textareaClass}
                    placeholder={`+1 (555) 123-4567\nhello@restaurant.com`}
                  />
                </div>
              </div>
            </div>

            {/* Map Embed URL */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Map Section Title</label>
                <input
                  type="text"
                  value={contact.mapTitle || ""}
                  onChange={(e) => handleChange("contact", "mapTitle", e.target.value)}
                  className={inputClass}
                  placeholder="Find Us Here"
                />
              </div>

              <div>
                <label className={labelClass}>Google Map Embed URL</label>
                <input
                  type="text"
                  value={contact.mapEmbedUrl || ""}
                  onChange={(e) => handleChange("contact", "mapEmbedUrl", e.target.value)}
                  className={inputClass}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 7. FOOTER & LEGAL LINKS                    */}
        {/* ========================================== */}
        <div className="border-t border-gray-100 pt-6">
          <SectionHeader
            icon={Globe}
            title="Footer & Legal"
            subtitle="Copyright text preview, legal policy links, and bottom navigation"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Copyright Info Card */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4 space-y-3">
              <h5 className="text-xs font-semibold text-gray-800">Copyright Settings</h5>
              <div>
                <label className={labelClass}>Copyright Name</label>
                <input
                  type="text"
                  value={navigation.fullName || ""}
                  onChange={(e) => handleChange("navigation", "fullName", e.target.value)}
                  className={inputClass}
                  placeholder="Spice Route Indian Restaurant"
                />
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-2.5">
                <p className="text-xs text-gray-600">
                  Preview: © {new Date().getFullYear()} {navigation.fullName || "Your Restaurant"}. All rights reserved.
                </p>
              </div>
            </div>

            {/* Legal Links Card */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-gray-800">Legal & Footer Links</h5>
                {footer?.links && footer.links.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleChange("footer", "links", [])}
                    className="text-[11px] font-medium text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div>
                <label className={labelClass}>Links Format: "Label | /path"</label>
                <textarea
                  rows={4}
                  value={(footer?.links || [])
                    .map((link) => `${link.label} | ${link.href}`)
                    .join("\n")}
                  onChange={(e) => {
                    const links = e.target.value
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line) => {
                        const parts = line.split("|").map((s) => s.trim());
                        return {
                          label: parts[0] || "",
                          href: parts[1] || "#",
                        };
                      });
                    handleChange("footer", "links", links);
                  }}
                  className={textareaClass}
                  placeholder={`Privacy Policy | /privacy\nTerms of Service | /terms\nRefund Policy | /refund`}
                />
              </div>

              {footer?.links && footer.links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {footer.links.map((link, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600"
                    >
                      {link.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;