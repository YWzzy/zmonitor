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
      dataIndex: 'url',
      key: 'url',
      width: 220,
      align: 'left',
      fixed: 'left',
      render: url => TableItem.renderUrl(url, 30, true),
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
        <Tag color={record['status'] === 'ok' ? '#1f8800' : '#c33300'}>{status}</Tag>
      ),
    },
    {
      title: '请求耗时',
      dataIndex: 'elapsedTime',
      key: 'elapsedTime',
      sorter: true,
      align: 'center',
      sortOrder: sorter.sorterName === 'elapsedTime' ? sorter.sorterKey : null,
      width: 120,
      render: elapsedTime => TableItem.renderHttpCost(elapsedTime),
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      align: 'center',
      width: 80,
      render: (method, record) =>
      (
        <span>{record['requestData']?.method}</span>
      ),
    },
    {
      title: '请求头信息',
      dataIndex: 'reqHeaders',
      key: 'reqHeaders',
      align: 'center',
      width: 120,
      render: (reqHeaders, record) =>
      (
        TableItem.renderObject(record?.requestData?.headers, 50, false)
      )
    },
    {
      title: '请求体',
      dataIndex: 'reqBody',
      key: 'reqBody',
      width: 200,
      align: 'center',
      render: (reqBody, record) =>
      (
        TableItem.renderObject(record['requestData']?.data, 50, true)
      )
    },
    {
      title: '请求params',
      dataIndex: 'params',
      key: 'params',
      width: 200,
      align: 'center',
      render: (params, record) =>
      (
        TableItem.renderObject(record['requestData']?.params, 50, true)
      )
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 200,
      align: 'center',
      render: time => TableItem.renderTime(time),
    },
  ];
