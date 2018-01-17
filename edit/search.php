<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

include "./db.php";

$myDB = new DB("wwqp");
$result = $myDB->select("SELECT * FROM db_page WHERE name LIKE '%" . $_REQUEST["name"] . "%'");

echo json_encode($result);
