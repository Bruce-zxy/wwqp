<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

include "./db.php";

$myDB = new DB("db_page");

$arr = (object) array();
$arr->name = $_REQUEST["name"];
$arr->publish_uri = "http://" . $_SERVER['HTTP_HOST'] . "/wwqp/" . md5($_REQUEST["date"]) . ".html";
$arr->create_time = $_REQUEST["date"];
$arr->img_src = "http://" . $_SERVER['HTTP_HOST'] . "/wwqp/imgs/" . $_REQUEST["img_name"];

$result = $myDB->add($arr);

echo json_encode($result);
