<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

include "./db.php";

$myDB = new DB("db_page");

$arr = (object) array();
$arr->name = $_REQUEST["name"];
$arr->publish_uri = "http://wwqp.zhuxiaoyi.com/" . md5($_REQUEST["create_time"]) . ".html";
$arr->create_time = $_REQUEST["create_time"];
$arr->img_src = "http://wwqp.zhuxiaoyi.com/imgs/" . $_REQUEST["img_name"];

$result = $myDB->add($arr);

echo json_encode($result);
