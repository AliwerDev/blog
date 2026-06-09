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

export interface DatabaseSchema {
  posts: Post[];
}

export interface AdminSession {
  email: string;
  role: 'admin';
}
