<?php
namespace App\Http\Controllers;

use App\Models\Consent;
use App\Models\Patient;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class MainController extends Controller
{
    public function login(Request $request)
    {
        $userid   = $request->userid;
        $password = $request->password;
        $response = Http::withHeaders(['token' => env('API_KEY')])
            ->post('http://172.20.1.12/dbstaff/api/auth', [
                'userid'   => $userid,
                'password' => $password,

            ])
            ->json();
        if ($response['status'] == 1) {
            $userData = User::where('user_id', $userid)->first();
            if (! $userData) {
                $userData          = new User();
                $userData->user_id = $userid;
            }
            $userData->name = $response['user']['name'];
            $userData->save();

            Auth::login($userData);

            return redirect()->route('index');
        }

        return inertia('login', [
            'errors' => [
                'login' => 'รหัสพนักงงาน หรือ รหัสผ่านผิดพลาด',
            ],
        ]);
    }
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return inertia('login');
    }

    public function index()
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $data = [
            'title'       => 'Welcome to Our Application',
            'description' => 'This is the main page of our application where you can find various features and functionalities.',
        ];

        return inertia::render('index', compact('data'));
    }

    public function telemedicine($token)
    {
        $patient = Patient::where('token', $token)->first();
        if (! $patient || $patient->expires_at < now()) {
            return redirect()->route('error');
        }

        return inertia::render('patient/consent_telemedicine', compact('patient'));
    }

    public function telemedicine_store(Request $request)
    {
        $validated = $request->validate([
            'hn'             => 'required|string|exists:patients,hn',
            'type'           => 'required|string',
            'signature_name' => 'required|string',
            'signature'      => 'required|string',
            'consent_1'      => 'required|string',
            'consent_2'      => 'required|string',
            'consent_3'      => 'required|string',
            'consent_4'      => 'required|string',
        ]);

        $new                 = new Consent;
        $new->hn             = $request->hn;
        $new->type           = $request->type;
        $new->signature_name = $request->signature_name;
        $new->signature      = $request->signature;
        $new->consent_1      = ($request->consent_1 === 'yes') ? true : false;
        $new->consent_2      = ($request->consent_2 === 'yes') ? true : false;
        $new->consent_3      = ($request->consent_3 === 'yes') ? true : false;
        $new->consent_4      = ($request->consent_4 === 'yes') ? true : false;
        $new->save();

        return redirect()->route('success');
    }
}
