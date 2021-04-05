import moment from "moment";
import { Receipt } from "../models/models";

const MockDataCreator = (imgCount: number) => {
    const mockData = [];
    
    for(var i = 0; i < imgCount; i++){
        let randomDocumentNumber = Math.floor((Math.random() * 1000) + 1);
        let randomDay = Math.floor((Math.random() * 28) + 1);
        let randomTotalAmount = Math.floor((Math.random() * 100000) + 1) / 100;
        const receipt: Receipt = {
            imageUrl: 'https://picsum.photos/300/400',
            documentNumber: randomDocumentNumber.toString(),
            issueDate: `${randomDay}.02.2021`,
            processDate: moment().format('DD.MM.YYYY'),
            supplier: `Random Supplier: ${randomDocumentNumber}`,
            vatAmount: (randomTotalAmount*0.08).toFixed(2),
            totalAmount: randomTotalAmount.toFixed(2),
            createdAt: moment().toDate(),
            isTemplate: true
        };
        mockData.push(receipt);
    }
    return mockData;
}

export default MockDataCreator;