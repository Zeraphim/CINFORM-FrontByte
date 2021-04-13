function toggleMenu() {
  toggled = !toggled;
  let navigation = document.querySelector(".navigation");
  let toggle = document.querySelector(".toggle");
  let marker_data = (document.querySelector(".draggable").style.visibility =
    "false");
  navigation.classList.toggle("active");
  toggle.classList.toggle("active");

  if (toggled) {
    logo.innerHTML = `<br />
        <img src="/static/cinform_logo_transparent.png" width="193.44mm" height='36.09cm' style='margin-left:5px;'>
        <br />
        <hr />`;
  } else {
    logo.innerHTML = `<br />
        <img src="/static/CI_FrontByte.png" height='36.09cm' style='margin-left:8px;'>
        <br />
        <hr />`;
  }
}

let logo = document.querySelector(".navigation .navlist .logo_header");

var map;
var all_overlays = [];
var card;
var selected_area_index;
var toggled = false;
var extra_window = document.getElementById("extra_window");

function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(14.5995, 120.9842),
    zoom: 5,
    disableDefaultUI: true,
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#1d2c4d",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#8ec3b9",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#1a3646",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#4b6878",
          },
        ],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#64779e",
          },
        ],
      },
      {
        featureType: "administrative.province",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#4b6878",
          },
        ],
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#334e87",
          },
        ],
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [
          {
            color: "#023e58",
          },
        ],
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#283d6a",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#6f9ba5",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#1d2c4d",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#023e58",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#3C7680",
          },
        ],
      },
      {
        featureType: "road",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#304a7d",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#98a5be",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#1d2c4d",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#2c6675",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#255763",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#b0d5ce",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#023e58",
          },
        ],
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#98a5be",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#1d2c4d",
          },
        ],
      },
      {
        featureType: "transit.line",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#283d6a",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [
          {
            color: "#3a4762",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#0e1626",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#4e6d70",
          },
        ],
      },
    ],
  };
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  var opt = { minZoom: 8, maxZoom: 15 };
  map.setOptions(opt);
  showPosition();
  fetchFromAPI();
  google.maps.event.addListener(map, "click", function (event) {
    handleClick(event.latLng);
  });
}

function handleClick(location) {
  if (all_overlays[selected_area_index - 1] != null) {
    all_overlays[selected_area_index - 1].setMap(null);
  }
  const latlng = { lat: location.lat(), lng: location.lng() };
  var marker = new google.maps.Marker({
    position: latlng,
    map,
  });
  selected_area_index = all_overlays.push(marker);

  fetch(
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      location.lat() +
      "," +
      location.lng() +
      "&key=AIzaSyDbTAtv9hnUhV6zL72oFdvpasLcAHROyac&result_type=administrative_area_level_3"
  )
    .then((response) => response.json())
    .then((json) => display_inspector(json, location));
}

function display_inspector(city, location) {
  let city_name = city["results"][0]["address_components"][0]["short_name"];
  var card = "";
  card += `<div class="card mt-3" style="width: 18rem; z-index: 0">
  <div class="card-body" style="text-align: left;">
    <h5 class="card-title">${city_name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${location.lat()}, ${location.lng()}</h6>
    <p class="card-text">Choose your action below.</p>
    <a class="card-link send_report" style="cursor: pointer;">Report Event</a>
    <a class="card-link remove_marker" style="cursor: pointer">Remove Marker</a><br>
    <a class="card-link view_all" style="cursor: pointer">View all Events in City</a>
  </div></div>`;

  let marker_card = document.querySelector(".content");
  marker_card.innerHTML =
    "" +
    "<div class='inspector' style='background-color: white;padding: 20px; max-width: 400px; max-height: 400px'><p>Inspector" +
    "<br></p>" +
    card +
    "</div>";
  marker_card.style.visibility = "true";

  var btn = document.querySelectorAll(".inspector .card .remove_marker");
  btn[0].addEventListener("click", function () {
    resetInspector();
  });

  var reset_btn = document.querySelectorAll(".inspector .card .send_report");
  reset_btn[0].addEventListener("click", function () {
    report_builder(city_name, location.lat(), location.lng());
  });
  var view_all_btn = document.querySelectorAll(".inspector .card .view_all");
  view_all_btn[0].addEventListener("click", function () {
    display_card(city_name);
  });
}

