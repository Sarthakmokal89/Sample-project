import apiRequest from './api';
import { Feedback, Sentiment, Urgency, Platform } from '../types';

// This type represents the raw data structure from the backend /api/emails endpoint
interface RawEmail {
  id: string;
  from_email: string;
  subject: string;
  body: string;
  sentiment: Sentiment;
  urgency: Urgency;
  date: string;
  resolved: boolean;
}

// This function transforms the raw email data into the Feedback type used by the frontend
const mapRawEmailToFeedback = (email: RawEmail): Feedback => {
  // Simple parsing for username and email address from "User Name <email@example.com>" format
  let username = email.from_email;
  let emailAddress = email.from_email;
  const match = email.from_email.match(/(.*)<(.*)>/);
  if (match) {
    username = match[1].trim();
    emailAddress = match[2].trim();
  } else {
    // Fallback for just an email address
    emailAddress = email.from_email;
    username = email.from_email.split('@')[0];
  }


  return {
    id: email.id,
    username,
    email: emailAddress,
    avatar: `https://i.pravatar.cc/150?u=${emailAddress}`,
    message: {
      subject: email.subject,
      body: email.body,
    },
    sentiment: email.sentiment,
    urgency: email.urgency,
    platform: Platform.Email, // Assume all are from email for now
    date: email.date,
    resolved: email.resolved,
  };
};

interface EmailsResponse {
    emails: RawEmail[];
}

export const fetchFeedback = async (): Promise<Feedback[]> => {
  try {
    const data = await apiRequest<EmailsResponse>('/emails');
    if (data && Array.isArray(data.emails)) {
        return data.emails.map(mapRawEmailToFeedback);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch feedback data:', error);
    // Re-throw the error to be caught by the component
    throw error;
  }
};
