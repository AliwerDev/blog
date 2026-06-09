export interface Post {
  id: string;
  title: string;
  content: string;
  previewText: string;
  tags: string[];
  topicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  youtubeUrl: string;
  category?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  posts: Post[];
  videos?: Video[];
}

export interface AdminSession {
  email: string;
  role: 'admin';
}
