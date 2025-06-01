import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GalleryHeartButtonProps {
  galleryItemId: number;
  initialLikesCount?: number;
}

export default function GalleryHeartButton({ galleryItemId, initialLikesCount = 0 }: GalleryHeartButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user has liked this item
  const { data: likeStatus } = useQuery({
    queryKey: ['gallery-like-status', galleryItemId],
    queryFn: async () => {
      const response = await fetch(`/api/gallery/${galleryItemId}/liked`);
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const isLiked = likeStatus?.isLiked || false;

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/gallery/${galleryItemId}/like`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to like gallery item');
      }
      return response.json();
    },
    onSuccess: () => {
      setLikesCount(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: ['gallery-like-status', galleryItemId] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Liked!",
        description: "You liked this gallery item",
        className: "bg-green-50 border-green-200",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to like gallery item",
        variant: "destructive",
      });
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/gallery/${galleryItemId}/like`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to unlike gallery item');
      }
      return response.json();
    },
    onSuccess: () => {
      setLikesCount(prev => Math.max(0, prev - 1));
      queryClient.invalidateQueries({ queryKey: ['gallery-like-status', galleryItemId] });
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: "Unliked",
        description: "You removed your like from this gallery item",
        className: "bg-blue-50 border-blue-200",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unlike gallery item",
        variant: "destructive",
      });
    },
  });

  const handleHeartClick = () => {
    if (likeMutation.isPending || unlikeMutation.isPending) return;

    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHeartClick}
        disabled={likeMutation.isPending || unlikeMutation.isPending}
        className={`p-1 h-auto transition-all duration-200 hover:scale-110 ${
          isLiked 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-400'
        }`}
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-200 ${
            isLiked ? 'fill-current' : ''
          }`}
        />
      </Button>
      
      <span className="text-sm text-gray-600 font-medium">
        {likesCount}
      </span>
    </div>
  );
}