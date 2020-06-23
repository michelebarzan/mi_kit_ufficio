<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Gestione linee";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
        <link rel="stylesheet" href="css/struttura.css" />
		<link rel="stylesheet" href="css/global.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/gestioneLinee.css" />
		<script src="js/gestioneLinee.js"></script>
		<link rel="stylesheet" href="libs/js/spinnersV2/spinners.css" />
		<script src="libs/js/spinnersV2/spinners.js"></script>
		<link rel="stylesheet" href="libs/js/spinners/spinner.css" />
		<link rel="stylesheet" href="css/materialComponents.css" />
		<script src="libs/js/spinners/spinner.js"></script>
		<script src="editableTable/editableTable.js"></script>
		<link rel="stylesheet" href="editableTable/editableTable.css" />
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="full-width-action-bar">
			<div class="full-width-action-bar-buttons-container">
				<button class="full-width-action-bar-button" onclick="resetStyle(this);assegnaCabineCorridoi(this)">
					<span>Assegna cabine/corridoi</span>
					<i class="fad fa-tasks-alt"></i>
				</button>
				<button class="full-width-action-bar-button" onclick="resetStyle(this);anagraficaLinee(this)">
					<span>Anagrafica linee</span>
					<i class="fad fa-line-columns"></i>
				</button>
				<button class="full-width-action-bar-button" onclick="resetStyle(this);anagraficaStazioni(this)">
					<span>Anagrafica stazioni</span>
					<i class="fad fa-network-wired"></i>
				</button>
			</div>
        </div>
        <div class="gestioneLineeOuterContainer">
			<div class="gestioneLineeInnerContainer">
				<div class="gestioneLineeActionBar" id="gestioneLineeActionBar"></div>
				<div id="gestioneLineeInnerContainer"></div>
			</div>
		</div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
	<script src="libs/js/jquery-ui.js"></script>
	<script src="libs/js/multiple-select/multiple-select.min.js"></script>
	<script src="libs/js/multiple-select/multiple-select-it-IT.js"></script>
	<link rel="stylesheet" href="libs/js/multiple-select/multiple-select.min.css">
</html>