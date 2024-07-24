import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message, Spin, Button, Upload, UploadFile, Row, Col, Card, Radio } from 'antd';
import { updateAppConfig, uploadDistFiles } from '@/src/api';
import { useAppStore, useUserStore } from '@/src/hooks';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { ProjectEnvType, ProjectEnvTypes } from '@/src/constants';

interface ConfigApplicationIn {
  open: boolean;
  onClose: () => void;
  appId: string;
}

interface AppConfig {
  appName: string;
  appId: string;
  deployServer: string;
  packageUrl: string;
  recordingStorage: string;
  appSecret: string;
  appDesc?: string;
  enableRecording: boolean;
  reportErrorsOnly: boolean;
  isSourceMap: boolean;
}

export const ConfigApplication: React.FC<ConfigApplicationIn> = ({ open, onClose, appId }) => {
  const [form] = Form.useForm();

  const { appDispatch } = useAppStore();
  const { userInfo } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [appConfig, setAppConfig] = useState<AppConfig | object>({});
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { TextArea } = Input;

  useEffect(() => {
    const fetchAppConfig = async () => {
      setFetching(true);
      setFileList([]); // 清空文件列表
      try {
        const config = await appDispatch.getConfigApp(appId);
        setAppConfig(config);
        form.setFieldsValue(config);
      } catch (error) {
        message.error('获取应用配置失败！');
      } finally {
        setFetching(false);
      }
    };

    if (open && appId) {
      fetchAppConfig();
    }
  }, [open, appId, appDispatch, form]);

  // 清除dist文件
  const clearDistFiles = () => {
    setFileList([]);
  }

  // 上传dist文件
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      if (appConfig['isSourceMap'] && file.name.endsWith('.map')) {
        formData.append('files', file.originFileObj as Blob);
      } else if (!appConfig['isSourceMap'] && !file.name.endsWith('.map')) {
        formData.append('files', file.originFileObj as Blob);
      }
    });
    formData.append('appId', appConfig['appId']);
    formData.append('projectEnv', appConfig['projectEnv']);
    formData.append('projectVersion', appConfig['projectVersion']);
    formData.append('isSourceMap', appConfig['isSourceMap']);
    formData.append('userId', import.meta.env.VITE_USERID);

    setUploading(true);
    try {
      await uploadDistFiles(formData);
      message.success('文件上传成功！');
      setFileList([]); // 清空文件列表
    } catch (error) {
      message.error('文件上传失败！');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isSourceMap = appConfig['isSourceMap'];
      const allowedNonSourceMapExtensions = ['.js', '.ts', '.cjs', '.css', '.html', '.htm'];

      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isValidNonSourceMapFile = allowedNonSourceMapExtensions.includes(fileExtension);

      // 当isSourceMap为true时，只上传sourceMap文件；当isSourceMap为false时，只上传指定后缀的非sourceMap文件
      if ((isSourceMap && !file.name.endsWith('.map')) || (!isSourceMap && (!isValidNonSourceMapFile || file.name.endsWith('.map')))) {
        console.warn(`文件 ${file.name} 不符合上传条件,因为isSourceMap = ${isSourceMap},所以被过滤`);
        return false;
      }

      const uploadFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file,
      };
      setFileList(prevList => [...prevList, uploadFile]);
      return false; // 阻止自动上传
    },

    showUploadList: true,
    multiple: true,
    directory: true,
    fileList,
  };

  return (
    <Modal
      open={open}
      width={'70%'}
      destroyOnClose
      onOk={async () => {
        await form.validateFields();
        setLoading(true);
        try {
          const formData = form.getFieldsValue();
          await updateAppConfig(formData);
          await appDispatch.getAppList(userInfo.account);
          setLoading(false);
          message.success('应用配置成功更新！');
          setFileList([]); // 清空文件列表
          onClose();
        } catch (error) {
          setLoading(false);
          message.error('应用配置更新失败！');
        }
      }}
      onCancel={onClose}
      okButtonProps={{
        loading,
      }}
      title="配置应用"
    >
      {fetching ? (
        <Spin />
      ) : (
        <Row gutter={16}>
          <Col span={12}>
            <Form form={form} initialValues={appConfig}>
              <Form.Item name="appName" label="应用名称" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="appId" label="appId">
                <Input disabled />
              </Form.Item>
              <Form.Item name="projectVersion" label="当前项目版本" rules={[{ required: true }]}>
                <Input placeholder='当前项目版本, eg：1.2.1' />
              </Form.Item>
              <Form.Item name="deployServer" label="应用部署服务器地址" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="packageUrl" label="应用包地址" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="recordingStorage" label="录屏文件存放地址" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="appSecret" label="应用密钥" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="appDesc" label="应用描述">
                <TextArea placeholder="请输入应用描述" autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="enableRecording" label="是否开启录屏" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  <Form.Item name="reportErrorsOnly" label="是否只异常上报" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="isSourceMap" label="是否是sourcemap" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name="projectEnv"
                    label="应用环境"
                    initialValue={ProjectEnvType.DEVELOPMENT}
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      {ProjectEnvTypes.map(item => (
                        <Radio value={item.value} key={item.value}>
                          {item.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={12}>
            <Card style={{ height: '500px', overflowY: 'auto' }}>
              <Form.Item label="上传包文件">
                {
                  fileList.length !== 0 && !uploading &&
                  <Button icon={<CloseOutlined />} onClick={clearDistFiles} disabled={uploading}>
                    清除
                  </Button>
                }
                <Button
                  type="primary"
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
                <Upload {...uploadProps}>
                  {
                    fileList.length === 0 && !uploading &&
                    <Button icon={<UploadOutlined />} disabled={uploading}>
                      选择文件夹
                    </Button>
                  }
                </Upload>

              </Form.Item>
              <div>
                {fileList.map(file => (
                  <div key={file.uid}>
                    {file.name}
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Modal>
  );
};
