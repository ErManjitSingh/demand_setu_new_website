import { buildApiUrl } from "@/lib/apiConfig";

export async function createHotelBooking(payload) {
  const response = await fetch(buildApiUrl("api/hotelbooking/create"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Hotel booking create failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}
