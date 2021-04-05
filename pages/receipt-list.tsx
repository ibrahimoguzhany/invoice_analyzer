import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Image, Input, InputNumber, Modal, notification, Row, Space, Table, Tag, Tooltip } from 'antd'
import { ArrowsAltOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, FileExcelOutlined, PlusOutlined, ShrinkOutlined } from '@ant-design/icons'
import moment from 'moment';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import app from '../helpers/firebase';
import rules from '../helpers/rules';
import { Receipt, Log } from '../models/models';
import _ from 'lodash';

const db = app.firestore();

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface ReceiptListProps{
  recordCount?: number;
  isTemplates?: boolean;
}

const ReceiptList = (props: ReceiptListProps) => {
  const {recordCount, isTemplates} = props;
  const logsRef = db.collection('logs');
  const receiptsRef = db.collection('receipts');
  const receiptsQuery = isTemplates == true ? receiptsRef.where('isTemplate', '==', true) : receiptsRef.where('isTemplate', '==', false) ; 
  const [receipts] = useCollectionData<Receipt>(receiptsQuery, { idField: 'id' });

  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [maxResultCount, setMaxResultCount] = useState(10);

  const columns = [
    {
      title: 'Document Number',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width: '10%',
      render: (text: string, record: any) => editingKey !== record.id ?
      (<div style={{ textAlign: 'center' }}>
        <Tag color="#f50">{text}</Tag>
      </div>)
      :
      (<FormItem
        name={'documentNumber'}
        style={{ marginBottom: 0, textAlign: 'center' }}
        rules={rules.documentNumber}
        initialValue={text}
      >
        <Input/>
      </FormItem>)
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: '5%',
      render: (text: string) => <div style={{ textAlign: 'center' }}>
        <Image
          preview={!isImageExpanded}
          width={!isImageExpanded ? 50 : 400}
          src={text}
        />
      </div>
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: '10%',
      render: (text: string, record: any) => editingKey !== record.id ?
        (<div style={{ textAlign: 'center' }}>
          <Tag color="#178566">{text}</Tag>
        </div>)
        : (<FormItem name={'issueDate'} style={{ marginBottom: 0 }} rules={rules.issueDate} initialValue={moment(text, 'DD.MM.YYYY')}>
          {<DatePicker format={"DD.MM.YYYY"} />}
        </FormItem>)
    },
    {
      title: 'Process Date',
      dataIndex: 'processDate',
      key: 'processDate',
      width: '10%',
      render: (text: string, record: any) => editingKey !== record.id ?
        (<div style={{ textAlign: 'center' }}>
          <Tag color="#dbae0b">{text}</Tag>
        </div>)
        : (<FormItem name={'processDate'} style={{ marginBottom: 0 }} rules={rules.processDate} initialValue={moment(text, 'DD.MM.YYYY')}>
          {<DatePicker format={"DD.MM.YYYY"} />}
        </FormItem>)
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '25%',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 100,
          }
        }
      },
      render: (text: string, record: any) => editingKey !== record.id ?
        (<Tooltip title={text}>
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            <Tag color="#108ee9">
              {text}
            </Tag>
          </div>
        </Tooltip>)
        : (<FormItem name={'supplier'} style={{ marginBottom: 0 }} rules={rules.supplier} initialValue={text}>
          <TextArea rows={4} />
        </FormItem>)
    },
    {
      title: 'Vat Amount',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width: '15%',
      render: (text: string, record: any) => editingKey !== record.id ?
        (<div style={{ textAlign: 'center' }}>
          <Tag color="#6921a7">{text}</Tag>
        </div>)
        : (<FormItem name={'vatAmount'} style={{ marginBottom: 0, textAlign: 'center' }} rules={rules.vatAmount} initialValue={text}>
          <InputNumber<string> step={"0.01"} min={"0"} stringMode />
        </FormItem>)
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: '15%',
      render: (text: string, record: any) => editingKey !== record.id ?
        (<div style={{ textAlign: 'center' }}>
          <Tag color="#99002a">{text}</Tag>
        </div>)
        : (<FormItem name={'totalAmount'} style={{ marginBottom: 0, textAlign: 'center' }} rules={rules.totalAmount} initialValue={text}>
          <InputNumber<string> step={"0.01"} min={"0"} stringMode={true} />
        </FormItem>)
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'id',
      width: '10%',
      render: (text: string, record: any) => editingKey !== record.id ? (
        <div>
          <Space size="middle">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => edit(record)} style={{ width: 104, marginBottom: 10 }}>
              Edit
            </Button>
          </Space>
          <Space size="middle">
            <Button icon={<CloseOutlined />} onClick={()=> deleteRecord(record)} style={{ width: 104 }} danger>
              {'Delete'}
            </Button>
          </Space>
        </div>
      ) :
        (
          <div>
            <Space size="middle">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{ width: 104, marginBottom: 10, background: '#178566', borderColor: '#52c41a' }}
                onClick={() => save(record)}
              >
                {'Save'}
              </Button>
            </Space>
            <Space size="middle">
              <Button icon={<CloseOutlined />} onClick={cancel} style={{ width: 104 }} danger>
                {'Cancel'}
              </Button>
            </Space>
          </div>
        )
    }
  ];

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
  ];

  const edit = (record: any) => {
    form.resetFields();
    setEditingKey(record.id);
  }

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
  }

  const isRowChanged = (record: any, updatedData: any) => {
    return !(record.documentNumber === updatedData.documentNumber
      && record.issueDate === updatedData.issueDate
      && record.processDate === updatedData.processDate
      && record.supplier === updatedData.supplier
      && record.vatAmount === updatedData.vatAmount
      && record.totalAmount === updatedData.totalAmount);
  }

  const whichRowsChanged = (record: any, updatedData: any) => {
    const changedRows = [];
    record.documentNumber !== updatedData.documentNumber ? changedRows.push('documentNumber') : null;
    record.issueDate !== updatedData.issueDate ? changedRows.push('issueDate') : null;
    record.processDate !== updatedData.processDate ? changedRows.push('processDate'): null;
    record.supplier !== updatedData.supplier ? changedRows.push('supplier'): null;
    record.vatAmount !== updatedData.vatAmount ? changedRows.push('vatAmount'): null;
    record.totalAmount !== updatedData.totalAmount ? changedRows.push('totalAmount'): null;
    return changedRows;
  }

  const save = async (record: any) => {
    const fieldValues = form.getFieldsValue();
    await form.validateFields().then(async () => {
      const updatedData = {
        documentNumber: fieldValues.documentNumber,
        issueDate: fieldValues.issueDate.format('DD.MM.YYYY'),
        processDate: fieldValues.processDate.format('DD.MM.YYYY'),
        supplier: fieldValues.supplier,
        vatAmount: fieldValues.vatAmount,
        totalAmount: fieldValues.totalAmount
      } as any;
      if (isRowChanged(record, updatedData)) {
        try {
          const documentRef = receiptsRef.doc(record.id);
          await documentRef.update(updatedData);
          notification.success({
            message: 'Document successfully updated!',
            placement: 'bottomRight'
          })
          try {
            const changedRows = whichRowsChanged(record, updatedData);
            let action : string = !record.isTemplate ? '' : '---Template---\n';
            changedRows.forEach((changedRow: any, index: number) => {
              const rowAction = `${index+1}: '${changedRow}' '${record[changedRow]}'  is updated as '${updatedData[changedRow]}';\n`;
              action += rowAction;
            });
            const log : Log = {recordId : record.id, action : action, createdAt: moment().toDate()}
            logsRef.add(log);
          }
          catch (error) {
            console.error("Error creating log: ", error);
          }
        } catch (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
          notification.error({
            message: 'Error updating document!',
            placement: 'bottomRight'
          })
        }
        finally {
          setEditingKey("");
        }
      }
      else {
        setEditingKey("");
      }
    });

  }

  const deleteRecord = async (record: any) => {
    Modal.confirm({
        title: 'Do you want to delete this item?',
        async onOk() {
          const documentRef = receiptsRef.doc(record.id);
          await documentRef.delete();
        },
        onCancel() {
        },
        icon: <DeleteOutlined />
    });
  } 

  const handleShowSizeChange = (current: any, size: any) => {
    setMaxResultCount(size);
  }

  return (
    <Row>
      <Col xs={20} sm={16} md={18} lg={19} xl={19}/>
      <Col xs={2} sm={8} md={4} lg={2} xl={2}>
        <Button
          style={{ marginBottom: 10 }}
          icon={<FileExcelOutlined />}
          onClick={() => {
            const excelPackage = require("antd-table-saveas-excel");
            const excel = new excelPackage.Excel();
            excel
              .addSheet('test')
              .addColumns(excelColumns)
              .addDataSource(receipts)
              .saveAs('deneme.xlsx');
          }}
        >
          Excel
          </Button>
      </Col>
      <Col xs={2} sm={8} md={4} lg={3} xl={3}>
        <Button style={{marginBottom: 10 }} onClick={() => setIsImageExpanded(!isImageExpanded)}>
          {!isImageExpanded ? 'Expand Images' : 'Shrink Images'}
          {!isImageExpanded ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
        </Button>
      </Col>
      <Col span={24}>
        <Form form={form} component={false}>
          <Table
            rowKey={'id'}
            bordered={true}
            dataSource={receipts ? (recordCount !== 0 ? _.orderBy(receipts, 'createdAt', 'desc').slice(0, recordCount) : []) : []}
            columns={columns as any}
            pagination={{
              pageSize: maxResultCount,
              total: receipts !== undefined ? (recordCount ? recordCount : receipts.length) : 0,
              defaultCurrent: 1,
              pageSizeOptions: ['10', '25', '50', '100'],
              showSizeChanger: true,
              onShowSizeChange: handleShowSizeChange
            }}
          />
        </Form>
      </Col>
    </Row>
  )

}

export default ReceiptList