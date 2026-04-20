export function getQRFilename(shortCode) {
  return `qr-${shortCode || 'link'}.png`;
}
