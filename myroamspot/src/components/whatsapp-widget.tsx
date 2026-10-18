import { WHATSAPP_NUMBER } from "../lib/site";
import { getDictionary, t } from "../lib/i18n";

export function WhatsAppWidget() {
  if (!WHATSAPP_NUMBER) return null;
  const dict = getDictionary("fr");
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t(dict, "support.whatsappMessage"))}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t(dict, "support.whatsappCta")}
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.98 11.98 0 0 0 5.71 1.447h.005c6.585 0 11.946-5.336 11.949-11.896a11.82 11.82 0 0 0-3.479-8.45zM12.05 21.785h-.004a9.98 9.98 0 0 1-5.082-1.389l-.365-.216-3.779.989 1.011-3.68-.238-.38a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.455-9.885 9.972-9.885 2.664 0 5.168 1.036 7.045 2.917a9.83 9.83 0 0 1 2.916 7.044c-.004 5.451-4.457 9.88-9.966 9.88z" />
      </svg>
    </a>
  );
}
