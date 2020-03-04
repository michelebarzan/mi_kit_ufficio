<?php

    set_time_limit(240);

    require("getCabineCorridoiFunctions.php");

    include "connessione.php";

    $id_linee=json_decode($_REQUEST['JSONid_linee']);
    $lotto=$_REQUEST['lotto'];
    $commessa=$_REQUEST['commessa'];
    $mostraCarrelli=$_REQUEST['mostraCarrelli'];

    $cabine_corridoi_linee=[];

    foreach ($id_linee as $id_linea)
    {
        $cabine_corridoi_linea=[];

        $query2="SELECT dbo.linee_cabine_corridoi.id_l_cc, dbo.linee_cabine_corridoi.linea, dbo.linee_cabine_corridoi.cabina_corridoio, dbo.linee_cabine_corridoi.lotto, dbo.linee_cabine_corridoi.commessa, derivedtbl_1.disegno_cabina
            FROM dbo.linee_cabine_corridoi INNER JOIN
                (SELECT DISTINCT disegno_cabina, numero_cabina
                FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                            FROM dbo.view_cabine
                                            UNION ALL
                                            SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                            FROM dbo.view_corridoi) AS derivedtbl_2) AS derivedtbl_1 ON dbo.linee_cabine_corridoi.cabina_corridoio = derivedtbl_1.numero_cabina
            WHERE (dbo.linee_cabine_corridoi.lotto = '$lotto') AND (dbo.linee_cabine_corridoi.commessa = '$commessa') AND (dbo.linee_cabine_corridoi.linea = $id_linea)";
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                $cabina_corridoio_linea["disegno_cabina"]=$row2['disegno_cabina'];
                $cabina_corridoio_linea["numero_cabina"]=$row2['cabina_corridoio'];

                $elettrificazione=getElettrificazioneKit($row2['disegno_cabina'],$conn,$commessa,$lotto);
                $cabina_corridoio_linea["n_kit"]=$elettrificazione["elettrificati"]+$elettrificazione["non_elettrificati"];
                $cabina_corridoio_linea["n_kit_elettrificati"]=$elettrificazione["elettrificati"];
                $cabina_corridoio_linea["n_kit_non_elettrificati"]=$elettrificazione["non_elettrificati"];

                if($mostraCarrelli=="true")
                    $cabina_corridoio_linea["carrello"]=getCarrello($conn,$commessa,$row2['cabina_corridoio']);

                $cabina_corridoio_linea["n_pannelli"]=getNPannelli($row2['disegno_cabina'],$conn,$commessa,$lotto);

                array_push($cabine_corridoi_linea,$cabina_corridoio_linea);
            }
            $cabine_corridoi_linee[$id_linea]=$cabine_corridoi_linea;
        }
        else
            die("error");
    }
    
    echo json_encode($cabine_corridoi_linee);

?>