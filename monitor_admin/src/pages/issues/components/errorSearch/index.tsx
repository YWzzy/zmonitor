import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Table, Popover, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { Card } from '@/src/components';
import { getIssueErrorList } from '@/src/api';
import SourceMapUtils from '@/src/utils/sourcemap';
import { useAppStore } from '@/src/hooks';
import { CodeAnalysisDrawer, RevertBehavior } from '@/src/pages/issues/components';

export const ErrorSearch = () => {
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

  const toSearch = async () => {
    const { date } = form.getFieldsValue();
    const query = {
      appId: active,
      beginTime: date ? date[0].format('YYYY-MM-DD 00:00:00') : undefined,
      endTime: date ? date[1].format('YYYY-MM-DD 23:59:59') : undefined,
    };
    search(query);
  };

  const toReset = () => {
    form.resetFields();
    search({
      appId: active,
      beginTime: dayjs().format('YYYY-MM-DD 00:00:00'),
      endTime: dayjs().format('YYYY-MM-DD 23:59:59'),
    });
  };

  const search = async searchQuery => {
    setLoading(true);
    const { data } = await getIssueErrorList(searchQuery);

    setTableData(data);
    setLoading(false);
  };

  useEffect(() => {
    toSearch();
  }, []);

  const columns: TableColumnsType<ErrorMsgItem> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '报错信息',
      dataIndex: 'message',
      key: 'message',
      width: 200,
      align: 'left',
      render: text => (
        <Popover content={<div className="popoverContent">{text}</div>}>
          <div className="tableCell">{text}</div>
        </Popover>
      ),
    },
    {
      title: '报错页面',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
      width: 100,
      align: 'left',
      render: text => (
        <Popover content={<div className="popoverContent">{text}</div>}>
          <div className="tableCell">{text}</div>
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
        <span className="tableCell">
          {record.time
            ? dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')
            : dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '项目编号',
      dataIndex: 'apikey',
      key: 'apikey',
      align: 'center',
      render: text => <div className="tableCell">{text}</div>,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
      render: text => <div className="tableCell">{text}</div>,
    },
    {
      title: 'SDK版本',
      dataIndex: 'sdkVersion',
      key: 'sdkVersion',
      align: 'center',
      render: text => <div className="tableCell">{text}</div>,
    },
    {
      title: '浏览器信息',
      dataIndex: 'deviceInfo',
      key: 'browserInfo',
      align: 'center',
      render: (text, record) => (
        <Popover content={<div className="popoverContent">{record.deviceInfo.browser}</div>}>
          <div className="tableCell">{record.deviceInfo.browser}</div>
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
          <div className="tableCell">{record.deviceInfo.os}</div>
        </Popover>
      ),
    },
    {
      title: '操作',
      width: 200,
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
          {record.breadcrumb ? (
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
    await SourceMapUtils.findCodeBySourceMap({
      ...record,
    }).then(res => {
      setCodeMsg({
        ...res,
        open: true,
      });
      // if (revertRef.current) {
      //   revertRef.current.innerHTML = res; // 在事件处理函数中设置innerHTML
      // }
    });
  };

  const playRecord = recordScreenId => {
    // 播放录屏的逻辑
    console.log('播放录屏', recordScreenId);
  };

  // 查看用户行为
  const revertBehavior = record => {
    console.log('查看用户行为', record);
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
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={toSearch}>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={toReset}>重置</Button>
        </Form.Item>
      </Form>

      <Table
        sticky
        rowKey={'id'}
        loading={loading}
        columns={columns}
        dataSource={tableData}
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
    </Card>
  );
};
