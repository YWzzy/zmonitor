import { TableColumnsType, Tag } from 'antd';
import React from 'react';
import { SortOrder } from 'antd/es/table/interface';
import { TableItem } from '../tableItem';

export const httpTableColumns = (sorter: {
  sorterName: string;
  sorterKey: SortOrder;
}): TableColumnsType<RequestReportMsg & PublicMsg> => [
  {
    title: '接口地址',
    dataIndex: 'pageUrl',
    key: 'pageUrl',
    width: 220,
    align: 'left',
    fixed: 'left',
    render: pageUrl => TableItem.renderUrl(pageUrl, 30, true),
  },
  {
    title: '请求类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: 80,
  },
  {
    title: '状态码',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    render: (status, record) => (
      <Tag color={record.requestType === 'ok' ? '#1f8800' : '#c33300'}>{status}</Tag>
    ),
  },
  {
    title: '请求耗时',
    dataIndex: 'cost',
    key: 'cost',
    sorter: true,
    align: 'center',
    sortOrder: sorter.sorterName === 'cost' ? sorter.sorterKey : null,
    width: 120,
    render: val => TableItem.renderHttpCost(val),
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    key: 'method',
    align: 'center',
    width: 80,
  },
  // {
  //   title: '请求头信息',
  //   dataIndex: 'reqHeaders',
  //   key: 'reqHeaders',
  //   align: 'center',
  //   width: 120,
  //   render: (text) => TableItem.renderText(text, 10, false),
  // },
  {
    title: '请求体',
    dataIndex: 'reqBody',
    key: 'reqBody',
    width: 200,
    align: 'center',
    render: url => TableItem.renderUrl(url, 23, true),
  },
  {
    title: '时间',
    dataIndex: '@timestamp',
    key: '@timestamp',
    width: 200,
    align: 'center',
    render: time => TableItem.renderTime(time),
  },
];
