import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const audioDir = path.join(process.cwd(), "public", "audio");

  try {
    const files = fs.readdirSync(audioDir);
    const audioFiles = files
      .filter((file) => file.endsWith(".mp3") || file.endsWith(".wav"))
      .map((file) => ({
        id: file,
        name: file,
        path: `/audio/${file}`,
      }));

    return NextResponse.json(audioFiles);
  } catch (error) {
    console.error("Error reading audio directory:", error);
    return NextResponse.json(
      { error: "Failed to read audio files" },
      { status: 500 }
    );
  }
}
