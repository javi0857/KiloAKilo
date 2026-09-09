function readSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet || sheet.getLastRow() <= 1) return [];

  var data = sheet.getDataRange().getValues();
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    var headers = data[0];
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (headers[j] === "fecha") {
        row.fecha = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        row[headers[j]] = val;
      }
    }
    result.push(row);
  }
  return result;
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      peso: readSheet("Peso"),
      deporte: readSheet("Deporte")
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var type = body.type || "peso";

  var sheet = ss.getSheetByName(type === "deporte" ? "Deporte" : "Peso");
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Hoja '" + type + "' no encontrada" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var fecha = body.fecha ? new Date(body.fecha) : new Date();

  if (type === "deporte") {
    sheet.appendRow([
      fecha,
      body.deporte || "",
      body.detalle || "",
      body.duracion_min || ""
    ]);
  } else {
    sheet.appendRow([
      fecha,
      body.peso_kg || ""
    ]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
