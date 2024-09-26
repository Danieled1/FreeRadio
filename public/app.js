document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearButton');
    const suggestions = document.getElementById('suggestions');
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const stationTitle = document.getElementById('stationTitle');
    const stationImage = document.getElementById('stationImage');
    const stationTags = document.getElementById('stationTags');
    const stationHomepage = document.getElementById('stationHomepage');
    const stationListElement = document.getElementById('stationList'); 
    const stationListMenu = new bootstrap.Offcanvas(document.getElementById('stationListMenu'));
  
    let stations = [];
    let selectedStation = null;
  
    // Fetch stations and populate the list
    async function fetchStations() {
      try {
        const response = await fetch('https://de1.api.radio-browser.info/json/stations/bycountry/Israel', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
        stations = await response.json();    
        stations = stations.filter(station => 
            station.language !== 'arabic' && station.languagecode !== 'ar'
        );    
        console.log(stations);
        
        showTopStations(stations); 
        populateStationMenu(stations);
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    }
  
    // Show top 10 most listened stations by default
    function showTopStations(stationList) {
      const topStations = stationList
        .filter(station => station.country === 'Israel')
        .sort((a, b) => b.clickcount - a.clickcount)
        .slice(0, 10);
  
      populateStationList(topStations);
    }
  
    // Populate the off-canvas menu with all stations
    function populateStationMenu(stationList) {
      if (stationListElement) {
        stationListElement.innerHTML = '';
        stationList.forEach(station => {
          const item = document.createElement('a');
          item.href = "#";
          item.classList.add('list-group-item', 'list-group-item-action');
          item.textContent = `${station.name} (${station.country})`;
          item.onclick = () => {
            selectStation(station);
            stationListMenu.hide(); // Close the off-canvas menu
            playStation();
          };
          stationListElement.appendChild(item);
        });
      }
    }
  
    // Show suggestions when input is focused
    searchInput.addEventListener('focus', () => {
      if (!searchInput.value) showTopStations(stations);
    });
  
    // Display filtered suggestions based on user input
    function showSuggestions(value) {
      const searchTerm = value.toLowerCase();
      suggestions.innerHTML = '';
  
      if (searchTerm) {
        const filteredStations = stations.filter(station =>
          station.name.toLowerCase().includes(searchTerm) || station.tags.toLowerCase().includes(searchTerm)
        );
        populateStationList(filteredStations);
      } else {
        showTopStations(stations);
      }
    }
  
    // Populate the suggestions list with stations
    function populateStationList(stationList) {
      suggestions.innerHTML = '';
  
      if (stationList.length > 0) {
        stationList.forEach(station => {
          const item = document.createElement('div');
          item.classList.add('list-group-item', 'list-group-item-action');
          item.textContent = `${station.name} (${station.country})`;
          item.onclick = () => {
            selectStation(station);
            playStation();
          };
          suggestions.appendChild(item);
        });
      }
    }
  
    // Select a station from suggestions or menu
    function selectStation(station) {
      selectedStation = station;
      searchInput.value = `${station.name} (${station.country})`; 
      suggestions.innerHTML = ''; 
    }
  
    // Play the selected station and display additional info
    function playStation() {
      if (selectedStation) {
        audioPlayer.src = selectedStation.url_resolved;
        audioPlayer.play();
        stationTitle.textContent = selectedStation.name;
  
        if (selectedStation.favicon) {
          stationImage.src = selectedStation.favicon;
          stationImage.style.display = 'block';
        } else {
          stationImage.style.display = 'none';
        }
  
        if (selectedStation.tags) {
          stationTags.textContent = `תגיות: ${selectedStation.tags}`;
          stationTags.style.display = 'block';
        } else {
          stationTags.style.display = 'none';
        }
  
        if (selectedStation.homepage) {
          stationHomepage.href = selectedStation.homepage;
          stationHomepage.style.display = 'block';
        } else {
          stationHomepage.style.display = 'none';
        }
      } else {
        alert("אנא בחר תחנה מהרשימה.");
      }
    }
  
    // Clear search input and reset selected station
    function clearSearch() {
      searchInput.value = '';
      suggestions.innerHTML = '';
      selectedStation = null;
      showTopStations(stations);
    }
  
    // Event listeners
    searchInput.addEventListener('input', () => showSuggestions(searchInput.value));
    playButton.addEventListener('click', playStation);
    clearButton.addEventListener('click', clearSearch);
  
    // Initial fetch of stations
    fetchStations();
  });
  