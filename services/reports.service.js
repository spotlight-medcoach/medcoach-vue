export async function submitReport ({ file, captureType, reportType, description, rating }) {
  const token = process.client ? localStorage.getItem('usertoken') : null;
  const formData = new FormData();

  if (file && captureType) {
    const ext = captureType === 'screenshot' ? 'png' : 'webm';
    formData.append('file', file, `reporte.${ext}`);
    formData.append('capture_type', captureType);
  }

  formData.append('report_type', reportType);
  formData.append('description', description || '');
  formData.append('page_url', window.location.href);
  formData.append('user_agent', navigator.userAgent);
  formData.append('screen_width', String(window.screen.width));
  formData.append('screen_height', String(window.screen.height));

  if (rating !== undefined && rating !== null) {
    formData.append('rating', String(rating));
  }

  const baseUrl = (process.env.BASE_PATH && process.env.BASE_PATH.trim() !== '')
    ? process.env.BASE_PATH
    : 'https://1q66rzf5zl.execute-api.us-east-1.amazonaws.com/api';

  const response = await fetch(`${baseUrl}/student/user-reports`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al enviar el reporte');
  }
  return response.json();
}
