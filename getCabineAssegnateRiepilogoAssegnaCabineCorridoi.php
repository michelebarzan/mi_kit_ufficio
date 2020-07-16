<?php

    set_time_limit(240);

    include "connessione.php";

    $lotto=$_REQUEST['lotto'];
    $commessa=$_REQUEST['commessa'];

    $turni=[];

    $query2="SELECT (SELECT COUNT(DISTINCT cabina_corridoio) AS tot_cabine
            FROM dbo.linee_cabine_corridoi
            WHERE (lotto = '$lotto') AND (commessa = '$commessa')) AS cabine_assegnate,
            (SELECT COUNT(DISTINCT numero_cabina) AS tot_cabine
                FROM (SELECT numero_cabina, commessa, lotto
                                        FROM dbo.view_cabine
                                        UNION
                                        SELECT numero_cabina, commessa, lotto
                                        FROM dbo.view_corridoi) AS derivedtbl_1
                WHERE (lotto = '$lotto') AND (commessa = '$commessa')) AS cabine_totali";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            echo "Hai assegnato <b style='color:#4C91CB'>".$row2['cabine_assegnate']."/".$row2['cabine_totali']."</b> cabine";
        }
    }
    else
        die("error");

?>