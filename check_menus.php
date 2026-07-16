<?php
$request = Request::create('/api/menus', 'GET', ['type' => 'admin']); 
$request->setUserResolver(function() { 
    return \App\Models\User::where('email', 'developer@smartschool.sch.id')->first(); 
}); 
$controller = new \App\Http\Controllers\MenuController(); 
$response = $controller->index($request); 
echo json_encode($response->getData());
