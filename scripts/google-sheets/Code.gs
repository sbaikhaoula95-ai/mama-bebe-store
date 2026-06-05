/**
 * Hnina Google Sheets Apps Script Webhook
 * 
 * Deploy as a Web App:
 * - Execute as: Me
 * - Who has access: Anyone with the link
 * 
 * Set Script Properties:
 * - SCRIPT_SECRET: same value as backend SHEET_WEBHOOK_SECRET
 */

const SCRIPT_SECRET = PropertiesService.getScriptProperties().getProperty('SCRIPT_SECRET');

const SHEET_NAMES = {
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  EVENTS: 'events',
};

const ORDER_HEADERS = [
  'orderId', 'createdAt', 'status', 'customerName', 'phone', 'city', 'address',
  'subtotal', 'deliveryFee', 'total', 'currency',
  'upsellShown', 'upsellAccepted', 'upsellProductId',
  'sourcePage', 'utmSource', 'utmMedium', 'utmCampaign',
  'eventId', 'userAgent',
  'callStatus', 'confirmedAt', 'deliveryStatus', 'carrierTracking', 'notes',
];

const ORDER_ITEM_HEADERS = [
  'orderId', 'productId', 'sku', 'nameAr', 'quantity', 'unitPrice', 'lineTotal', 'isUpsell',
];

const EVENT_HEADERS = [
  'orderId', 'type', 'message', 'createdAt',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // Security: validate secret
    if (!SCRIPT_SECRET || body.secret !== SCRIPT_SECRET) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: 'Unauthorized' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date().toISOString();

    // Write order row
    if (body.order) {
      const ordersSheet = getOrCreateSheet(ss, SHEET_NAMES.ORDERS, ORDER_HEADERS);
      const o = body.order;
      ordersSheet.appendRow([
        o.orderId || '',
        o.createdAt || timestamp,
        o.status || 'received',
        o.customerName || '',
        o.phone || '',
        o.city || '',
        o.address || '',
        o.subtotal || 0,
        o.deliveryFee || 0,
        o.total || 0,
        o.currency || 'MAD',
        o.upsellShown ? 'نعم' : 'لا',
        o.upsellAccepted ? 'نعم' : 'لا',
        o.upsellProductId || '',
        o.sourcePage || '',
        o.utmSource || '',
        o.utmMedium || '',
        o.utmCampaign || '',
        o.eventId || '',
        o.userAgent || '',
        '', // callStatus
        '', // confirmedAt
        '', // deliveryStatus
        '', // carrierTracking
        '', // notes
      ]);
    }

    // Write order items
    if (body.items && body.items.length > 0) {
      const itemsSheet = getOrCreateSheet(ss, SHEET_NAMES.ORDER_ITEMS, ORDER_ITEM_HEADERS);
      for (const item of body.items) {
        itemsSheet.appendRow([
          item.orderId || '',
          item.productId || '',
          item.sku || '',
          item.nameAr || '',
          item.quantity || 0,
          item.unitPrice || 0,
          item.lineTotal || 0,
          item.isUpsell ? 'نعم' : 'لا',
        ]);
      }
    }

    // Write events
    if (body.events && body.events.length > 0) {
      const eventsSheet = getOrCreateSheet(ss, SHEET_NAMES.EVENTS, EVENT_HEADERS);
      for (const event of body.events) {
        eventsSheet.appendRow([
          event.orderId || '',
          event.type || '',
          event.message || '',
          timestamp,
        ]);
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, timestamp: timestamp })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('Webhook error:', err.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', service: 'hnina-sheets-webhook' })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get or create a sheet with headers.
 */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4F6F52');
    headerRange.setFontColor('#FBF7F1');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
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
 * Manual test function — run from Apps Script editor.
 */
function testWebhook() {
  const testPayload = {
    secret: SCRIPT_SECRET,
    order: {
      orderId: 'HN-20260605-TEST',
      createdAt: new Date().toISOString(),
      status: 'received',
      customerName: 'تست - سلمى',
      phone: '0612345678',
      city: 'الدار البيضاء',
      address: 'شارع محمد الخامس، حي المعاريف',
      subtotal: 299,
      deliveryFee: 0,
      total: 299,
      currency: 'MAD',
      upsellShown: true,
      upsellAccepted: false,
      upsellProductId: '',
      sourcePage: 'https://hnina.shop/products/hnina-mama',
      utmSource: 'facebook',
      utmMedium: 'paid',
      utmCampaign: 'test',
      eventId: 'order_test_123',
      userAgent: 'TestAgent/1.0',
    },
    items: [
      {
        orderId: 'HN-20260605-TEST',
        productId: 'hnina-mama',
        sku: 'HNINA-MAMA',
        nameAr: 'حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة',
        quantity: 2,
        unitPrice: 149.5,
        lineTotal: 299,
        isUpsell: false,
      },
    ],
    events: [
      {
        orderId: 'HN-20260605-TEST',
        type: 'order_created',
        message: 'Test order from Apps Script editor',
      },
    ],
  };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date().toISOString();

  if (testPayload.order) {
    const ordersSheet = getOrCreateSheet(ss, SHEET_NAMES.ORDERS, ORDER_HEADERS);
    const o = testPayload.order;
    ordersSheet.appendRow([
      o.orderId, o.createdAt, o.status, o.customerName, o.phone, o.city, o.address,
      o.subtotal, o.deliveryFee, o.total, o.currency,
      o.upsellShown ? 'نعم' : 'لا', o.upsellAccepted ? 'نعم' : 'لا', o.upsellProductId,
      o.sourcePage, o.utmSource, o.utmMedium, o.utmCampaign, o.eventId, o.userAgent,
      '', '', '', '', 'TEST ROW',
    ]);
  }

  Logger.log('Test webhook ran successfully.');
}
