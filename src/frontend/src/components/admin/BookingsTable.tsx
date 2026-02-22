import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useMemo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BookingsTable() {
  const { data: bookings, isLoading, isError, error } = useBookings();

  const sortedBookings = useMemo(() => {
    if (!bookings) return [];
    return [...bookings].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  }, [bookings]);

  const exportToCSV = () => {
    if (!sortedBookings || sortedBookings.length === 0) return;

    const headers = [
      'ID',
      'Full Name',
      'Mobile Number',
      'Location',
      'Property Type',
      'Service',
      'Date',
      'Time Slot',
      'Area (sq.ft)',
      'Created At',
    ];

    const rows = sortedBookings.map((booking) => [
      booking.id,
      booking.fullName,
      booking.mobileNumber,
      booking.location,
      booking.propertyType,
      booking.service,
      booking.date,
      booking.timeSlot,
      booking.area.toString(),
      new Date(Number(booking.createdAt) / 1000000).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-8">Loading bookings...</div>;
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return (
      <Alert variant="destructive" className="block">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="mt-2">
          <strong>Failed to load bookings.</strong>
          <br />
          {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToCSV} variant="outline" className="gap-2" disabled={!sortedBookings?.length}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBookings && sortedBookings.length > 0 ? (
              sortedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.fullName}</TableCell>
                  <TableCell>{booking.mobileNumber}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>{booking.propertyType}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell>{booking.area.toString()} sq.ft</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(booking.createdAt) / 1000000).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No bookings yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
