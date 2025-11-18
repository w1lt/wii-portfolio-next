"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMacStatuses } from "@/app/actions/mac-status";

interface Process {
  name: string;
  memory: number;
  pid: number;
}

interface MacStatus {
  id: string;
  deviceId: string;
  hostname: string | null;
  osVersion: string | null;
  hardwareModel: string | null;
  cpuCount: number | null;
  cpuUsagePercent: number | null;
  totalMemory: string | null;
  memoryUsed: string | null;
  memoryFree: string | null;
  memoryUsagePercent: number | null;
  uptime: number | null;
  batteryPercent: number | null;
  isCharging: boolean | null;
  screenBrightness: number | null;
  wifiSSID: string | null;
  wifiRSSI: number | null;
  activeProcessCount: number | null;
  topProcessesByMemory: Process[] | null;
  timestamp: string;
  receivedAt: string;
}

function MacStatusPage() {
  const [statuses, setStatuses] = useState<MacStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatuses();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatuses = async () => {
    try {
      const data = await getMacStatuses();
      setStatuses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load statuses");
    } finally {
      setLoading(false);
    }
  };

  const formatMemory = (bytes: string | null) => {
    if (!bytes) return "N/A";
    const gb = Number(bytes) / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  const getWifiSignalStrength = (rssi: number | null) => {
    if (rssi === null) return "N/A";
    if (rssi >= -50) return "Excellent";
    if (rssi >= -60) return "Good";
    if (rssi >= -70) return "Fair";
    return "Poor";
  };

  const getProgressColor = (
    percent: number | null,
    type: "cpu" | "memory" | "battery" = "cpu"
  ) => {
    if (percent === null) return "bg-gray-300";
    if (type === "battery") {
      if (percent > 50) return "bg-green-500";
      if (percent > 20) return "bg-yellow-500";
      return "bg-red-500";
    }
    if (percent < 50) return "bg-green-500";
    if (percent < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get the most recent status (single device)
  const latestStatus =
    statuses.length > 0
      ? statuses.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]
      : null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto p-6 bg-white rounded-lg"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Mac Status
        </h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto p-6 bg-white rounded-lg"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Mac Status
        </h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-white rounded-lg"
    >
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        Mac Status
      </h1>

      {!latestStatus ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No status data available yet.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Performance Metrics - Horizontal Charts */}
          <div className="space-y-3">
            {/* CPU Usage */}
            {latestStatus.cpuUsagePercent != null && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 font-medium">CPU</span>
                  <span className="text-sm text-gray-900 font-bold">
                    {latestStatus.cpuUsagePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${latestStatus.cpuUsagePercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-2.5 rounded-full ${getProgressColor(
                      latestStatus.cpuUsagePercent,
                      "cpu"
                    )}`}
                  />
                </div>
              </div>
            )}

            {/* Memory Usage */}
            {latestStatus.memoryUsagePercent != null && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 font-medium">
                    Memory
                  </span>
                  <span className="text-sm text-gray-900 font-bold">
                    {latestStatus.memoryUsagePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${latestStatus.memoryUsagePercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-2.5 rounded-full ${getProgressColor(
                      latestStatus.memoryUsagePercent,
                      "memory"
                    )}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>
                    {latestStatus.memoryUsed
                      ? formatMemory(latestStatus.memoryUsed)
                      : "N/A"}{" "}
                    / {formatMemory(latestStatus.totalMemory)}
                  </span>
                </div>
              </div>
            )}

            {/* Battery */}
            {latestStatus.batteryPercent != null && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 font-medium">
                    Battery {latestStatus.isCharging && "(Charging)"}
                  </span>
                  <span className="text-sm text-gray-900 font-bold">
                    {latestStatus.batteryPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${latestStatus.batteryPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-2.5 rounded-full ${getProgressColor(
                      latestStatus.batteryPercent,
                      "battery"
                    )}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Info - Compact Horizontal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-2 border-t border-gray-200">
            {latestStatus.screenBrightness != null && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Screen</p>
                <p className="text-gray-900 font-medium text-sm">
                  {latestStatus.screenBrightness.toFixed(0)}%
                </p>
              </div>
            )}
            {latestStatus.wifiSSID && (
              <div>
                <p className="text-xs text-gray-500 mb-1">WiFi</p>
                <p
                  className="text-gray-900 font-medium text-sm truncate"
                  title={latestStatus.wifiSSID}
                >
                  {latestStatus.wifiSSID}
                </p>
                {latestStatus.wifiRSSI != null && (
                  <p className="text-xs text-gray-500">
                    {getWifiSignalStrength(latestStatus.wifiRSSI)} (
                    {latestStatus.wifiRSSI} dBm)
                  </p>
                )}
              </div>
            )}
            {latestStatus.activeProcessCount != null && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Processes</p>
                <p className="text-gray-900 font-medium text-sm">
                  {latestStatus.activeProcessCount}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-gray-900 font-medium text-sm">
                {formatRelativeTime(latestStatus.timestamp)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MacStatusPage;
