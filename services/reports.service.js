const BASE_URL = (process.env.BASE_PATH && process.env.BASE_PATH.trim() !== '')
  ? process.env.BASE_PATH
  : 'https://1q66rzf5zl.execute-api.us-east-1.amazonaws.com/api';

function getAuthHeaders () {
  const token = process.client ? localStorage.getItem('usertoken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Step 1 — Ask the backend for a presigned S3 PUT URL.
 * The file will be uploaded directly from the browser to S3.
 */
async function getPresignedUploadUrl (mimeType) {
  const res = await fetch(`${BASE_URL}/student/user-reports/presigned-url`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ mime_type: mimeType }),
  });
  if (!res.ok) { throw new Error('No se pudo obtener la URL de carga'); }
  const json = await res.json();
  return json.data; // { uploadUrl, key, fileUrl }
}

/**
 * Step 2 — Upload the file directly to S3 using the presigned URL.
 * No size limit applies here; the request goes directly to S3.
 */
async function uploadToS3 (uploadUrl, blob, mimeType) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body: blob,
  });
  if (!res.ok) { throw new Error('Error al subir el archivo a S3'); }
}

/**
 * Step 3 — Submit the report metadata (JSON) to the API.
 * No file is sent here; only key/url references from the S3 upload.
 */
export async function submitReport ({ file, captureType, reportType, description, rating }) {
  let fileKey;
  let fileUrl;

  if (file && captureType) {
    const mimeType = captureType === 'screenshot' ? 'image/png' : 'video/webm';

    // Get presigned URL from backend
    const { uploadUrl, key, fileUrl: s3Url } = await getPresignedUploadUrl(mimeType);

    // Upload directly to S3 (bypasses API Gateway / Lambda size limits)
    await uploadToS3(uploadUrl, file, mimeType);

    fileKey = key;
    fileUrl = s3Url;
  }

  // Submit JSON metadata to the API (small payload, no size issues)
  const res = await fetch(`${BASE_URL}/student/user-reports`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      report_type: reportType,
      capture_type: captureType || undefined,
      description: description || '',
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      screen_width: String(window.screen.width),
      screen_height: String(window.screen.height),
      rating: rating !== undefined ? String(rating) : undefined,
      file_key: fileKey,
      file_url: fileUrl,
    }),
  });

  if (!res.ok) { throw new Error('Error al enviar el reporte'); }
  return res.json();
}
