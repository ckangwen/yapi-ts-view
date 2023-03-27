import { useEffect, useState } from "react";

import { Spin, Descriptions, Tag } from "antd";
import { useRouter } from "next/router";

import useYApiConfig from "hooks/useYApiConfig";
import { API } from "utils/api";
import { highlightCode } from "utils/shiki";

export default function Page() {
  const router = useRouter();
  const { config: yApiConfig, ready: yApiReady } = useYApiConfig();

  const context = API.useContext();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [interfaceVO, setInterfaceVO] = useState<{
    title: string;
    path: string;
    method: string;
  } | null>(null);
  useEffect(() => {
    if (yApiConfig.token && yApiConfig.url && yApiReady) {
      setLoading(true);
      context.yapi.getInterface
        .fetch(Number(router.query.id))
        .then((res) => {
          if (!res.data) return "";
          setInterfaceVO({
            title: res.data.title,
            path: res.data.path,
            method: res.data.method,
          });
          return highlightCode(res.code);
        })
        .then((res) => {
          setCode(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [yApiConfig, yApiReady, context, router]);

  return (
    <div>
      <Spin spinning={loading}>
        <Descriptions title="基本信息">
          <Descriptions.Item label="接口名称">
            <span>{interfaceVO?.title || ""}</span>
          </Descriptions.Item>
          <Descriptions.Item label="接口路径">
            <Tag color="blue">{interfaceVO ? interfaceVO.method.toUpperCase() : ""}</Tag>
            <span>{interfaceVO?.path || ""}</span>
          </Descriptions.Item>
        </Descriptions>
        <div className="flex flex-col bg-[#121212] px-3 rounded-md">
          <div className="flex items-center mt-2">
            <span className="inline-block w-[14px] h-[14px] rounded-full mr-2 bg-[#ff5f57]" />
            <span className="inline-block w-[14px] h-[14px] rounded-full mr-2 bg-[#febc2e]" />
            <span className="inline-block w-[14px] h-[14px] rounded-full mr-2 bg-[#28c840]" />
          </div>

          <div className="mt-2">
            <div
              dangerouslySetInnerHTML={{
                __html: code,
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
}
