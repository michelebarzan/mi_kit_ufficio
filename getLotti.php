<?php

    include "connessione.php";

    $order_by=$_REQUEST["order_by"];
    $order_type=$_REQUEST["order_type"];

    $lotti=[];

    $query2="SELECT * FROM dbo.lotti ORDER BY $order_by $order_type";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $lotto["id_lotto"]=$row2['id_lotto'];
            $lotto["lotto"]=$row2['lotto'];
            $lotto["commessa"]=$row2['commessa'];
            $lotto["producibile"]=$row2['producibile'];

            array_push($lotti,$lotto);
        }
    }
    else
        die("error");

    echo json_encode($lotti);

?>