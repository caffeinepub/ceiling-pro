import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Section from './Section';

const REVIEWS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Mumbai',
    rating: 5,
    text: 'Excellent work! The team was professional and completed the POP ceiling installation on time. Very satisfied with the quality.',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    text: 'Great service and affordable pricing. The PVC ceiling looks amazing and the installation was clean and hassle-free.',
  },
  {
    id: 3,
    name: 'Amit Patel',
    location: 'Bangalore',
    rating: 5,
    text: 'Highly recommend Ceiling Pro! They transformed our office with beautiful wall molding. The team was skilled and punctual.',
  },
];

export default function ReviewsSection() {
  return (
    <Section variant="white">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Customer Reviews</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Hear what our satisfied customers have to say
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((review) => (
          <Card key={review.id} className="shadow-sm">
            <CardContent className="pt-6">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{review.text}</p>
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
