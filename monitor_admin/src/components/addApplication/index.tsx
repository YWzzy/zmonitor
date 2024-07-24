import React, { useState } from 'react';
import { Modal, Form, Radio, Input, message } from 'antd';
import { createApp } from '@/src/api';
import { AppTypes, AppType, ProjectEnvType, ProjectEnvTypes } from '@/src/constants';
import { useAppStore, useUserStore } from '@/src/hooks';

interface AddApplicationIn {
  open: boolean;
  onClose: () => void;
}
export const AddApplication: React.FC<AddApplicationIn> = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const { appDispatch } = useAppStore();
  const { userInfo } = useUserStore();

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      open={open}
      destroyOnClose
      onOk={async () => {
        try {
          await form.validateFields();
          setLoading(true);
          const params = { ...form.getFieldsValue(), userKey: userInfo.account };
          await createApp(params);
          await appDispatch.getAppList(userInfo.account);
          setLoading(false);
          message.success('应用成功创建！');
          onClose();
        } catch (error) {
          setLoading(false);
          message.error('应用创建失败！');
        }
      }}
      onCancel={onClose}
      okButtonProps={{
        loading,
      }}
      title="创建应用"
    >
      <Form form={form}>
        <Form.Item name="appName" label="应用名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="appType"
          label="应用类型"
          initialValue={AppType.WEB}
          rules={[{ required: true }]}
        >
          <Radio.Group>
            {AppTypes.map(item => (
              <Radio value={item.value} disabled={item.value !== AppType.WEB} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
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
      </Form>
    </Modal>
  );
};
