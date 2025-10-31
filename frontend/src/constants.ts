// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { Feedback } from './types';

// The application no longer uses mock data.
// User objects are created at login time, and feedback data should be fetched from an API.

export const MOCK_FEEDBACK_DATA: Feedback[] = [];
