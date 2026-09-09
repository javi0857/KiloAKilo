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

function getConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Config");
  var config = { peso_objetivo: null };
  if (!sheet || sheet.getLastRow() <= 1) return config;

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var clave = String(data[i][0]);
    var valor = data[i][1];
    if (clave === "peso_objetivo" && valor !== "" && valor !== null) {
      config.peso_objetivo = Number(valor);
    }
  }
  return config;
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      peso: readSheet("Peso"),
      deporte: readSheet("Deporte"),
      objetivo: getConfig()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var type = body.type || "peso";

  if (type === "objetivo") {
    return setObjetivo(body.peso_objetivo_kg);
  }

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

function setObjetivo(pesoObjetivo) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Config");
  if (!sheet) {
    sheet = ss.insertSheet("Config");
    sheet.appendRow(["clave", "valor"]);
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === "peso_objetivo") {
      sheet.getRange(i + 1, 2).setValue(Number(pesoObjetivo));
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, peso_objetivo: Number(pesoObjetivo) }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  sheet.appendRow(["peso_objetivo", Number(pesoObjetivo)]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, peso_objetivo: Number(pesoObjetivo) }))
    .setMimeType(ContentService.MimeType.JSON);
}
