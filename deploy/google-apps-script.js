// =============================================
// Google Apps Script — Dilson Batista
// Abaixo-assinado · euapoiodilsonbatista.com.br
// =============================================

function doGet(e) {
  const params = e.parameter;
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; // primeira aba

  // ── Retorna contagem total ─────────────────
  if (params.action === 'count') {
    return responder({ total: getTotal(sheet) });
  }

  // ── Registra nova assinatura ───────────────
  const nome     = sanitizar(params.nome     || '');
  const email    = sanitizar(params.email    || '');
  const whatsapp = sanitizar(params.whatsapp || '');
  const timestamp = params.timestamp || new Date().toISOString();

  if (!nome || !email || !whatsapp) {
    return responder({ status: 'erro', msg: 'Campos obrigatórios ausentes.' });
  }

  if (emailJaExiste(sheet, email)) {
    return responder({ status: 'duplicado', msg: 'Este e-mail ja assinou.', total: getTotal(sheet) });
  }

  sheet.appendRow([ new Date(timestamp), nome, email, whatsapp ]);

  return responder({ status: 'ok', total: getTotal(sheet) });
}

function getTotal(sheet) {
  const last = sheet.getLastRow();
  return Math.max(0, last - 1); // desconta cabeçalho
}

function emailJaExiste(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const emails = sheet.getRange(2, 3, last - 1, 1).getValues().flat();
  return emails.map(e => String(e).toLowerCase().trim()).includes(email.toLowerCase().trim());
}

function sanitizar(str) {
  return String(str).replace(/<[^>]*>/g, '').replace(/['"`;]/g, '').trim().substring(0, 200);
}

function responder(dados) {
  return ContentService.createTextOutput(JSON.stringify(dados)).setMimeType(ContentService.MimeType.JSON);
}
