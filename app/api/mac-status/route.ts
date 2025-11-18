import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.deviceId || !body.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields: deviceId, timestamp" },
        { status: 400 }
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
        totalMemory: body.totalMemory ? BigInt(body.totalMemory) : null,
        uptime: body.uptime || null,
        timestamp: new Date(body.timestamp),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Status received",
        receivedAt: new Date().toISOString(),
        id: macStatus.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing MacStatus telemetry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "MacStatus API",
      version: "1.0.0",
    },
    { status: 200 }
  );
}

