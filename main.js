var g_map;
var g_me;
var g_me_markers;
var g_last_point_marker;


function SetStorage(key, json_value) {
  localStorage.setItem(key, JSON.stringify(json_value));
}

function GetStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function Init() {
  var last_center = GetStorage("last_center");

  if (last_center == null) {
    navigator.geolocation.getCurrentPosition(
      function(position){
        last_center = {lat:position.coords.latitude, lng:position.coords.longitude};
        SetStorage("last_center", last_center);
        RenderMap(map, last_center);
      });
  } else {
    RenderMap(map, last_center);
  }
}

function RenderPointMarker(point, map) {

  var infowindow = new google.maps.InfoWindow({
    content: point.time});

  var marker = new google.maps.Marker({
    position: {lat: point.lat, lng:point.lng},
    title:point.time,
    animation: google.maps.Animation.BOUNCE,
    map : map,
    zIndex: 2,
  });
  marker.addListener('mouseover', function() {
    infowindow.open(map, marker);
    });
  marker.addListener('mouseout', function() {
    infowindow.close();
    });
  return marker;
}

function RenderPointInfo(point) {
  var info = $("<div>", {class:"point-info"})
  info.append($("<span>", {class: "glyphicon glyphicon-tags"}));
  info.append($("<span>", {class: "point-info-text", text:"Last time : "+ point.time}));
  $("#last-point").html("");
  $("#last-point").append(info);
}

function Save() {
  if(confirm("Remeber the point at your location? \n (The last pin will be overwrited.)")) {
    // remove last marker
    var new_last_point = {lat:g_me.lat, lng:g_me.lng, time:RenderTime(new Date)};
    g_last_point_marker.setMap(null);
    g_last_point_marker = RenderPointMarker(new_last_point, g_map);
    RenderPointInfo(new_last_point);
    SetStorage("last-point", new_last_point);
  }
}

// function AddPin() {
//   var time = RenderTime(new Date());
//   var point = {time: time, lat:g_me.lat, lng:g_me.lng};
//   var map = g_map;

//   var infowindow = new google.maps.InfoWindow({
//     content: point.time});

//   var marker = new google.maps.Marker({
//     position: {lat: point.lat, lng:point.lng},
//     title:point.time,
//     map : map,
//     animation: google.maps.Animation.BOUNCE
//   });
//   marker.addListener('mouseover', function() {
//     infowindow.open(map, marker);
//     });
//   marker.addListener('mouseout', function() {
//     infowindow.close();
//     });
// }

function ReCenter() {
  RenderMe(g_map);
  g_map.panTo(g_me);
}

function RenderMe(map) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      var me = {lat:position.coords.latitude, lng:position.coords.longitude};
      var me_halo_marker = new google.maps.Marker({
        position: me,
        icon: {
          path : google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: "blue",
          fillOpacity:0.3,
          strokeColor: "blue",
          strokeOpacity: 0,
          strokeWeight:6
        },
        zIndex: -101,
        clickable: false,
        map: map});

      var me_marker = new google.maps.Marker({
        position: me,
        icon: {
          path : google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "blue",
          fillOpacity:0.7,
          strokeColor: "white",
          strokeOpacity: 1,
          strokeWeight:3
        },
        clickable: false,
        zIndex: 0,
        map: map});

      if (typeof(g_me_markers) !== "undefined") {
        g_me_markers.me_marker.setMap(null);
        g_me_markers.me_halo_marker.setMap(null);
      }
      g_me_markers = {me_marker:me_marker, me_halo_marker:me_halo_marker};
      g_me = me;
    }
  );
}

function RenderTime(datetime) {
  return (datetime.getMonth() + 1) + "/" + (datetime.getDate() + 1) + "  " +
         datetime.getHours() + ":" + datetime.getMinutes();
}

function RenderMap(map, center) {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: center.lat, lng: center.lng},
    zoom: 15,
    disableDefaultUI: true,
    mapTypeControl: false,
    clickableIcons: false,
  });
  RenderMe(map);
  g_last_point_marker = RenderPointMarker(GetStorage("last-point"), map);
  RenderPointInfo(GetStorage("last-point"));
  g_map = map;
}

$(".recenter-btn").click(ReCenter);
$(".save-btn").click(Save);
