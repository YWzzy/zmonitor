import React, { useEffect, useState } from 'react';
import { Radio, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { showHttpDetail } from '@/src/utils/enventBus';
import { Card } from '@/src/components';
import { getHttpErrorRank } from '@/src/api';
import { RootState } from '@/src/models/store';
import { TableItem } from '@/src/components/tableItem';

interface DataType {
  requestType: string;
  method: string;
  url: string;
  type: string;
  count: number;
}

export const HighFrequency = () => {
  const [day, setDay] = useState(1);

  const { active } = useSelector((state: RootState) => state.app);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const columns: TableColumnsType<DataType> = [
    {
      title: '接口URL',
      dataIndex: 'url',
      key: 'url',
      align: 'center',
      render: val => TableItem.renderUrl(val, 60, false),
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      width: 100,
    },
    {
      title: '错误量',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <a
          onClick={() => {
            showHttpDetail.publish({
              link: record.url,
              // requestType: 'error',
              beginTime: String(dayjs().add(-(day - 1), 'day').startOf('day').valueOf()),
              endTime: String(dayjs().endOf('day').valueOf())
            });
          }}
        >
          查看详情
        </a>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);
    const { data } = await getHttpErrorRank({
      appId: active,
      beginTime: String(dayjs().add(-(day - 1), 'day').startOf('day').valueOf()),
      endTime: String(dayjs().endOf('day').valueOf())
    });
    const result = data.map(item => ({
      count: item.errorCount,
      ...item,
    }));
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    if (active) {
      getData();
    }
  }, [active, day]);

  return (
    <Card
      title="高频错误"
      prefixHeadRight={
        <Radio.Group
          value={day}
          onChange={e => {
            setDay(e.target.value);
          }}
          size="small"
        >
          <Radio.Button value={7}>7天内</Radio.Button>
          <Radio.Button value={3}>3天内</Radio.Button>
          <Radio.Button value={1}>今天</Radio.Button>
        </Radio.Group>
      }
    >
      <Table
        sticky
        rowKey="url"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          total: data.length,
          pageSize: 10,
        }}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
};
