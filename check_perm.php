<?php
$u = \App\Models\User::where('email', 'developer@smartschool.sch.id')->first();
echo $u->can('manage-system') ? 'YES' : 'NO';
