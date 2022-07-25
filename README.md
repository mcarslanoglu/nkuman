NKU-MAN
=======================

Morphometric Analysis in Google Earth Engine: An online interactive web-based application for global-scale analysis 
[svm](#svm) 


## Introduction:

For researchers focusing on watershed and streams morphometric analysis, extracting the morphometric parameters of a watershed and streams is a time-consuming process and requires computer hardware, GIS software resources and GIS expertise. Since river basins or watersheds are different in size and formation, terrain processing should be redone for each basin to obtain morphometric characteristics. 

This application has been developed on the GEE platform where morphometric characteristics of watersheds and streams over the world can be obtained.

_**Important Note: Access to Google Earth Engine is currently only available to
registered users.**_

-   [Earth Engine Homepage](https://earthengine.google.com/)
-   [Web Code Editor](https://code.earthengine.google.com/)

Here's an example screenshot and the corresponding Code Editor JavaScript code:
![image](https://user-images.githubusercontent.com/10681552/180725783-841a5834-2425-4ecf-aee0-ab7612eb56b6.png)

```javascript
// Compute the trend of night-time lights.

// Adds a band containing image date as years since 1991.
function createTimeBand(img) {
  var year = ee.Date(img.get('system:time_start')).get('year').subtract(1991);
  return ee.Image(year).byte().addBands(img);
}

// Map the time band creation helper over the night-time lights collection.
// https://developers.google.com/earth-engine/datasets/catalog/NOAA_DMSP-OLS_NIGHTTIME_LIGHTS
var collection = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS')
    .select('stable_lights')
    .map(createTimeBand);

// Compute a linear fit over the series of values at each pixel, visualizing
// the y-intercept in green, and positive/negative slopes as red/blue.
Map.addLayer(
    collection.reduce(ee.Reducer.linearFit()),
    {min: 0, max: [0.18, 20, -0.18], bands: ['scale', 'offset', 'scale']},
    'stable lights trend');
```


#### svm
