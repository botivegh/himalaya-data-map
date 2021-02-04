// Create a popup, but don't add it to the map yet.

///https://nagix.github.io/mapbox-gl-animated-popup/
//  var popup = new mapboxgl.Popup({
//    closeButton: false,
//    closeOnClick: false,
//    offset: [0, -25],
//    className : "hover-popup"
//  });

var popupHover = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: [0, 50],
  className: "hover-popup",
});
var popupClick = new mapboxgl.Popup({
  className: "click-popup",
  closeButton: false,
  closeOnClick: false,
  offset: [0, 0],
});
// var popupClick = new AnimatedPopup({
//   className: "click-popup",
//   openingAnimation: {
//     closeButton: false,
//     offset: [0, -25],
//     duration: 1500,
//     easing: "easeOutElastic",
//   },
//   closingAnimation: {
//     duration: 300,
//     easing: "easeInBack",
//   },
// });

mapboxgl.accessToken =
  "pk.eyJ1IjoiYm90aXZlZ2gxMSIsImEiOiJjazdydGI1NXAwYTJ4M25zZnNuanhoOGVtIn0.ehZ8tfymMjbNyAPJ2o2lhQ";
var map = new mapboxgl.Map({
  container: "map",
  zoom: 11.5,
  center: [86.925782, 27.987029],
  pitch: 75,
  bearing: 70,
  attributionControl: false,
  preserveDrawingBuffer: true,
  // style: "mapbox://styles/botivegh11/ck7rxaiee0lpb1holaqo8i5j2",
  style: "mapbox://styles/mapbox/satellite-v9",

  //style: "mapbox://styles/mapbox/outdoors-v10?optimize=true",
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), (position = "bottom-right"));

map.on("load", function () {
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 10,
  });

  ///////// ADD PEAKS
  map.loadImage(
    "http://127.0.0.1:5500/assets/images/marker_peak_blue_red.png",
    // Add an image to use as a custom marker
    function (error, image) {
      if (error) throw error;
      map.addImage("mountain-marker", image);

      map.addSource("peaks", {
        type: "geojson",
        data: "http://127.0.0.1:5500/Himalayan Database/GeoData/peaks.geojson",
      });

      // Add a layer showing the peaks.
      map.addLayer({
        id: "peaks",
        type: "symbol",
        source: "peaks",
        paint: { "text-color": "white" },
        layout: {
          "icon-image": "mountain-marker",
          "icon-size": 0.12,
          "icon-allow-overlap": true,
          "text-allow-overlap": false,
          "text-field": ["get", "heightm"],
          "text-variable-anchor": ["top"],
          "text-justify": "center",
          "text-radial-offset": 0.7,
          "text-size": 11,
          //'font-scale': 0.8,
          "text-font": ["Roboto Black", "Arial Unicode MS Regular"],
        },
      });
    }
  );
  //// ADD PEAKS POPUP ON

  map.on("mouseenter", "peaks", function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    var coordinates = e.features[0].geometry.coordinates.slice();
    var pkname = e.features[0].properties.pkname;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    // Populate the popup and set its coordinates
    // based on the feature found.
    popupHover.setLngLat(coordinates).setHTML(pkname).addTo(map);
  });

  map.on("mouseleave", "peaks", function () {
    map.getCanvas().style.cursor = "";
    popupHover.remove();
  });

  ///// GET DATA BY CLICKS
  map.on("click", "peaks", function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var id = e.features[0].properties.peakid;
    popupClick.setLngLat(coordinates).setHTML("click").addTo(map);
    /// Mapbox not giving the array format properties as array so I need to request the data angain to get it in the proper format
    $.getJSON("/Himalayan Database/GeoData/peaks.geojson", function (data) {
      var selectedPeak = data.features.filter(
        (el) => el.properties.peakid == id
      )[0];

      ToggleToolBox(true);
      setSidebarData(selectedPeak);
    });
  });
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "peaks", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "peaks", function () {
    map.getCanvas().style.cursor = "";
  });

  // add markers to map https://jsonkeeper.com/b/A71V

  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1 });

  // add a sky layer that will show when the map is highly pitched
  map.addLayer({
    id: "sky",
    type: "sky",
    paint: {
      "sky-type": "atmosphere",
      "sky-atmosphere-sun": [0.0, 0.0],
      "sky-atmosphere-sun-intensity": 15,
    },
  });
});

