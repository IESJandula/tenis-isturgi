export const FOTOS_TENIS_FILES = [
  'Captura de pantalla 2026-03-23 124553.png',
  'Captura de pantalla 2026-03-23 124614.png',
  'Captura de pantalla 2026-03-23 124811.png',
  'Captura de pantalla 2026-03-23 124829.png',
  'Captura de pantalla 2026-03-23 124907.png',
  'Captura de pantalla 2026-03-23 124933.png',
  'Captura de pantalla 2026-03-23 124955.png',
  'Captura de pantalla 2026-03-23 125019.png',
  'Captura de pantalla 2026-03-23 125036.png',
  'Captura de pantalla 2026-03-23 125056.png',
  'Captura de pantalla 2026-03-23 125109.png',
  'Captura de pantalla 2026-03-23 125138.png'
];

export function fotoTenisUrl(fileName) {
  return encodeURI(`/fotos-tenis/${fileName}`);
}

export function fotoTenisAlt(fileName, index) {
  const base = fileName.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  if (typeof index === 'number') return `Foto del club ${index + 1}: ${base}`;
  return `Foto del club: ${base}`;
}

export function fotosTenisAsGaleriaItems() {
  return FOTOS_TENIS_FILES.map((fileName, index) => ({
    id: `fotos-tenis-${index + 1}`,
    src: fotoTenisUrl(fileName),
    categoria: 'Club',
    titulo: 'Fotos del club',
    texto: 'Galería del Club de Tenis Isturgi.'
  }));
}
