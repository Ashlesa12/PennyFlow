export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  currency?: string;
  date_format?: string;
  theme?: string;
}

export interface UserPreferences {
  currency: "NPR" | "USD" | "EUR" | "GBP" | "INR";
  date_format: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM/DD/YYYY" | "DD/MM/YYYY";
  theme: "Light" | "Dark" | "System";
}

export interface ChangePassword {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