//////////////// Depreciated markers

// $.getJSON(
//     "http://127.0.0.1:5500/Himalayan Database/GeoData/peaks.geojson",
//     function (data) {
//       var geojson = data; // JSON result in `data` variable
//       geojson.features.forEach(function (marker) {
//         // create a DOM element for the marker
//         var el = document.createElement("div");
//         el.className = "marker";
//         //el.style.backgroundColor = "white";
//         el.style.backgroundImage =
//           "url('http://127.0.0.1:5500/assets/images/marker_peak_blue.png')";
//         el.innerHTML = "<span>" + marker.properties.heightm + "m" + "</span/>";

//         var popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false }).setText(
//             marker.properties.pkname
//             );

//         // add marker to map
//         const myMarker = new mapboxgl.Marker(el)
//           .setLngLat(marker.geometry.coordinates)
//           .addTo(map)
//           .setPopup(popup);

//         el.addEventListener('mouseenter', () => myMarker.togglePopup());
//         el.addEventListener('mouseleave', () => myMarker.togglePopup());

//       });
//     }
//   );

/////////////// LOCATION SEARCH

$.getJSON("/Himalayan Database/GeoData/peaks_search.json", function (data) {
  $("#searchTextField").autocomplete({
    source: data,
    appendTo: "#location-search",
    open: function (event, ui) {
      $(".ui-autocomplete").off("menufocus hover mouseover mouseenter");
    },
    minLength: 0,
    select: function (event, ui) {
      var countrycenter = [ui.item.id[1], ui.item.id[0]];

      map.zoomTo(7, { duration: 100 });

      //map.setPitch(0, { duration: 1000 });
      //map.flyTo({
      map.easeTo({
        center: countrycenter,
        pitch: 80,
        zoom: 10,
        // bearing: -60,
        duration: 4000,
      });
      //location_search_stats.style.visibility="visible";
    },
  });
});

jQuery.ui.autocomplete.prototype._resizeMenu = function () {
  var ul = this.menu.element;
  ul.outerWidth(this.element.outerWidth());
};

//// MODIFY DOM

//OPEN TOOLBOX
var toolbar = document.getElementById("toolbar");
var toolbar_header = document.getElementById("toolbar-header");
var toolbar_button = document.getElementById("toolbar-button");
var location_search = document.getElementById("location-search");

document.getElementById("toolbar-button").onclick = function () {
  ToggleToolBox();
};
///// TOGGLE
function ToggleToolBox(forceOpen) {
  if (forceOpen == true) {
    toolbar.style.visibility = "visible";
    toolbar_button.className = "active";
    location_search.className = "location-search-toolbox-active";
  } else {
    if (toolbar.style.visibility == "visible") {
      toolbar.style.visibility = "hidden";
      toolbar_button.className = "";
      location_search.className = "";
    } else {
      toolbar.style.visibility = "visible";
      toolbar_button.className = "active";
      location_search.className = "location-search-toolbox-active";
    }
  }
}

