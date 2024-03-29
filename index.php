<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<title>Cajeros automáticos del Distrito Federal</title>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
<script src="http://api.tiles.mapbox.com/mapbox.js/v1.4.0/mapbox.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>

<link href="http://api.tiles.mapbox.com/mapbox.js/v1.4.0/mapbox.css" rel="stylesheet">
<link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.1/css/font-awesome.css" rel="stylesheet">
<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet">
<link href="css/main.css" rel="stylesheet">
<!--[if lte IE 8]>
	<link href="http://api.tiles.mapbox.com/mapbox.js/v1.4.0/mapbox.ie.css" rel="stylesheet">
<![endif]-->
</head>
<body ng-app="ATM" ng-controller="ATMCtrl">

<div id="map-menu">
	<div class="list-group">
		<a href="#" class="list-group-item" ng-click="showAllBanks()">
			<span ng-show="filterStatus == 'all'"><i class="fa fa-filter fa-fw"></i> Bancos</span>
			<span ng-show="filterStatus == 'some'"><i class="fa fa-eye fa-fw"></i> Ver todos</span>
		</a>
		<a href="#" ng-repeat="(bank, filter) in filters" class="list-group-item" ng-class="{ 'active': filters[bank].isActive }" ng-click="toggleBank(bank)">
			<i class="fa fa-fw" ng-class="{ true: 'fa-check-square', false: 'fa-square-o' }[filters[bank].isActive]"></i>
			{{ filter.label }}
		</a>
	</div>
</div>

<div id="map-search" class="panel panel-default">
	<div class="panel-body">
		<form ng-submit="search()" class="form-inline" role="form">
			<div class="input-group">
				<input type="text" class="form-control" placeholder="Búsqueda por dirección" ng-model="textSearch">
				<span class="input-group-btn"><button type="submit" class="btn btn-primary"><i class="fa fa-search"></i></button></span>
			</div>
			<span class="help-block">Ejemplo: <a href="#" ng-click="exampleSearch()">{{ searchOptions.exampleSearch }}</a>.</span>
		</form>
	</div>
</div>

<div id="map-detail" class="panel panel-default" ng-hide="currentFeature == null">
	<div class="panel-heading">
		<h2 class="panel-title"><!-- <img src="design/pin-banamex.flat.png"> --> {{ currentFeature.properties.name }}</h2>
	</div>
	<div class="panel-body">
		<p>{{ currentFeature.properties.address }}</p>
		<p>Colonia {{ currentFeature.properties.neighborhood }}, C. P. {{ currentFeature.properties.zipCode }}</p>
		<p><a ng-href="{{ currentFeature.properties.googleMapsSearch }}" target="_blank" class="btn btn-primary"><i class="fa fa-map-marker"></i> Google Maps</a> <button class="btn btn-warning"><i class="fa fa-warning"></i> Reportar ubicación</button></p>
		<p style="display: none;">{{ currentFeature.properties | json }}</p>
	</div>
</div>

<div id="map-footer">
	<div class="container">
		<p class="brand">&copy; 2013 Eduardo García</p>
		<p class="text-muted">Los logotipos aquí presentados con fines informativos son marcas registradas y propiedad de la institución bancaria correspondiente.</p>
	</div>
</div>

<div id="map"></div>

<script src="data/banamex.geojson"></script>
<script src="data/bancomer.geojson"></script>
<script src="js/main.js"></script>
</body>
</html>