function report_builder(city_name, lat, lng) {
  var inspector = document.querySelector(".inspector .card");
  inspector.innerHTML = `
  <div class="card-body" style="text-align: left; z-index: 100">
    <h5 class="card-title">Report an Event</h5>
    <h6 class="card-subtitle mb-2 text-muted">We will automatically include ${city_name} as the location of your report.</h6>
    <form action="/api/report" method="post" id="myForm">
    <div class="form-group">
    <label for="event_name">Event Name:</label>
    <input class="form-control" id="event_name" name="event_name">
    </div>
    <div class="form-group">
    <label for="event_description">Event Description:</label>
    <input class="form-control" id="event_description" name="event_description">
    </div>
    <div class="form-group">
    <label for="event_type">Event Type:</label>.
    <select class="custom-select" aria-label="warning select" name="event_type">
  <option value="General Warning">General Warning</option>
  <option value="Risk Mitigation/Preparation">Risk Mitigation/Preparation</option>
  <option value="Disaster">Disaster</option>
  <option value="Response">Response</option>
  <option value="Recovery">Recovery</option>
    <option selected value="">Choose event type</option>
</select>
</div>
    <input type="hidden" name="city_name" value="${city_name}">
    <input type="hidden" name="lat" value="${lat}">
    <input type="hidden" name="lng" value="${lng}">
    <button onclick="send_form()" type="submit" class="btn btn-primary">Submit</button>
    <a onclick="resetInspector()" class="card-link" style="margin-left: 10px; cursor: pointer">Cancel</a>
</div>
</form>
  </div>`;
}

function resetInspector() {
  var inspector = document.querySelector(".content");
  inspector.innerHTML = `<div class="card" style="width: 18rem;">
  <div class="card-body">
    <a class="text-muted">Click on the map.</a>
  </div>
</div>`;
  if (all_overlays[selected_area_index - 1] != null) {
    all_overlays[selected_area_index - 1].setMap(null);
  }
}

function send_form() {
  document.getElementById("myForm").submit();
  var card = "";
  card += `<div class="card mt-3" style="width: 18rem; z-index: 0">
  <div class="card-body" style="text-align: left;">
    <h5 class="card-title">Report Submitted</h5>
    <p class="card-text">Your report has been submitted and will be evaluated as soon as possible. Check back later.</p>
    <h6 class="card-subtitle mb-2 text-muted">You may click on another area in the map again.</h6>
  </div></div>`;

  let marker_card = document.querySelector(".content");
  marker_card.innerHTML =
    "" +
    "<div class='inspector' style='background-color: white;padding: 20px; max-width: 400px; max-height: 400px'><p>Inspector" +
    "<br></p>" +
    card +
    "</div>";
  marker_card.style.visibility = "true";
}

function sendToAPI(geocoded, location) {
  var city_name = geocoded["results"][0]["address_components"][0]["short_name"];
  fetch(
    "api/save/?city_name=" +
      city_name +
      "&lat=" +
      location.lat() +
      "&lng=" +
      location.lng() +
      "&status=test"
  )
    .then((response) => response.json())
    .then((json) => fetchFromAPI());
}

function fetchFromAPI() {
  fetch("api/retrieve/")
    .then((response) => response.json())
    .then((json) => drawOnclick(json));
}

