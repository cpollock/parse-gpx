const TrackPoint = require('./TrackPoint');
const Track = require('./Track');

const parseTrack = track =>  {
  track = track[0].trkseg[0].trkpt;
  const trackPoints = track.map(t => {
  var elevation = t.ele[0],
    lat = t['$'].lat,
    lng = (t['$'].lng || t['$'].lon),
    timestamp = t.time[0],
    hr,
    cadence,
    power;

  if(t.extensions) {
    var extensions = t.extensions[0];
    for(var k in extensions) {
      var extension = extensions[k][0];

      // Strava exports gpx
      if(typeof extension === 'object') {
        for(var k2 in extension) {
          if(k2.indexOf('hr') > -1) {
            hr = extension[k2][0];
          }
          if(k2.indexOf('cadence') > -1) {
            cadence = extension[k2][0];
          }
        }
      } else {
          // topografix gpx
          if(k.indexOf('hr') > -1) {
            hr = extension;
          }

          if(k.indexOf('power') > -1) {
            power = extension;
          }

          if(k.indexOf('cadence') > -1 || k.indexOf('cad') > -1) {
            cadence = extension;
          }
      }
    }
  }

    return new TrackPoint(elevation, lat, lng, timestamp, hr, cadence, power);
  });

  return new Track(trackPoints);
};

module.exports = parseTrack;
