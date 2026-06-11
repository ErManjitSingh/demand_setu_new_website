import { buildApiUrl } from "@/lib/apiConfig";

function formatInr(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateLabel(value) {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function paymentLabel(method) {
  if (method === "pay_at_property") return "Pay at property";
  if (method === "pay_now") return "Pay now";
  return method || "—";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRoomsHtml(rooms = []) {
  if (!rooms.length) {
    return `<p style="margin:0;color:#78716c;font-size:14px;">Standard room booking</p>`;
  }

  return rooms
    .map(
      (room) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f5f5f4;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1c1917;">${escapeHtml(room.roomName)}</p>
          <p style="margin:0 0 6px;font-size:12px;color:#78716c;">${escapeHtml(room.categoryLabel)} · ${escapeHtml(room.mealPlanLabel || room.mealPlan)}</p>
          <p style="margin:0;font-size:12px;color:#57534e;">
            ${room.roomCount} room${room.roomCount !== 1 ? "s" : ""} · ${room.nights} night${room.nights !== 1 ? "s" : ""}
            ${room.occupancyLabel ? ` · ${escapeHtml(room.occupancyLabel)}` : ""}
          </p>
        </td>
        <td align="right" style="padding:14px 0;border-bottom:1px solid #f5f5f4;vertical-align:top;">
          <p style="margin:0;font-size:15px;font-weight:700;color:#ea580c;">${formatInr(room.pricing?.total ?? room.total)}</p>
        </td>
      </tr>`
    )
    .join("");
}

export function buildBookingConfirmationEmailHtml(booking) {
  const { property, stay, guests, guest, pricing, rooms = [], paymentMethod } = booking;
  const guestName = guest?.fullName || `${guest?.firstName || ""} ${guest?.lastName || ""}`.trim() || "Guest";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f8f6f3;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f6f3;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e7e5e4;box-shadow:0 12px 40px rgba(28,25,23,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#9a3412 0%,#ea580c 55%,#f97316 100%);padding:28px 32px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.82);">Demand Setu Tours</p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:800;color:#ffffff;">Your booking is confirmed</h1>
              <p style="margin:10px 0 0;font-size:15px;line-height:1.5;color:rgba(255,255,255,0.92);">
                Thank you, ${escapeHtml(guestName)}. We&apos;re excited to host you.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff7ed;border:1px solid #ffedd5;border-radius:16px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#c2410c;">Property</p>
                    <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#1c1917;">${escapeHtml(property?.title)}</h2>
                    <p style="margin:0;font-size:14px;color:#57534e;">${escapeHtml(property?.location)}${property?.region ? `, ${escapeHtml(property.region)}` : ""}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="padding:10px 8px 10px 0;vertical-align:top;">
                    <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:14px;padding:16px;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;color:#78716c;">Check-in</p>
                      <p style="margin:0;font-size:15px;font-weight:700;color:#1c1917;">${formatDateLabel(stay?.checkIn)}</p>
                      <p style="margin:6px 0 0;font-size:12px;color:#78716c;">From 14:00</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:10px 0 10px 8px;vertical-align:top;">
                    <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:14px;padding:16px;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;color:#78716c;">Check-out</p>
                      <p style="margin:0;font-size:15px;font-weight:700;color:#1c1917;">${formatDateLabel(stay?.checkOut)}</p>
                      <p style="margin:6px 0 0;font-size:12px;color:#78716c;">Until 12:00</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;border-radius:14px;border:1px solid #e7e5e4;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;color:#78716c;">Stay summary</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#57534e;">Nights</td>
                        <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#1c1917;">${stay?.nights || "—"}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#57534e;">Adults</td>
                        <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#1c1917;">${guests?.adults ?? "—"}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#57534e;">Children</td>
                        <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#1c1917;">${guests?.children ?? 0}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#57534e;">Rooms</td>
                        <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#1c1917;">${booking.totalRooms ?? guests?.rooms ?? "—"}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#57534e;">Payment</td>
                        <td align="right" style="padding:6px 0;font-size:14px;font-weight:700;color:#1c1917;">${escapeHtml(paymentLabel(paymentMethod))}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;color:#78716c;">Selected rooms</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${buildRoomsHtml(rooms)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1c1917;border-radius:16px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#d6d3d1;">Subtotal</td>
                        <td align="right" style="padding:4px 0;font-size:14px;color:#ffffff;">${formatInr(pricing?.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:14px;color:#d6d3d1;">GST (5%)</td>
                        <td align="right" style="padding:4px 0;font-size:14px;color:#ffffff;">${formatInr(pricing?.gst)}</td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:#ffffff;">Total payable</td>
                        <td align="right" style="padding:14px 0 0;font-size:22px;font-weight:800;color:#fb923c;">${formatInr(pricing?.payableTotal ?? pricing?.total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff7ed;border:1px solid #ffedd5;border-radius:14px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;color:#c2410c;">Guest details</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#44403c;"><strong>Name:</strong> ${escapeHtml(guestName)}</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#44403c;"><strong>Email:</strong> ${escapeHtml(guest?.email)}</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#44403c;"><strong>Mobile:</strong> ${escapeHtml(guest?.mobile)}</p>
                    <p style="margin:0;font-size:14px;color:#44403c;"><strong>Country:</strong> ${escapeHtml(guest?.country)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 30px;">
              <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#57534e;">
                Use your mobile number and password to sign in and view your bookings anytime on Demand Setu.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#78716c;">
                Need help? Call us at <a href="tel:+918353056000" style="color:#ea580c;font-weight:700;text-decoration:none;">+91 8353056000</a>
                or reply to this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#fafaf9;padding:18px 32px;border-top:1px solid #e7e5e4;">
              <p style="margin:0;font-size:12px;color:#a8a29e;text-align:center;">
                © ${new Date().getFullYear()} Demand Setu Tours · info@demandsetutours.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildBookingConfirmationEmailText(booking) {
  const { property, stay, guests, guest, pricing, rooms = [], paymentMethod } = booking;
  const guestName = guest?.fullName || `${guest?.firstName || ""} ${guest?.lastName || ""}`.trim() || "Guest";

  const roomLines = rooms.length
    ? rooms
        .map(
          (room) =>
            `- ${room.roomName} (${room.mealPlanLabel || room.mealPlan}): ${formatInr(room.pricing?.total ?? room.total)}`
        )
        .join("\n")
    : "- Standard room booking";

  return `Booking Confirmed - ${property?.title}

Hello ${guestName},

Your stay at ${property?.title} is confirmed.

Property: ${property?.title}
Location: ${property?.location}
Check-in: ${formatDateLabel(stay?.checkIn)} (from 14:00)
Check-out: ${formatDateLabel(stay?.checkOut)} (until 12:00)
Nights: ${stay?.nights}
Guests: ${guests?.adults} adults, ${guests?.children || 0} children
Rooms: ${booking.totalRooms ?? guests?.rooms}
Payment: ${paymentLabel(paymentMethod)}

Rooms:
${roomLines}

Subtotal: ${formatInr(pricing?.subtotal)}
GST: ${formatInr(pricing?.gst)}
Total: ${formatInr(pricing?.payableTotal ?? pricing?.total)}

Guest: ${guestName}
Email: ${guest?.email}
Mobile: ${guest?.mobile}

Sign in with your mobile and password to view My Bookings on Demand Setu.
Support: +91 8353056000`;
}

export async function sendBookingConfirmationEmail(booking) {
  const to = String(booking?.guest?.email || "").trim();
  if (!to) {
    return { ok: false, reason: "no_email" };
  }

  const propertyTitle = booking?.property?.title || "your stay";
  const subject = `Booking Confirmed · ${propertyTitle} | Demand Setu`;
  const html = buildBookingConfirmationEmailHtml(booking);
  const text = buildBookingConfirmationEmailText(booking);

  const response = await fetch(buildApiUrl("api/webmail/send-demand"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject,
      html,
      text,
      replyTo: "info@demandsetutours.com",
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Booking email failed (${response.status})`;
    throw new Error(message);
  }

  return { ok: true, data: payload };
}
