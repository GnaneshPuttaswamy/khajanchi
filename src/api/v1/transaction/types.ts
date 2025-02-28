export interface AddTransactionRequest {
  date: Date;
  amount: number;
  category: string;
  description: string;
  isConfirmed?: boolean;
}

export interface AddTransactionData {
  id: number;
  date: Date;
  amount: number;
  category: string;
  description: string;
  isConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetTransactionParams {
  id: number;
}

export interface GetTransactionData extends AddTransactionData {}

export interface GetAllTransactionsData extends AddTransactionData {}

export interface DeleteTransactionParams extends GetTransactionParams {}

export interface DeleteTransactionData {
  deletedCount: number;
}
