<?php
header('Access-Control-Allow-Origin:*');
// header("Content-Length: 27");

// 允许上传的图片后缀
$allowedExts = array("gif", "jpeg", "jpg", "JPG", "png", "rar", "zip", "bz2");

$temp = explode(".", $_FILES["fileList"]["name"]);
$extension = end($temp); // 获取文件后缀名
if (((true || $_FILES["fileList"]["type"] == "image/gif")
    || ($_FILES["fileList"]["type"] == "image/jpeg")
    || ($_FILES["fileList"]["type"] == "image/jpg")
    || ($_FILES["fileList"]["type"] == "image/pjpeg")
    || ($_FILES["fileList"]["type"] == "image/x-png")
    || ($_FILES["fileList"]["type"] == "image/png")
    || ($_FILES["fileList"]["type"] == "application/x-rar")
    || ($_FILES["fileList"]["type"] == "application/zip")
    || ($_FILES["fileList"]["type"] == "application/x-bzip")
)) {
    if ($_FILES["fileList"]["error"] > 0) {
        echo json_encode(array('fileList_error' => $_FILES["fileList"]["error"]));
        // echo "错误：: " . $_FILES["fileList"]["error"] . "<br>";
    } else {

        判断当前目录下uploadForME文件夹是否存在
        if (!file_exists("/wwqp/imgs")) {
            mkdir(iconv('utf-8', 'gbk', "uploadForME"));
        }

        // 判断当期目录下的 uploadForME 目录是否存在该文件
        // 如果没有 uploadForME 目录，你需要创建它，uploadForME 目录权限为 777
        if (file_exists("/wwqp/imgs/" . $_FILES["fileList"]["name"])) {
            echo json_encode(array('exist_error' => $_FILES["fileList"]["name"] . " 文件已经存在。 "));
            // echo $_FILES["fileList"]["name"] . " 文件已经存在。 ";
        } else {
            // 如果 uploadForME 目录不存在该文件则将文件上传到 uploadForME 目录下
            move_uploaded_file($_FILES["fileList"]["tmp_name"], "/wwqp/imgs/" . $_FILES["fileList"]["name"]);
            chmod("/wwqp/imgs/" . $_FILES["fileList"]["name"], 0777);
            echo json_encode(array('status' => 'ok'));
        }
    }
} else {
    echo json_encode(array('error' => "Images upload error！"));
}
