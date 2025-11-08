import React from 'react';
import Avatar from '@/components/ui/Avatar';
import { Star } from 'lucide-react';

interface Rating {
  id: number;
  rating: number;
  comment: string;
  customer_name: string;
  customer_avatar: string | null;
  rated_at: string;
}

interface RatingsListProps {
  ratings: Rating[];
}

export default function RatingsList({ ratings }: RatingsListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Đánh giá gần đây</h3>
      <div className="space-y-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar src={rating.customer_avatar} alt={rating.customer_name} size={40} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{rating.customer_name}</span>
                <span className="text-sm text-gray-500">{rating.rated_at}</span>
              </div>
              <div className="flex items-center gap-1 my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill={i < rating.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">{rating.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}