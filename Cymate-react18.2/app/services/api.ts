import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (same way as in the existing auth system)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log('✅ API Request: Token included in headers for', config.method?.toUpperCase(), config.url);
      console.log('🔑 Token:', token.substring(0, 20) + '...'); // Log first 20 chars for debugging
    } else {
      console.warn('⚠️ API Request: No token found in localStorage for', config.method?.toUpperCase(), config.url);
      console.warn('🔍 Available localStorage keys:', Object.keys(localStorage || {}));
    }
    console.log('📡 API Request:', config.method?.toUpperCase(), config.url, 'with headers:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, clear it and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to get current user from localStorage
const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data');
    console.log('🔍 Getting current user from localStorage:', userData ? 'Found' : 'Not found');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('👤 Current user data:', parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }
  return null;
};

// TypeScript interfaces for API responses - Updated to match actual backend response
export interface Post {
  id: string;
  author: string; // Username as string
  post_type: 'post' | 'blog' | 'question' | 'event';
  title: string | null;
  content: string;
  image: string | null;
  tags: string[];
  created_at: string;
  trend: boolean;
  comments_count: number;
  shares_count: number;
  reacts_count: number;
  saves_count: number;
  comments: Comment[];
  user_reaction: string | null;
  is_shared: boolean;
  is_saved: boolean;
  
  // New reaction structure from API - individual counts
  reactions?: {
    Thunder: number;
    Love: number;
    Dislike: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar?: string;
    profile_image?: string;
  };
  created_at: string;
  updated_at: string;
  reactions?: {
    Thunder: number;
    Love: number;
    Dislike: number;
  };
}

export interface PostResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export interface PostDetailResponse {
  post: Post;
  notifications: any[];
  unread_notifications_count: number;
}

export interface CreatePostData {
  title?: string;
  content: string;
  post_type: 'post' | 'blog' | 'question' | 'event';
  tags: string[];
  image?: File;
}

export interface InteractionData {
  action_type: 'react' | 'save' | 'share';
  react_type?: 'Love' | 'Dislike' | 'Thunder';
}

export interface CommentData {
  content: string;
}

// Helper function to normalize post data from API to match frontend expectations
const normalizePost = (post: any): Post => {
  const currentUser = getCurrentUser();
  
  return {
    id: post.id?.toString() || '',
    author: post.author || '',
    post_type: post.post_type || 'post',
    title: post.title || null,
    content: post.content || '',
    image: post.image || null,
    tags: post.tags || [],
    created_at: post.created_at || new Date().toISOString(),
    trend: post.trend || false,
    comments_count: post.comments_count || 0,
    shares_count: post.shares_count || 0,
    reacts_count: post.reacts_count || 0,
    saves_count: post.saves_count || 0,
    comments: (post.comments || []).map((comment: any) => ({
      id: comment.id?.toString() || '',
      content: comment.content || '',
      author: {
        id: comment.author?.id?.toString() || comment.user?.id?.toString() || '',
        first_name: comment.author?.first_name || comment.first_name || '',
        last_name: comment.author?.last_name || comment.last_name || '',
        username: comment.author?.username || comment.user || comment.username || 'unknown',
        avatar: comment.author?.avatar || comment.author?.profile_image,
        profile_image: comment.author?.profile_image || comment.author?.avatar
      },
      created_at: comment.created_at || comment.timestamp || new Date().toISOString(),
      updated_at: comment.updated_at || comment.created_at || comment.timestamp || new Date().toISOString(),
      reactions: {
        Thunder: 0,
        Love: 0,
        Dislike: 0
      }
    })),
    user_reaction: post.user_reaction || null,
    is_shared: post.is_shared || false,
    is_saved: post.is_saved || false,
    
    // Use reactions from API response if available, otherwise default to 0
    reactions: post.reactions ? {
      Thunder: post.reactions.Thunder || 0,
      Love: post.reactions.Love || 0,
      Dislike: post.reactions.Dislike || 0
    } : {
      Thunder: 0,
      Love: 0,
      Dislike: 0
    }
  };
};

/**
 * Get posts from the API with pagination and optional tag filtering
 */
