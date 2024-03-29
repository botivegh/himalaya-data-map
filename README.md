# Nepal Himalayas Map
Link: http://himalayas-map.s3-website-eu-west-1.amazonaws.com/  

**Map**
For my individual visualisation, I created an interactive map presenting the peaks of the Himalayas in Nepal. My goal was to create an easily understandable, intuitive application for a broader audience. As such, I chose to follow a simplistic approach in the design objectives and user experience.

I used Mapbox GL JS library for this application, as it allows to use 3D terrain layers and sky layer to visualise the mountains more realistically on the screen. Plolty.js library was used to dynamically create the plots about each peak as the user selected them. When the map loads up, the user automatically starts their journey at the Mount Everest. Therefore, it’s immediately orienting the user to familiar location. Other peaks can be selected in the search bar where all peaks are listed or by browsing on the map and clicking on the markers. Search bar is mainly aimed to provide the users with more knowledge on the peaks of Himalayas as they can search for individual peaks by name. 

The data showed on a peak is the following: first summiters, first year ascent, total attempts, success rate, death rate, oxygen rate, time series of attempts, climbers age and gender distributions. 

I particularly paid attention to create an intuitive UI and made sure the app is not limited to desktop but well structured and clear on mobile as well. I followed Bootstrap 4 guidelines to create a modern, appealing design. As the application is for a wider audience, the look and feel plays a more significant role to engage the users. A photo functionality added to the application so a great bird view of the mountains can be saved as an image.

**The dataset**
I used an open database on the mountain peaks of Himalayas in Nepal. The provided data has information on the climbers, peaks and expeditions. For example, it contains the injuries, oxygen usage, nationality, age, success of climbers. The data did not include geolocations on the peaks, but after data cleaning and researching I managed to geocode or find coordinates about the 80% of the peaks.


**References**

Data used:
Nepal Himalayas: https://www.himalayandatabase.com/
Explore Himalaya:  https://www.explorehimalaya.com/peak-climbing-resources/identified-peaks-of-nepal/ 
Cultural treks:  https://www.culturaltreks.com/expedition-information/peak-openedfor-expedition-2.html 
Peak Visor: https://peakvisor.com/adm/nepal.html 
