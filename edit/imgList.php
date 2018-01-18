<?php
// 设置允许跨域访问
header('Access-Control-Allow-Origin:*');
// 设置utf8编码
header("Content-type: text/html; charset=utf-8");
// 设置默认时区
date_default_timezone_set("Asia/Shanghai");

class Lists
{
    public $name;
    public $size;
    public $time;
}

function Fsize($val)
{
    if ($val > (1024 * 1024 * 1024)) {
        return round($val / 1024 / 1024 / 1024, 2) . ' GB';
    } else if ($val > (1024 * 1024)) {
        return round($val / 1024 / 1024, 2) . ' MB';
    } else if ($val > 1024) {
        return round($val / 1024, 2) . ' KB';
    } else {
        return round($val, 2) . ' B';
    }
}

// 设置扫描目录
$dir = "../imgs/";
// 以升序排序 - 默认
$a = scandir($dir);
$len = count($a);
$list = array();
$temp;
for ($x = 2; $x <= $len - 1; $x++) {
    if ($a[$x] === 'list.php' || $a[$x] === 'create.php' || is_dir($dir . $a[$x])) {
        continue;
    }
    echo is_dir($a[$x]);
    $temp = new Lists();
    $temp->name = $a[$x];
    $temp->size = Fsize(filesize($dir . $a[$x]));
    $temp->path = 'http://wwqp.zhuxiaoyi.com/imgs/' . $a[$x];
    $temp->time = date("Y-m-d H:i:s", filemtime($dir . $a[$x]));
    array_push($list, $temp);
}

echo json_encode($list);