function drawOnclick(json) {
  for (var i = 0; i < all_overlays.length; i++) {
    all_overlays[i].setMap(null);
  }
  // alert("clicked");
  for (x in json) {
    if (json[x][4] === "General Warning") {
      fill_color = "#f0ad4e";
    } else if (json[x][4] === "Risk Mitigation/Preparation") {
      fill_color = "#5cb85c";
    } else if (json[x][4] === "Disaster") {
      fill_color = "#FF0000";
    } else if (json[x][4] === "Response") {
      fill_color = "#5bc0de";
    } else if (json[x][4] === "Recovery") {
      fill_color = "#0275d8";
    } else {
      fill_color = "#FFF";
    }
    var antennasCircle = new google.maps.Circle({
      strokeColor: fill_color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: fill_color,
      fillOpacity: 0.35,
      map: map,
      center: {
        lat: parseFloat(json[x][1]),
        lng: parseFloat(json[x][2]),
      },
      radius: 50 * 10,
    });
    all_overlays.push(antennasCircle);
    google.maps.event.addListener(antennasCircle, "click", function () {
      if (all_overlays[selected_area_index - 1] != null) {
        all_overlays[selected_area_index - 1].setMap(null);
      }
      get_events(this.center.lat(), this.center.lng());
    });

    console.log(all_overlays);
  }
}

function showPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latlng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      map.panTo(latlng);
      map.zoom = 10;
    });
  } else {
    alert("Sorry, your browser does not support HTML5 geolocation.");
  }
}
// W3Schools draggable div
// Make the DIV element draggable:
dragElement(document.getElementById("draggable"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.querySelector(".draggableheader")) {
    // if present, the header is where you move the DIV from:
    document.querySelector(".draggableheader").onmousedown = dragMouseDown;
  } else {
    console.log("no header");
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    var window_height = window.innerHeight;
    var window_width = window.innerWidth;
    console.log(window_width);
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    if (parseInt(elmnt.style.top) < 0) {
      elmnt.style.top = "0";
    } else if (parseInt(elmnt.style.left) < 0) {
      elmnt.style.left = "0";
    } else if (parseInt(elmnt.style.top) > window_height - 50) {
      elmnt.style.top = "70vh";
      elmnt.style.left = "60vw";
    } else if (parseInt(elmnt.style.left) > window_width - 150) {
      elmnt.style.top = "70vh";
      elmnt.style.left = "60vw";
    } else {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function get_events(lat, lng) {
  fetch("api/retrieve/events/?lat=" + lat + "&lng=" + lng)
    .then((response) => response.json())
    .then((json) => display_card(json));
}

function display_card(city_name) {
  fetch("api/retrieve/events/city/?city_name=" + city_name)
    .then((response) => response.json())
    .then((events) => display_events(city_name, events));
}

function display_events(city_name, events) {
  var event_entries = "";
  var i;
  for (i = 0; i < events.length; i++) {
    if (events[i][4] === "General Warning") {
      event_entries += `<div class="card mt-3 bg-warning text-light" style="width: 18rem;">`;
    } else if (events[i][4] === "Risk Mitigation/Preparation") {
      event_entries += `<div class="card mt-3 bg-success text-light" style="width: 18rem;">`;
    } else if (events[i][4] === "Disaster") {
      event_entries += `<div class="card mt-3 bg-danger text-light" style="width: 18rem;">`;
    } else if (events[i][4] === "Response") {
      event_entries += `<div class="card mt-3 bg-info text-light" style="width: 18rem;">`;
    }

    event_entries += `
  <div class="card-body" style="text-align: left;">
    <h5 class="card-title font-weight-bold">${events[i][2]}</h5>
    <h6 class="card-subtitle mb-2 font-weight-light">${events[i][4]}</h6>
    <p class="card-text font-weight-normal">${events[i][3]}</p>
    <h6 class="text-light mb-2 font-italic">${events[i][5]}</h6>
  </div></div>`;
    console.log("looped");
  }
  let marker_card = document.querySelector(".content");

  if (events.length === 0) {
    marker_card.innerHTML =
      "" +
      "<div style='background-color: white;padding: 20px; max-width: 400px; max-height: 400px'><p>Events in " +
      city_name +
      "<br></p><a class='text-muted'>No entry exists for this city.</a></div>";
    marker_card.style.visibility = "true";
  } else {
    marker_card.innerHTML =
      "" +
      "<div style='background-color: white;padding: 20px; max-width: 400px; max-height: 400px'><p>Events in " +
      city_name +
      "<br></p>" +
      event_entries +
      "</div>";
    marker_card.style.visibility = "true";
  }
}

function tutorial(page = 0) {
  let inspector = document.querySelector(".content");
  if (page === 0) {
    inspector.innerHTML = `<div class="card mt-3" style="width: 18rem;"><div class="card-body" style="text-align: left;">
    <h5 class="card-title font-weight-bold">Welcome to CINFORM!</h5>
    <h6 class="card-subtitle mb-2 font-weight-light">Page 1 of 4</h6>
    <p class="card-text font-weight-normal">You can begin using the app by clicking on any part of the map. After clicking,
    you will be presented with data in your Inspector Window.</p>
    <h6 class="text-muted mb-2 font-italic">Clicking outside of the Inspector window will close this tutorial.</h6>
    <button onclick="tutorial(${
      page - 1
    })" class="btn btn-primary disabled">Previous</button>
    <button onclick="tutorial(${
      page + 1
    })" class="btn btn-primary" style="float: right">Next</button>
  </div></div>`;
  }

  if (page === 1) {
    inspector.innerHTML = `<div class="card mt-3" style="width: 18rem;"><div class="card-body" style="text-align: left;">
    <h5 class="card-title font-weight-bold">Create a new Event</h5>
    <h6 class="card-subtitle mb-2 font-weight-light">Page 2 of 4</h6>
    <p class="card-text font-weight-normal">After pressing the map, the Inspector will show you options to report a new
    event and list all events in the city of your marker. The Inspector will then show a form that can be filled to
    send your report.</p>
    <h6 class="text-muted mb-2 font-italic">Clicking outside of the Inspector window will close this tutorial.</h6>
    <button onclick="tutorial(${
      page - 1
    })" class="btn btn-primary">Previous</button>
    <button onclick="tutorial(${
      page + 1
    })" class="btn btn-primary" style="float: right">Next</button>
  </div></div>`;
  }

  if (page === 2) {
    inspector.innerHTML = `<div class="card mt-3" style="width: 18rem;"><div class="card-body" style="text-align: left;">
    <h5 class="card-title font-weight-bold">List all Events in the city.</h5>
    <h6 class="card-subtitle mb-2 font-weight-light">Page 3 of 4</h6>
    <p class="card-text font-weight-normal">By pressing an existing Event marker in the map, or by clicking "View all..."
    in the Inspector, you can see a list of all events in the city of the selected area.</p>
    <h6 class="text-muted mb-2 font-italic">Clicking outside of the Inspector window will close this tutorial.</h6>
    <button onclick="tutorial(${
      page - 1
    })" class="btn btn-primary">Previous</button>
    <button onclick="tutorial(${
      page + 1
    })" class="btn btn-primary" style="float: right">Next</button>
  </div></div>`;
  }

  if (page === 3) {
    inspector.innerHTML = `<div class="card mt-3" style="width: 18rem;"><div class="card-body" style="text-align: left;">
    <h5 class="card-title font-weight-bold">Collaborative Information all in one place.</h5>
    <h6 class="card-subtitle mb-2 font-weight-light">Page 4 of 4</h6>
    <p class="card-text font-weight-normal">Articles from reliable sources and independent authors can be found in the
    sidebar > Articles. Users can both read existing data and write their own posts.</p>
    <h6 class="text-muted mb-2 font-italic">Clicking outside of the Inspector window will close this tutorial.</h6>
    <button onclick="tutorial(${
      page - 1
    })" class="btn btn-primary">Previous</button>
    <button onclick="resetInspector()" class="btn btn-primary" style="float: right">Finish</button>
  </div></div>`;
  }
}

window.onload = function () {
  tutorial();
};
