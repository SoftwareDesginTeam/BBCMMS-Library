<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];



    //Data base values
    $serverName = "localhost";
    $userName = "root";
    $psswrd = "";
    $dbName = "SQLdata_base";

    //create database connection

    $con = mysql_connect($serverName, $userName, $psswrd, $dbName);

    if(mysql_connect_errno()){
        echo "Failed to Connect!";
        exit()
    }
    echo "Connection Success!";
?>