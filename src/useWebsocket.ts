import { WebSocketManager } from "@/services/websocket";
import { getLocalStorage } from "@/utils/tools";
import { useEffect } from "react";
import { useModel } from "umi";

export default function useWebsocket() {
  const { onWebSocketMessage } = useModel('emitter')
  useEffect(() => {
    let cleaner: () => void
    WebSocketManager(getLocalStorage('account'), { onWebSocketMessage }).then(cl => cleaner = cl)
    return () => cleaner?.()
  }, []);
}