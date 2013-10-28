angular.module('ATM', [])
	.controller('ATMCtrl', ['$scope', '$http', function($scope, $http) {
		$scope.map = L.mapbox.map('map', 'thewarpaint.map-0z9uozzq')
			.setView([19.425214427643432, -99.14435863494873], 11);

		$scope.map.markerLayer.on('layeradd', function(e) {
			var marker = e.layer,
				feature = marker.feature;

			marker.setIcon($scope.icons[feature.properties.bankName]);
		});

		$scope.map.markerLayer.on('click', function(e) {
			$scope.map.panTo(e.layer.getLatLng()); /* .setZoom(15, true) */
		});

		$scope.BankIcon = L.Icon.extend({
			options: {
				iconSize:     [43, 48],
				iconAnchor:   [20, 44],
				popupAnchor:   [0, -35]
			}
		});

		$scope.icons = {
			'banamex': new $scope.BankIcon({ iconUrl: 'design/pin-banamex.flat.png' }),
			'bancomer': new $scope.BankIcon({ iconUrl: 'design/pin-bancomer.flat.png' }),
			'santander': new $scope.BankIcon({ iconUrl: 'design/pin-santander.flat.png' })
		};

		$scope.geoJSON = {
			"type": "FeatureCollection",
			"features": []
		};

		$scope.filters = {
			'banamex': {
				'label': 'Banamex',
				'isActive': false
			},
			'bancomer': {
				'label': 'BBVA Bancomer',
				'isActive': false
			}/*,
			'santander': {
				'label': 'Santander',
				'isActive': false
			}*/
		};

		$scope.filterStatus = 'all';

		$scope.init = function() {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition($scope.geolocationSuccess, function() {});
			}

			_.each(banamexJSON.features, function(feature) {
				feature.properties.bankName = 'banamex';
			});

			_.each(bancomerJSON.features, function(feature) {
				feature.properties.bankName = 'bancomer';
			});

			$scope.geoJSON.features = _.union(banamexJSON.features, bancomerJSON.features);

			$scope.map.markerLayer.setGeoJSON($scope.geoJSON);
		};

		$scope.geolocationSuccess = function (position) {
			$scope.map.setView([position.coords.latitude, position.coords.longitude], 15);
		};

		$scope.addLayer = function(layer) {
			if(!$scope.map.hasLayer(layer)) {
				$scope.map.addLayer(layer);
			}
		};

		$scope.removeLayer = function(layer) {
			if($scope.map.hasLayer(layer)) {
				$scope.map.removeLayer(layer);
			}
		};

		$scope.showAllLayers = function() {
			_.each($scope.filters,
				function(filter, bank) {
					$scope.filters[bank].isActive = false;
					$scope.updateFilter(bank);
				}
			);
		};

		$scope.fillLayers = function() {
			_.each($scope.layers, $scope.addLayer);
		};

		$scope.clearLayers = function() {
			_.each($scope.layers, $scope.removeLayer);
		};

		$scope.toggleBank = function(bank) {
			if(angular.isDefined($scope.filters[bank])) {
				$scope.filters[bank].isActive = !$scope.filters[bank].isActive;
				$scope.updateFilter(bank);
			}
		};

		$scope.updateFilter = function(bank) {
			var filterOnCount = 0,
				oldFilterStatus = $scope.filterStatus;

			_.each($scope.filters, function(filter) {
				if(filter.isActive) filterOnCount++;
			});

			$scope.filterStatus = (filterOnCount == 0 || filterOnCount == $scope.filters.length) ? 'all' : 'some';

			// Pre
			if(oldFilterStatus == 'all' && $scope.filterStatus == 'some') {
				$scope.clearLayers();
			}

			// Add/remove layers
			if(angular.isDefined(bank)) {
				if($scope.filters[bank].isActive) {
					$scope.addLayer($scope.layers[bank]);
				}
				else {
					$scope.removeLayer($scope.layers[bank]);
				}
			}

			// Post
			if($scope.filterStatus == 'all' && filterOnCount == 0) {
				$scope.fillLayers();
			}
		};

		$scope.init();
	}]);