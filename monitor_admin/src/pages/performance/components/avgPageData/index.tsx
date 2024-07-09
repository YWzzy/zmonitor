import React, { useEffect, useState } from 'react';
import { DatePicker, Table, Input } from 'antd';
import type { TableColumnsType } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Card, HighlightText, ShowTime } from '@/src/components';
import { getPageAvgPerformance } from '@/src/api';
import { RootState } from '@/src/models/store';

interface DataType {
  pageUrl: string;
  whiteTime: number;
  FCP: number;
  LCP: number;
  FID: number;
  TTFB: number;
  dnsTime: number;
  tcpTime: number;
}

export const AvgPageData = () => {
  const { active } = useSelector((state: RootState) => state.app);

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchUrl, setUrl] = useState('');

  const [date, setDate] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().add(-7, 'day'), dayjs()]);

  const getDataValue = (data: object) => {
    const obj = {};
    const keys = Object.keys(data);
    for (const key of keys) {
      const item = data[key];
      if (item?.value || item.value === 0 || item.value === null) {
        obj[key] = item.value;
      } else {
        obj[key] = item;
      }
    }
    return obj;
  };

  const getData = async () => {
    setLoading(true);
    const { data } = await getPageAvgPerformance({
      appId: active,
      beginTime: date[0].format('YYYY-MM-DD 00:00:00'),
      endTime: date[1].format('YYYY-MM-DD 23:59:59'),
    });
    const res = data.map(item => getDataValue(item));
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (active && date) {
      getData();
    }
  }, [active, date]);

  const columns: TableColumnsType<DataType> = [
    {
      title: (
        <Input
          placeholder="请输入网页链接"
          value={searchUrl}
          onChange={e => {
            setUrl(e.target.value);
          }}
        />
      ),
      dataIndex: 'key',
      key: 'key',
      width: 200,
      fixed: 'left',
      render: val => <HighlightText searchTerm={searchUrl} text={val} />,
    },
    {
      title: '白屏时间',
      dataIndex: 'whiteTime',
      key: 'whiteTime',
      width: 100,
      sorter: (a, b) => a.whiteTime - b.whiteTime,
      render: (val: number) => <ShowTime name="whiteTime" value={val} />,
    },
    {
      title: 'FCP',
      dataIndex: 'FCP',
      key: 'FCP',
      width: 100,
      sorter: (a, b) => a.FCP - b.FCP,
      render: (val: number) => <ShowTime name="FCP" value={val} />,
    },
    {
      title: 'LCP',
      dataIndex: 'LCP',
      key: 'LCP',
      width: 100,
      sorter: (a, b) => a.LCP - b.LCP,
      render: (val: number) => <ShowTime name="LCP" value={val} />,
    },
    {
      title: 'FID',
      dataIndex: 'FID',
      key: 'FID',
      width: 100,
      sorter: (a, b) => a.FID - b.FID,
      render: (val: number) => <ShowTime name="FID" value={val} />,
    },
    {
      title: 'TTFB',
      dataIndex: 'TTFB',
      key: 'TTFB',
      width: 100,
      sorter: (a, b) => a.TTFB - b.TTFB,
      render: (val: number) => <ShowTime name="TTFB" value={val} />,
    },
    {
      title: 'DNS解析时长',
      dataIndex: 'dnsTime',
      key: 'dnsTime',
      width: 120,
      sorter: (a, b) => a.dnsTime - b.dnsTime,
      render: (val: number) => <ShowTime name="dnsTime" value={val} />,
    },
    {
      title: 'TCP链接时长',
      dataIndex: 'tcpTime',
      key: 'tcpTime',
      width: 120,
      sorter: (a, b) => a.tcpTime - b.tcpTime,
      render: (val: number) => <ShowTime name="tcpTime" value={val} />,
    },
  ];

  const tableData = React.useMemo(
    () => data.filter(item => item.key.indexOf(searchUrl) !== -1),
    [data, searchUrl]
  );
  return (
    <Card
      title="TOP性能分析"
      prefixHeadRight={
        <DatePicker.RangePicker
          value={date}
          disabledDate={current => current.isAfter(dayjs())}
          onChange={value => {
            setDate(value);
          }}
        />
      }
    >
      <Table
        columns={columns}
        loading={loading}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
};
