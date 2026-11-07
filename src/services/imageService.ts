const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function readImageFile(file: File): Promise<string> {
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Formato no compatible. Selecciona una imagen JPG, PNG o WebP.');
  }
  if (file.size === 0) throw new Error('El archivo está vacío. Selecciona otra fotografía.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('La imagen debe pesar menos de 8 MB.');

  const imageDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('No se pudo leer la fotografía. Intenta seleccionar el archivo otra vez.'));
    reader.onerror = () => reject(new Error('No se pudo leer la fotografía. Intenta seleccionar el archivo otra vez.'));
    reader.readAsDataURL(file);
  });

  await validateImageDataUrl(imageDataUrl);
  return imageDataUrl;
}

export async function validateImageDataUrl(imageDataUrl: string): Promise<void> {
  const match = imageDataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match || !match[2]) throw new Error('La fotografía no tiene un formato de imagen compatible.');
  if (Math.floor((match[2].length * 3) / 4) > MAX_IMAGE_BYTES) {
    throw new Error('La imagen debe pesar menos de 8 MB.');
  }

  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth < 160 || image.naturalHeight < 160) {
        reject(new Error('La imagen tiene muy poca resolución. Usa una fotografía de al menos 160 × 160 píxeles.'));
        return;
      }
      resolve();
    };
    image.onerror = () => reject(new Error('No se pudo abrir la fotografía. El archivo puede estar dañado.'));
    image.src = imageDataUrl;
  });
}
