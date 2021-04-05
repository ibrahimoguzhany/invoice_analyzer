import React, { useState } from 'react';
import { Upload, message, Row, Col, Button, Table, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import app from '../helpers/firebase';
import ReceiptList from './receipt-list';
import { Receipt } from '../models/models';
import moment from 'moment';
import axios from 'axios';

const firestore = app.firestore();
const storage = app.storage();

const Home = () => {
    const receiptsRef = firestore.collection('receipts');

    const [files, setFiles] = useState([] as any);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [recordCount, setRecordCount] = useState(0);

    const [addedRecords, setAddedRecords] = useState([] as any);

    const onRemove = (file: any) => {
        const index = files.indexOf(file);
        const newFileList = files.slice();
        newFileList.splice(index, 1);
        setFiles(newFileList);
    };

    const removeAllFiles = () => {
        setFiles([]);
        setAddedRecords([]);
        setRecordCount(0);
    };

    const beforeUpload = (file: any, fileList: any) => {
        if (file === fileList[0]) {
            const eligibleFiles = [] as any;
            for (var i = 0; i < fileList.length; i++) {
                if (
                    fileList[i].type !== 'image/jpeg' &&
                    fileList[i].type !== 'image/png'
                ) {
                    message.error(
                        `${fileList[i].name} is not eligible for uploading!`
                    );
                } else {
                    if (files.map((p: any) => p.name).includes(file.name)) {
                        message.warning(
                            `A file named as'${fileList[i].name}' is already added!`
                        );
                    } else {
                        eligibleFiles.push(fileList[i]);
                    }
                }
            }
            const newFileList = [...eligibleFiles, ...files];
            setFiles(newFileList);
        }
        return false;
    };

    const handleUpload = async () => {
        setUploading(true);
        let index = 0;
        const templateRecords = [] as any;
        for (const file of files) {
            const image = file;
            console.log('1-image', image);
            const imgUrl = await uploadImage(image);
            console.log('2-imgUrl', imgUrl);
            const receiptData = await processImage(imgUrl, image.name);
            if (receiptData != null) {
                index++;
                console.log('3-receiptData', receiptData);
                const record = await saveAsTemplateToFirebase(
                    receiptData,
                    imgUrl
                );
                templateRecords.push(record);
                console.log('templateRecords', templateRecords);
                console.log('finish');
            }
        }
        setAddedRecords(templateRecords);
        setRecordCount(index);
        setUploading(false);
    };

    const uploadImage = async (image: any) => {
        return new Promise<string>(function (resolve, reject) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    console.log('Error:', error);
                    reject();
                },
                () => {
                    storage
                        .ref('images')
                        .child(image.name)
                        .getDownloadURL()
                        .then((url: string) => {
                            resolve(url);
                        });
                }
            );
        });
    };

    const processImage = async (imageUrl: string, imageName: string) => {
        // const requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Access-Control-Allow-Origin': '*',
        //     },
        //     body: JSON.stringify({ fileUrl: imageUrl }),
        // };
        // const response = await fetch(
        //     'https://karraentegra.herokuapp.com/http://receipt-scanning-api.demos.arfitect.net/api/v1/receipt-scanner/ScanFileByUrl',
        //     requestOptions
        // );
        // const data = await response.json();
        // console.log('Image Processing Data', data);
        // return data.receiptData;
        try {
            const response: any = await axios.post(
                'https://karraentegra.herokuapp.com/http://receipt-scanning-api.demos.arfitect.net/api/v1/receipt-scanner/ScanFileByUrl',
                { fileUrl: imageUrl },
                { timeout: 10000 }
            );
            const data = response.data.receiptData;
            data.total = data.total.toString();
            data.totalTax = data.totalTax.toString();

            console.log('DATA', data);
            return data;
        } catch (error) {
            notification.error({
                message: `COULDN'T PROCESS IMAGE OF: ${imageName}!`,
                placement: 'topRight',
            });
            console.log('ERROR', error);
            return null;
        }
    };

    const saveAsTemplateToFirebase = async (
        receiptData: any,
        imageUrl: string
    ) => {
        const receipt: Receipt = {
            imageUrl: imageUrl,
            documentNumber: receiptData.documentNumber,
            issueDate: receiptData.date,
            processDate: moment().format('DD.MM.YYYY'),
            supplier: receiptData.contact,
            vatAmount: receiptData.totalTax,
            totalAmount: receiptData.total,
            createdAt: moment().toDate(),
            isTemplate: true,
        };
        try {
            const addedRecord = await receiptsRef.add(receipt);
            return addedRecord;
        } catch (error) {
            console.error('Error creating receipt: ', error);
        }
    };

    const saveAll = async () => {
        setSaving(true);
        addedRecords.forEach(async (record: any) => {
            try {
                const documentRef = receiptsRef.doc(record.id);
                await documentRef.update({ isTemplate: false });
            } catch (error) {
                console.error('Error updating receipt: ', error);
            }
        });
        notification.success({
            message: 'Documents successfully saved!',
            placement: 'topRight',
        });
        removeAllFiles();
        setSaving(false);
    };

    const cancel = async () => {
        addedRecords.forEach(async (record: any) => {
            try {
                const documentRef = receiptsRef.doc(record.id);
                await documentRef.delete();
            } catch (error) {
                console.error('Error deleting receipt: ', error);
            }
        });
        removeAllFiles();
    };
    return (
        <>
            <Row>
                <Col span={12} offset={6}>
                    <Upload.Dragger
                        onRemove={onRemove}
                        beforeUpload={beforeUpload}
                        fileList={files}
                        name={'file'}
                        multiple={true}
                        height={300}
                        withCredentials={true}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            You can upload single or bulk files
                        </p>
                    </Upload.Dragger>
                </Col>
            </Row>
            <Row>
                <Col span={12} offset={6}>
                    <Button
                        type={'primary'}
                        danger
                        onClick={removeAllFiles}
                        disabled={files.length === 0 || uploading}
                        style={{ marginTop: 16 }}
                    >
                        {'Remove All Files'}
                    </Button>
                    <Button
                        type={'primary'}
                        onClick={handleUpload}
                        disabled={files.length === 0}
                        loading={uploading}
                        style={{ marginTop: 16, float: 'right' }}
                    >
                        {uploading ? 'Processing' : 'Complete Upload'}
                    </Button>
                </Col>
                <Col span={12} />
            </Row>
            <Row>
                <Col span={24}>
                    <ReceiptList recordCount={recordCount} isTemplates={true} />
                </Col>
            </Row>
            <Row>
                <Col offset={20} span={2}>
                    <Button
                        type={'primary'}
                        danger
                        onClick={cancel}
                        style={{ marginTop: 16, float: 'right' }}
                    >
                        {'Cancel'}
                    </Button>
                </Col>
                <Col span={2}>
                    <Button
                        type={'primary'}
                        onClick={saveAll}
                        disabled={files.length === 0 || uploading}
                        loading={saving}
                        style={{
                            marginTop: 16,
                            float: 'right',
                            background: '#178566',
                            borderColor: '#52c41a',
                        }}
                    >
                        {'Save All'}
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default Home;
