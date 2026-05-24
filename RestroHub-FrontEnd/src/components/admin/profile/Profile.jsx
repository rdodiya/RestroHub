import React, { useState, useEffect } from 'react';

import ProfileHeader from './profileComponents/ProfileHeader';
import ProfileSidebar from './profileComponents/ProfileSidebar';
import PersonalInfoCard from './profileComponents/PersonalInfoCard';
import RestaurantInfoCard from './profileComponents/RestaurantInfoCard';
import SecurityCard from './profileComponents/SecurityCard';
import ProfileImageModal from './profileComponents/ProfileImageModal';

import profileService from '../../../services/user/profileService';

const Profile = () => {

  // tracks which sidebar section is active
  const [activeSection, setActiveSection] = useState('personal');

  // controls profile image modal visibility
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // handles skeleton loading state
  const [loading, setLoading] = useState(true);

  // main profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',

    // keeping some fallback static ui data for now
    role: 'Restaurant Owner',
    location: 'Rajkot, Gujarat',
    joinedDate: 'Jan 2024',

    avatar: null,

    restaurantName: 'Rajkot Dhaba',
    totalOrders: '1,234',
    totalRevenue: '₹4.5L',
    rating: '4.8',
    branches: '3',
  });

  // fetch current authenticated user profile
  useEffect(() => {

    const fetchProfile = async () => {

      try {

        setLoading(true);

        const data =
          await profileService.getCurrentUserProfile();

        // update frontend state with backend response
        setProfile((prev) => ({
          ...prev,

          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',

          avatar: data.pictureUrl || null,
        }));

      } catch (error) {

        console.error(
          'Failed to fetch profile:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

    fetchProfile();

  }, []);

  // handles saving updated personal info
  const handleSaveProfile = async (updatedFields) => {

    try {

      const requestData = {

        name:
          updatedFields.name ||
          profile.name,

        phoneNumber:
          updatedFields.phoneNumber ||
          profile.phoneNumber,
      };

      const updatedData =
        await profileService.updateUserProfile(
          requestData
        );

      // sync updated backend data into ui
      setProfile((prev) => ({
        ...prev,

        name: updatedData.name,

        phoneNumber:
          updatedData.phoneNumber,
      }));

    } catch (error) {

      console.error(
        'Failed to update profile:',
        error
      );
    }
  };

  // renders different cards based on selected sidebar section
  const renderSection = () => {

    switch (activeSection) {

      case 'personal':

        return (
          <PersonalInfoCard
            profile={profile}
            onSave={handleSaveProfile}
          />
        );

      case 'restaurant':

        return (
          <RestaurantInfoCard
            profile={profile}
            onSave={(data) =>
              setProfile({
                ...profile,
                ...data
              })
            }
          />
        );

      case 'security':

        return <SecurityCard />;

      default:

        return (
          <PersonalInfoCard
            profile={profile}
            onSave={handleSaveProfile}
          />
        );
    }
  };

  // show skeleton loader while profile data is loading
  if (loading) {

    return (

      <div className="p-6 animate-pulse space-y-6">

        <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-4 h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

          <div className="lg:col-span-8 space-y-6">

            <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

            <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="space-y-5 sm:space-y-6">

      {/* profile header */}

      <ProfileHeader
        profile={profile}
        onEditAvatar={() =>
          setImageModalOpen(true)
        }
      />

      {/* sidebar + main content layout */}

      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">

        {/* sidebar */}

        <div className="lg:col-span-4 xl:col-span-3">

          <ProfileSidebar
            profile={profile}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* active section content */}

        <div className="lg:col-span-8 xl:col-span-9">

          {renderSection()}
        </div>
      </div>

      {/* profile image modal */}

      <ProfileImageModal
        isOpen={imageModalOpen}
        onClose={() =>
          setImageModalOpen(false)
        }
        currentImage={profile.avatar}
        onSave={(img) =>
          setProfile({
            ...profile,
            avatar: img
          })
        }
      />
    </div>
  );
};

export default Profile;