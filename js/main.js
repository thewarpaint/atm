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

		$scope.toggleBank = function(bank) {
			if(angular.isDefined($scope.filters[bank])) {
				$scope.filters[bank].isActive = !$scope.filters[bank].isActive;
				$scope.updateFilter(bank);
			}
		};

		$scope.updateFilter = function(bank) {
			var filters = [];

			_.each($scope.filters, function(filter, bank) {
				if(filter.isActive) filters.push(bank);
			});

			if(filters.length == 0 || filters.length == $scope.filters.length) {
				$scope.filterStatus = 'all';

				$scope.map.markerLayer.setFilter(function(f) {
					return true;
				});
			}
			else {
				$scope.filterStatus = 'some';
				
				$scope.map.markerLayer.setFilter(function(f) {
					return _.contains(filters, f.properties['bankName']);
				});
			}
		};

		$scope.init();
	}]);