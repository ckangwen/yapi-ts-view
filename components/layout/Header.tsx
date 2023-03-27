import { useState } from "react";

import { SettingOutlined } from "@ant-design/icons";
import { Layout, Modal, Form, Input, Button } from "antd";

import useYApiConfig, { YApiConfig } from "hooks/useYApiConfig";

function YApiConfigForm({ onUpdateOpenState }: { onUpdateOpenState: (value: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  const { config: yApiConfig, setConfig: setYApiConfig } = useYApiConfig();

  const onFinish = (values: YApiConfig) => {
    setLoading(true);
    setYApiConfig(values);
    setTimeout(() => {
      setLoading(false);
    }, 300);
    onUpdateOpenState(false);
  };

  const onCancel = () => {
    onUpdateOpenState(false);
  };

  return (
    <Form
      name="config"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={yApiConfig}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Url"
        name="url"
        required
        rules={[{ required: true, message: "Please input yapi url!" }]}
      >
        <Input name="url" value={yApiConfig.url} />
      </Form.Item>

      <Form.Item
        label="Token"
        name="token"
        required
        rules={[{ required: true, message: "Please input your token!" }]}
      >
        <Input name="token" value={yApiConfig.token} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4 }} className="text-right mb-0">
        <Button htmlType="button" className="mr-4" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickTrigger = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Layout.Header className="bg-white flex items-center justify-between pl-4">
        <div className="w-[200px] h-[40px] rounded-sm bg-violet-300" />
        <Button icon={<SettingOutlined />} onClick={onClickTrigger} />
      </Layout.Header>
      <Modal title="Config" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <YApiConfigForm onUpdateOpenState={setIsModalOpen} />
      </Modal>
    </>
  );
}
