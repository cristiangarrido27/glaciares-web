export function buildWhatsappUrl(phone: string, message: string): string {
  const digitsOnly = phone.replace(/[^\d]/g, '');
  const encoded = encodeURIComponent(message);
  if (!digitsOnly) return `https://wa.me/?text=${encoded}`;
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}

export const ASSISTANCE_MESSAGE_TEMPLATE =
  'Hola, soy cliente de Glaciares Rent a Car y necesito asistencia. Mi nombre es ______, vehículo ______, patente ______ y mi ubicación es ______.';
