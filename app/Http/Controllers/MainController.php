<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MainController extends Controller
{
    public function index()
    {
        $data = [
            'title'       => 'Welcome to Our Application',
            'description' => 'This is the main page of our application where you can find various features and functionalities.',
        ];
        return inertia::render('index', compact('data'));
    }

    public function telemedicine()
    {

        return inertia::render('patient/consent_telemedicine');
    }

    public function telemedicine_store(Request $request)
    {
        dump($request);

        return redirect()->back()->with('message', 'Consent recorded successfully.');
    }
}
