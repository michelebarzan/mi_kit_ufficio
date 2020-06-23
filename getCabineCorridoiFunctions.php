<?php

function getCarrello($conn,$commessa,$numero_cabina)
{
    $commessaShort=str_replace("00","",$commessa);
    $query2="SELECT CODCAR, numero_cabina, commessa
            FROM dbo.carrelli_cabine
            WHERE (numero_cabina = '$numero_cabina') AND (commessa = '$commessaShort')";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            return $row2["CODCAR"];
        }
    }
    else
        die("error".$query2);
}
function getElettrificazioneKit($disegno_cabina,$conn,$commessa,$lotto)
{
    /*$query2="SELECT COUNT(db_tecnico.dbo.kit.CODKIT) AS n_kit, CASE WHEN MaxDiFORI = 'Si' THEN 'true' ELSE 'false' END AS elettrificati, db_tecnico.dbo.cabkit.CODCAB AS disegno_cabina, lotti_cabine_corridoi.commessa, 
            lotti_cabine_corridoi.lotto
            FROM db_tecnico.dbo.kit INNER JOIN
            db_tecnico.dbo.cabkit ON db_tecnico.dbo.kit.CODKIT = db_tecnico.dbo.cabkit.CODKIT INNER JOIN
                (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                    FROM dbo.view_cabine
                    WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')
                    UNION ALL
                    SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                    FROM dbo.view_corridoi
                    WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')) AS lotti_cabine_corridoi ON 
            db_tecnico.dbo.cabkit.CODCAB COLLATE SQL_Latin1_General_CP1_CI_AS = lotti_cabine_corridoi.disegno_cabina
            GROUP BY CASE WHEN MaxDiFORI = 'Si' THEN 'true' ELSE 'false' END, db_tecnico.dbo.cabkit.CODCAB, lotti_cabine_corridoi.commessa, lotti_cabine_corridoi.lotto";*/

    $query2="SELECT SUM(n_kit) AS n_kit, elettrificati, disegno_cabina, commessa, lotto
            FROM (SELECT COUNT(kit) * qnt AS n_kit, elettrificati, disegno_cabina, commessa, lotto, qnt
                FROM (SELECT t_1.commessa, t_1.lotto, t_1.numero_cabina, t_1.disegno_cabina, t_1.kit, t_1.posizione, t_1.qnt, CASE WHEN MaxDiFORI = 'Si' THEN 'true' ELSE 'false' END AS elettrificati
                                        FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                                    FROM dbo.view_cabine
                                                                    WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')
                                                                    UNION ALL
                                                                    SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                                    FROM dbo.view_corridoi
                                                                    WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')) AS t_1 INNER JOIN
                                                                    db_tecnico.dbo.kit ON t_1.kit COLLATE Latin1_General_CI_AS = db_tecnico.dbo.kit.CODKIT) AS t_2
                GROUP BY commessa, lotto, numero_cabina, disegno_cabina, qnt, elettrificati) AS t
            GROUP BY elettrificati, disegno_cabina, commessa, lotto";

    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $elettrificazione["elettrificati"]=0;
        $elettrificazione["non_elettrificati"]=0;
        
        while($row2=sqlsrv_fetch_array($result2))
        {
            if($row["elettrificati"]="true")
                $elettrificazione["elettrificati"]=$row2["n_kit"];
            if($row["elettrificati"]="false")
                $elettrificazione["non_elettrificati"]=$row2["n_kit"];
        }
        return $elettrificazione;
    }
    else
        die("error".$query2);
}
function getNPannelli($disegno_cabina,$conn,$commessa,$lotto)
{
    /*$query2="SELECT ISNULL(SUM(n_pannelli), 0) AS n_pannelli
            FROM (SELECT lotti_cabine_corridoi.kit, lotti_cabine_corridoi.commessa, lotti_cabine_corridoi.lotto, COUNT(db_tecnico.dbo.kitpan.CODELE) AS n_pannelli, lotti_cabine_corridoi.disegno_cabina
                FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
            FROM dbo.view_cabine
            WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')
            UNION ALL
            SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
            FROM dbo.view_corridoi
            WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')) AS lotti_cabine_corridoi INNER JOIN
                                        db_tecnico.dbo.kitpan ON lotti_cabine_corridoi.kit COLLATE Latin1_General_CI_AS = db_tecnico.dbo.kitpan.CODKIT
                GROUP BY lotti_cabine_corridoi.kit, lotti_cabine_corridoi.commessa, lotti_cabine_corridoi.lotto, lotti_cabine_corridoi.disegno_cabina) AS derivedtbl_1";*/

    $query2="SELECT SUM(qnt_pannelli) AS n_pannelli
            FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, COUNT(kit) * qnt_kit * qnt_pannelli AS qnt_pannelli
                FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, qnt_kit, COUNT(CODELE) * qnt_pannelli AS qnt_pannelli
                                        FROM (SELECT t_1.commessa, t_1.lotto, t_1.numero_cabina, t_1.disegno_cabina, t_1.kit, t_1.qnt AS qnt_kit, db_tecnico.dbo.kitpan.CODELE, db_tecnico.dbo.kitpan.QNT AS qnt_pannelli
                                                                    FROM (SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                                                            FROM dbo.view_cabine
                                                                                            WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')
                                                                                            UNION ALL
                                                                                            SELECT commessa, lotto, numero_cabina, disegno_cabina, kit, posizione, qnt
                                                                                            FROM dbo.view_corridoi
                                                                                            WHERE (commessa = '$commessa') AND (lotto = '$lotto') AND (disegno_cabina = '$disegno_cabina')) AS t_1 INNER JOIN
                                                                                            db_tecnico.dbo.kit ON t_1.kit COLLATE Latin1_General_CI_AS = db_tecnico.dbo.kit.CODKIT INNER JOIN
                                                                                            db_tecnico.dbo.kitpan ON db_tecnico.dbo.kit.CODKIT = db_tecnico.dbo.kitpan.CODKIT) AS derivedtbl_1
                                        GROUP BY commessa, lotto, numero_cabina, disegno_cabina, kit, qnt_kit, qnt_pannelli) AS t
                GROUP BY commessa, lotto, numero_cabina, disegno_cabina, qnt_kit, qnt_pannelli) AS derivedtbl_2";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            return $row2["n_pannelli"];
        }
    }
    else
        die("error".$query2);
}

?>