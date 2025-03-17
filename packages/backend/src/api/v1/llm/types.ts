export interface ParseTransactionsRequest {
  transactionsDescription: string;
}

export interface ParseTransactionsData {
  date: Date;
  amount: number;
  category: string;
  description: string;
}
