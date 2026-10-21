const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '233507410361').replace(/\D/g, '');

export function whatsappUrl(product) {
  if (!phone) return null;
  const message = product
    ? `Hello Darlin! I'm interested in ${product}. Please confirm availability, compatibility, and current pricing.`
    : "Hello Darlin! I'd like to enquire about your phones and accessories.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function EnquireLink({ product, className = 'button', children = 'Enquire' }) {
  const href = whatsappUrl(product);
  if (!href) return <button className={className} disabled>{children}</button>;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={product ? `Enquire about ${product} on WhatsApp` : 'Enquire on WhatsApp'}>{children}</a>;
}
