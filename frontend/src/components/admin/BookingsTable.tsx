import React, { useState } from 'react';
import { useGetAllBookings } from '../../hooks/useBookings';
import { Booking } from '../../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, ArrowUpDown } from 'lucide-react';

type SortField = 'createdAt' | 'fullName' | 'date' | 'service';
type SortDir = 'asc' | 'desc';

function formatDate(isoStr: string) {
  try {
    return new Date(isoStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoStr;
  }
}

function formatTimestamp(ns: bigint) {
  try {
    const ms = Number(ns / BigInt(1_000_000));
    return new Date(ms).toLocaleString('en-IN');
  } catch {
    return String(ns);
  }
}

export default function BookingsTable() {
  const { data: bookings = [], isLoading, error, refetch, isFetching } = useGetAllBookings();
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...bookings].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'createdAt') {
      cmp = Number(a.createdAt - b.createdAt);
    } else if (sortField === 'fullName') {
      cmp = a.fullName.localeCompare(b.fullName);
    } else if (sortField === 'date') {
      cmp = a.date.localeCompare(b.date);
    } else if (sortField === 'service') {
      cmp = a.service.localeCompare(b.service);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Mobile', 'Location', 'Property', 'Service', 'Date', 'Time Slot', 'Created At'];
    const rows = sorted.map((b: Booking) => [
      b.id,
      b.fullName,
      b.mobileNumber,
      b.location,
      b.propertyType,
      b.service,
      b.date,
      b.timeSlot,
      formatTimestamp(b.createdAt),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-gray-900 font-medium"
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading…' : `${bookings.length} total booking${bookings.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            disabled={bookings.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 text-red-600 text-sm bg-red-50 border-b border-red-100">
          Failed to load bookings: {String(error)}
        </div>
      )}

      {isLoading ? (
        <div className="px-6 py-12 text-center text-gray-400">Loading bookings…</div>
      ) : sorted.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-400">No bookings yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead><SortButton field="fullName" label="Name" /></TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Property</TableHead>
                <TableHead><SortButton field="service" label="Service" /></TableHead>
                <TableHead><SortButton field="date" label="Date" /></TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead><SortButton field="createdAt" label="Booked At" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((booking: Booking, idx: number) => (
                <TableRow key={booking.id}>
                  <TableCell className="text-gray-400 text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{booking.fullName}</TableCell>
                  <TableCell>{booking.mobileNumber}</TableCell>
                  <TableCell>{booking.location}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{booking.propertyType}</Badge>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell className="text-xs text-gray-500">{formatTimestamp(booking.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
