import { useMemo, useState } from "react";

import { useMount } from "ahooks";
import createDebug from "debug";
import { useRouter } from "next/router";

import { API } from "utils/api";
import { tryJsonParse } from "utils/helper";
import { atou, utoa } from "utils/string";

const debug = createDebug("YApi");

export interface YApiConfig {
  url: string;
  token: string;
}

const getYApiConfigFromUrl = (): YApiConfig => {
  const queryValue = new URLSearchParams(window.location.search).get("config") || "";

  console.log("queryValue", tryJsonParse(atou(queryValue), {}), atou(queryValue));
  return {
    url: "",
    token: "",
    ...(queryValue ? tryJsonParse(atou(queryValue), {}) : {}),
  };
};

function onYApiConfigChange(config: YApiConfig) {
  const query = new URLSearchParams({
    config: utoa(JSON.stringify(config)),
  });
  const url = new URL(window.location.href);
  url.search = query.toString();
  window.history.replaceState(undefined, "", url.toString());
}

export default function useYApiConfig() {
  const [config, setConfigState] = useState<YApiConfig>({
    url: "",
    token: "",
  });
  const base64Config = useMemo(() => {
    return utoa(JSON.stringify(config));
  }, [config]);
  const [ready, setReady] = useState(false);
  const { mutate } = API.yapi.setConfig.useMutation({
    onSuccess: (data) => {
      debug("update YApi config success", data);

      setReady(Boolean(data.token && data.url));
    },
    onError: () => {
      debug("update YApi config error");
      setReady(true);
    },
  });

  const setConfig = (data: YApiConfig) => {
    setConfigState(data);
    onYApiConfigChange(data);
    mutate(data);
  };

  useMount(() => {
    const configFromUlr = getYApiConfigFromUrl();
    setConfig(configFromUlr);
  });

  return {
    config,
    setConfig,
    ready,
    base64Config,
  };
}
