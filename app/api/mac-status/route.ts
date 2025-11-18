import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Add CORS headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    console.log("MacStatus POST request received at:", new Date().toISOString());
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log("Request body received:", { 
      deviceId: body.deviceId, 
      hostname: body.hostname,
      timestamp: body.timestamp 
    });

    // Validate required fields
    if (!body.deviceId || !body.timestamp) {
      console.error("Missing required fields:", { 
        hasDeviceId: !!body.deviceId, 
        hasTimestamp: !!body.timestamp 
      });
      return NextResponse.json(
        { error: "Missing required fields: deviceId, timestamp" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Save to database
    const macStatus = await prisma.macStatus.create({
      data: {
        deviceId: body.deviceId,
        hostname: body.hostname || null,
        osVersion: body.osVersion || null,
        hardwareModel: body.hardwareModel || null,
        cpuCount: body.cpuCount || null,
        cpuUsagePercent: body.cpuUsagePercent != null ? body.cpuUsagePercent : null,
        totalMemory: body.totalMemory ? BigInt(body.totalMemory) : null,
        memoryUsed: body.memoryUsed ? BigInt(body.memoryUsed) : null,
        memoryFree: body.memoryFree ? BigInt(body.memoryFree) : null,
        memoryUsagePercent: body.memoryUsagePercent != null ? body.memoryUsagePercent : null,
        uptime: body.uptime || null,
        batteryPercent: body.batteryPercent != null ? body.batteryPercent : null,
        timestamp: new Date(body.timestamp),
      },
    });

    console.log("MacStatus saved successfully:", macStatus.id);

    return NextResponse.json(
      {
        success: true,
        message: "Status received",
        receivedAt: new Date().toISOString(),
        id: macStatus.id,
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error processing MacStatus telemetry:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// Health check endpoint
export async function GET() {
  console.log("MacStatus GET request received at:", new Date().toISOString());
  return NextResponse.json(
    {
      status: "ok",
      service: "MacStatus API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: corsHeaders() }
  );
}

