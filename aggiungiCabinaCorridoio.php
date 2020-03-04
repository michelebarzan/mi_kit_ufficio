<?php

    include "connessione.php";

    $id_linea=$_REQUEST['id_linea'];
    $commessa=$_REQUEST['commessa'];
    $lotto=$_REQUEST['lotto'];
    $numero_cabina=$_REQUEST['numero_cabina'];

    $query2="INSERT INTO [dbo].[linee_cabine_corridoi] ([linea],[commessa],[lotto],[cabina_corridoio])
             VALUES ($id_linea,'$commessa','$lotto','$numero_cabina')";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        echo "ok";
    }
    else
        die("error".$query2);

?>