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
        $consent  = Consent::first();
        $response = Http::withHeaders(['token' => env('API_KEY')])
            ->post('http://172.20.1.12/dbstaff/api/patient/consent', [
                'hn'   => $consent->hn,
                'lang' => 'th',
            ])
            ->json();

        $consentData = [
            'hn'         => $consent->hn,
            'patient'    => [
                'nameTH'             => $response['patient']['nameTH'],
                'surnameTH'          => $response['patient']['surnameTH'],
                'nameEN'             => $response['patient']['nameEN'],
                'surnameEN'          => $response['patient']['surnameEN'],
                'birthDate'          => $response['patient']['DOB'],
                'age'                => $response['patient']['age'],
                'address'            => $response['patient']['address'],
                'mobile'             => $response['patient']['mobile'],
                'email'              => $response['patient']['email'],
                'religion'           => $response['patient']['religion'],
                'race'               => $response['patient']['race'],
                'national'           => $response['patient']['national'],
                'martial'            => $response['patient']['martial'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => $response['patient']['allergy_name'],
                'allergy_symptom'    => $response['patient']['allergy_symptom'],
                'represent'          => $response['patient']['represent'],
                'represent_name'     => $response['patient']['represent_name'],
                'represent_relation' => $response['patient']['represent_relation'],
                'represent_phone'    => $response['patient']['represent_phone'],
            ],
            'created_at' => $consent->created_at,
            'status'     => $consent->status,
        ];

        return Inertia::render('TelemedicineConsent', [
            'consent' => $consentData,
        ]);

    }

    public function login(Request $request)
    {
        $userid   = $request->userid;
        $password = $request->password;
        if (env('APP_ENV') == 'dev' || env('APP_PASSWORD') == $password) {
            $response = Http::withHeaders(['token' => env('API_KEY')])
                ->post('http://172.20.1.12/dbstaff/api/getuser', [
                    'userid' => $userid,
                ])
                ->json();
            if ($response['status'] == 1) {
                $userData = User::firstOrCreate(['user_id' => $userid, 'name' => $response['user']['name']]);
                Auth::login($userData);

                return redirect()->route('admin.index');
            }

            return inertia('login', [
                'errors' => [
                    'login' => 'Developer only : user_id not exist',
                ],
            ]);
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

            return redirect()->route('admin.index');
        }

        return inertia('login', [
            'errors' => [
                'login' => 'รหัสพนักงาน หรือ รหัสผ่านผิดพลาด',
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

    public function index_search(Request $request)
    {
        $request->validate([
            'hn' => ['required', 'string', 'max:255'],
        ]);

        $hn = $request->input('hn');

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
            $patient = Patient::where('hn', $hn)->first();
            if ($patient == null) {
                $patient        = new Patient();
                $patient->hn    = $hn;
                $patient->token = Crypt::encryptString($hn);
            }
            $patient->expires_at = now()->addMinutes(60);
            $patient->save();

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

        // Get consents for the HN
        $consents = Consent::where('hn', $hn)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/index', [
            'patient'  => $patientData,
            'result1'  => $generatedResult1,
            'result2'  => $generatedResult2,
            'result3'  => $generatedResult3,
            'consents' => $consents,
        ]);
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
        $new->informer_name  = auth()->user()->user_id;
        $new->witness_name   = auth()->user()->user_id;
        $new->save();

        return redirect()->route('success');
    }

    public function viewConsent(Request $request)
    {
        $startDate = $request->start_date ?? now()->startOfDay()->format('Y-m-d');
        $endDate   = $request->end_date ?? now()->endOfDay()->format('Y-m-d');

        $consents = Consent::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia::render('admin/view', compact('consents'));
    }

    public function viewTelemedicineConsent($id)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $consent = Consent::findOrFail($id);

        // Fetch patient data from API
        $response = Http::withHeaders(['token' => env('API_KEY')])
            ->post('http://172.20.1.12/dbstaff/api/patient/consent', [
                'hn'   => $consent->hn,
                'lang' => 'th',
            ])
            ->json();

        if ($response['status'] == 0) {
            return back()->with('error', 'ไม่พบข้อมูลผู้ป่วย');
        }

        $consentData = [
            'hn'         => $consent->hn,
            'patient'    => [
                'nameTH'             => $response['patient']['nameTH'],
                'surnameTH'          => $response['patient']['surnameTH'],
                'nameEN'             => $response['patient']['nameEN'],
                'surnameEN'          => $response['patient']['surnameEN'],
                'birthDate'          => $response['patient']['DOB'],
                'age'                => $response['patient']['age'],
                'gender'             => $response['patient']['gender'] ?? 'N/A',
                'address'            => $response['patient']['address'],
                'mobile'             => $response['patient']['mobile'],
                'email'              => $response['patient']['email'],
                'religion'           => $response['patient']['religion'],
                'race'               => $response['patient']['race'],
                'national'           => $response['patient']['national'],
                'martial'            => $response['patient']['martial'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => $response['patient']['allergy_name'],
                'allergy_symptom'    => $response['patient']['allergy_symptom'],
                'represent'          => $response['patient']['represent'],
                'represent_name'     => $response['patient']['represent_name'],
                'represent_relation' => $response['patient']['represent_relation'],
                'represent_phone'    => $response['patient']['represent_phone'],
            ],
            'created_at' => $consent->created_at,
            'status'     => $consent->status,
        ];

        return Inertia::render('admin/telemedicine_consent_view', [
            'consent' => $consentData,
        ]);
    }
}
