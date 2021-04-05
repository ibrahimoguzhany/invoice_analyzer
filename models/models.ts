export interface Receipt {
  id?: string;
  imageUrl: string;
  documentNumber: string;
  issueDate: string;
  processDate: string;
  supplier: string;
  vatAmount: string;
  totalAmount: string;
  createdAt: Date;
  isTemplate: boolean;
}

export interface Log {
    id?: string;
    recordId: string;
    action: string;
    createdAt: Date;
}