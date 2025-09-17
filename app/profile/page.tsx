import Navbar from '@/components/navbar/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UpdateProfile from './update-profile';
import UpdateAvatarEdit from './update-avatar';

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='container mx-auto max-w-4xl pt-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold mb-2'>Profile</h1>
            <p className='text-muted-foreground'>Manage your account settings</p>
          </div>
          
          <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-1'>
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex justify-center'>
                  <UpdateAvatarEdit />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateProfile />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
