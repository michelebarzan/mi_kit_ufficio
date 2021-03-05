<?php

    include "connessione.php";

    $lotto=$_REQUEST['lotto'];
    $commessa=$_REQUEST['commessa'];

    $composizione_lotto=[];

    $carrelli=[];

    $q5="SELECT DISTINCT CODCAR
        FROM dbo.carrelli_cabine INNER JOIN dbo.dati_gea ON dbo.carrelli_cabine.numero_cabina = dbo.dati_gea.numero_cabina AND { fn CONCAT('00', dbo.carrelli_cabine.commessa) } = dbo.dati_gea.commessa AND  dbo.carrelli_cabine.disegno_cabina = dbo.dati_gea.disegno_cabina
        WHERE (dbo.dati_gea.lotto = '$lotto') AND (dbo.dati_gea.commessa = '$commessa')";
    $r5=sqlsrv_query($conn,$q5);
    if($r5==FALSE)
    {
        die("error1: ".$q5);
    }
    else
    {
        while($row5=sqlsrv_fetch_array($r5))
        {
            array_push($carrelli,$row5["CODCAR"]);
        }
    }

    $carrelli_in="'".implode("','",$carrelli)."'";
                
    $query2="SELECT DISTINCT TOP (100) PERCENT codice_carrello, codice_componente, descrizione, posizione, codice_cabina, qnt, dbo.carrelli_cabine.numero_cabina
            FROM (SELECT DISTINCT TOP (100) PERCENT codice_carrello, codice_materia_prima AS codice_componente, descrizione, posizione, codice_cabina, qnt
                                    FROM (SELECT mi_db_tecnico.dbo.carrelli.codice_carrello, mi_db_tecnico.dbo.materie_prime.codice_materia_prima, mi_db_tecnico.dbo.materie_prime.descrizione, NULL AS posizione, 
                                                                                        mi_db_tecnico.dbo.cabine.codice_cabina, mi_db_tecnico.dbo.materie_prime_cabine.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine_carrelli ON mi_db_tecnico.dbo.carrelli.id_carrello = mi_db_tecnico.dbo.cabine_carrelli.id_carrello INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine ON mi_db_tecnico.dbo.cabine_carrelli.id_cabina = mi_db_tecnico.dbo.cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime_cabine ON mi_db_tecnico.dbo.cabine.id_cabina = mi_db_tecnico.dbo.materie_prime_cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.materie_prime_cabine.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima
                                                                UNION ALL
                                                                SELECT carrelli_2.codice_carrello, mi_db_tecnico.dbo.pannelli.codice_pannello, mi_db_tecnico.dbo.pannelli.descrizione, NULL AS posizione, cabine_2.codice_cabina, 
                                                                                        mi_db_tecnico.dbo.pannelli_cabine.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_2 INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine_carrelli AS cabine_carrelli_2 ON carrelli_2.id_carrello = cabine_carrelli_2.id_carrello INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine AS cabine_2 ON cabine_carrelli_2.id_cabina = cabine_2.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.pannelli_cabine ON cabine_2.id_cabina = mi_db_tecnico.dbo.pannelli_cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.pannelli ON mi_db_tecnico.dbo.pannelli_cabine.id_pannello = mi_db_tecnico.dbo.pannelli.id_pannello
                                                                UNION ALL
                                                                SELECT carrelli_1.codice_carrello, mi_db_tecnico.dbo.kit.codice_kit, mi_db_tecnico.dbo.kit.descrizione, mi_db_tecnico.dbo.kit_cabine.pos, cabine_1.codice_cabina, mi_db_tecnico.dbo.kit_cabine.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_1 INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine_carrelli AS cabine_carrelli_1 ON carrelli_1.id_carrello = cabine_carrelli_1.id_carrello INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine AS cabine_1 ON cabine_carrelli_1.id_cabina = cabine_1.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit_cabine ON cabine_1.id_cabina = mi_db_tecnico.dbo.kit_cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit ON mi_db_tecnico.dbo.kit_cabine.id_kit = mi_db_tecnico.dbo.kit.id_kit
                                                                UNION ALL
                                                                SELECT carrelli_3.codice_carrello, kit_1.codice_kit, kit_1.descrizione, mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.pos, mi_db_tecnico.dbo.sottoinsiemi_corridoi.codice_sottoinsieme_corridoio, 
                                                                                        mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_3 INNER JOIN
                                                                                        mi_db_tecnico.dbo.sottoinsiemi_corridoi ON carrelli_3.sottoinsieme_corridoio = mi_db_tecnico.dbo.sottoinsiemi_corridoi.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi ON mi_db_tecnico.dbo.sottoinsiemi_corridoi.id_sottoinsieme_corridoio = mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit AS kit_1 ON mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_kit = kit_1.id_kit
                                                                UNION ALL
                                                                SELECT carrelli_4.codice_carrello, materie_prime_1.codice_materia_prima, materie_prime_1.descrizione, NULL AS posizione, sottoinsiemi_corridoi_1.codice_sottoinsieme_corridoio, 
                                                                                        mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_4 INNER JOIN
                                                                                        mi_db_tecnico.dbo.sottoinsiemi_corridoi AS sottoinsiemi_corridoi_1 ON carrelli_4.sottoinsieme_corridoio = sottoinsiemi_corridoi_1.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi ON 
                                                                                        sottoinsiemi_corridoi_1.id_sottoinsieme_corridoio = mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime AS materie_prime_1 ON mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi.id_materia_prima = materie_prime_1.id_materia_prima) AS t
                                    WHERE (codice_carrello IN ($carrelli_in))) AS derivedtbl_1 INNER JOIN
                         dbo.carrelli_cabine ON derivedtbl_1.codice_carrello = dbo.carrelli_cabine.CODCAR COLLATE Latin1_General_CI_AS
            WHERE (codice_componente NOT IN
                                        (SELECT kit COLLATE Latin1_General_CI_AS AS Expr1
                                        FROM dbo.dati_gea
                                        WHERE (lotto = '$lotto') AND (commessa = '$commessa')))
            ORDER BY codice_componente";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $componente["codice_carrello"]=$row2['codice_carrello'];
            $componente["numero_cabina"]=$row2['numero_cabina'];
            $componente["codice_cabina"]=$row2['codice_cabina'];
            $componente["codice_componente"]=$row2['codice_componente'];
            $componente["descrizione"]=utf8_encode($row2['descrizione']);
            $componente["posizione"]=$row2['posizione'];
            $componente["qnt"]=$row2['qnt'];
            $componente["origine"]='db_tecnico';

            array_push($composizione_lotto,$componente);
        }
    }
    else
        die("error");

    $query3="SELECT DISTINCT TOP (100) PERCENT codice_carrello, codice_componente, descrizione, posizione, codice_cabina, qnt, dbo.carrelli_cabine.numero_cabina
            FROM (SELECT DISTINCT TOP (100) PERCENT codice_carrello, codice_materia_prima AS codice_componente, descrizione, posizione, codice_cabina, qnt
                                    FROM (SELECT mi_db_tecnico.dbo.carrelli.codice_carrello, mi_db_tecnico.dbo.materie_prime.codice_materia_prima, mi_db_tecnico.dbo.materie_prime.descrizione, NULL AS posizione, 
                                                                                        mi_db_tecnico.dbo.cabine.codice_cabina, mi_db_tecnico.dbo.materie_prime_cabine.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine_carrelli ON mi_db_tecnico.dbo.carrelli.id_carrello = mi_db_tecnico.dbo.cabine_carrelli.id_carrello INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine ON mi_db_tecnico.dbo.cabine_carrelli.id_cabina = mi_db_tecnico.dbo.cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime_cabine ON mi_db_tecnico.dbo.cabine.id_cabina = mi_db_tecnico.dbo.materie_prime_cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.materie_prime_cabine.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima
                                                                UNION ALL
                                                                SELECT carrelli_2.codice_carrello, mi_db_tecnico.dbo.pannelli.codice_pannello, mi_db_tecnico.dbo.pannelli.descrizione, NULL AS posizione, cabine_2.codice_cabina, 
                                                                                        mi_db_tecnico.dbo.pannelli_cabine.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_2 INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine_carrelli AS cabine_carrelli_2 ON carrelli_2.id_carrello = cabine_carrelli_2.id_carrello INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine AS cabine_2 ON cabine_carrelli_2.id_cabina = cabine_2.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.pannelli_cabine ON cabine_2.id_cabina = mi_db_tecnico.dbo.pannelli_cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.pannelli ON mi_db_tecnico.dbo.pannelli_cabine.id_pannello = mi_db_tecnico.dbo.pannelli.id_pannello
                                                                UNION ALL
                                                                SELECT carrelli_1.codice_carrello, mi_db_tecnico.dbo.kit.codice_kit, mi_db_tecnico.dbo.kit.descrizione, mi_db_tecnico.dbo.kit_cabine.pos, cabine_1.codice_cabina, mi_db_tecnico.dbo.kit_cabine.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_1 INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine_carrelli AS cabine_carrelli_1 ON carrelli_1.id_carrello = cabine_carrelli_1.id_carrello INNER JOIN
                                                                                        mi_db_tecnico.dbo.cabine AS cabine_1 ON cabine_carrelli_1.id_cabina = cabine_1.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit_cabine ON cabine_1.id_cabina = mi_db_tecnico.dbo.kit_cabine.id_cabina INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit ON mi_db_tecnico.dbo.kit_cabine.id_kit = mi_db_tecnico.dbo.kit.id_kit
                                                                UNION ALL
                                                                SELECT carrelli_3.codice_carrello, kit_1.codice_kit, kit_1.descrizione, mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.pos, mi_db_tecnico.dbo.sottoinsiemi_corridoi.codice_sottoinsieme_corridoio, 
                                                                                        mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_3 INNER JOIN
                                                                                        mi_db_tecnico.dbo.sottoinsiemi_corridoi ON carrelli_3.sottoinsieme_corridoio = mi_db_tecnico.dbo.sottoinsiemi_corridoi.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi ON mi_db_tecnico.dbo.sottoinsiemi_corridoi.id_sottoinsieme_corridoio = mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.kit AS kit_1 ON mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_kit = kit_1.id_kit
                                                                UNION ALL
                                                                SELECT carrelli_4.codice_carrello, materie_prime_1.codice_materia_prima, materie_prime_1.descrizione, NULL AS posizione, sottoinsiemi_corridoi_1.codice_sottoinsieme_corridoio, 
                                                                                        mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi.qnt
                                                                FROM mi_db_tecnico.dbo.carrelli AS carrelli_4 INNER JOIN
                                                                                        mi_db_tecnico.dbo.sottoinsiemi_corridoi AS sottoinsiemi_corridoi_1 ON carrelli_4.sottoinsieme_corridoio = sottoinsiemi_corridoi_1.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi ON 
                                                                                        sottoinsiemi_corridoi_1.id_sottoinsieme_corridoio = mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi.id_sottoinsieme_corridoio INNER JOIN
                                                                                        mi_db_tecnico.dbo.materie_prime AS materie_prime_1 ON mi_db_tecnico.dbo.materie_prime_sottoinsiemi_corridoi.id_materia_prima = materie_prime_1.id_materia_prima) AS t
                                    WHERE (codice_carrello IN ($carrelli_in))) AS derivedtbl_1 INNER JOIN
                         dbo.carrelli_cabine ON derivedtbl_1.codice_carrello = dbo.carrelli_cabine.CODCAR COLLATE Latin1_General_CI_AS
            WHERE (codice_componente IN
                                        (SELECT kit COLLATE Latin1_General_CI_AS AS Expr1
                                        FROM dbo.dati_gea
                                        WHERE (lotto = '$lotto') AND (commessa = '$commessa')))
            ORDER BY codice_componente";
    $result3=sqlsrv_query($conn,$query3);
    if($result3==TRUE)
    {
        while($row3=sqlsrv_fetch_array($result3))
        {
            $componente["codice_carrello"]=$row3['codice_carrello'];
            $componente["numero_cabina"]=$row2['numero_cabina'];
            $componente["codice_cabina"]=$row3['codice_cabina'];
            $componente["codice_componente"]=$row3['codice_componente'];
            $componente["descrizione"]=utf8_encode($row3['descrizione']);
            $componente["posizione"]=$row3['posizione'];
            $componente["qnt"]=$row3['qnt'];
            $componente["origine"]='gea';

            array_push($composizione_lotto,$componente);
        }
    }
    else
        die("error");

    echo json_encode($composizione_lotto);

?>