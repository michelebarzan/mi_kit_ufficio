<?php

    include "Session.php";
    include "connessione.php";

    $q1="SELECT * FROM importazioni_db_tecnico WHERE stato='avviata'";
    $r1=sqlsrv_query($conn,$q1);
    if($r1==FALSE)
    {
        die("error1: ".$q1);
    }
    else
    {
        $rows = sqlsrv_has_rows( $r1 );
        if ($rows === true)
            echo "ko";
        else 
        {
            
            /*$q2="INSERT INTO importazioni_db_tecnico (stato,data_importazione) SELECT 'avviata', GETDATE()";
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error1: ".$q2);
            }
            else
                die("ok");*/
        }
    }
   
?>