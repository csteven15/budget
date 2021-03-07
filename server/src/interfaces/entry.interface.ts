export interface IEntry {
  userId: string;
  name: string;
  type: number;
  budgetedAmount: number;
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
}
