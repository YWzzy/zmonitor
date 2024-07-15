import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { updateAppConfig } from '@/src/api';
import { useAppStore, useUserStore } from '@/src/hooks';

interface ConfigApplicationIn {
  open: boolean;
  onClose: () => void;
  appId: string;
}

export const ConfigApplication: React.FC<ConfigApplicationIn> = ({ open, onClose, appId }) => {
  const [form] = Form.useForm();

  const { appDispatch } = useAppStore();
  const { userInfo } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [appConfig, setAppConfig] = useState<AppConfig | object>({});

  const { TextArea } = Input;

  useEffect(() => {
    const fetchAppConfig = async () => {
      const config = await appDispatch.getConfigApp(appId);
      setAppConfig(config);
      form.setFieldsValue(config);
    };

    if (open && appId) {
      fetchAppConfig();
    }
  }, [open, appId, appDispatch, form]);

  return (
    <Modal
      open={open}
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
      <Form form={form} initialValues={appConfig}>
        <Form.Item name="appName" label="应用名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="appId" label="appId">
          <Input disabled />
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
        <Form.Item name="enableRecording" label="是否开启录屏" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="reportErrorsOnly" label="是否只异常上报" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="appStatus" label="应用开关" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
