// RESTful API service using JSONPlaceholder as backend
const API_BASE = "https://jsonplaceholder.typicode.com";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

// GET all posts
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE}/posts`);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

// GET single post
export const fetchPost = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts/${id}`);
  if (!response.ok) throw new Error("Failed to fetch post");
  return response.json();
};

// POST create new post
export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

// PUT update post
export const updatePost = async (id: number, data: Partial<Post>): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

// DELETE post
export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete post");
};
