import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { useMyBookings } from '../hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogIn, User, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Section from '../components/marketing/Section';

export default function AccountPage() {
  const { identity, login, isLoggingIn, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { data: myBookings, isLoading: bookingsLoading } = useMyBookings();

  const [name, setName] = useState('');
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsSettingUpProfile(true);
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSettingUpProfile(false);
    }
  };

  const handleLogout = async () => {
    await clear();
    toast.success('Logged out successfully');
  };

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
            <CardDescription className="text-base">
              View your bookings and manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full">
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile setup required
  if (showProfileSetup) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription className="text-base">
              Please tell us your name to complete your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSettingUpProfile}
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={isSettingUpProfile || !name.trim()}
              size="lg"
              className="w-full"
            >
              {isSettingUpProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading profile
  if (profileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main account view
  return (
    <Section variant="white" className="py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
            <p className="mt-2 text-muted-foreground">
              Welcome back, {userProfile?.name || 'User'}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>My Bookings</CardTitle>
            </div>
            <CardDescription>View all your consultation bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : myBookings && myBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Area (sq.ft)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.service}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.timeSlot}</TableCell>
                        <TableCell>{booking.location}</TableCell>
                        <TableCell>{booking.area.toString()}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Confirmed
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">You haven't made any bookings yet</p>
                <Button variant="link" className="mt-2" onClick={() => window.location.href = '/'}>
                  Book a consultation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
