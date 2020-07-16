<?php

    include "connessione.php";

    $keyCode=$_REQUEST["keyCode"];

    $query2="SELECT * FROM mappatura_tasti WHERE keyCode=$keyCode";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $funzione_tasto["id_tasto"]=$row2['id_tasto'];
            $funzione_tasto["key"]=$row2['key'];
            $funzione_tasto["keyCode"]=$row2['keyCode'];
            $funzione_tasto["funzione"]=$row2['funzione'];

            echo json_encode($funzione_tasto);
        }
    }
    else
        die("error");

?>