import { NextResponse } from "next/server";
import { submitCrmLeads, submitStayLead } from "@/lib/tourLeadSubmit";

export async function POST(request) {
  try {
    const body = await request.json();
    const { leadKind, ...payload } = body;

    const result =
      leadKind === "stay" ? await submitStayLead(payload) : await submitCrmLeads(payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
