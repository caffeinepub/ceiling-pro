import React from 'react';
import ImagesEditor from '../components/admin/ImagesEditor';
import ServiceRatesEditor from '../components/admin/ServiceRatesEditor';
import TimeSlotsEditor from '../components/admin/TimeSlotsEditor';
import BookingsTable from '../components/admin/BookingsTable';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">CeilingPro — Site Management</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <section>
          <ImagesEditor />
        </section>

        <section>
          <ServiceRatesEditor />
        </section>

        <section>
          <TimeSlotsEditor />
        </section>

        <section>
          <BookingsTable />
        </section>
      </main>
    </div>
  );
}
