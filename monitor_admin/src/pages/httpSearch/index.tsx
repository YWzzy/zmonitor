import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Radio, Table } from 'antd';
import dayjs from 'dayjs';
import { Card } from '@/src/components';
import { getZMonitorHttpList } from '@/src/api';
import { useAppStore, useQueryParams } from '@/src/hooks';
import { httpTableColumns } from '@/src/components/httpTableColumns';

const defaultSize = 10;

const HttpSearch = () => {
  const { state } = useQueryParams();
  const { url: urlParam, time: timeParam, status: statusParam } = state || {};

  const endDate = timeParam ? dayjs(Number(timeParam)) : dayjs();
  const startDate = endDate;

  // Initializing form values
  const initialValues = {
    url: urlParam || '',
    date: [startDate, endDate],
    requestType: statusParam || '',
  };


  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const { active } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [pagination, setPageIn] = useState({
    current: 1,
    pageSize: defaultSize,
  });

  const [sorter, setSorter] = useState({
    sorterName: '',
    sorterKey: null,
  });

  const [total, setTotal] = useState(0);

  const toSearch = async () => {
    const { url, date, requestType } = form.getFieldsValue();
    const query = {
      from: 1,
      size: defaultSize,
      appId: active,
      url,
      beginTime: date ? dayjs(date[0].format('YYYY-MM-DD 00:00:00')).valueOf() : undefined,
      endTime: date ? dayjs(date[1].format('YYYY-MM-DD 23:59:59')).valueOf() : undefined,
      requestType,
      sorterName: sorter.sorterKey ? sorter.sorterName : '',
      sorterKey: sorter.sorterKey ? (sorter.sorterKey === 'ascend' ? 'asc' : 'desc') : '',
    };
    search(query);
    setPageIn({
      current: 1,
      pageSize: defaultSize,
    });
    setSorter({
      sorterName: '',
      sorterKey: '',
    });
  };

  const toReset = () => {
    setPageIn({
      current: 1,
      pageSize: defaultSize,
    });
    setSorter({
      sorterName: '',
      sorterKey: '',
    });
    form.resetFields();
    search({
      appId: active,
      from: 1,
      size: defaultSize,
      beginTime: dayjs(dayjs().format('YYYY-MM-DD 00:00:00')).valueOf(),
      endTime: dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf(),
    });
  };

  const onTableChange = (pagination, __, sorter: any) => {
    const { url, date, requestType } = form.getFieldsValue();
    const query = {
      from: pagination.current,
      size: pagination.pageSize,
      appId: active,
      url,
      beginTime: date ? dayjs(date[0].format('YYYY-MM-DD 00:00:00')).valueOf() : undefined,
      endTime: date ? dayjs(date[1].format('YYYY-MM-DD 23:59:59')).valueOf() : undefined,
      requestType,
      sorterName: sorter.order ? sorter.field : '',
      sorterKey: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '',
      projectEnv: import.meta.env.VITE_ENV,
    };
    setPageIn({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (sorter.order) {
      setSorter({
        sorterName: sorter.field,
        sorterKey: sorter.order,
      });
    } else {
      setSorter({
        sorterName: '',
        sorterKey: null,
      });
    }
    search(query);
  };

  const search = async (searchQuery) => {
    setLoading(true);
    const {
      data: { total, list },
    } = await getZMonitorHttpList(searchQuery);
    setTotal(total);
    setData(
      list.map(item => ({
        key: item.id,
        ...item,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (active) {
      if (statusParam) {
        toSearch();
      } else {
        toReset();
      }
    }
  }, [active, state]);

  return (
    <Card title="请求查询">
      <Form form={form} style={{ paddingBottom: 20 }} name="horizontal_login" layout="inline" initialValues={initialValues}>
        <Form.Item name="url" label="接口地址">
          <Input placeholder="请输入接口地址" />
        </Form.Item>
        <Form.Item name="date" label="日期">
          <DatePicker.RangePicker
            presets={[
              { label: '1天内', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
              { label: '7天内', value: [dayjs().subtract(7, 'days'), dayjs().endOf('day')] },
              { label: '30天内', value: [dayjs().subtract(1, 'month'), dayjs().endOf('day')] },
            ]} />
        </Form.Item>
        <Form.Item name="requestType" label="请求状态">
          <Radio.Group>
            <Radio value="">不限</Radio>
            <Radio value="done">成功</Radio>
            <Radio value="error">失败</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button onClick={toReset}>重置</Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={toSearch}>
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        sticky
        key="id"
        loading={loading}
        columns={httpTableColumns(sorter)}
        dataSource={data}
        onChange={onTableChange}
        pagination={{
          ...pagination,
          total,
        }}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
};

export default HttpSearch;
