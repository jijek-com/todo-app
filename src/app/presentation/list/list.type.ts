export interface Todo {
  id: string;
  title: string;
  expirationDate: string;
  expirationTime?: string;
  createdAt: string;
  favorite?: boolean;
}
