import React, { useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { useSiteData } from "@context/SiteContext";
import { section } from "framer-motion/client";

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve({
        fileName: file.name,
        contentType: file.type,
        base64
      });
    };
    reader.onerror = reject;
  });

const SectionEditor = () => {
  const { siteData, updateSection } = useSiteData();
  const fileInputRef = useRef(null);

  if (!siteData) return null;
  debugger
  const { navigation, about, hero, gallery, reservations, contact, social, footer } = siteData;

  console.log(siteData);

  const handleChange = (sectionName, field, value) => {
    debugger
    updateSection(sectionName, {
      [field]: value,
    });
  };

  const handleLogoUpload = async (e, sectionName, field) => {
    debugger
    const file = e.target.files[0];
    if (!file) return;
    const image = await fileToBase64(file);
    updateSection(sectionName, {
      [field]: image
    });
  };

  const getImageSrc = (image) => {
    if (!image) return "";
    if (typeof image === "string") {
      return image;
    }
    if (image.base64) {
      return `data:${image.contentType};base64,${image.base64}`;
    }
    return "";
  };

  const handleNestedArrayChange = (section, object, field, value) => {
    updateSection(section, {
      [object]: {
        ...siteData[section]?.[object],
        [field]: value
          .split("\n")
          .map(item => item.trim())
          .filter(Boolean)
      }
    });
  };

  const styles = {
    input: {
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      fontSize: "14px",
      background: "#ffffff",
      color: "#111827",
      outline: "none",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "10px",
      fontSize: "14px",
      background: "#ffffff",
      color: "#111827",
      resize: "vertical",
      outline: "none",
      boxSizing: "border-box",
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Brand Settings
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize your restaurant branding.
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Side */}
        <div className="space-y-5">
          {/* Restaurant Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Restaurant Name
            </label>

            <input
              style={styles.input}
              type="text"
              value={navigation.name || ""}
              onChange={(e) => handleChange("navigation", "name", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Spice Route"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Restaurant Name
            </label>

            <input
              style={styles.input}
              type="text"
              value={navigation.fullName || ""}
              onChange={(e) => handleChange("navigation", "fullName", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Spice Route Indian Restaurant"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tagline
            </label>

            <input
              style={styles.input}
              type="text"
              value={navigation.tagline || ""}
              onChange={(e) => handleChange("navigation", "tagline", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Authentic Indian Cuisine"
            />
          </div>

          {/* Established */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Established
            </label>

            <input
              style={styles.input}
              type="text"
              value={navigation.established || ""}
              onChange={(e) => handleChange("navigation", "established", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Est. 2018"
            />
          </div>
        </div>

        {/* Right Side */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Restaurant Logo
          </label>

          <div
            onClick={() => fileInputRef.current.click()}
            className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500 hover:bg-blue-50"
          >
            {navigation.logo ? (
              <>
                <img
                  src={getImageSrc(navigation.logo)}
                  alt="Restaurant Logo"
                  className="mb-5 h-36 w-36 rounded-xl border bg-white object-contain p-3 shadow"
                />

                <p className="text-sm text-gray-500">
                  Click to change logo
                </p>
              </>
            ) : (
              <>
                <div className="mb-5 rounded-full bg-blue-100 p-5">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>

                <p className="text-base font-semibold text-gray-800">
                  Upload Restaurant Logo
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG or SVG
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleLogoUpload(e, 'navigation', 'logo')}
          />

          {navigation.logo && (
            <button
              type="button"
              onClick={() => handleChange("navigation", "logo", "")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={16} />
              Remove Logo
            </button>
          )}
        </div>

        {/* ================= Subtitle ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Subtitle
          </label>

          <input
            style={styles.input}
            type="text"
            value={about.subtitle || ""}
            onChange={(e) =>
              handleChange("about", "subtitle", e.target.value)
            }
            placeholder="Our Story"
          />
        </div>

        {/* ================= Title Line 1 ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Title Line 1
          </label>

          <input
            style={styles.input}
            type="text"
            value={about.title?.[0] || ""}
            onChange={(e) => {
              const title = [...about.title];
              title[0] = e.target.value;
              handleChange("about", "title", title);
            }}
            placeholder="Authentic"
          />
        </div>

        {/* ================= Title Line 2 ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Title Line 2
          </label>

          <input
            style={styles.input}
            type="text"
            value={about.title?.[1] || ""}
            onChange={(e) => {
              const title = [...about.title];
              title[1] = e.target.value;
              handleChange("about", "title", title);
            }}
            placeholder="Indian Cuisine"
          />
        </div>

        {/* ================= Description 1 ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description 1
          </label>

          <textarea
            style={styles.textarea}
            rows={4}
            value={about.description?.[0] || ""}
            onChange={(e) => {
              const description = [...about.description];
              description[0] = e.target.value;
              handleChange("about", "description", description);
            }}
          />
        </div>

        {/* ================= Description 2 ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description 2
          </label>

          <textarea
            style={styles.textarea}
            rows={4}
            value={about.description?.[1] || ""}
            onChange={(e) => {
              const description = [...about.description];
              description[1] = e.target.value;
              handleChange("about", "description", description);
            }}
          />
        </div>

        {/* ================= Hours Title ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hours Title
          </label>

          <input
            style={styles.input}
            type="text"
            value={about.hours?.title || ""}
            onChange={(e) =>
              handleChange("about", "hours", {
                ...about.hours,
                title: e.target.value,
              })
            }
            placeholder="Opening Hours"
          />
        </div>

        {/* ================= Hours Time ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hours Time
          </label>

          <input
            style={styles.input}
            type="text"
            value={about.hours?.time || ""}
            onChange={(e) =>
              handleChange("about", "hours", {
                ...about.hours,
                time: e.target.value,
              })
            }
            placeholder="11:00 AM - 11:00 PM"
          />
        </div>

        {/* ================= Statistics ================= */}

        <h3 className="text-lg font-semibold text-gray-900 mt-6">
          Statistics
        </h3>

        {/* Stat 1 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            style={styles.input}
            placeholder="25+"
            value={about.stats?.[0]?.value || ""}
            onChange={(e) => {
              const stats = [...about.stats];
              stats[0] = {
                ...stats[0],
                value: e.target.value,
              };
              handleChange("about", "stats", stats);
            }}
          />

          <input
            style={styles.input}
            placeholder="Expert Chefs"
            value={about.stats?.[0]?.label || ""}
            onChange={(e) => {
              const stats = [...about.stats];
              stats[0] = {
                ...stats[0],
                label: e.target.value,
              };
              handleChange("about", "stats", stats);
            }}
          />
        </div>

        {/* Stat 2 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            style={styles.input}
            placeholder="10K+"
            value={about.stats?.[1]?.value || ""}
            onChange={(e) => {
              const stats = [...about.stats];
              stats[1] = {
                ...stats[1],
                value: e.target.value,
              };
              handleChange("about", "stats", stats);
            }}
          />

          <input
            style={styles.input}
            placeholder="Happy Customers"
            value={about.stats?.[1]?.label || ""}
            onChange={(e) => {
              const stats = [...about.stats];
              stats[1] = {
                ...stats[1],
                label: e.target.value,
              };
              handleChange("about", "stats", stats);
            }}
          />
        </div>

        {/* Stat 3 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            style={styles.input}
            placeholder="100+"
            value={about.stats?.[2]?.value || ""}
            onChange={(e) => {
              const stats = [...about.stats];
              stats[2] = {
                ...stats[2],
                value: e.target.value,
              };
              handleChange("about", "stats", stats);
            }}
          />

          <input
            style={styles.input}
            placeholder="Signature Dishes"
            value={about.stats?.[2]?.label || ""}
            onChange={(e) => {
              const stats = [...about.stats];
              stats[2] = {
                ...stats[2],
                label: e.target.value,
              };
              handleChange("about", "stats", stats);
            }}
          />
        </div>

        {/* ================= About Image ================= */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            About Image
          </label>

          <div
            onClick={() => fileInputRef.current.click()}
            className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500 hover:bg-blue-50"
          >
            {about.image ? (
              <>
                <img
                  src={getImageSrc(about.image)}
                  alt="About"
                  className="mb-5 h-48 w-full rounded-xl border bg-white object-cover p-2 shadow"
                />

                <p className="text-sm text-gray-500">
                  Click to change image
                </p>
              </>
            ) : (
              <>
                <div className="mb-5 rounded-full bg-blue-100 p-5">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>

                <p className="text-base font-semibold text-gray-800">
                  Upload About Image
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG or WEBP
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoUpload(e, "about", "image")}
          />

          {about.image && (
            <button
              type="button"
              onClick={() => handleChange("about", "image", "")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={16} />
              Remove Image
            </button>
          )}
        </div>

        {/* ================= Hero Title Line 1 ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hero Title Line 1
          </label>

          <input
            style={styles.input}
            type="text"
            value={hero.title?.[0] || ""}
            onChange={(e) => {
              const title = [...hero.title];
              title[0] = e.target.value;
              handleChange("hero", "title", title);
            }}
            placeholder="Taste The"
          />
        </div>

        {/* ================= Hero Title Line 2 ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hero Title Line 2
          </label>

          <input
            style={styles.input}
            type="text"
            value={hero.title?.[1] || ""}
            onChange={(e) => {
              const title = [...hero.title];
              title[1] = e.target.value;
              handleChange("hero", "title", title);
            }}
            placeholder="Difference"
          />
        </div>

        {/* ================= Primary Button Label ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Primary Button Text
          </label>

          <input
            style={styles.input}
            type="text"
            value={hero.ctaPrimary?.label || ""}
            onChange={(e) =>
              handleChange("hero", "ctaPrimary", {
                ...hero.ctaPrimary,
                label: e.target.value,
              })
            }
            placeholder="View Menu"
          />
        </div>

        {/* ================= Secondary Button Label ================= */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Secondary Button Text
          </label>

          <input
            style={styles.input}
            type="text"
            value={hero.ctaSecondary?.label || ""}
            onChange={(e) =>
              handleChange("hero", "ctaSecondary", {
                ...hero.ctaSecondary,
                label: e.target.value,
              })
            }
            placeholder="Book Table"
          />
        </div>

        {/* ================= Hero Background Image ================= */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hero Background Image
          </label>

          <div
            onClick={() => fileInputRef.current.click()}
            className="flex h-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500 hover:bg-blue-50"
          >
            {hero.backgroundImage ? (
              <>
                <img
                  src={getImageSrc(hero.backgroundImage)}
                  alt="Hero Background"
                  className="mb-5 h-48 w-full rounded-xl border bg-white object-cover p-2 shadow"
                />

                <p className="text-sm text-gray-500">
                  Click to change background image
                </p>
              </>
            ) : (
              <>
                <div className="mb-5 rounded-full bg-blue-100 p-5">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>

                <p className="text-base font-semibold text-gray-800">
                  Upload Hero Background
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG or WEBP
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleLogoUpload(e, "hero", "backgroundImage")
            }
          />

          {hero.backgroundImage && (
            <button
              type="button"
              onClick={() =>
                handleChange("hero", "backgroundImage", "")
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={16} />
              Remove Background
            </button>
          )}
        </div>

        {/* Galary Section */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Subtitle
          </label>

          <input
            style={styles.input}
            type="text"
            value={gallery.subtitle || ""}
            onChange={(e) =>
              handleChange("gallery", "subtitle", e.target.value)
            }
            placeholder="Gallery"
          />
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            style={styles.input}
            type="text"
            value={gallery.title || ""}
            onChange={(e) =>
              handleChange("gallery", "title", e.target.value)
            }
            placeholder="Restaurant Moments"
          />
        </div>

        <div className="space-y-6">
          {gallery.images.map((image, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Side */}
                <div className="space-y-4">

                  {/* Alt */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Alt Text
                    </label>

                    <input
                      style={styles.input}
                      type="text"
                      value={image.alt}
                      onChange={(e) => {
                        const images = [...gallery.images];
                        images[index].alt = e.target.value;
                        handleChange("gallery", "images", images);
                      }}
                    />
                  </div>

                  {/* Span */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Grid Size
                    </label>

                    <select
                      style={styles.input}
                      value={image.span}
                      onChange={(e) => {
                        const images = [...gallery.images];
                        images[index].span = e.target.value;
                        handleChange("gallery", "images", images);
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                      <option value="wide">Wide</option>
                    </select>
                  </div>
                </div>

                {/* Right Side */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gallery Image
                  </label>

                  <div
                    onClick={() =>
                      document.getElementById(`gallery-${index}`).click()
                    }
                    className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    {image.src ? (
                      <>
                        <img
                          src={getImageSrc(image.src)}
                          alt=""
                          className="mb-4 h-32 w-32 rounded-xl border bg-white object-cover p-1 shadow"
                        />

                        <p className="text-sm text-gray-500">
                          Click to change image
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="mb-5 rounded-full bg-blue-100 p-5">
                          <Upload className="h-8 w-8 text-blue-600" />
                        </div>

                        <p className="font-semibold text-gray-800">
                          Upload Image
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          PNG, JPG or WEBP
                        </p>
                      </>
                    )}
                  </div>

                  <input
                    id={`gallery-${index}`}
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const base64 = await fileToBase64(file);

                      const images = [...gallery.images];
                      images[index].src = base64;

                      handleChange("gallery", "images", images);
                    }}
                  />

                  {image.src && (
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                      onClick={() => {
                        const images = [...gallery.images];
                        images[index].src = "";

                        handleChange("gallery", "images", images);
                      }}
                    >
                      <Trash2 size={16} />
                      Remove Image
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Background Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Background Image
          </label>

          <div
            onClick={() => document.getElementById("reservation-bg").click()}
            className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-blue-500 hover:bg-blue-50"
          >
            {reservations.backgroundImage ? (
              <>
                <img
                  src={getImageSrc(reservations.backgroundImage)}
                  alt=""
                  className="mb-4 h-40 w-full rounded-xl object-cover shadow"
                />

                <p className="text-sm text-gray-500">
                  Click to change image
                </p>
              </>
            ) : (
              <>
                <div className="mb-5 rounded-full bg-blue-100 p-5">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>

                <p className="font-semibold text-gray-800">
                  Upload Background
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG or WEBP
                </p>
              </>
            )}
          </div>

          <input
            id="reservation-bg"
            hidden
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const image = await fileToBase64(file);

              handleChange(
                "reservations",
                "backgroundImage",
                image
              );
            }}
          />

          {reservations.backgroundImage && (
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              onClick={() =>
                handleChange(
                  "reservations",
                  "backgroundImage",
                  ""
                )
              }
            >
              <Trash2 size={16} />
              Remove Image
            </button>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Subtitle
          </label>

          <input
            style={styles.input}
            type="text"
            value={reservations.subtitle || ""}
            onChange={(e) =>
              handleChange(
                "reservations",
                "subtitle",
                e.target.value
              )
            }
            placeholder="Reservations"
          />
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            style={styles.input}
            type="text"
            value={reservations.title || ""}
            onChange={(e) =>
              handleChange(
                "reservations",
                "title",
                e.target.value
              )
            }
            placeholder="Reserve Your Table"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            style={styles.textarea}
            rows={4}
            value={reservations.description || ""}
            onChange={(e) =>
              handleChange(
                "reservations",
                "description",
                e.target.value
              )
            }
            placeholder="Reservation description..."
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Time Slots
          </label>

          <div className="space-y-2">
            {reservations.timeSlots.map((slot, index) => (
              <input
                key={index}
                style={styles.input}
                type="text"
                value={slot}
                onChange={(e) => {
                  const slots = [...reservations.timeSlots];
                  slots[index] = e.target.value;

                  handleChange(
                    "reservations",
                    "timeSlots",
                    slots
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* Guest Options */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Guest Options
          </label>

          <div className="space-y-2">
            {reservations.guestOptions.map((guest, index) => (
              <input
                key={index}
                style={styles.input}
                type="text"
                value={guest}
                onChange={(e) => {
                  const guests = [...reservations.guestOptions];
                  guests[index] = e.target.value;

                  handleChange(
                    "reservations",
                    "guestOptions",
                    guests
                  );
                }}
              />
            ))}
          </div>
        </div>

        {/* ================= CONTACT SECTION ================= */}

        <div className="space-y-6">

          {/* Section Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Section Title
            </label>

            <input
              style={styles.input}
              type="text"
              value={contact.sectionTitle || ""}
              onChange={(e) =>
                handleChange("contact", "sectionTitle", e.target.value)
              }
              placeholder="Get in Touch"
            />
          </div>

          {/* Section Subtitle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Section Subtitle
            </label>

            <textarea
              style={styles.textarea}
              rows={3}
              value={contact.sectionSubtitle || ""}
              onChange={(e) =>
                handleChange("contact", "sectionSubtitle", e.target.value)
              }
              placeholder="We'd love to hear from you. Visit us or reach out anytime."
            />
          </div>

          {/* Location Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location Title
            </label>

            <input
              style={styles.input}
              type="text"
              value={contact.location?.title || ""}
              onChange={(e) =>
                handleNestedArrayChange("contact", "location", "title", e.target.value)
              }
              placeholder="Our Location"
            />
          </div>

          {/* Location Lines */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location Details (One Per Line)
            </label>

            <textarea
              style={styles.textarea}
              rows={4}
              value={(contact.location?.lines || []).join("\n")}
              onChange={(e) =>
                handleNestedArrayChange(
                  "contact",
                  "location",
                  "lines",
                  e.target.value
                )
              }
              placeholder={`123 Main Street\nNew York, NY 10001`}
            />
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Google Maps Link
            </label>

            <input
              style={styles.input}
              type="text"
              value={contact.location?.mapUrl || ""}
              onChange={(e) =>
                handleNestedArrayChange("contact", "location", "mapUrl", e.target.value)
              }
              placeholder="https://maps.google.com/..."
            />
          </div>

          {/* Google Map Embed */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Google Map Embed URL
            </label>

            <textarea
              style={styles.textarea}
              rows={3}
              value={contact.mapEmbedUrl || ""}
              onChange={(e) =>
                handleChange("contact", "mapEmbedUrl", e.target.value)
              }
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          {/* Hours Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hours Title
            </label>

            <input
              style={styles.input}
              type="text"
              value={contact.hours?.title || ""}
              onChange={(e) =>
                handleNestedArrayChange("contact", "hours", "title", e.target.value)
              }
              placeholder="Opening Hours"
            />
          </div>

          {/* Hours Lines */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Opening Hours (One Per Line)
            </label>

            <textarea
              style={styles.textarea}
              rows={5}
              value={(contact.hours?.lines || []).join("\n")}
              onChange={(e) =>
                handleNestedArrayChange(
                  "contact",
                  "hours",
                  "lines",
                  e.target.value
                )
              }
              placeholder={`Monday - Friday : 10 AM - 10 PM\nSaturday : 9 AM - 11 PM`}
            />
          </div>

          {/* Contact Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contact Title
            </label>

            <input
              style={styles.input}
              type="text"
              value={contact.contact?.title || ""}
              onChange={(e) =>
                handleNestedArrayChange("contact", "contact", "title", e.target.value)
              }
              placeholder="Contact Us"
            />
          </div>

          {/* Contact Lines */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Contact Details (One Per Line)
            </label>

            <textarea
              style={styles.textarea}
              rows={4}
              value={(contact.contact?.lines || []).join("\n")}
              onChange={(e) =>
                handleNestedArrayChange(
                  "contact",
                  "contact",
                  "lines",
                  e.target.value
                )
              }
              placeholder={`+1 (555) 123-4567\nhello@restaurant.com`}
            />
          </div>

          {/* Map Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Map Section Title
            </label>

            <input
              style={styles.input}
              type="text"
              value={contact.mapTitle || ""}
              onChange={(e) =>
                handleChange("contact", "mapTitle", e.target.value)
              }
              placeholder="Find Us Here"
            />
          </div>

        </div>

        {/* ================= FOOTER SECTION ================= */}

        <div className="space-y-8">

          {/* Copyright & Legal Links */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">©</span>
              Footer Bottom
            </h3>

            <div className="space-y-6">

              {/* Copyright Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Copyright Information</h4>

                <div className="space-y-3">
                  {/* Restaurant Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Restaurant Full Name
                      <span className="text-xs text-gray-500 ml-2">(Used in copyright)</span>
                    </label>
                    <input
                      style={styles.input}
                      type="text"
                      value={navigation.fullName || ""}
                      onChange={(e) =>
                        handleChange("navigation", "fullName", e.target.value)
                      }
                      placeholder="Spice Route Indian Restaurant"
                    />
                  </div>

                  {/* Copyright Preview */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Copyright Preview
                    </label>
                    <div className="p-3 bg-white rounded-lg border border-gray-300">
                      <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} {navigation.fullName || "Your Restaurant Name"}. All rights reserved.
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ℹ️ Year updates automatically
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Links Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Legal Links</h4>

                <div className="space-y-3">
                  {/* Legal Links Input */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Footer Legal Links
                      <span className="text-xs text-gray-500 ml-2">(Optional - One per line)</span>
                    </label>
                    <textarea
                      style={styles.textarea}
                      rows={4}
                      value={(footer?.links || []).map(link =>
                        `${link.label} | ${link.href}`
                      ).join("\n")}
                      onChange={(e) => {
                        const links = e.target.value
                          .split("\n")
                          .filter(line => line.trim())
                          .map(line => {
                            const parts = line.split("|").map(s => s.trim());
                            return {
                              label: parts[0] || "",
                              href: parts[1] || "#"
                            };
                          });

                        handleChange("footer", "links", links);
                      }}
                      placeholder="Privacy Policy | /privacy&#10;Terms of Service | /terms&#10;Cookie Policy | /cookies&#10;Sitemap | /sitemap"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Format: "Link Name | /url-path" (separate label and URL with |)
                    </p>
                  </div>

                  {/* Links Preview */}
                  {footer?.links && footer.links.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Preview
                      </label>
                      <div className="p-3 bg-white rounded-lg border border-gray-300">
                        <div className="flex flex-wrap gap-3">
                          {footer.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.href}
                              className="text-sm text-gray-600 hover:text-purple-600 underline"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clear Links Button */}
                  {footer?.links && footer.links.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleChange("footer", "links", [])}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      Clear All Links
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
          {/* 
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-xl border-2 border-cyan-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Footer Bottom Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Copyright text uses Restaurant Full Name from Navigation settings</li>
                    <li>• Year in copyright updates automatically</li>
                    <li>• Legal links are optional - leave blank if not needed</li>
                    <li>• Common links: Privacy Policy, Terms, Cookie Policy, Sitemap</li>
                    <li>• Use relative URLs (/privacy) or full URLs (https://...)</li>
                  </ul>
                </div>
              </div>
            </div> */}

        </div>
      </div>
    </div>

  );
};

export default SectionEditor;