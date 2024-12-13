import { LogoutButton } from '@/components/logout-button';
import UpdateProfileForm from '@/components/update-profile-form';
import { getCurrentUser } from '@/actions/auth/controller';
import { createServerActionHandler } from '@/lib/safe-action';
import ProfileImage from './profile-image-select';
import { NotificationsButton } from '@/components/notifications-button';

const getUser = createServerActionHandler(getCurrentUser);

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="flex flex-col overflow-y-auto pb-4 h-full gap-4">
      <div className="text-center sm:text-start">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Your profile information and settings.
        </p>
      </div>

      <ProfileImage
        initials={user.name
          .split(' ')
          .map((name) => name[0])
          .join('')}
        image={user?.image}
      />
      <UpdateProfileForm user={user} />

      <div>
        <h3 className="text-2xl mb-4 font-semibold">Notifications</h3>
        <NotificationsButton />
      </div>

      <LogoutButton
        variant={'outline'}
        className="w-full mt-auto sm:w-auto sm:ml-auto"
      />
    </div>
  );
}
