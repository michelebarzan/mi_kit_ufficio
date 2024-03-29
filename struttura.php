	<?php $appName="mi_kit_ufficio"; ?>
	<script type="text/javascript" src="libs/js/jquery.min.js"></script>
	<link href="libs/css/fontawesome/css/all.css" rel="stylesheet">
	<script src="libs/js/sweetalert2.all.min.js"></script>
	<link href="css/fonts.css" rel="stylesheet">
	<script src="js/global.js"></script>
	<link href="css/global.css" rel="stylesheet">
	<div id="header" class="header" >
		<!--<input type="button" id="nascondi" value="" onclick="nascondi()" data-toggle='tooltip' title='Apri menu' />-->
		<button class="main-nav-bar-open-button" onclick="mainNavBarOpen()" title="Apri"><i class="fal fa-list fa-2x"></i></button>
		<div id="pageName" class="pageName"><?php echo $pageName; ?></div>
		<div id="user" class="user">
			<div id="username"><?php echo $_SESSION['Username']; ?></div>
			<input type="button" value="" id="btnUser">
			<input type="button" value="" onclick="apriNotifiche()" id="btnNotifica">
			<input type="button" id="btnNuovaNotifica" value="" >
			<div id="notifichePadding"></div>
			<div id="notifiche">
				<script>
					document.getElementById("user").addEventListener("mouseover", function()
					{
						if(document.getElementById('notifiche').style.display=="inline-block")
							apriNotifiche();	
						if(document.getElementById('notifichePadding').style.display=="inline-block")
							apriNotifiche();	
					});
				
					document.getElementById("notifiche").addEventListener("mouseover", function()
					{
						apriNotifiche();							
					});
					document.getElementById("notifiche").addEventListener("mouseout", function()
					{
						chiudiNotifiche();							
					});
					document.getElementById("notifichePadding").addEventListener("mouseover", function()
					{
						apriNotifiche();							
					});
				</script>
				<div id="userSettingsRow1">
					<div id="titoloUserSettings">Notifiche</div>
					<input type="button" value="" id="btnChiudiUserSettings" onclick="chiudiNotifiche()">
				</div>
				<div id="containerNotifiche">
					<div id="nessunaNotifica">
						Nessuna notifica
					</div>
				</div>
			</div>
			
			<input type="button" value="" onclick="apriUserSettings()" id="btnUserSettings">
			<div id="userSettingsPadding"></div>
			<div id="userSettings">
				<script>
					document.getElementById("user").addEventListener("mouseover", function() 
					{
						if(document.getElementById('userSettings').style.display=="inline-block")
							apriUserSettings();	
						if(document.getElementById('userSettingsPadding').style.display=="inline-block")
							apriUserSettings();	
					});
				
					document.getElementById("userSettings").addEventListener("mouseover", function()
					{
						apriUserSettings();							
					});
					document.getElementById("userSettings").addEventListener("mouseout", function()
					{
						chiudiUserSettings();							
					});
					document.getElementById("userSettingsPadding").addEventListener("mouseover", function()
					{
						apriUserSettings();							
					});
					setInterval(function()
					{
						if(document.getElementById('btnUserSettings').offsetWidth!="24")
						{
							chiudiUserSettings();
							chiudiNotifiche();	
						}
					}, 100);
				</script>
				<div id="userSettingsRow1">
					<div id="titoloUserSettings">Impostazioni</div>
					<input type="button" value="" id="btnChiudiUserSettings" onclick="chiudiUserSettings()">
				</div>
				<div id="userSettingsRow2">
					<?php getNomeCognome($conn,$_SESSION['Username']); ?>
				</div>
				<div id="userSettingsRow2">
					<a id="userSettingsCambiaPassword" href="cambiaPassword.html">Cambia password</a>
				</div>
				<div id="permessiUserSettings">
					<div id="userSettingsRow3">
						Hai accesso alle pagine:
					</div>
					<?php getPermessi($conn,$_SESSION['Username'],$appName); ?>
				</div>
			</div>
			<input type="button" value="Logout" id="btnLogout" onclick="logoutB()">
		</div>
	</div>

	<div class="main-nav-bar">
		<div class="main-nav-bar-close-button-container main-nav-bar-hidden-elements">
			<button class="main-nav-bar-close-button" title="Chiudi" onclick="mainNavBarClose()"><i class="fal fa-list fa-2x"></i></button>
			<div class="main-nav-bar-close-button-text">MENU</div>
			<img class="main-nav-bar-close-button-logo" src="images/logo-white.png"/>
		</div>
		<div class="main-nav-bar-user-info-container main-nav-bar-hidden-elements">
			<div class="main-nav-bar-user-info-menu">
				<div class="main-nav-bar-user-info-user-image"></div>
				<div class="main-nav-bar-user-info-username"><?php echo $_SESSION['Username']; ?></div>
				<div class="main-nav-bar-user-info-arrow"><i class="fas fa-sort-down" onclick="$('.main-nav-bar-user-info-hidden-menu').toggle()"></i></div>
			</div>
		</div>
		<div class="main-nav-bar-user-info-hidden-menu main-nav-bar-hidden-elements">
			<div class="main-nav-bar-user-info-hidden-menu-row"><a href="#" onclick="logoutB()">Logout</a></div>
			<div class="main-nav-bar-user-info-hidden-menu-row"><a href="cambiapassword.html">Cambia password</a></div>
		</div>
		<div id="main-nav-bar-sections-outer-container" class="main-nav-bar-hidden-elements"></div>
	</div>
		
	<?php 
		$id_utente=getIdUtente($conn,$_SESSION['Username']);
		if(!checkPermessi($conn,$id_utente,$pageName))
		{
			echo "<div style='width:100%;height:200px;line-height:200px;text-align:center;font-weight:bold;color:red;font-family:".htmlspecialchars(json_encode('Montserrat')).",sans-serif'>Accesso alla pagina non consentito</div>";
			echo '<div id="footer">
					<b>Marine&nbspInteriors&nbspS.p.A.</b>&nbsp&nbsp|&nbsp&nbspVia&nbspSegaluzza&nbsp33170&nbspPordenone&nbsp&nbsp|&nbsp&nbspPhone:&nbsp(+39)&nbsp0434612811&nbsp|&nbspPowered&nbspby&nbsp<a target="_blank" href="http://www.servizioglobale.it">Servizio Globale S.R.L.</a>
				</div>';
			echo '</body>';
			echo '</html>';
			die();
		}
	
		function checkPermessi($conn,$id_utente,$pageName) 
		{
			$q="SELECT permesso FROM permessi_pagine,elenco_pagine WHERE permessi_pagine.pagina=elenco_pagine.id_pagina AND utente=$id_utente AND nomePagina='$pageName'";
			$r=sqlsrv_query($conn,$q);
			if($r==FALSE)
			{
				echo "<br><br>Errore esecuzione query<br>Query: ".$q."<br>Errore: ";
				die(print_r(sqlsrv_errors(),TRUE));
			}
			else
			{
				$rows = sqlsrv_has_rows( $r );
				if ($rows === true)
				{
					while($row=sqlsrv_fetch_array($r))
					{
						if($row['permesso']=='completo')
							return true;
						else
							return false;
					}
				}
				else
					return false;
			}
		}
		function getNomeCognome($conn,$username) 
		{
			$q="SELECT nome,cognome FROM utenti WHERE username='$username'";
			$r=sqlsrv_query($conn,$q);
			if($r==FALSE)
			{
				echo "<br><br>Errore esecuzione query<br>Query: ".$q."<br>Errore: ";
				die(print_r(sqlsrv_errors(),TRUE));
			}
			else
			{
				while($row=sqlsrv_fetch_array($r))
				{
					echo $row['nome']." ".$row['cognome'];
				}
			}
		}
		function getIdUtente($conn,$username) 
		{
			$q="SELECT id_utente FROM utenti WHERE username='$username'";
			$r=sqlsrv_query($conn,$q);
			if($r==FALSE)
			{
				echo "<br><br>Errore esecuzione query<br>Query: ".$q."<br>Errore: ";
				die(print_r(sqlsrv_errors(),TRUE));
			}
			else
			{
				while($row=sqlsrv_fetch_array($r))
				{
					return $row['id_utente'];
				}
			}
		}
		function getPermessi($conn,$username,$appName) 
		{
			$q="SELECT nomePagina FROM permessi_pagine,elenco_pagine WHERE permessi_pagine.pagina=elenco_pagine.id_pagina AND applicazione='$appName' AND permesso='completo' AND utente=".getIdUtente($conn,$username);
			$r=sqlsrv_query($conn,$q);
			if($r==FALSE)
			{
				echo "<br><br>Errore esecuzione query<br>Query: ".$q."<br>Errore: ";
				die(print_r(sqlsrv_errors(),TRUE));
			}
			else
			{
				while($row=sqlsrv_fetch_array($r))
				{
					echo $row['nomePagina']."<br>";
				}
			}
			/*$q="SELECT DISTINCT descrizione,pagina FROM accesso_pagine";
			$r=sqlsrv_query($conn,$q);
			if($r==FALSE)
			{
				echo "<br><br>Errore esecuzione query<br>Query: ".$q."<br>Errore: ";
				die(print_r(sqlsrv_errors(),TRUE));
			}
			else
			{
				while($row=sqlsrv_fetch_array($r))
				{
					$q2="SELECT accesso_pagine.accesso FROM accesso_pagine,utenti WHERE accesso_pagine.utente=utenti.id_utente AND utenti.username='$username' AND accesso_pagine.pagina='".$row['pagina']."'";
					$r2=sqlsrv_query($conn,$q2);
					if($r2==FALSE)
					{
						echo "<br><br>Errore esecuzione query<br>Query: ".$q2."<br>Errore: ";
						die(print_r(sqlsrv_errors(),TRUE));
					}
					else
					{
						$rows = sqlsrv_has_rows( $r2 );  
						if ($rows === true)  
						{						
							while($row2=sqlsrv_fetch_array($r2))
							{
								if($row2['accesso']!='negato')
									echo $row['descrizione']."<br>";
							}
						}
						else
							echo $row['descrizione']."<br>";
					}
				}
			}*/
		}
	?>