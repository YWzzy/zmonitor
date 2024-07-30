import React, { useEffect, useState } from 'react';
import { Layout, Menu, Modal, Select, Button, Drawer } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import logoPng from '@/src/images/logo.png';
import { checkAppStatus, AddApplication } from '@/src/components';
import { munuRouters, hasAppRouters } from '@/src/router';
import { useAppStore } from '@/src/hooks';
import { ConfigApplication } from '@/src/components/configApplication';
import { loginOut } from '@/src/api';

const { Sider } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setKey(location.pathname);
  }, [location]);

  const { pathname } = useLocation();
  const [openMenuKey, setKey] = useState(pathname);

  const { apps, active, showAddModal, showConfigModal, appDispatch, curConfAppId } = useAppStore();

  const menus = React.useMemo(() => {
    const menus = apps.length < 0 ? munuRouters : [...munuRouters, ...hasAppRouters];
    return menus.map(item => ({
      key: item.path,
      icon: React.createElement(item.icon),
      label: item.name,
    }));
  }, [apps.length]);

  const renderSidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 p-4 text-white bg-blue-500">
        <img src={logoPng} alt="" className="w-8 h-8 mr-2 rounded-full" />
        <span className={`${collapsed ? 'hidden' : ''} lg:inline`}>前端监控平台</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Sider
          breakpoint="lg"
          collapsed={collapsed}
          collapsible
          trigger={null}
          onCollapse={value => setCollapsed(value)}
          className="h-full"
        >
          <Menu
            selectedKeys={[openMenuKey]}
            onClick={val => {
              setKey(val.key);
              setMobileDrawerOpen(false);
            }}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['4']}
            onSelect={info => {
              navigate(info.key);
            }}
            items={menus}
          />
        </Sider>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:block">
        {renderSidebar()}
      </div>

      {/* Mobile drawer */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        visible={mobileDrawerOpen}
        bodyStyle={{ padding: 0 }}
        width="240px"
      >
        {renderSidebar()}
      </Drawer>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 bg-white shadow-sm max-w-[100%]">
          <div className="flex items-center">
            <Button
              icon={mobileDrawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="mr-4 lg:hidden"
            />
            {apps.length > 0 && (
              <Select
                className="w-40 mr-4"
                onChange={val => {
                  appDispatch.updateActive(val);
                }}
                value={active}
              >
                {apps.map(item => (
                  <Select.Option key={item.id} value={item.appId}>
                    {item.appName}
                  </Select.Option>
                ))}
              </Select>
            )}
            <Button
              type="primary"
              onClick={() => {
                appDispatch.updateAddModalStatus(true);
              }}
              icon={<PlusCircleFilled />}
            >
              创建应用
            </Button>
          </div>
          <PoweroffOutlined
            onClick={() => {
              Modal.confirm({
                title: '确定退出登录？',
                okText: '确定',
                cancelText: '取消',
                onOk: async () => {
                  await loginOut();
                  dispatch.user.resetUserInfo();
                  dispatch.app.resetAppModel();
                  navigate('/login');
                },
              });
            }}
            className="cursor-pointer"
          />
        </header>
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100 max-w-[100%]">
          <Outlet />
        </main>
      </div>

      <AddApplication
        open={showAddModal}
        onClose={() => {
          appDispatch.updateAddModalStatus(false);
        }}
      />
      <ConfigApplication
        open={showConfigModal}
        appId={curConfAppId}
        onClose={() => {
          appDispatch.updateConfigModalStatus(false);
        }}
      />
    </div>
  );
}

export default checkAppStatus(Home);