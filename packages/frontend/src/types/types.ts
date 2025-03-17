export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  isConfirmed: boolean;
}
