export interface TransactionDTO {
  description: string;
  amount: number;
  type: 'EXPENSE' | 'REVENUE';
  category: string;
  date: string;
}