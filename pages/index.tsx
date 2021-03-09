import React, { useState } from 'react'
import { Upload, message, Row, Col, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/lib/upload/interface'

const Home = () => {
  const [files, setFiles] = useState([] as UploadFile[]);
  const [uploading, setUploading] = useState(false);
  const [isBeforeUpload, setIsBeforeUpload] = useState(true);

  const onRemove = (file: UploadFile) => {
    const index = files.indexOf(file);
    const newFileList = files.slice();
    newFileList.splice(index, 1);
    setFiles(newFileList);
  }

  const removeAllFiles = () => {
    setFiles([]);
  }

  const beforeUpload = (file: UploadFile, fileList: UploadFile[]) => {    
    const eligibleFiles = [] as UploadFile[];
    for(var i = 0; i < fileList.length ; i++){
      if (fileList[i].type !== 'image/jpeg' && fileList[i].type !== 'image/png') {
        message.error(`${file.name} is not eligible for uploading!`)
      }
      else{
        eligibleFiles.push(fileList[i]);
      }
    }
    const newFileList = [...eligibleFiles, ...files];
    setFiles(newFileList);
    return false;
  }

  const handleUpload = () => {
    setUploading(true);
    setTimeout(function () {
      setUploading(false)
    }, 5000);
  }

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
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
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
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </Col>
        <Col span={12} />
      </Row>
    </>
  )

}

export default Home