<?php

    include "connessione.php";

    $lotto=$_REQUEST['lotto'];
    $commessa=$_REQUEST['commessa'];

    $materiali_aggiuntivi_carrello=[];

    $query2="SELECT DISTINCT TOP (100) PERCENT derivedtbl_1.disegno_cabina AS corridoio, db_tecnico.dbo.dibcor.CODKIT AS completamento, db_tecnico.dbo.dibcor.QNT AS qnt, db_tecnico.dbo.dibcor.POS AS posizione
            FROM (SELECT disegno_cabina
                FROM dbo.view_corridoi
                WHERE (lotto = '$lotto') AND (commessa = '$commessa')) AS derivedtbl_1 INNER JOIN
                db_tecnico.dbo.dibcor ON derivedtbl_1.disegno_cabina = db_tecnico.dbo.dibcor.CODCOR COLLATE SQL_Latin1_General_CP1_CI_AS LEFT OUTER JOIN
                    (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                    FROM dbo.view_corridoi AS view_corridoi_1
                    WHERE (lotto = '$lotto') AND (commessa = '$commessa')) AS derivedtbl_2 ON db_tecnico.dbo.dibcor.CODCOR COLLATE SQL_Latin1_General_CP1_CI_AS = derivedtbl_2.disegno_cabina AND 
                db_tecnico.dbo.dibcor.CODKIT COLLATE SQL_Latin1_General_CP1_CI_AS = derivedtbl_2.kit
            WHERE (derivedtbl_2.kit IS NULL)
            ORDER BY corridoio";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $materiale_aggiuntivo_carrello["tipo"]="Corridoio";
            $materiale_aggiuntivo_carrello["codice"]=$row2['corridoio'];
            $materiale_aggiuntivo_carrello["n_disegni"]=1;
            $materiale_aggiuntivo_carrello["completamento"]=$row2['completamento'];
            $materiale_aggiuntivo_carrello["qnt"]=$row2['qnt'];
            $materiale_aggiuntivo_carrello["posizione"]=$row2['posizione'];

            array_push($materiali_aggiuntivi_carrello,$materiale_aggiuntivo_carrello);
        }
    }
    else
        die("error");

        $query2="SELECT        TOP (100) PERCENT derivedtbl_2.disegno_cabina AS codice, derivedtbl_2.conteggio AS n_disegni, db_tecnico.dbo.cabkit.CODKIT AS completamento, db_tecnico.dbo.cabkit.QNT AS qnt, 
        db_tecnico.dbo.cabkit.POS AS posizione
FROM            db_tecnico.dbo.cabkit INNER JOIN
            (SELECT        disegno_cabina, COUNT(disegno_cabina) AS conteggio
              FROM            (SELECT DISTINCT disegno_cabina, numero_cabina
                                        FROM            dbo.view_cabine
                                        WHERE        (lotto = '$lotto') AND (commessa = '$commessa')) AS derivedtbl_1
              GROUP BY disegno_cabina) AS derivedtbl_2 ON db_tecnico.dbo.cabkit.CODCAB = derivedtbl_2.disegno_cabina COLLATE Latin1_General_CI_AS LEFT OUTER JOIN
            (SELECT        commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
              FROM            dbo.view_cabine AS view_cabine_1
              WHERE        (lotto = '$lotto') AND (commessa = '$commessa')) AS derivedtbl_1_1 ON db_tecnico.dbo.cabkit.CODCAB = derivedtbl_1_1.disegno_cabina COLLATE Latin1_General_CI_AS AND 
        db_tecnico.dbo.cabkit.CODKIT = derivedtbl_1_1.kit COLLATE Latin1_General_CI_AS
WHERE        (derivedtbl_1_1.disegno_cabina IS NULL)
ORDER BY codice";	
        $result2=sqlsrv_query($conn,$query2);
        if($result2==TRUE)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                $materiale_aggiuntivo_carrello["tipo"]="Cabina";
                $materiale_aggiuntivo_carrello["codice"]=$row2['codice'];
                $materiale_aggiuntivo_carrello["n_disegni"]=$row2['n_disegni'];
                $materiale_aggiuntivo_carrello["completamento"]=$row2['completamento'];
                $materiale_aggiuntivo_carrello["qnt"]=$row2['qnt'];
                $materiale_aggiuntivo_carrello["posizione"]=$row2['posizione'];

                array_push($materiali_aggiuntivi_carrello,$materiale_aggiuntivo_carrello);
            }
        }
        else
            die("error");

    echo json_encode($materiali_aggiuntivi_carrello);

?>