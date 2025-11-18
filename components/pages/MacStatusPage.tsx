"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMacStatuses } from "@/app/actions/mac-status";

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

  const formatUptime = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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

  // Get the most recent status (single device)
  const latestStatus = statuses.length > 0 
    ? statuses.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]
    : null;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Mac Status
        </h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Mac Status
        </h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-900"
      >
        Mac Status
      </motion.h1>

      {!latestStatus ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No status data available yet.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Updated {formatRelativeTime(latestStatus.timestamp)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">OS Version</p>
              <p className="text-gray-900 font-medium">{latestStatus.osVersion || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Hardware</p>
              <p className="text-gray-900 font-medium">{latestStatus.hardwareModel || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">CPU Cores</p>
              <p className="text-gray-900 font-medium">{latestStatus.cpuCount || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">CPU Usage</p>
              <p className="text-gray-900 font-medium">
                {latestStatus.cpuUsagePercent != null 
                  ? `${latestStatus.cpuUsagePercent.toFixed(1)}%` 
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Memory Total</p>
              <p className="text-gray-900 font-medium">
                {formatMemory(latestStatus.totalMemory)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Memory Used</p>
              <p className="text-gray-900 font-medium">
                {latestStatus.memoryUsed 
                  ? formatMemory(latestStatus.memoryUsed) 
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Memory Free</p>
              <p className="text-gray-900 font-medium">
                {latestStatus.memoryFree 
                  ? formatMemory(latestStatus.memoryFree) 
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Memory Usage</p>
              <p className="text-gray-900 font-medium">
                {latestStatus.memoryUsagePercent != null 
                  ? `${latestStatus.memoryUsagePercent.toFixed(1)}%` 
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Battery</p>
              <p className="text-gray-900 font-medium">
                {latestStatus.batteryPercent != null 
                  ? `${latestStatus.batteryPercent}%` 
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Uptime</p>
              <p className="text-gray-900 font-medium">
                {formatUptime(latestStatus.uptime)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MacStatusPage;
