import { Col, Row, Table, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
import _ from "lodash";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import app from "../helpers/firebase";
import { Log } from "../models/models";


const firestore = app.firestore();

const Logs = () => {
    const logsRef = firestore.collection('logs');
    const [logs] = useCollectionData<Log>(logsRef, { idField: 'id' });
    const columns = [
        {
            title: 'Record Id',
            dataIndex: 'recordId',
            key: 'recordId',
            width: '10%',
            render: (text: string) => (
                <div style={{ textAlign: 'center' }}>
                    <Tag color="#178566">{text}</Tag>
                </div>
            )
        },
        {
            title: 'Logs',
            dataIndex: 'action',
            key: 'action',
            width: '90%',
            onCell: () => {
                return {
                    style: {
                        whiteSpace: 'nowrap',
                        maxWidth: 100,
                    }
                }
            },
            render: (text: string) => (
                <TextArea rows={2} defaultValue={text} readOnly/>
            )
        }
    ];

    return (
        <Row>
            <Col span={24}>
                <Table
                    rowKey={'id'}
                    bordered={true}
                    dataSource={logs !== undefined ? _.orderBy(logs, 'createdAt', 'desc') : []}
                    columns={columns as any}
                />
            </Col>
        </Row>
    )
}

export default Logs;