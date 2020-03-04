<?php

    include "connessione.php";

    $linee=[];

    $query2="SELECT [id_linea],[nome],[numero],[label] FROM [mi_linea_kit].[dbo].[anagrafica_linee]";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $linea["id_linea"]=$row2['id_linea'];
            $linea["nome"]=$row2['nome'];
            $linea["numero"]=$row2['numero'];
            $linea["label"]=$row2['label'];

            array_push($linee,$linea);
        }
    }
    else
        die("error");

    echo json_encode($linee);

?>