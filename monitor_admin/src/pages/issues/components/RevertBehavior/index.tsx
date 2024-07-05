/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Drawer, Timeline } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface ActivityItem {
  category: string;
  status: string;
  data: any; // Adjust data type according to your actual structure
  message: string;
  createTime: string;
}

interface RevertBehaviorProps {
  breadcrumbMsg: {
    open: boolean;
    breadcrumb: ActivityItem[];
  };
  onClose: () => void;
}

export const RevertBehavior: React.FC<RevertBehaviorProps> = ({ breadcrumbMsg, onClose }) => {
  const getActivityContent = (item: ActivityItem): string => {
    switch (item.category) {
      case 'Click':
        return `用户点击dom: ${item.data}`;
      case 'Http':
        return `调用接口: ${item.data.url}, ${item.status === 'ok' ? '请求成功' : '请求失败'}`;
      case 'Code_Error':
        return `代码报错：${item.data.message}`;
      case 'Resource_Error':
        return `加载资源报错：${item.message}`;
      case 'Route':
        return `路由变化：从 ${item.data.from} 页面切换到 ${item.data.to} 页面`;
      default:
        return '';
    }
  };

  const getActivityIcon = (item: ActivityItem): React.ReactNode => {
    return item.status === 'ok' ? (
      <CheckOutlined style={{ color: '#5FF713' }} />
    ) : (
      <CloseOutlined style={{ color: '#F70B0B' }} />
    );
  };

  return (
    <Drawer
      width={800}
      title="用户行为 Timeline"
      placement="right"
      onClose={onClose}
      open={breadcrumbMsg.open}
    >
      <Timeline>
        {breadcrumbMsg.breadcrumb.map((item, index) => (
          <Timeline.Item
            key={index}
            dot={getActivityIcon(item)}
            color={item.status === 'ok' ? '#5FF713' : '#F70B0B'}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <span>{getActivityContent(item)}</span>
              <span>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Drawer>
  );
};
