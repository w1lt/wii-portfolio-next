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
  totalMemory: string | null;
  uptime: number | null;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Group by deviceId
  const groupedByDevice = statuses.reduce((acc, status) => {
    const deviceId = status.deviceId;
    if (!acc[deviceId]) {
      acc[deviceId] = [];
    }
    acc[deviceId].push(status);
    return acc;
  }, {} as Record<string, MacStatus[]>);

  // Get latest status for each device
  const latestStatuses = Object.entries(groupedByDevice).map(
    ([, deviceStatuses]) => {
      return deviceStatuses.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
    }
  );

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
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-900"
      >
        Mac Status
      </motion.h1>

      {latestStatuses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No status data available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {latestStatuses.map((status, index) => (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {status.hostname || status.deviceId}
                </h2>
                <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
                  Online
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Device ID</p>
                    <p className="font-mono text-xs text-gray-900 truncate">
                      {status.deviceId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">OS Version</p>
                    <p className="text-gray-900">{status.osVersion || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hardware</p>
                    <p className="text-gray-900">
                      {status.hardwareModel || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">CPU Cores</p>
                    <p className="text-gray-900">{status.cpuCount || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Memory</p>
                    <p className="text-gray-900">
                      {formatMemory(status.totalMemory)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Uptime</p>
                    <p className="text-gray-900">
                      {formatUptime(status.uptime)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {formatDate(status.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {statuses.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing {latestStatuses.length} device
            {latestStatuses.length !== 1 ? "s" : ""} • Total records:{" "}
            {statuses.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default MacStatusPage;
