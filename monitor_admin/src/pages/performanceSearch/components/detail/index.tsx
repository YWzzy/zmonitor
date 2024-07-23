import React, { useEffect, useState } from 'react';
import { Drawer, Table, Tag, Col, Row } from 'antd';
import type { TableColumnsType } from 'antd';
import styles from './index.module.less';
import { getStatusColor } from '@/src/utils/getStatusColor';
import { parseUrl } from '@/src/utils';
import { getResourcesByPerformanceIds } from '@/src/api';
import { ShowTime } from '@/src/components';

interface DetailProps {
  data: (PerfamceReportMsg & PublicMsg) | null;
  open: boolean;
  onClose: () => void;
}

interface ShowPerformanceIn {
  performanceKey: PerformanceInKey;
  value: number;
  title: string;
}

const mapping = [
  {
    name: '域名',
    key: 'domain',
    render: item => <span>{parseUrl(item['pageUrl'])}</span>,
  },
  {
    name: '网页路径',
    key: 'pageUrl',
  },
  {
    name: '请求参数',
    key: 'query',
  },
  {
    name: '用户信息',
    key: 'markUserId',
    render: (item: PerfamceReportMsg & PublicMsg) =>
      [item?.markUserId, item?.userId].filter(item => item).join('、'),
  },
  {
    name: 'browser',
    key: 'browser',
    render: item => <span>{item['deviceInfo']['browser']}</span>,
  },
  {
    name: '设备类型',
    key: 'device_type',
    render: item => <span>{item['deviceInfo']['device_type']}</span>,
  },
  {
    name: 'UserAgent',
    key: 'ua',
    render: item => <span>{item['deviceInfo']['ua']}</span>,
  },
  {
    name: 'IP信息',
    key: 'ip',
    render: (item: PerfamceReportMsg & PublicMsg) =>
      [item?.ip, item?.country, item?.province, item?.city].filter(item => item).join(' - '),
  },
  {
    name: '性能指标',
    key: 'performance',
    render: (record: PerfamceReportMsg & PublicMsg) => {
      const map = [
        {
          name: '白屏时间',
          key: 'whiteTime',
        },
        {
          name: 'FCP',
          key: 'FCP',
        },
        {
          name: 'LCP',
          key: 'LCP',
        },
        {
          name: 'FID',
          key: 'FID',
        },
        {
          name: 'TTFB',
          key: 'TTFB',
        },
        {
          name: 'DNS解析时长',
          key: 'dnsTime',
        },
        {
          name: 'TCP链接时长',
          key: 'tcpTime',
        },
      ];
      return map.map(item => (
        <ShowPerformance
          key={item.key}
          performanceKey={item.key as PerformanceInKey}
          title={item.name}
          value={record[item.key]}
        />
      ));
    },
  },
  {
    name: '加载资源',
    key: 'rescources',
    render: (item: PerfamceReportMsg & PublicMsg) => <ResourceTable performanceIds={item.ids} />,
  },
];

const ShowPerformance: React.FC<ShowPerformanceIn> = ({ performanceKey, value, title }) => {
  const color = getStatusColor(value, performanceKey);

  return (
    <Tag color={color} style={{ marginBottom: 10 }}>
      {title}:{value && value.toFixed(2)}
      <small>ms</small>
    </Tag>
  );
};

const ResourceTable: React.FC<{ performanceIds: string[] }> = ({ performanceIds }) => {
  const [loading, setLoading] = useState(false);
  const [resourcesData, setResourcesData] = useState([]);

  useEffect(() => {
    const fetchResourcesData = async () => {
      setLoading(true);
      try {
        const { data } = await getResourcesByPerformanceIds({ ids: performanceIds });
        setResourcesData(data);
      } catch (error) {
        console.error('Failed to fetch resources data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResourcesData();
  }, [performanceIds]);

  const columns: TableColumnsType<ResourceStatus> = [
    {
      title: '资源Url',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      fixed: 'left',
    },
    {
      title: '资源大小',
      dataIndex: 'transferSize',
      key: 'transferSize',
      align: 'center',
      width: 80,
      render: value => (
        <span>
          {value ? value.toFixed(2) : '-'}
          <small>kb</small>
        </span>
      ),
    },
    {
      title: '加载耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 50,
      align: 'center',
      render: (val: number) => <ShowTime name="requestTime" value={val} />,
    },
    {
      title: '发起类型',
      dataIndex: 'initiatorType',
      key: 'initiatorType',
      width: 60,
      align: 'center',
    },
    {
      title: '传输类型',
      dataIndex: 'deliveryType',
      key: 'deliveryType',
      width: 60,
      align: 'center',
    },
    {
      title: '响应状态码',
      dataIndex: 'responseStatus',
      key: 'responseStatus',
      width: 60,
      align: 'center',
    },
    {
      title: '发生时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 80,
      align: 'center',
      render: value => new Date(value).toLocaleString(),
    },
  ];

  return (
    <Table
      loading={loading}
      scroll={{
        x: 1300,
      }}
      columns={columns}
      dataSource={resourcesData}
      pagination={null}
    />
  );
};

export const Detail: React.FC<DetailProps> = ({ data, open, onClose }) => (
  <Drawer open={open} onClose={onClose} width={800} destroyOnClose title="详情信息">
    {data
      ? mapping.map(item => (
          <Row key={item.key}>
            <Col span={3} className={styles.label}>
              {item.name}:
            </Col>
            <Col span={20} className={styles.value}>
              {item.render ? item.render(data) : data?.[item.key] || '-'}
            </Col>
          </Row>
        ))
      : null}
  </Drawer>
);
