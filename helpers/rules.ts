const rules = {
    documentNumber:  [{ required: true, message: 'Document Number is required!' }],
    issueDate: [{ required: true, message: 'Issue Date is required!' }],
    processDate: [{ required: true, message: 'Process Date is required!' }],
    supplier: [{ required: true, message: 'Supplier is required!' }],
    vatAmount: [{ required: true, message: 'Vat Amount is required!' }],
    totalAmount: [{ required: true, message: 'Total Amount is required!' }],
};
  
export default rules;