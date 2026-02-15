import Section from '../components/marketing/Section';
import BookingsTable from '../components/admin/BookingsTable';
import ServiceRatesEditor from '../components/admin/ServiceRatesEditor';
import TimeSlotsEditor from '../components/admin/TimeSlotsEditor';
import ImagesEditor from '../components/admin/ImagesEditor';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Section variant="white" className="py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage bookings, service rates, time slots, and website images</p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Website Images</h2>
              <ImagesEditor />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Service Rates</h2>
              <ServiceRatesEditor />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">Time Slot Availability</h2>
              <TimeSlotsEditor />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">All Bookings</h2>
              <BookingsTable />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
