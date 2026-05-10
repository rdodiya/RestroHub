import { useState } from 'react';
import ProfileHeader from './profileComponents/ProfileHeader';
import ProfileSidebar from './profileComponents/ProfileSidebar';
import PersonalInfoCard from './profileComponents/PersonalInfoCard';
import RestaurantInfoCard from './profileComponents/RestaurantInfoCard';
import SecurityCard from './profileComponents/SecurityCard';
import ProfileImageModal from './profileComponents/ProfileImageModal';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Kashyap Rathod',
    firstName: 'Kashyap',
    lastName: 'Rathod',
    email: 'kashyap@restrohub.com',
    phone: '9876543210',
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

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoCard profile={profile} onSave={(data) => setProfile({ ...profile, ...data })} />;
      case 'restaurant':
        return <RestaurantInfoCard profile={profile} onSave={(data) => setProfile({ ...profile, ...data })} />;
      case 'security':
        return <SecurityCard />;
      default:
        return <PersonalInfoCard profile={profile} onSave={(data) => setProfile({ ...profile, ...data })} />;
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Profile Header with Cover */}
      <ProfileHeader
        profile={profile}
        onEditAvatar={() => setImageModalOpen(true)}
      />

      {/* Content: Sidebar + Cards */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <ProfileSidebar
            profile={profile}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 xl:col-span-9">
          {renderSection()}
        </div>
      </div>

      {/* Image Modal */}
      <ProfileImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        currentImage={profile.avatar}
        onSave={(img) => setProfile({ ...profile, avatar: img })}
      />
    </div>
  );
};

export default Profile;