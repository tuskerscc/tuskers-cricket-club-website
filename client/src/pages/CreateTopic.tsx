import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { ForumCategory } from '@shared/schema';

export default function CreateTopic() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  const createTopicMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; categoryId: number }) => {
      return await apiRequest('/api/forum/topics', 'POST', data);
    },
    onSuccess: (topic: any) => {
      toast({
        title: "Success",
        description: "Your topic has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/forum/topics/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forum/stats'] });
      setLocation('/forum');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    createTopicMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      categoryId: parseInt(categoryId),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation('/forum')}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </button>
          <h1 className="text-4xl font-bold text-amber-400 mb-2">CREATE NEW TOPIC</h1>
          <p className="text-blue-100">Start a new discussion in the TUSKERS CRICKET CLUB community</p>
        </div>

        {/* Create Topic Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-300/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-amber-400 font-semibold mb-2">
                Category *
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full bg-white/10 border-blue-300/30 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic Title */}
            <div>
              <label className="block text-amber-400 font-semibold mb-2">
                Topic Title *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your topic title..."
                className="w-full bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200"
                maxLength={200}
              />
            </div>

            {/* Topic Content */}
            <div>
              <label className="block text-amber-400 font-semibold mb-2">
                Content *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your topic content here..."
                className="w-full h-64 bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200 resize-none"
                maxLength={5000}
              />
              <div className="text-right text-sm text-blue-200 mt-1">
                {content.length}/5000 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/forum')}
                className="border-blue-300/50 text-blue-100 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTopicMutation.isPending || !title.trim() || !content.trim() || !categoryId}
                className="bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold flex items-center gap-2"
              >
                {createTopicMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Topic
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-white/5 rounded-xl p-6">
          <h3 className="text-amber-400 font-semibold mb-3">Community Guidelines</h3>
          <ul className="text-blue-100 text-sm space-y-2">
            <li>• Keep discussions respectful and cricket-related</li>
            <li>• Use clear, descriptive titles for your topics</li>
            <li>• Search existing topics before creating new ones</li>
            <li>• Follow the TUSKERS CRICKET CLUB community standards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}