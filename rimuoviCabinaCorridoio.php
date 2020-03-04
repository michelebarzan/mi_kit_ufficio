<?php

    include "connessione.php";

    $id_linea=$_REQUEST['id_linea'];
    $commessa=$_REQUEST['commessa'];
    $lotto=$_REQUEST['lotto'];
    $numero_cabina=$_REQUEST['numero_cabina'];

    $query2="DELETE FROM linee_cabine_corridoi WHERE linea=$id_linea AND commessa='$commessa' AND lotto='$lotto'  AND cabina_corridoio='$numero_cabina'";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        echo "ok";
    }
    else
        die("error".$query2);

?>