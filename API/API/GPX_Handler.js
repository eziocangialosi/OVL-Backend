/**
 * @module GPX_Handler
 * @description This module handle creation of GPX files.
 * @example <caption>Use this module from another file.</caption>
 * const mysql = require('./GPX_Handler')
*/
const date = require('./date')
function exportToGPX(Tracker,Positions,Callback) {
  // Créer le début du fichier GPX
  let gpx = `<?xml version="1.0"?>
  <gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
    <metadata>
      <name>`+Tracker+` | Positions GPS</name>
    </metadata>
    <trk>
    <name>`+Tracker+` | Positions GPS</name>
      <trkseg>`;

  // Ajouter chaque position au fichier GPX
  Positions.forEach(position => {
    gpx += `
      <trkpt lat="${position.lat}" lon="${position.lon}">
        <time>${date.GetISOStringFromTimeStamp(position.timestamp)}</time>
      </trkpt>`;
  });

  // Terminer le fichier GPX
  gpx += `
      </trkseg>
    </trk>
  </gpx>`;
  Callback(gpx);
}

//exportToGPX("Test",[{lat: 0.0,lon: 0.0},{lat: 10.0, lon: 0.0}])

module.exports = { // Export function for other file to use it.
    /**
     * Set the tracker availabilty.
     * @param {(String)} TrackerName - The name of the tracker.
     * @param {(Array)} History - Position history
     * @param {(Function)} Callback - Callback function.
     */
    exportToGPX: function(TrackerName,History,Callback) {
        exportToGPX(TrackerName,History,Callback);
    }  
}
