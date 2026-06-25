// Helpers for the WhatsApp-based payment confirmation flow.

export type WhatsAppSettings = {
  business_number: string;
  payment_instructions: string;
  message_template: string;
};

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  business_number: "923496881538",
  payment_instructions:
    "Please send your payment via JazzCash / EasyPaisa to 03496881538 and share the screenshot on WhatsApp.",
  message_template:
    "Hello, I want to confirm my order.\n\nOrder ID: {order_code}\nTracking ID: {order_code}\nCustomer Name: {customer_name}\nPhone Number: {phone}\nOrder Amount: Rs. {amount}\n\nPayment completed. Please verify and confirm my order.",
};

export type PaymentVars = {
  order_code: string;
  customer_name: string;
  phone: string;
  amount: string | number;
};

export function renderTemplate(template: string, vars: PaymentVars): string {
  // Support literal "\n" stored in the database
  const normalised = template.replace(/\\n/g, "\n");
  return normalised
    .replace(/\{order_code\}/g, vars.order_code)
    .replace(/\{customer_name\}/g, vars.customer_name)
    .replace(/\{phone\}/g, vars.phone)
    .replace(/\{amount\}/g, String(vars.amount ?? "—"));
}

export function buildPaymentWhatsAppLink(
  settings: WhatsAppSettings,
  vars: PaymentVars,
): string {
  const number = settings.business_number.replace(/\D/g, "");
  const text = renderTemplate(settings.message_template, vars);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const PAYMENT_STATUS_META: Record<
  "pending" | "submitted" | "confirmed" | "rejected",
  { label: string; emoji: string; cls: string }
> = {
  pending:   { label: "Payment Pending",      emoji: "⏳", cls: "bg-warning/15 text-warning" },
  submitted: { label: "Awaiting Verification", emoji: "⌛", cls: "bg-primary/15 text-primary" },
  confirmed: { label: "Payment Confirmed",    emoji: "✓",  cls: "bg-success/15 text-success" },
  rejected:  { label: "Payment Rejected",     emoji: "✗",  cls: "bg-destructive/15 text-destructive" },
};
