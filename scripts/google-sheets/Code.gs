/**
 * Hnina Google Sheets Apps Script Webhook
 *
 * Setup:
 *   1. Open the spreadsheet (e.g. "OrdersHNINAStore").
 *   2. Extensions -> Apps Script -> paste this entire file as Code.gs.
 *   3. Save, then "Deploy > New deployment > Web app":
 *        - Description: hnina-orders-webhook
 *        - Execute as:  Me
 *        - Who has access: Anyone
 *      Copy the resulting /exec URL and put it in the backend env var:
 *        SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 *
 *   IMPORTANT: this script MUST be created from inside the spreadsheet
 *   (Extensions > Apps Script) so it is container-bound. A standalone Apps
 *   Script project has no active spreadsheet and every request will fail with
 *   "no_active_spreadsheet".
 *
 *   No secret required. Anyone who knows the URL can append a row, which is
 *   acceptable here because only the backend ever calls it.
 *
 * Sheet columns (left -> right, must match this order):
 *   date | orderid | country | name | phone | product | sku | quantity | total price | currency | status
 *
 * Response contract (read by the backend):
 *   On success: { "success": true,  "orderId": "..." }
 *   On failure: { "success": false, "error": "..." }
 *
 * Apps Script web apps cannot return non-2xx HTTP codes, so the backend MUST
 * check `success` in the JSON body. Do not change this contract without
 * updating backend/app/services/sheet_webhook.py.
 */

const SHEET_NAME = 'orders';

const HEADERS = [
  'date',
  'orderid',
  'country',
  'name',
  'phone',
  'product',
  'sku',
  'quantity',
  'total price',
  'currency',
  'status',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'no_payload' });
    }

    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: 'invalid_json' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      return jsonResponse({
        success: false,
        error: 'no_active_spreadsheet',
        hint: 'Open the target spreadsheet, then Extensions > Apps Script. Standalone scripts cannot reach a spreadsheet.',
      });
    }

    const sheet = getOrCreateSheet(ss, SHEET_NAME, HEADERS);

    const row = [
      body.date || '',
      body.orderId || body.orderid || '',
      body.country || 'MOROCCO',
      body.name || '',
      formatPhone(body.phone || ''),
      body.product || '',
      body.sku || '',
      body.quantity || '',
      body.totalPrice != null ? body.totalPrice : (body['total price'] || ''),
      body.currency || 'MAD',
      body.status || '',
    ];

    sheet.appendRow(row);

    return jsonResponse({ success: true, orderId: row[1] });
  } catch (err) {
    const msg = err && err.toString ? err.toString() : String(err);
    console.error('Webhook error:', msg);
    return jsonResponse({ success: false, error: msg });
  }
}

function doGet() {
  return jsonResponse({ success: true, service: 'hnina-orders-webhook', status: 'ok' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Phones are stored as text so leading zeros are preserved.
 */
function formatPhone(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.startsWith("'") ? str : "'" + str;
}

/**
 * Get or create the sheet with the expected header row.
 */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4F6F52');
    headerRange.setFontColor('#FBF7F1');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Manual smoke test — run from the Apps Script editor.
 * Adds one fake order row to verify the wiring.
 */
function testWebhook() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        date: '11/06/2026',
        orderId: 'HNINA-20260611-9999',
        country: 'MOROCCO',
        name: 'تست - فاطمة الزهراء',
        phone: '0610950849',
        product: 'حنينة ماما/حنينة جذور',
        sku: 'HNM-7281/HNJ-3469',
        quantity: '2/1',
        totalPrice: 597,
        currency: 'MAD',
        status: '',
      }),
    },
  };
  const out = doPost(fakeEvent);
  Logger.log(out.getContent());
}
