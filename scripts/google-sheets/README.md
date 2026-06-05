# Hnina Google Sheets Webhook

This Apps Script receives order data from the Hnina backend and writes it to Google Sheets for COD order management.

## Setup

1. **Create a Google Spreadsheet** at sheets.google.com
2. **Open Extensions → Apps Script**
3. **Delete the default code** and paste `Code.gs`
4. **Set Script Properties**:
   - `SCRIPT_SECRET`: same random string as backend `SHEET_WEBHOOK_SECRET`
5. **Deploy as Web App**:
   - Click Deploy → New deployment
   - Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone with the link**
   - Click Deploy and copy the URL
6. **Add URL to backend** `.env`:
   ```
   SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   SHEET_WEBHOOK_SECRET=your_same_secret_here
   ```
7. **Test**: Run `testWebhook()` from the Apps Script editor

## Sheet Tabs

The script auto-creates three tabs:

| Tab | Purpose |
|-----|---------|
| `orders` | One row per order — customer info, totals, UTM, call/delivery status |
| `order_items` | One row per line item |
| `events` | Operational log |

## Confirmation Call Columns

In the `orders` tab, use these empty columns for operations:

- **callStatus**: called, no-answer, confirmed, cancelled
- **confirmedAt**: when you confirmed
- **deliveryStatus**: preparing, shipped, delivered, returned
- **carrierTracking**: carrier tracking number
- **notes**: any notes for fulfillment

## Security

The `SCRIPT_SECRET` is validated on every request. Requests without the correct secret are rejected.

**Never share the secret publicly.**
