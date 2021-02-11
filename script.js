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
  style: "mapbox://styles/botivegh11/ckl07lvlf0a3117o1sxfyh3ju",
  //style: "mapbox://styles/mapbox/satellite-v9",

  //style: "mapbox://styles/mapbox/outdoors-v10?optimize=true",
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), (position = "bottom-right"));

map.on("load", function () {
  //   map.addSource("mapbox-dem", {
  //     type: "raster-dem",
  //     // url: "mapbox://mapbox.mapbox-terrain-dem-v1",
  //     tileSize: 512,
  //     maxzoom: 10,
  //   });

  ///////// ADD PEAKS
  map.loadImage(
    "http://127.0.0.1:5500/assets/images/marker_peak_blue_red.png",
    // Add an image to use as a custom marker
    function (error, image) {
      if (error) throw error;
      map.addImage("mountain-marker", image);

      map.addSource("peaks", {
        type: "geojson",
        data: "http://127.0.0.1:5500/assets/data/peaks.geojson",
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
    $.getJSON("/assets/data/peaks.geojson", function (data) {
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
  //map.setTerrain({ source: "mapbox-dem", exaggeration: 1 });

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

//Loading screen, it is waiting for the pharmacies source to load
map.on("data", function (e) {
  if (e.dataType === "source" && e.sourceId === "peaks") {
    document.getElementById("loading-screen").style.visibility = "hidden";
    document.getElementById("map-container").style.filter = "none";
  }
});

//////////////// Depreciated markers

// $.getJSON(
//     "http://127.0.0.1:5500/assets/data/peaks.geojson",
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
var select_location = new SlimSelect({
  select: "#location-search",
  placeholder: "Search for peak of Nepal",
});

$.getJSON("./assets/data/peaks_search.json", function (data) {
  //https://trendtype-web-app-data.s3-eu-west-1.amazonaws.com/pharmacy_explorer/pharma_city_search.json
  select_location.setData(data);
  select_location.set(null);
});

document.getElementById("location-search").onchange = function () {
  var selected = select_location.selected();
  if (selected != null) {
    map.easeTo({
      center: [selected.split(",")[1], selected.split(",")[0]],
      pitch: 80,
      zoom: 10,
      // bearing: -60,
      duration: 4000,
    });
    $.getJSON("/assets/data/peaks.geojson", function (data) {
      var selectedPeak = data.features.filter(
        (el) => el.properties.peakid == selected.split(",")[2]
      )[0];
      ToggleToolBox(true);
      setSidebarData(selectedPeak);
    });
  }
};

//// MODIFY DOM

//OPEN TOOLBOX
var toolbar = document.getElementById("toolbar");
var toolbar_header = document.getElementById("toolbar-header");
var toolbar_button = document.getElementById("toolbar-button");
var location_search = document.getElementById("location-search-container");

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
    'url("./assets/images/peakimg/' +
    selectedPeak.properties.peakid +
    '.jpg"), url("./assets/images/placeholder1.jpg")';
  document.getElementById("peak-height-badge").innerHTML =
    selectedPeak.properties.heightm + "m";
  document.getElementById("peak-name-text").innerHTML =
    selectedPeak.properties.pkname;
  document.getElementById("fly-button").dataset.location = [
    selectedPeak.properties.lng,
    selectedPeak.properties.lat,
  ];
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
      "<hr/> <strong>About</strong> <br/> " + selectedPeak.properties.about;

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
    var trace3 = {
      x: selectedPeak.properties.lineX,
      y: selectedPeak.properties.lineY_death,
      name: "death",
      mode: "lines",
      line: {
        dash: "spline",
        width: 2,
        color: "black",
      },
    };

    var data = [trace1, trace2, trace3];

    var layout = {
      showlegend: true,
      hovermode: "x unified",
      legend: {
        orientation: "h",
      },
      margin: {
        l: 30,
        r: 30,
        b: 30,
        t: 15,
      },
    };
    Plotly.newPlot(
      "time-plot",
      data,
      layout,
      (config = { responsive: true, displayModeBar: false, scrollZoom: false })
    );

    /// GENDER
    var gender_trace1 = {
      y: ["Climbers"],
      x: [selectedPeak.properties.count_mem_try_female],
      text:
        parseFloat(
          (selectedPeak.properties.count_mem_try_female /
            selectedPeak.properties.count_mem_try) *
            100
        ).toFixed(2) + "%",
      textposition: "inside",
      name: "Female",
      type: "bar",
      marker: {
        color: "rgb(55, 83, 109)",
      },
      orientation: "h",
    };

    var gender_trace2 = {
      y: ["Climbers"],
      x: [
        selectedPeak.properties.count_mem_try -
          selectedPeak.properties.count_mem_try_female,
      ],
      text:
        parseFloat(
          (1 -
            selectedPeak.properties.count_mem_try_female /
              selectedPeak.properties.count_mem_try) *
            100
        ).toFixed(2) + "%",
      textposition: "inside",
      name: "Male",
      type: "bar",
      marker: {
        color: "rgb(26, 118, 255)",
      },
      orientation: "h",
    };

    var gender_data = [gender_trace1, gender_trace2];

    var gender_layout = {
      showlegend: true,
      barmode: "stack",
      xaxis: {
        showgrid: false,
        zeroline: false,
        visible: false,
        showspikes: false,
      },
      yaxis: {
        showgrid: false,
        zeroline: false,
        visible: false,
        showspikes: false,
      },
      legend: {
        orientation: "h",
        y: 0,
      },
      hovermode: "y unified",
      margin: {
        l: 20,
        r: 20,
        b: 0,
        t: 15,
      },
    };

    Plotly.newPlot(
      "gender-plot",
      gender_data,
      gender_layout,
      (config = { responsive: true, displayModeBar: false, scrollZoom: false })
    );

    //// AGE DISTRIBUTION

    var bar_trace = {
      x: Object.keys(selectedPeak.properties.age_histogram),
      y: Object.values(selectedPeak.properties.age_histogram),
      type: "bar",
      marker: {
        color: "rgb(26, 118, 255)",
      },
    };
    var age_data = [bar_trace];
    var age_layout = {
      legend: {
        orientation: "h",
        y: 0,
      },
      hovermode: "x unified",
      margin: {
        l: 30,
        r: 30,
        b: 55,
        t: 15,
      },
    };
    Plotly.newPlot(
      "age-plot",
      age_data,
      age_layout,
      (config = { responsive: true, displayModeBar: false, scrollZoom: false })
    );
  }
}

// VISIT TO TOP5 PEAKS!!

function Top5Story(rank) {
  map_rank_id = { 1: "EVER", 2: "KANG", 3: "LHOT", 4: "YALU", 5: "MAKA" };

  $.getJSON("/assets/data/peaks.geojson", function (data) {
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
  console.log("download");
  var img = map.getCanvas().toDataURL("image/png");
  this.href = img;
});

/// Locate button
document.getElementById("fly-button").onclick = function () {
  var coords = document.getElementById("fly-button").dataset.location;
  map.easeTo({
    center: coords.split(","),
    pitch: 60,
    zoom: 12,
    // bearing: -60,
    duration: 4000,
  });
};

/// Plotly resizer when stats tab appears to make sure it is sized properly
var targetNode = document.getElementById("pills-stats");
var observer = new MutationObserver(function () {
  if (targetNode.style.display != "none") {
    Plotly.Plots.resize("time-plot");
    Plotly.Plots.resize("gender-plot");
    Plotly.Plots.resize("age-plot");
  }
});
observer.observe(targetNode, { attributes: true, childList: true });

//// ADD FLAG
//https://krikienoid.github.io/flagwaver/
// // var el = document.createElement("div");
// // el.className = "marker";
// // el.style.backgroundImage =
// //   "url(https://cdn.lowgif.com/full/5707951145ff991d-the-gallery-for-american-flag-icon-gif.gif)";
// // el.style.width = "50px";
// // el.style.height = "50px";
// // new mapboxgl.Marker(el).setLngLat([86.925782, 27.987029]).addTo(map);
