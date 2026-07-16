<?php
$user = \App\Models\User::where('email', 'developer@smartschool.sch.id')->first();
$role = \Spatie\Permission\Models\Role::where('name', 'Developer')->first();
$user->assignRole($role);
echo "DONE";
