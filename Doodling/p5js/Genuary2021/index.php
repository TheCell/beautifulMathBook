<?php
$directory = array_filter(glob('*'), 'is_dir');
foreach($directory as $folder)
{
    echo '<a href="' . $folder . '">' . $folder . ' <br />';
}
?>