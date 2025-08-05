
// Utility functions
const handleViewDocument = (docUrl: string | string[], docType: 'mergeDoc' | 'vkycDoc' | 'vkycVideo') => {
  if (docUrl && Array.isArray(docUrl)) {
    if (docUrl.length === 1) {
      window.open(docUrl[0], '_blank');
    } else {
      const htmlContent = `
        <html>
          <head><title>Multiple Documents</title></head>
          <body>
            <h2>Documents to Open:</h2>
            ${docUrl.map((url, i) => `<p><a href="${url}" target="_blank">Document ${i + 1}</a></p>`).join('')}
          </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  } else if (docUrl && docType === 'mergeDoc') {
    window.open(docUrl, '_blank');
  }
};

export default handleViewDocument;
