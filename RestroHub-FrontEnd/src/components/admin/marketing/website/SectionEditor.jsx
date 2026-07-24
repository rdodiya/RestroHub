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

  const navigation = siteData.navigation;

  console.log(siteData);

  const handleChange = (sectionName, field, value) => {
    debugger
    updateSection(sectionName, {
      [field]: value,
    });
  };

  const handleLogoUpload = async (e, sectionName) => {
    debugger
    const file = e.target.files[0];
    if (!file) return;
    const image = await fileToBase64(file);
    updateSection(sectionName, {
      image: image
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
                  src={navigation.logo}
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
            onChange={(e) => handleLogoUpload(e, 'navigation')}
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
      </div>
    </div>


  );
};

export default SectionEditor;