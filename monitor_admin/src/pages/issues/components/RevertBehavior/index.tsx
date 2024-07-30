import React from 'react';
import { Drawer, Timeline, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface ActivityItem {
  category: string;
  status: string;
  data: any; // Adjust data type according to your actual structure
  message: string;
  createTime: string;
  time: string;
}

interface RevertBehaviorProps {
  breadcrumbMsg: {
    open: boolean;
    breadcrumb: ActivityItem[];
  };
  onClose: () => void;
}

export const RevertBehavior: React.FC<RevertBehaviorProps> = ({ breadcrumbMsg, onClose }) => {
  const navigate = useNavigate();

  const handleViewClick = (data: object | undefined) => {
    navigate('/httpSearch', { state: data });
  };

  const getActivityContent = (item: ActivityItem): JSX.Element => {
    switch (item.category) {
      case 'Click':
        return <span>用户点击dom: {item.data}</span>;
      case 'Http':
        return (
          <span>
            调用接口: {item.data.url}, {item.status === 'ok' ? '请求成功' : '请求失败'}
            <Button
              type="link"
              onClick={() => handleViewClick(item.data)}
            >
              查看
            </Button>
          </span>
        );
      case 'Code_Error':
        return <span>代码报错：{item.data.message}</span>;
      case 'Resource_Error':
        return <span>加载资源报错：{item.data.message}</span>;
      case 'Route':
        return <span>路由变化：从 {item.data.from} 页面切换到 {item.data.to} 页面</span>;
      default:
        return <span></span>;
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
              {getActivityContent(item)}
              <span>{dayjs(Number(item.time)).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Drawer>
  );
};
