export enum Sentiment {
  Positive = 'positive',
  Neutral = 'neutral',
  Negative = 'negative',
}

export enum Urgency {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum Platform {
    Email = 'email',
    Twitter = 'twitter',
    Web = 'web',
}

export interface Feedback {
  id: string;
  username: string;
  avatar: string;
  email: string;
  message: {
      subject: string;
      body: string;
  };
  sentiment: Sentiment;
  urgency: Urgency;
  platform: Platform;
  date: string;
  resolved: boolean;
}

export type UserRole = 'admin' | 'client';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}