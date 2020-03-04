<?php
	include "Session.php";
	include "connessione.php";

	$pageName="Importa dati";
?>
<html>
	<head>
		<link href="css/fonts.css" rel="stylesheet">
		<title><?php echo $pageName; ?></title>
        <link rel="stylesheet" href="css/struttura.css" />
		<link rel="stylesheet" href="css/global.css" />
		<script src="js/struttura.js"></script>
        <link rel="stylesheet" href="css/importaDati.css" />
		<script src="js/importaDati.js"></script>
	</head>
	<body onload="getElencoLotti()">
		<?php include('struttura.php'); ?>
		<div id="outerContainerImportaDati">
            <div id="leftContainerImportaDati" class="innerContainerImportaDati">
                <div class="innerContainerRowImportaDati">
                    <button id="importaDatiGeaButton" class="importaDatiButton" onclick="importaDatiGea(this)">
                        <span>Importa dati da Gea</span>
                        <i class="fad fa-file-import"></i>
                    </button>
                    <input type="file" accept=".txt" onchange="importaFileGea(this)" multiple id="inputImportaFileGea">
                </div>
                <div id="lottiContainer" class="innerContainerRowImportaDati"></div>
            </div>
            <div id="rightContainerImportaDati" class="innerContainerImportaDati">
                <div class="innerContainerRowImportaDati">
                    <button id="importaDatiDbTecnicoButton" class="importaDatiButton" onclick="importaDatiDbTecnico(this)">
                        <span>Importa database tecnico</span><!-- fai partire la stored porocedure createCarrelliCabine-->
                        <i class="fad fa-database"></i>
                    </button>
                </div>
            </div>
        </div>
		<div id="footer">
			<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
		</div>
	</body>
</html>