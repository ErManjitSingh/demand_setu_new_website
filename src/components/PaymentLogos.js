const cardClass =
  "flex h-10 min-w-[56px] items-center justify-center rounded-lg bg-white px-3 py-2 shadow-md ring-1 ring-stone-200/10";

export default function PaymentLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className={cardClass} title="Visa">
        <VisaLogo />
      </div>
      <div className={cardClass} title="Mastercard">
        <MastercardLogo />
      </div>
      <div className={cardClass} title="UPI">
        <UpiLogo />
      </div>
      <div className={cardClass} title="RuPay">
        <RuPayLogo />
      </div>
      <div className={`${cardClass} bg-[#006FCF] ring-0`} title="American Express">
        <AmexLogo />
      </div>
    </div>
  );
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 60 20" className="h-[18px] w-auto" aria-hidden>
      <path
        fill="#1434CB"
        d="M25.2 2.5h-4l-2.5 15h4l2.5-15zm11.3 9.7c0-4.1-5.7-4.3-5.7-6.2 0-.6.5-1.2 1.6-1.4.5-.1 1.9-.1 3.4.6l.6-2.9c-.8-.4-2-.6-3.5-.6-3.7 0-6.3 2-6.3 4.7 0 2 1.8 3.2 3.2 4 1.4.7 1.9 1.2 1.9 1.8 0 1-1.2 1.5-2.3 1.5-1.9 0-3-.5-3.9-1l-.6 2.9c1 .4 2.4.7 4 .7 3.8 0 6.4-1.9 6.4-5zm10.6 5.3h3.6l-3.4-15h-3.3c-.8 0-1.4.5-1.6 1.1l-5.6 13.9h3.9l.7-2h5l.6 2zm-4.3-5.1l2-5.5 1.2 5.5h-3.2zM10.2 2.5L6.3 13 5.8 9.5C4.8 5.5 1.7 2.9-2.2 2.5l.1 15h3.9l5.7-15h3.7zm30.5 0h-3.7c-1.1 0-2 .6-2.5 1.6l-5.5 13.4h3.9l.7-1.7h4.9l.4 1.7h3.4l-2.6-15zm-4.1 9.7l1.9-5.2 1.1 5.2h-3z"
      />
      <path fill="#FAA61A" d="M12.5 2.5l-1.2 15h-4l1.2-15h4z" opacity="0" />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 44 28" className="h-6 w-auto" aria-hidden>
      <circle cx="16" cy="14" r="10" fill="#EB001B" />
      <circle cx="28" cy="14" r="10" fill="#F79E1B" />
      <path fill="#FF5F00" d="M22 7.5a10 10 0 000 13 10 10 0 000-13z" />
    </svg>
  );
}

function UpiLogo() {
  return (
    <svg viewBox="0 0 72 24" className="h-6 w-auto" aria-hidden>
      <text
        x="2"
        y="18"
        fill="#097939"
        fontSize="16"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        UPI
      </text>
      <path
        fill="#666"
        d="M34 8h2v8h-2zm4 0h6c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V8zm2 2v4h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4z"
        opacity="0.5"
      />
    </svg>
  );
}

function RuPayLogo() {
  return (
    <svg viewBox="0 0 80 24" className="h-6 w-auto" aria-hidden>
      <path fill="#007B84" d="M8 4c6.6 0 12 5.4 12 12H8V4z" />
      <path fill="#F58220" d="M20 4v12c-6.6 0-12-5.4-12-12h12z" />
      <text
        x="34"
        y="17"
        fill="#007B84"
        fontSize="13"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        RuPay
      </text>
    </svg>
  );
}

function AmexLogo() {
  return (
    <svg viewBox="0 0 52 16" className="h-4 w-auto" aria-hidden>
      <text
        x="26"
        y="12"
        fill="#fff"
        fontSize="9"
        fontWeight="700"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="0.5"
      >
        AMEX
      </text>
    </svg>
  );
}