//// SET SIDEBAR - TOOLBAR
function setSidebarData(selectedPeak) {
  document.getElementById("peak-img").style.backgroundImage =
    'url("' +
    selectedPeak.properties.photos +
    '"), url("./assets/images/placeholder2.jpg")';
  document.getElementById("peak-height-badge").innerHTML =
    selectedPeak.properties.heightm + "m";
  document.getElementById("peak-name-text").innerHTML =
    selectedPeak.properties.pkname;

  //// SET DATA ON STORY TAB
  if (
    selectedPeak.properties.count_mem_success == null ||
    selectedPeak.properties.count_mem_success == "null"
  ) {
    document.getElementById("story-first-sub").innerHTML = "UNCLIMBED";
    document.getElementById("story-first-year").innerHTML = "";
    document.getElementById("story-about").innerHTML = "";
    // $(".flag-carousel").slick("removeSlide", null, null, true);
  } else {
    /// First peps
    document.getElementById("story-first-sub").innerHTML =
      "<strong>First Summiters</strong> <br/> " +
      selectedPeak.properties.psummiters;
    /// FIst year
    document.getElementById("story-first-year").innerHTML =
      "<hr/><strong>First Year Ascent</strong> <br/> " +
      selectedPeak.properties.pyear;
    /// Popular Route
    document.getElementById("story-route").innerHTML =
      "<hr/><strong>Most Popular Route</strong> <br/> " +
      selectedPeak.properties.most_pop_route;
    /// About:
    document.getElementById("story-about").innerHTML =
      "<hr/> <strong>About</strong> <br/> " + selectedPeak.properties.location;

    /// Add flag to the caroussel!
    // $(".flag-carousel").slick("removeSlide", null, null, true);
    // JSON.parse(selectedPeak.properties.country_mem_success)
    //   .slice(0, 20)
    //   .forEach((element) => {
    //     var img =
    //       '<img src="./assets/images/flags/' +
    //       element.toLowerCase() +
    //       '.svg" alt=""  style="height: 30px;" >';
    //     $(".flag-carousel").slick("slickAdd", img);
    //   });

    /// KPI SUCCESS
    document.getElementById("attempts-total").innerText =
      selectedPeak.properties.count_mem_try;

    document.getElementById("success-rate").innerText =
      parseFloat(
        (selectedPeak.properties.count_mem_success /
          selectedPeak.properties.count_mem_try) *
          100
      ).toFixed(2) + "%";
    document.getElementById("success-total").innerText =
      selectedPeak.properties.count_mem_success;
    /// KPI O2
    document.getElementById("o2-rate").innerText =
      parseFloat(
        (selectedPeak.properties.mo2used /
          selectedPeak.properties.count_mem_try) *
          100
      ).toFixed(2) + "%";
    document.getElementById("o2-total").innerText =
      selectedPeak.properties.mo2used;
    /// KPI DEATH
    document.getElementById("death-rate").innerText =
      parseFloat(
        (selectedPeak.properties.death /
          selectedPeak.properties.count_mem_try) *
          100
      ).toFixed(2) + "%";
    document.getElementById("death-total").innerText =
      selectedPeak.properties.death;

    ////  LINE CHART

    var trace1 = {
      x: selectedPeak.properties.lineX,
      y: selectedPeak.properties.lineY_attemps,
      name: "attempt",
      mode: "lines",
      line: {
        dash: "solid",

        width: 2,
      },
    };

    var trace2 = {
      x: selectedPeak.properties.lineX,
      y: selectedPeak.properties.lineY_success,
      name: "success",
      mode: "lines",
      line: {
        dash: "spline",
        width: 2,
        color: "green",
      },
    };

    var data = [trace1, trace2];

    var layout = {
      showlegend: true,
      legend: {
        orientation: "h",
      },
      margin: {
        l: 30,
        r: 20,
        b: 30,
        t: 20,
      },
    };

    TESTER = document.getElementById("tester");
    Plotly.newPlot("tester", data, layout);
  }
}

// VISIT TO TOP5 PEAKS!!

function Top5Story(rank) {
  map_rank_id = { 1: "EVER", 2: "KANG", 3: "LHOT", 4: "YALU", 5: "MAKA" };

  $.getJSON("/Himalayan Database/GeoData/peaks.geojson", function (data) {
    var selectedPeak = data.features.filter(
      (el) => el.properties.peakid == map_rank_id[rank]
    )[0];
    map.easeTo({
      center: selectedPeak.geometry.coordinates,
      pitch: 80,
      zoom: 12,
      duration: 4000,
    });

    setSidebarData(selectedPeak);
    ToggleToolBox(true);
  });
}
// Caroussel
// $(document).ready(function () {
//   $(".flag-carousel").slick({
//     infinite: true,
//     lazyLoad: "ondemand",
//     arrows: true,
//     slidesToShow: 4,
//     slidesToScroll: 3,
//     centerMode: false,
//     variableWidth: true,
//   });
// });

/// Screenshot
$("#download-screen-shot").click(function () {
  console.log("hahi");
  var img = map.getCanvas().toDataURL("image/png");
  this.href = img;
});

//// ADD FLAG
//https://krikienoid.github.io/flagwaver/
// // var el = document.createElement("div");
// // el.className = "marker";
// // el.style.backgroundImage =
// //   "url(https://cdn.lowgif.com/full/5707951145ff991d-the-gallery-for-american-flag-icon-gif.gif)";
// // el.style.width = "50px";
// // el.style.height = "50px";
// // new mapboxgl.Marker(el).setLngLat([86.925782, 27.987029]).addTo(map);
