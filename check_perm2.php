<?php
$user = \App\Models\User::where('email', 'developer@smartschool.sch.id')->first();
echo $user->can('manage-system') ? 'YES' : 'NO';
