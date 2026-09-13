import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import ProfileHeader from './profileComponents/ProfileHeader';
import ProfileSidebar from './profileComponents/ProfileSidebar';
import PersonalInfoCard from './profileComponents/PersonalInfoCard';
import RestaurantInfoCard from './profileComponents/RestaurantInfoCard';
import SecurityCard from './profileComponents/SecurityCard';
import ProfileImageModal from './profileComponents/ProfileImageModal';
import ProfileSkeleton from './profileComponents/ProfileSkeleton';

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
        const data = await profileService.getCurrentUserProfile();

        // update frontend state with backend response
        setProfile((prev) => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          role: data.role || 'Restaurant Owner',
          restaurantId: data.restaurantId || null,
          restaurantName: data.restaurantName || prev.restaurantName,
          tagline: data.restaurantDescription || prev.tagline,
          branches: data.branches || prev.branches,
          joinedDate: data.joinedDate || prev.joinedDate,
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || 'male',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          bio: data.bio || '',
          avatar: data.profileImage
            ? data.profileImage.startsWith('data:')
              ? data.profileImage
              : `data:image/jpeg;base64,${data.profileImage}`
            : null,
        }));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to fetch profile');
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
        name: updatedFields.name || profile.name,
        phoneNumber: updatedFields.phoneNumber || profile.phoneNumber,
        dateOfBirth: updatedFields.dateOfBirth,
        gender: updatedFields.gender,
        address: updatedFields.address,
        city: updatedFields.city,
        state: updatedFields.state,
        pincode: updatedFields.pincode,
        bio: updatedFields.bio,
      };

      const updatedData = await profileService.updateUserProfile(requestData);

      // sync updated backend data into ui
      setProfile((prev) => ({
        ...prev,
        ...updatedFields,
        name: updatedData.name || prev.name,
        phoneNumber: updatedData.phoneNumber || prev.phoneNumber,
        dateOfBirth: updatedData.dateOfBirth || updatedFields.dateOfBirth || prev.dateOfBirth,
        gender: updatedData.gender || updatedFields.gender || prev.gender,
        address: updatedData.address || updatedFields.address || prev.address,
        city: updatedData.city || updatedFields.city || prev.city,
        state: updatedData.state || updatedFields.state || prev.state,
        pincode: updatedData.pincode || updatedFields.pincode || prev.pincode,
        bio: updatedData.bio || updatedFields.bio || prev.bio,
        avatar: updatedData.profileImage
          ? updatedData.profileImage.startsWith('data:')
            ? updatedData.profileImage
            : `data:image/jpeg;base64,${updatedData.profileImage}`
          : prev.avatar,
      }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
      throw error;
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
    return <ProfileSkeleton />;
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