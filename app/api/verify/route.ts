import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const key = body.key;
  const metadata = body.metadata;

  if (!key) {
    return NextResponse.json(
      { error: "Key Access tidak valid" },
      { status: 400 },
    );
  }
  const res = await fetch(`${process.env.URL_API}/key/update`, {
    method: "PATCH",
    body: JSON.stringify({
      key,
      metadata,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Key Access tidak valid" },
      { status: 400 },
    );
  }
  const res = await fetch(`${process.env.URL_API}/key/used?key=${key}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (data.error) {
    return NextResponse.json(data, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
