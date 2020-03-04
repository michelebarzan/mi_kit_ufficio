<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Homepage";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
		<link rel="stylesheet" href="css/struttura.css" />
		<script src="js/struttura.js"></script>
	</head>
	<body>
		<?php include('struttura.php'); ?>
		<div id="container">
			<div id="content">
				<div id="immagineLogo" class="immagineLogo" ></div>
				<div class="homepageLinkContainer">
					<div class="homepageLink" data-tooltip="Homepage" onclick="gotopath('index.php')">
						<i class="fad fa-home"></i>
						<div>Homepage</div>
					</div>
					<div class="homepageLink" data-tooltip="Importa dati" onclick="gotopath('importaDati.php')">
						<i class="fad fa-file-import"></i>
						<div>Importa dati</div>
					</div>
					<div class="homepageLink" data-tooltip="Gestione linee" onclick="gotopath('gestioneLinee.php')">
						<i class="fad fa-line-columns"></i>
						<div>Gestione linee</div>
					</div>
				</div>
				<div id="statisticheSwContainer"></div>
			</div>
		</div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>
