<?php

    include "connessione.php";

    $array_funzioni_tasti=[];
    $obj_array_funzioni_tasti=[];

    $query2="SELECT funzione FROM funzioni_tasti";
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
			array_push($array_funzioni_tasti,$row2['funzione']);
        }
        foreach ($array_funzioni_tasti as $funzione)
        {
            $obj_funzione["nome"]=$funzione;

            $query3="SELECT * FROM mappatura_tasti WHERE funzione='$funzione'";
            $result3=sqlsrv_query($conn,$query3);
            if($result3==TRUE)
            {
                $rows = sqlsrv_has_rows( $result3 );
                if ($rows === true)
                {
                    $obj_funzione["assegnato"]=true;
                    $obj_funzione["color"]="#E9A93A";
                    while($row3=sqlsrv_fetch_array($result3))
                    {
                        $obj_funzione["key"]=$row3['key'];
                        $obj_funzione["keyCode"]=$row3['keyCode'];
                    }
                }
                else 
                {
                    $obj_funzione["key"]=null;
                    $obj_funzione["keyCode"]=null;
                    $obj_funzione["assegnato"]=false;
                    $obj_funzione["color"]="#70B085";
                }
            }
            else
                die("error");

            array_push($obj_array_funzioni_tasti,$obj_funzione);
        }
        echo json_encode($obj_array_funzioni_tasti);
    }
    else
        die("error");

?>