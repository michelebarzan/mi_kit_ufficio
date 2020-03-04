<?php

    set_time_limit(240);

    require("getCabineCorridoiFunctions.php");

    include "connessione.php";

    $lotto=$_REQUEST['lotto'];
    $commessa=$_REQUEST['commessa'];
    $mostraCarrelli=$_REQUEST['mostraCarrelli'];

    $cabine_corridoi=[];

    $query2="SELECT DISTINCT commessa, lotto, disegno_cabina, numero_cabina
            FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                FROM dbo.view_cabine
                UNION ALL
                SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                FROM dbo.view_corridoi) AS derivedtbl_1
            WHERE (lotto = '$lotto') AND (commessa = '$commessa') AND (numero_cabina NOT IN
                (SELECT cabina_corridoio
                FROM dbo.linee_cabine_corridoi
                WHERE (lotto = '$lotto') AND (commessa = '$commessa')))";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $cabina_corridoio["disegno_cabina"]=$row2['disegno_cabina'];
            $cabina_corridoio["numero_cabina"]=$row2['numero_cabina'];

            $elettrificazione=getElettrificazioneKit($row2['disegno_cabina'],$conn,$commessa,$lotto);
            $cabina_corridoio["n_kit"]=$elettrificazione["elettrificati"]+$elettrificazione["non_elettrificati"];
            $cabina_corridoio["n_kit_elettrificati"]=$elettrificazione["elettrificati"];
            $cabina_corridoio["n_kit_non_elettrificati"]=$elettrificazione["non_elettrificati"];

            if($mostraCarrelli=="true")
                $cabina_corridoio["carrello"]=getCarrello($conn,$commessa,$row2['numero_cabina']);

            $cabina_corridoio["n_pannelli"]=getNPannelli($row2['disegno_cabina'],$conn,$commessa,$lotto);

            array_push($cabine_corridoi,$cabina_corridoio);
        }
    }
    else
        die("error");

    echo json_encode($cabine_corridoi);

?>