export const getPosts = async (page: number = 1, page_size: number = 10, tags?: string[]): Promise<PostResponse> => {
  try {
    let url = `/posts/?page=${page}&page_size=${page_size}`;
    
    // Add tags filter if provided
    if (tags && tags.length > 0) {
      const tagsParam = tags.join(',');
      url += `&tags=${encodeURIComponent(tagsParam)}`;
    }
    
    console.log('📡 Fetching posts from:', url);
    
    const response = await api.get(url);
    console.log('📋 Posts API response:', response.data);
    
    return {
      count: response.data.count || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
      results: (response.data.results || []).map(normalizePost)
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Create a new post
 * @param postData - Data for the new post
 * @returns Promise<Post>
 */
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  try {
    console.log('Creating post with data:', postData);
    
    // Prepare form data for multipart/form-data
    const formData = new FormData();
    
    if (postData.title) {
      formData.append('title', postData.title);
    }
    formData.append('content', postData.content);
    formData.append('post_type', postData.post_type);
    formData.append('tags', JSON.stringify(postData.tags));
    
    if (postData.image) {
      formData.append('image', postData.image);
    }
    
    // Create a new axios instance for this request with multipart content type
    const response = await api.post('/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Post created successfully:', response.data);
    return normalizePost(response.data);
  } catch (error: any) {
    console.error('❌ Error creating post:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get details of a specific post by ID
 * @param postId - ID of the post to fetch
 * @returns Promise<Post>
 */
export const getPostDetails = async (postId: string): Promise<Post> => {
  try {
    const response = await api.get(`/posts/${postId}/`);
    // Backend returns { post: {...}, notifications: [], unread_notifications_count: 0 }
    const data: PostDetailResponse = response.data;
    return normalizePost(data.post);
  } catch (error) {
    console.error('Error fetching post details:', error);
    throw error;
  }
};

/**
 * Get post with interaction details
 * @param postId - ID of the post
 * @returns Promise<Post>
 */
export const getPostInteractions = async (postId: string): Promise<Post> => {
  try {
    const response = await api.get(`/posts/${postId}/interact/`);
    return normalizePost(response.data);
  } catch (error) {
    console.error('Error fetching post interactions:', error);
    throw error;
  }
};

/**
 * React to a post (like, love, etc.)
 */
export const reactToPost = async (postId: string, reactType: 'Love' | 'Dislike' | 'Thunder'): Promise<Post> => {
  try {
    console.log(`🎭 Reacting to post ${postId} with ${reactType}`);
    
    const interactionData: InteractionData = {
      action_type: 'react',
      react_type: reactType
    };
    
    const response = await api.post(`/posts/${postId}/interact/`, interactionData);
    console.log('✅ Reaction successful:', response.data);
    return normalizePost(response.data);
  } catch (error: any) {
    console.error('❌ Error reacting to post:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Save a post
 * @param postId - ID of the post to save
 * @returns Promise<Post>
 */
export const savePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/posts/${postId}/interact/`, {
      action_type: 'save'
    });
    return normalizePost(response.data);
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};

/**
 * Share a post
 * @param postId - ID of the post to share
 * @returns Promise<Post>
 */
export const sharePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post(`/posts/${postId}/interact/`, {
      action_type: 'share'
    });
    return normalizePost(response.data);
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};

/**
 * Add a comment to a post
 * @param postId - ID of the post to comment on
 * @param commentData - Content of the comment
 * @returns Promise<Comment>
 */
export const commentOnPost = async (postId: string, commentData: CommentData): Promise<Comment> => {
  try {
    const response = await api.post(`/posts/${postId}/comment/`, commentData);
    const comment = response.data;
    const currentUser = getCurrentUser();
    
    return {
      id: comment.id?.toString() || '',
      content: comment.content || '',
      author: {
        id: comment.author?.id?.toString() || currentUser?.id?.toString() || '',
        first_name: comment.author?.first_name || currentUser?.first_name || '',
        last_name: comment.author?.last_name || currentUser?.last_name || '',
        username: comment.author?.username || currentUser?.username || '',
        avatar: comment.author?.avatar || comment.author?.profile_image,
        profile_image: comment.author?.profile_image || comment.author?.avatar
      },
      created_at: comment.created_at || new Date().toISOString(),
      updated_at: comment.updated_at || comment.created_at || new Date().toISOString(),
      reactions: {
        Thunder: 0,
        Love: 0,
        Dislike: 0
      }
    };
  } catch (error) {
    console.error('Error commenting on post:', error);
    throw error;
  }
};

/**
 * Fetch saved posts for the current user
 * @returns Promise<Post[]>
 */
export const getSavedPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts/saved/');
    return (response.data || []).map(normalizePost);
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error;
  }
};

/**
 * Edit an existing post
 * @param postId - ID of the post to edit
 * @param postData - Updated data for the post
 * @returns Promise<Post>
 */
export const editPost = async (postId: string, postData: Partial<CreatePostData>): Promise<Post> => {
  try {
    console.log('Editing post:', postId, 'with data:', postData);
    
    // Check if we have an image to upload or remove
    if (postData.image !== undefined) {
      // Use FormData for image uploads or removals
      const formData = new FormData();
      
      if (postData.title !== undefined) {
        formData.append('title', postData.title);
      }
      if (postData.content !== undefined) {
        formData.append('content', postData.content);
      }
      if (postData.post_type !== undefined) {
        formData.append('post_type', postData.post_type);
      }
      if (postData.tags !== undefined) {
        formData.append('tags', JSON.stringify(postData.tags));
      }
      
      // If image is null, we want to remove it
      if (postData.image === null) {
        formData.append('image', ''); // Send empty string to remove image
      } else if (postData.image instanceof File) {
        formData.append('image', postData.image);
      }
      
      const response = await api.put(`/posts/${postId}/edit/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Edit response:', response.data);
      return normalizePost(response.data);
    } else {
      // Use JSON for text-only updates
      const editData = {
        ...postData,
        // Remove undefined values
        ...(postData.title !== undefined && { title: postData.title }),
        ...(postData.content !== undefined && { content: postData.content }),
        ...(postData.post_type !== undefined && { post_type: postData.post_type }),
        ...(postData.tags !== undefined && { tags: postData.tags }),
      };
      
      console.log('Sending edit request with data:', editData);
      
      const response = await api.put(`/posts/${postId}/edit/`, editData);
      console.log('Edit response:', response.data);
      
      return normalizePost(response.data);
    }
  } catch (error: any) {
    console.error('Error editing post:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw error;
  }
};

/**
 * Delete a post
 * @param postId - ID of the post to delete
 * @returns Promise<void>
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting post:', postId);
    await api.delete(`/posts/${postId}/edit/`);
    console.log('✅ Post deleted successfully');
  } catch (error: any) {
    console.error('❌ Error deleting post:', error.response?.data || error.message);
    throw error;
  }
}; 