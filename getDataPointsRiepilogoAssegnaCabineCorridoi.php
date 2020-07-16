<?php

    set_time_limit(240);

    include "connessione.php";

    $lotto=$_REQUEST['lotto'];
    $commessa=$_REQUEST['commessa'];
    $colonna=$_REQUEST['colonna'];

    $turni=[];

    $query2="SELECT * FROM anagrafica_turni";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $turno["type"]="bar";
            $turno["showInLegend"]=true;
            $turno["name"]=$row2["label"];

            $dataPoints=[];

            if($colonna=="cabina_corridoio")
            {
                $query3="SELECT dbo.anagrafica_linee.label, COUNT(dbo.linee_cabine_corridoi.cabina_corridoio) AS y
                        FROM dbo.anagrafica_linee INNER JOIN dbo.linee_cabine_corridoi ON dbo.anagrafica_linee.id_linea = dbo.linee_cabine_corridoi.linea
                        WHERE (dbo.linee_cabine_corridoi.lotto = '$lotto') AND (dbo.linee_cabine_corridoi.commessa = '$commessa') AND (dbo.linee_cabine_corridoi.turno = ".$row2['id_turno'].")
                        GROUP BY dbo.anagrafica_linee.label OPTION ( QUERYTRACEON 9481 )";
            }
            if($colonna=="kit")
            {
                $query3="SELECT dbo.anagrafica_linee.label, COUNT(derivedtbl_1.kit) AS y
                        FROM dbo.anagrafica_linee INNER JOIN
                                                dbo.linee_cabine_corridoi ON dbo.anagrafica_linee.id_linea = dbo.linee_cabine_corridoi.linea INNER JOIN
                                                    (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                    FROM dbo.view_cabine
                                                    UNION ALL
                                                    SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                    FROM dbo.view_corridoi) AS derivedtbl_1 ON dbo.linee_cabine_corridoi.lotto = derivedtbl_1.lotto AND dbo.linee_cabine_corridoi.commessa = derivedtbl_1.commessa AND 
                                                dbo.linee_cabine_corridoi.cabina_corridoio = derivedtbl_1.numero_cabina
                        WHERE (dbo.linee_cabine_corridoi.lotto = '$lotto') AND (dbo.linee_cabine_corridoi.commessa = '$commessa') AND (dbo.linee_cabine_corridoi.turno = ".$row2['id_turno'].")
                        GROUP BY dbo.anagrafica_linee.label OPTION ( QUERYTRACEON 9481 )";
            }
            if($colonna=="pannelli")
            {
                $query3="SELECT dbo.anagrafica_linee.label, COUNT(db_tecnico.dbo.kitpan.CODELE) AS y
                        FROM db_tecnico.dbo.kitpan INNER JOIN
                                                dbo.anagrafica_linee INNER JOIN
                                                dbo.linee_cabine_corridoi ON dbo.anagrafica_linee.id_linea = dbo.linee_cabine_corridoi.linea INNER JOIN
                                                    (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                    FROM dbo.view_cabine
                                                    UNION ALL
                                                    SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                    FROM dbo.view_corridoi) AS derivedtbl_1 ON dbo.linee_cabine_corridoi.lotto = derivedtbl_1.lotto AND dbo.linee_cabine_corridoi.commessa = derivedtbl_1.commessa AND 
                                                dbo.linee_cabine_corridoi.cabina_corridoio = derivedtbl_1.numero_cabina ON db_tecnico.dbo.kitpan.CODKIT = derivedtbl_1.kit COLLATE Latin1_General_CI_AS
                        WHERE (dbo.linee_cabine_corridoi.lotto = '$lotto') AND (dbo.linee_cabine_corridoi.commessa = '$commessa') AND (dbo.linee_cabine_corridoi.turno = ".$row2['id_turno'].")
                        GROUP BY dbo.anagrafica_linee.label OPTION ( QUERYTRACEON 9481 )";
            }
            
            $result3=sqlsrv_query($conn,$query3);
            if($result3==TRUE)
            {
                while($row3=sqlsrv_fetch_array($result3))
                {
                    $dataPoint["y"]=$row3["y"];
                    $dataPoint["label"]=$row3["label"];

                    array_push($dataPoints,$dataPoint);
                }
            }
            else
                die("error");

            $turno["dataPoints"]=$dataPoints;

            array_push($turni,$turno);
        }
    }
    else
        die("error");

    echo json_encode($turni);

?>