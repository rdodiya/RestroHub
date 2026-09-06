import { useState } from 'react';
import {
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Loader2,
  Check,
} from 'lucide-react';

const ProfileHeader = ({ profile, onEditAvatar }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Cover Image */}
      <div className="relative h-32 sm:h-40 lg:h-48">
        <div
          className="
            h-full w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400
          "
        />
      </div>

      {/* Profile Info Bar */}
      <div className="relative px-4 pb-5 pt-0 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">
          {/* Avatar */}
          <div className="relative -mt-12 sm:-mt-14 lg:-mt-16">
            <div
              className="
                h-24 w-24 overflow-hidden rounded-2xl border-4 border-white
                bg-gray-100 shadow-lg
                sm:h-28 sm:w-28 lg:h-32 lg:w-32
              "
            >
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-50">
                  <span className="text-3xl font-bold text-blue-600 sm:text-4xl">
                    {profile.name?.charAt(0) || 'A'}
                  </span>
                </div>
              )}
            </div>

            {/* Camera Button */}
            <button
              onClick={onEditAvatar}
              className="
                absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center
                rounded-lg border-2 border-white bg-blue-600 text-white
                shadow-sm hover:bg-blue-700 transition-colors
                sm:h-9 sm:w-9
              "
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Name + Meta */}
          <div className="mt-3 text-center sm:mt-0 sm:flex-1 sm:pb-1 sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {profile.name || 'Admin User'}
            </h2>
            <p className="text-sm text-gray-500">
              {profile.role || 'Restaurant Owner'}
            </p>

            {/* Quick Info Tags */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {(profile.location || profile.city) && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {profile.location || `${profile.city}${profile.state ? ', ' + profile.state : ''}`}
                </span>
              )}
              {profile.email && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="h-3 w-3" />
                  {profile.email}
                </span>
              )}
              {profile.joinedDate && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Joined {profile.joinedDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;