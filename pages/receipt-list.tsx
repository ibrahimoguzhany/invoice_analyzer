import React, { useState } from 'react'
import { Button, Col, Image, Row, Space, Table, Tag, Tooltip } from 'antd'
import { ArrowsAltOutlined, PlusOutlined, ShrinkOutlined } from '@ant-design/icons'
import { Excel } from 'antd-table-saveas-excel'



const ReceiptList = () => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const mockDataSource = [
    {
      key: '1',
      imageUrl : 'http://receipt-scanning.demos.arfitect.net/receipts/2018_03_07__07_41_16--105.jpeg',
      documentNumber: '6',
      issueDate: '09.02.2018',
      processDate: '03.02.2021',
      supplier: 'KEBAPCI MEHMET USTA KEBAP SALONU MEHMET TEVIK DURSUN CENEDAG MAH DENIZCILER CAD NO 21 / C DERINCE / KOCAELE ESNAF SIC NO 41/83293 DERINCE VD 27066528128 TEŞEKKÜR EDERI',
      items: [{
        description: 'KEBAP 18',
        total: 105.00
      }],
      vatAmount: 7.78,
      totalAmount: 105
    },
    {
      key: '2',
      imageUrl : 'http://receipt-scanning.demos.arfitect.net/receipts/2020_06_02__06_04_59--tmp1591077897622.jpg',
      documentNumber: '40',
      issueDate: '22.05.2020',
      processDate: '02.02.2021',
      supplier: 'GUZEL ENERJI AKARYAKIT A.Ş. CIHANKÖY MH . CIHANKÖY SK . NO : 220 \ A ORHANGAZI BURSA B. MÜKELLEFLER VD : 8580044395 MERSIS NO : 0-8580-0443-9500017 4',
      items: [{
        description: '34 ZJ 1705 43,170 LT X 5,560 MOTORIN EXCELLIUM % 18',
        total: 240.00
      }],
      vatAmount: 36.61,
      totalAmount: 240.00
    },
  ];
  
  const columns = [
    {
      title: 'Document Number',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width : '10%',
      render : (text: string) => <div style={{textAlign: 'center'}}>
                                  <Tag color="#f50">{text}</Tag>
                                </div>
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width : '5%',
      render : (text: string) => <div style={{textAlign: 'center'}}>
                                    <Image
                                      preview={!isImageExpanded}
                                      width={!isImageExpanded ? 50 : 400}
                                      // width={50}
                                      src={text}
                                    />
                                  </div>
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width : '10%',
      render : (text: string) => <div style={{textAlign: 'center'}}>
      <Tag color="#178566">{text}</Tag>
    </div>
    },
    {
      title: 'Process Date',
      dataIndex: 'processDate',
      key: 'processDate',
      width : '10%',
      render : (text: string) => <div style={{textAlign: 'center'}}>
      <Tag color="#dbae0b">{text}</Tag>
    </div>
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      width : '25%',
      onCell: () => {
         return {
            style: {
               whiteSpace: 'nowrap',
               maxWidth: 100,
            }
         }
      },
      render : (text: string) =>  <Tooltip title={text}>
                                    <div style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>
                                      <Tag color="#108ee9">
                                        {text}
                                      </Tag>
                                    </div>
                                  </Tooltip>
    },
    {
      title: 'Vat Amount',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width : '15%',
      render : (text: string) => <div style={{textAlign: 'center'}}>
      <Tag color="#6921a7">{text}</Tag>
    </div>
    },
    
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width : '15%',
      render : (text: string) => <div style={{textAlign: 'center'}}>
      <Tag color="#99002a">{text}</Tag>
    </div>
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      width : '10%',
      render: () => (
        <Space size="middle">
          <Button type="primary" icon={<PlusOutlined />}>
            Edit
          </Button>
        </Space>
      ),
    }
  ];

  const expandedRowRender = (record : any) => {
    const expandedRowColumns = [
      { 
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '75%',
        render: (text: string) => <Tag color="purple">{text}</Tag>
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: '15%',
        render: (text: string) => <Tag color="gold">{text}</Tag>
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        render: () => (
          <Space size="middle">
            <Button icon={<PlusOutlined />}>
              Edit
            </Button>
          </Space>
        ),
      }
    ];
    return <Table 
              bordered={true}
              columns={expandedRowColumns}
              dataSource={record.items}
              pagination={false}
            />;
  };

  const excelColumns = [
    {
      title: 'Document Number',
      dataIndex: 'documentNumber'
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl'
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate'
    },
    {
      title: 'Process Date',
      dataIndex: 'processDate'
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier'
    },
    {
      title: 'Vat Amount',
      dataIndex: 'vatAmount'
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount'
    }
  ]

  return (
      <Row>
        <Col offset={19} span={2}>
            <Button
              style={{float: 'right', marginBottom: 10}} 
              // onClick={() => {
              //   const excel = new Excel();
              //   excel
              //     .addSheet('test')
              //     .addColumns(excelColumns)
              //     .addDataSource(mockDataSource)
              //     .saveAs('deneme.xlsx');
              // }}
          >
            Excel
          </Button>
        </Col>
        <Col offset={1} span={2}>
          <Button style={{float: 'right', marginBottom: 10}} onClick={() => setIsImageExpanded(!isImageExpanded)}>
              {!isImageExpanded ? 'Expand Images' : 'Shrink Images'}
              {!isImageExpanded ? <ArrowsAltOutlined />: <ShrinkOutlined />}
          </Button>
        </Col>
        <Col span={24}>
          <Table
            bordered={true}
            dataSource={mockDataSource} 
            columns={columns}
            expandable={{expandedRowRender}}
          />
        </Col>
      </Row>
  )
  
}

export default ReceiptList