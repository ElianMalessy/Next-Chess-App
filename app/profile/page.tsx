import Navbar from '@/components/navbar/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateProfile from './update-profile';
import UpdateAvatarEdit from './update-avatar';

export default function ProfilePage() {
  return (
    <div className='min-h-screen overflow-x-hidden'>
      <Navbar />
      <main className='px-4 py-2 w-full'>
        <div className='container mx-auto max-w-2xl pt-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold mb-2'>Profile</h1>
            <p className='text-muted-foreground'>Manage your account settings</p>
          </div>
          
          <div className='space-y-6 w-full'>
            {/* Avatar Section */}
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className='overflow-hidden'>
                <div className='flex justify-center w-full'>
                  <UpdateAvatarEdit />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings Section */}
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className='overflow-hidden'>
                <UpdateProfile />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
