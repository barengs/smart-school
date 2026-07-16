<?php
use Spatie\Permission\Models\Permission;
use App\Models\User;

$p = Permission::firstOrCreate(['name'=>'manage-system', 'guard_name'=>'web']);
$u = User::find(1);
if($u && !$u->hasPermissionTo('manage-system')) {
    $u->givePermissionTo('manage-system');
}
echo "Done";
