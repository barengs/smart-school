<?php
$credentials = ['email' => 'developer@smartschool.sch.id', 'password' => 'K@mbing1'];
echo \Illuminate\Support\Facades\Auth::guard('api')->attempt($credentials) ? 'OK' : 'FAIL';
