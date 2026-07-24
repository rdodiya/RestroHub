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

  const { navigation, about, hero } = siteData;

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







      </div>
    </div>




  );
};

export default SectionEditor;