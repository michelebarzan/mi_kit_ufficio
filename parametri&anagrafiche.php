<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Parametri & configurazioni";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/parametri&anagrafiche.css" />
		<script src="js/parametri&anagrafiche.js"></script>
		<link rel="stylesheet" href="libs/js/spinners/spinner.css" />
		<script src="libs/js/spinners/spinner.js"></script>
		<script src="editableTable/editableTable.js"></script>
		<link rel="stylesheet" href="editableTable/editableTable.css" />
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div class="full-width-action-bar">
			<div class="full-width-action-bar-buttons-container">
				<button class="full-width-action-bar-button" onclick="resetStyle(this);configurazioneTastierino()">
					<span>Configurazione tastierino</span>
					<i class="fad fa-keyboard"></i>
				</button>
				<button class="full-width-action-bar-button" onclick="resetStyle(this);getParametri(this)">
					<span>Parametri applicazione</span>
					<i class="fal fa-table"></i>
				</button>
			</div>
        </div>
        <div class="parametriAnagraficheOuterContainer">
			<div class="parametriAnagraficheInnerContainer">
				<div class="reusable-control-bar" id="parametriAnagraficheActionBar"></div>
				<div id="parametriAnagraficheInnerContainer"></div>
			</div>
		</div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>
