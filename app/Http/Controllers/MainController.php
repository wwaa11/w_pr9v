<?php
namespace App\Http\Controllers;

use App\Models\Consent;
use App\Models\Patient;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class MainController extends Controller
{

    public function temp()
    {
        $patient = Patient::first();

        return inertia::render('patient/temp', compact('patient'));
    }

    public function login(Request $request)
    {
        $userid   = $request->userid;
        $password = $request->password;

        if (env('APP_ENV') == 'dev') {
            $userData = User::where('user_id', $userid)->first();
            Auth::login($userData);

            return redirect()->route('index');
        }

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

        return inertia::render('admin/index', compact('data'));
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

    public function search(Request $request)
    {
        $request->validate([
            'hn' => ['required', 'string', 'max:255'],
        ]);

        $hn = $request->input('hn');

        $patient = Patient::where('hn', $hn)->first();
        if ($patient == null) {
            $patient        = new Patient();
            $patient->hn    = $hn;
            $patient->token = Crypt::encryptString($hn);
        }
        $patient->expires_at = now()->addMinutes(60);
        $patient->save();

        $response = Http::withHeaders(['token' => env('API_KEY')])
            ->post('http://172.20.1.12/dbstaff/api/patient/consent', [
                'hn'   => $hn,
                'lang' => 'th',

            ])
            ->json();

        if ($response['status'] == 0) {
            $patientData = [
                'hn'      => $hn,
                'name'    => $response['message'],
                'address' => 'N/A',
                'phone'   => 'N/A',
            ];
            $generatedResult1 = "Patient with HN {$hn} not found.";
            $generatedResult2 = "";
            $generatedResult3 = "";

        } else {
            $generatedResult1 = env('APP_URL') . '/telemedicine/' . $patient->token;
            $generatedResult2 = env('APP_URL') . '/telemehealth/' . $patient->token;
            $generatedResult3 = env('APP_URL') . '/hiv/' . $patient->token;
            $patientData      = [
                'hn'      => $patient->hn,
                'name'    => $response['patient']['nameTH'] . ' ' . $response['patient']['surnameTH'] ?? 'N/A',
                'address' => $response['patient']['address'] ?? 'N/A',
                'phone'   => $response['patient']['mobile'] ?? 'N/A',
            ];
        }

        return Inertia::render('admin/index', [
            'patient' => $patientData,
            'result1' => $generatedResult1,
            'result2' => $generatedResult2,
            'result3' => $generatedResult3,
        ]);
    }
}
