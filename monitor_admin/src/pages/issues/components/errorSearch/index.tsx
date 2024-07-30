/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Button, DatePicker, Form, Table, Popover, Space, message } from 'antd';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import dayjs from 'dayjs';
import { Card } from '@/src/components';
import { getIssueErrorListPage, getRecordScreenFile } from '@/src/api';
import SourceMapUtils from '@/src/utils/sourcemap';
import { useAppStore } from '@/src/hooks';
import { CodeAnalysisDrawer, RevertBehavior, RecordScreen } from '@/src/pages/issues/components';
import styles from './index.module.less';

export interface ErrorSearchHandle {
  toSearch: () => void;
}

export const ErrorSearch = forwardRef<ErrorSearchHandle>((props, ref) => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const { active } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [codeMsg, setCodeMsg] = useState({
    open: false,
    code: [],
    originalPosition: {
      source: '',
      line: 0,
      column: 0,
      name: '',
      hightLine: 0,
    },
    start: 0,
    end: 20,
  });

  const [breadcrumbMsg, setBreadcrumbMsg] = useState({
    open: false,
    breadcrumb: [],
  });
  const [recordScreenDataMsg, setRecordScreenDataMsg] = useState({
    open: false,
    recordScreenData: '',
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const toSearch = async (page = 1, pageSize = 10) => {
    const { date } = form.getFieldsValue();
    const query = {
      appId: active,
      beginTime: date ? dayjs(date[0].format('YYYY-MM-DD 00:00:00')).valueOf() : undefined,
      endTime: date ? dayjs(date[1].format('YYYY-MM-DD 23:59:59')).valueOf() : undefined,
      page,
      pageSize,
      projectEnv: import.meta.env.VITE_ENV
    };
    search(query);
  };

  const toReset = () => {
    form.resetFields();
    toSearch(1, pagination.pageSize);
  };

  const search = async searchQuery => {
    setLoading(true);
    const {
      data: { total, list },
    } = await getIssueErrorListPage(searchQuery);

    setTableData(list);
    setPagination({
      ...pagination,
      current: searchQuery.page,
      pageSize: searchQuery.pageSize,
      total,
    });
    setLoading(false);
  };

  useEffect(() => {
    toSearch();
  }, []);

  useImperativeHandle(ref, () => ({
    toSearch,
  }));

  const handleTableChange = (pagination: TablePaginationConfig) => {
    toSearch(pagination.current, pagination.pageSize);
  };

  const columns: TableColumnsType<ErrorMsgItem> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '报错信息',
      dataIndex: 'message',
      key: 'message',
      width: 200,
      align: 'center',
      render: text => (
        <Popover content={<div className="popoverContent">{text}</div>}>
          <div className={styles.tableCell}>{text}</div>
        </Popover>
      ),
    },
    {
      title: '报错页面',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
      width: 180,
      align: 'center',
      render: text => (
        <Popover content={<div className="popoverContent">{text}</div>}>
          <div className={styles.tableCell}>{text}</div>
        </Popover>
      ),
    },
    {
      title: '报错时间',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      align: 'center',
      render: (text, record) => (
        <span className={styles.tableCell}>
          {record.createTime && dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '项目编号',
      dataIndex: 'appId',
      key: 'appId',
      align: 'center',
      render: text => <div className={styles.tableCell}>{text}</div>,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
      render: text => <div className={styles.tableCell}>{text}</div>,
    },
    {
      title: 'SDK版本',
      dataIndex: 'sdkVersion',
      key: 'sdkVersion',
      align: 'center',
      render: text => <div className={styles.tableCell}>{text}</div>,
    },
    {
      title: '浏览器信息',
      dataIndex: 'deviceInfo',
      key: 'browserInfo',
      align: 'center',
      render: (text, record) => (
        <Popover content={<div className="popoverContent">{record.deviceInfo.browser}</div>}>
          <div className={styles.tableCell}>{record.deviceInfo.browser}</div>
        </Popover>
      ),
    },
    {
      title: '操作系统',
      dataIndex: 'deviceInfo',
      key: 'osInfo',
      align: 'center',
      render: (text, record) => (
        <Popover content={<div className="popoverContent">{record.deviceInfo.os}</div>}>
          <div className={styles.tableCell}>{record.deviceInfo.os}</div>
        </Popover>
      ),
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space>
          {record.type === 'error' || record.type === 'unhandledrejection' ? (
            <Button type="link" block onClick={() => revertCode(record)}>
              源码
            </Button>
          ) : null}
          {record.recordScreenId ? (
            <Button type="link" block onClick={() => playRecord(record.recordScreenId)}>
              录屏
            </Button>
          ) : null}
          {record.breadcrumb.length ? (
            <Button type="link" block onClick={() => revertBehavior(record)}>
              行为
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  // 还原错误代码
  const revertCode = async record => {
    try {
      await SourceMapUtils.findCodeBySourceMap({
        ...record,
      }).then(res => {
        if (res)
          setCodeMsg({
            ...res,
            open: true,
          });
      });
    } catch (error) {
      message.error(`还原错误代码失败:${error}`);
    }
  };

  // 播放录屏
  const playRecord = async recordScreenId => {
    const { data } = await getRecordScreenFile({ id: recordScreenId });
    if (data) {
      setRecordScreenDataMsg({
        open: true,
        recordScreenData: data,
      });
    }
  };

  // 查看用户行为
  const revertBehavior = record => {
    setBreadcrumbMsg({
      open: true,
      breadcrumb: record.breadcrumb,
    });
  };

  useEffect(() => {
    if (active) {
      toReset();
    }
  }, [active]);

  return (
    <Card title="异常查询">
      <Form form={form} style={{ paddingBottom: 20 }} name="horizontal_login" layout="inline">
        <Form.Item name="date" label="日期" initialValue={[dayjs(), dayjs()]}>
          <DatePicker.RangePicker
            presets={[
              { label: '1天内', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
              { label: '7天内', value: [dayjs().subtract(7, 'days'), dayjs().endOf('day')] },
              { label: '30天内', value: [dayjs().subtract(1, 'month'), dayjs().endOf('day')] },
            ]} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => toSearch(pagination.current, pagination.pageSize)}>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={toReset}>重置</Button>
        </Form.Item>
      </Form>

      <Table
        rowKey={'id'}
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1300 }}
      />
      <RevertBehavior
        breadcrumbMsg={breadcrumbMsg}
        onClose={() => setBreadcrumbMsg({ ...breadcrumbMsg, open: false })}
      />
      <CodeAnalysisDrawer
        codeMsg={codeMsg}
        onClose={() => setCodeMsg({ ...codeMsg, open: false })}
      />
      <RecordScreen
        recordScreenDataMsg={recordScreenDataMsg}
        onClose={() => setRecordScreenDataMsg({ ...recordScreenDataMsg, open: false })}
      />
    </Card>
  );
});
