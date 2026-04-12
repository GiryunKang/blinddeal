// ─── Enum Type Aliases ───────────────────────────────────────────────

export type DealCategory =
  | "real_estate"
  | "mna"
  | "investment"
  | "startup"
  | "other";

export type DealVisibility = "public" | "nda" | "private";

export type DealStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "closed"
  | "cancelled";

export type UserType = "individual" | "corporation";

export type MembershipTier = "free" | "basic" | "premium" | "enterprise";

export type RoomStatus = "pending" | "active" | "completed" | "cancelled";

// ─── Database Table Types ────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  user_type: UserType;
  company_name: string | null;
  membership_tier: MembershipTier;
  bio: string | null;
  phone: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  author_id: string;
  title: string;
  description: string;
  category: DealCategory;
  visibility: DealVisibility;
  status: DealStatus;
  amount: number | null;
  currency: string;
  location: string | null;
  tags: string[];
  attachments: string[];
  view_count: number;
  like_count: number;
  is_featured: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealRoom {
  id: string;
  deal_id: string;
  buyer_id: string;
  seller_id: string;
  status: RoomStatus;
  nda_signed: boolean;
  nda_signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "file" | "system";
  file_url: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  author_id: string;
  title: string;
  content: string;
  summary: string | null;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  view_count: number;
  like_count: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "deal" | "message" | "comment" | "system" | "like";
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
}

export interface Expert {
  id: string;
  user_id: string;
  specialty: string[];
  license_number: string | null;
  years_of_experience: number;
  introduction: string | null;
  portfolio_url: string | null;
  rating: number;
  review_count: number;
  hourly_rate: number | null;
  is_available: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}
