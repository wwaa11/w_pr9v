<?php
namespace App\Http\Controllers;

use App\Models\Hiv;
use App\Models\Patient;
use App\Models\Telehealth;
use App\Models\Telemedicine;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class MainController extends Controller
{
    public function login()
    {
        $users = User::where('role', 'witness')->get();

        return inertia('login', [
            'users' => $users,
        ]);
    }

    public function loginRequest(Request $request)
    {
        $userid   = $request->userid;
        $password = $request->password;
        $witness1 = $request->witness1;
        $witness2 = $request->witness2;

        if ($userid === $witness1 || $userid === $witness2 || $witness1 == null || $witness2 == null) {
            return inertia('login', [
                'users'  => User::where('role', 'witness')->get(),
                'errors' => [
                    'login' => 'ไม่สามารถเลือกตนเองเป็นพยานได้',
                ],
            ]);
        }

        if (env('APP_ENV') == 'dev' || env('APP_PASSWORD') == $password) {
            $response = Http::withHeaders(['token' => env('API_AUTH_KEY')])
                ->post('http://172.20.1.12/dbstaff/api/getuser', [
                    'userid' => $userid,
                ])
                ->json();

            if ($response['status'] == 1) {
                $userData = User::firstOrCreate(['user_id' => $userid, 'name' => $response['user']['name']]);
                Auth::login($userData);
                session(['witness1' => $witness1, 'witness2' => $witness2]);

                return redirect()->route('admin.index');
            }

            return inertia('login', [
                'users'  => User::where('role', 'witness')->get(),
                'errors' => [
                    'login' => 'Developer only : user_id not exist',
                ],
            ]);
        }

        $response = Http::withHeaders(['token' => env('API_AUTH_KEY')])
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
            session(['witness1' => $witness1, 'witness2' => $witness2]);

            return redirect()->route('admin.index');
        }

        return inertia('login', [
            'users'  => User::where('role', 'witness')->get(),
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

        return inertia('login', [
            'users'  => User::where('role', 'witness')->get(),
            'errors' => [
                'login' => 'ออกจากระบบสำเร็จ',
            ],
        ]);
    }

    public function admin()
    {
        if (! Auth::check()) {

            return redirect()->route('login');
        }

        return inertia::render('admin/index');
    }

    public function admin_search(Request $request)
    {
        $request->validate([
            'hn' => ['required', 'string', 'max:255'],
        ]);

        $hn = $request->input('hn');

        $response = Http::withHeaders(['key' => env('API_PATIENT_KEY')])
            ->post('http://172.20.1.22/w_phr/api/patient/info', [
                'hn' => $hn,
            ])
            ->json();

        if ($response['status'] == 'success') {
            $patient = Patient::where('hn', $hn)->first();
            if ($patient == null) {
                $patient        = new Patient();
                $patient->hn    = $hn;
                $patient->token = Crypt::encryptString($hn);
            }
            $patient->photo_consent     = $response['patient']['photo_consent'];
            $patient->treatment_consent = $response['patient']['treatment_consent'];
            $patient->insurance_consent = $response['patient']['insurance_consent'];
            $patient->benefit_consent   = $response['patient']['benefit_consent'];
            $patient->expires_at        = now()->addMinutes(60);
            $patient->save();

            $visit_response = Http::withHeaders(['key' => env('API_PATIENT_KEY')])
                ->post('http://172.20.1.22/w_phr/api/patient/visit', [
                    'hn' => $hn,
                ])
                ->json();
            $vn          = '';
            $visit       = '';
            $doctor_name = '';

            if ($visit_response['status'] == 'success') {
                $vn          = $visit_response['patient']['vn'];
                $visit       = $visit_response['patient']['visit_date'];
                $doctor_name = $visit_response['patient']['doctor'];
            }

            $queryParams = [
                'witness1_user_id' => session('witness1'),
                'witness2_user_id' => session('witness2'),
                'informer_user_id' => auth()->user()->user_id,
                'visit'            => $visit,
                'visit_date'       => date('d/m/Y', strtotime($visit)),
                'vn'               => $vn,
                'doctor_name'      => $doctor_name,
            ];

            $header_params = Crypt::encryptString(json_encode($queryParams));

            $baseUrl          = env('APP_URL');
            $generatedResult1 = "{$baseUrl}/telemedicine/{$patient->token}?data={$header_params}";
            $generatedResult2 = "{$baseUrl}/telehealth/{$patient->token}?data={$header_params}&doctor_name={$doctor_name}";
            $generatedResult3 = "{$baseUrl}/hiv/{$patient->token}?data={$header_params}";

            $patientData = [
                'hn'    => $patient->hn,
                'name'  => $response['patient']['name']['first_th'] . ' ' . $response['patient']['name']['last_th'] ?? 'N/A',
                'phone' => $response['patient']['phone'] ?? 'N/A',
            ];

        } else {
            $patientData = [
                'hn'    => $hn,
                'name'  => $response['message'],
                'phone' => 'N/A',
            ];
            $generatedResult1 = "Patient with HN {$hn} not found.";
            $generatedResult2 = "";
            $generatedResult3 = "";
        }

        return Inertia::render('admin/index', [
            'patient'           => $patientData,
            'telemedicines'     => $patient->telemedicines->take(1),
            'telehealths'       => $patient->telehealths->take(1),
            'hivs'              => $patient->hivs->take(1),
            'telemedicine_link' => $generatedResult1,
            'telehealth_link'   => $generatedResult2,
            'hiv_link'          => $generatedResult3,
            'queryParams'       => $queryParams,
            'informer'          => auth()->user(),
            'witness1'          => User::where('user_id', session('witness1'))->first(),
            'witness2'          => User::where('user_id', session('witness2'))->first(),
        ]);
    }

    public function telemedicine($token)
    {
        $patient = Patient::where('token', $token)->first();
        if (! $patient || $patient->expires_at < now()) {
            return redirect()->route('error');
        }

        return inertia::render('consents/telemedicine', compact('patient'));
    }

    public function telemedicine_store(Request $request)
    {
        $validated = $request->validate([
            'hn'                   => 'required|string|exists:patients,hn',
            'data'                 => 'required|string',
            'type'                 => 'required|string',
            'signature_name'       => 'required|string',
            'signature_type'       => 'required|string',
            'signature'            => 'required|string',
            'telemedicine_consent' => 'required|string',
        ]);

        $data = json_decode(Crypt::decryptString($request->data), true);

        $new                       = new Telemedicine;
        $new->hn                   = $request->hn;
        $new->type                 = $request->type;
        $new->signature_type       = $request->signature_type;
        $new->signature_name       = $request->signature_name;
        $new->signature            = $request->signature;
        $new->signature_relation   = $request->signature_relation;
        $new->telemedicine_consent = ($request->telemedicine_consent === 'yes') ? true : false;
        $new->treatment_consent    = ($request->treatment_consent === 'yes') ? true : false;
        $new->insurance_consent    = ($request->insurance_consent === 'yes') ? true : false;
        $new->benefit_consent      = ($request->benefit_consent === 'yes') ? true : false;
        $new->informer_user_id     = $data['informer_user_id'];
        $new->witness_user_id      = $data['witness1_user_id'];
        $new->save();

        return redirect()->route('success');
    }

    public function telehealth($token)
    {
        $patient = Patient::where('token', $token)->first();
        if (! $patient || $patient->expires_at < now()) {
            return redirect()->route('error');
        }

        return inertia::render('consents/telehealth', compact('patient'));
    }

    public function telehealth_store(Request $request)
    {
        $validated = $request->validate([
            'hn'           => 'required|string|exists:patients,hn',
            'data'         => 'required|string',
            'type'         => 'required|string',
            'patient_name' => 'required|string',
            'patient_type' => 'required|string',
            'signature'    => 'required|string',
        ]);

        $data = json_decode(Crypt::decryptString($request->data), true);

        $new                       = new Telehealth;
        $new->hn                   = $request->hn;
        $new->type                 = $request->type;
        $new->vn                   = $data['vn'];
        $new->visit_date           = date('Y-m-d H:i:s', strtotime($data['visit']));
        $new->doctor_name          = $data['doctor_name'];
        $new->name                 = $request->patient_name;
        $new->name_type            = $request->patient_type;
        $new->name_relation        = $request->patient_relation;
        $new->name_phone           = $request->patient_phone;
        $new->name_address         = $request->patient_address;
        $new->signature            = $request->signature;
        $new->document_information = true;
        $new->telehealth_consent   = true;
        $new->informer_user_id     = $data['informer_user_id'];
        $new->witness1_user_id     = $data['witness1_user_id'];
        $new->witness2_user_id     = $data['witness2_user_id'];

        $new->save();

        return redirect()->route('success');
    }

    public function hiv($token)
    {
        $patient = Patient::where('token', $token)->first();
        if (! $patient || $patient->expires_at < now()) {
            return redirect()->route('error');
        }

        return inertia::render('consents/hiv', compact('patient'));
    }

    public function hiv_store(Request $request)
    {
        $validated = $request->validate([
            'hn'           => 'required|string|exists:patients,hn',
            'data'         => 'required|string',
            'type'         => 'required|string',
            'patient_name' => 'required|string',
            'patient_type' => 'required|string',
            'hiv_consent'  => 'required|string',
            'signature'    => 'required|string',
        ]);

        $data = json_decode(Crypt::decryptString($request->data), true);

        $new                   = new Hiv;
        $new->hn               = $request->hn;
        $new->type             = $request->type;
        $new->vn               = $data['vn'];
        $new->visit_date       = date('Y-m-d H:i:s', strtotime($data['visit']));
        $new->doctor_name      = $data['doctor_name'];
        $new->name             = $request->patient_name;
        $new->name_type        = $request->patient_type;
        $new->name_relation    = $request->patient_relation;
        $new->name_phone       = $request->patient_phone;
        $new->name_address     = $request->patient_address;
        $new->signature        = $request->signature;
        $new->hiv_consent      = $request->hiv_consent;
        $new->hiv_name         = $request->hiv_name;
        $new->informer_user_id = $data['informer_user_id'];
        $new->witness1_user_id = $data['witness1_user_id'];
        $new->witness2_user_id = $data['witness2_user_id'];
        $new->save();

        return redirect()->route('success');
    }

    public function allConsents(Request $request)
    {
        $startDate = $request->start_date ?? now()->startOfDay()->format('Y-m-d');
        $endDate   = $request->end_date ?? now()->endOfDay()->format('Y-m-d');
        $hn        = $request->hn;

        $telehealths = Telehealth::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at', 'desc');

        $telemedicines = Telemedicine::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at', 'desc');

        $hivs = Hiv::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at', 'desc');

        if ($hn) {
            $telemedicines->where('hn', 'like', "%{$hn}%");
            $telehealths->where('hn', 'like', "%{$hn}%");
            $hivs->where('hn', 'like', "%{$hn}%");
        }

        $telemedicines = $telemedicines->get();
        $telehealths   = $telehealths->get();
        $hivs          = $hivs->get();
        $consents      = array_merge($telemedicines->toArray(), $telehealths->toArray(), $hivs->toArray());

        foreach ($consents as $index => $consent) {
            $consents[$index]['pdf_id'] = $consent['id'];
            $consents[$index]['id']     = $index + 1;
        }

        return inertia::render('admin/view', compact('consents'));
    }

    public function viewTelemedicineConsent($id)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $consent = Telemedicine::findOrFail($id);

        // Fetch patient data from API
        $response = Http::withHeaders(['key' => env('API_PATIENT_KEY')])
            ->post('http://172.20.1.22/w_phr/api/patient/info', [
                'hn' => $consent->hn,
            ])
            ->json();

        if ($response['status'] == 0) {
            return back()->with('error', 'ไม่พบข้อมูลผู้ป่วย');
        }

        $allergyName    = '';
        $allergySymptom = '';
        if ($response['patient']['allergy']) {
            foreach ($response['patient']['allergy_list'] as $allergy) {
                if (array_key_exists('name', $allergy)) {
                    $allergyName .= $allergy['name'] . ', ';
                }
                if (array_key_exists('remark', $allergy)) {
                    $allergySymptom .= $allergy['remark'] . ', ';
                }
            }
        }

        $consentData = [
            'hn'                   => $consent->hn,
            'patient'              => [
                'nameTH'             => $response['patient']['name']['first_th'],
                'surnameTH'          => $response['patient']['name']['last_th'],
                'nameEN'             => $response['patient']['name']['first_en'],
                'surnameEN'          => $response['patient']['name']['last_en'],
                'birthDate'          => $response['patient']['brithdate_text'],
                'religion'           => $response['patient']['religion'],
                'race'               => $response['patient']['race'],
                'national'           => $response['patient']['national'],
                'martial'            => $response['patient']['martial'],
                'age'                => $response['patient']['age'],
                'phone'              => $response['patient']['telephone'],
                'mobile'             => $response['patient']['phone'],
                'email'              => $response['patient']['email'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'education_code'     => $response['patient']['education_code'],
                'address'            => $response['patient']['address']['home']['full_address'],
                'address_contact'    => $response['patient']['address']['contact']['full_address'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => ($response['patient']['allergy']) ? $allergyName : '',
                'allergy_symptom'    => ($response['patient']['allergy']) ? $allergySymptom : '',
                'represent'          => isset($response['patient']['notify']) ? true : false,
                'represent_name'     => $response['patient']['notify']['first_name'],
                'represent_surname'  => $response['patient']['notify']['last_name'],
                'represent_relation' => $response['patient']['notify']['relation'],
                'represent_phone'    => $response['patient']['notify']['phone'],
            ],
            'visit_date'           => $consent->created_at->format('d/m/Y'),
            'visit_time'           => $consent->created_at->format('H:i'),
            'telemedicine_consent' => $consent->telemedicine_consent,
            'treatment_consent'    => $consent->treatment_consent,
            'insurance_consent'    => $consent->insurance_consent,
            'benefit_consent'      => $consent->benefit_consent,
            'signature'            => $consent->signature,
            'signature_type'       => $consent->signature_type,
            'signature_relation'   => $consent->signature_relation,
            'signature_name'       => $consent->signature_name,
            'informer_name'        => $consent->informer->name,
            'informer_sign'        => $consent->informer->signature,
            'witness_name'         => $consent->witness->name,
            'witness_sign'         => $consent->witness->signature,
        ];

        return Inertia::render('admin/pdf/telemedicine', [
            'consent' => $consentData,
        ]);
    }

    public function viewTelehealthConsent($id)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $consent = Telehealth::findOrFail($id);

        $response = Http::withHeaders(['key' => env('API_PATIENT_KEY')])
            ->post('http://172.20.1.22/w_phr/api/patient/info', [
                'hn' => $consent->hn,
            ])
            ->json();

        if ($response['status'] == 0) {
            return back()->with('error', 'ไม่พบข้อมูลผู้ป่วย');
        }

        $allergyName    = '';
        $allergySymptom = '';
        if ($response['patient']['allergy']) {
            foreach ($response['patient']['allergy_list'] as $allergy) {
                if (array_key_exists('name', $allergy)) {
                    $allergyName .= $allergy['name'] . ', ';
                }
                if (array_key_exists('remark', $allergy)) {
                    $allergySymptom .= $allergy['remark'] . ', ';
                }
            }
        }

        $consentData = [
            'hn'                   => $consent->hn,
            'patient'              => [
                'nameTH'             => $response['patient']['name']['first_th'],
                'surnameTH'          => $response['patient']['name']['last_th'],
                'nameEN'             => $response['patient']['name']['first_en'],
                'surnameEN'          => $response['patient']['name']['last_en'],
                'gender'             => $response['patient']['gender'],
                'birthDate'          => $response['patient']['brithdate_text'],
                'religion'           => $response['patient']['religion'],
                'race'               => $response['patient']['race'],
                'national'           => $response['patient']['national'],
                'martial'            => $response['patient']['martial'],
                'age'                => $response['patient']['age'],
                'phone'              => $response['patient']['telephone'],
                'mobile'             => $response['patient']['phone'],
                'email'              => $response['patient']['email'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'address'            => $response['patient']['address']['home']['full_address'],
                'address_contact'    => $response['patient']['address']['contact']['full_address'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => ($response['patient']['allergy']) ? $allergyName : '',
                'allergy_symptom'    => ($response['patient']['allergy']) ? $allergySymptom : '',
                'represent'          => isset($response['patient']['notify']) ? true : false,
                'represent_name'     => $response['patient']['notify']['first_name'],
                'represent_surname'  => $response['patient']['notify']['last_name'],
                'represent_relation' => $response['patient']['notify']['relation'],
                'represent_phone'    => $response['patient']['notify']['phone'],
            ],
            'vn'                   => $consent->vn,
            'name'                 => $consent->name,
            'name_type'            => $consent->name_type,
            'name_relation'        => $consent->name_relation,
            'name_phone'           => $consent->name_phone,
            'name_address'         => $consent->name_address,
            'visit_date'           => date('d/m/Y', strtotime($consent->visit_date)),
            'visit_time'           => date('H:i', strtotime($consent->visit_date)),
            'doctor_name'          => $consent->doctor_name,
            'document_information' => $consent->document_information,
            'signature'            => $consent->signature,
            'informer_name'        => $consent->informer->name,
            'informer_sign'        => $consent->informer->signature,
            'witness1_name'        => $consent->witness1->name,
            'witness1_sign'        => $consent->witness1->signature,
            'witness2_name'        => $consent->witness2->name,
            'witness2_sign'        => $consent->witness2->signature,
        ];

        return inertia::render('admin/pdf/telehealth', [
            'consent' => $consentData,
        ]);
    }

    public function viewHivConsent($id)
    {
        $consent = Hiv::findOrFail($id);

        $response = Http::withHeaders(['key' => env('API_PATIENT_KEY')])
            ->post('http://172.20.1.22/w_phr/api/patient/info', [
                'hn' => $consent->hn,
            ])
            ->json();

        if ($response['status'] == 0) {
            return back()->with('error', 'ไม่พบข้อมูลผู้ป่วย');
        }

        $allergyName    = '';
        $allergySymptom = '';
        if ($response['patient']['allergy']) {
            foreach ($response['patient']['allergy_list'] as $allergy) {
                if (array_key_exists('name', $allergy)) {
                    $allergyName .= $allergy['name'] . ', ';
                }
                if (array_key_exists('remark', $allergy)) {
                    $allergySymptom .= $allergy['remark'] . ', ';
                }
            }
        }

        $consentData = [
            'hn'            => $consent->hn,
            'patient'       => [
                'nameTH'             => $response['patient']['name']['first_th'],
                'surnameTH'          => $response['patient']['name']['last_th'],
                'nameEN'             => $response['patient']['name']['first_en'],
                'surnameEN'          => $response['patient']['name']['last_en'],
                'gender'             => $response['patient']['gender'],
                'birthDate'          => $response['patient']['brithdate_text'],
                'religion'           => $response['patient']['religion'],
                'race'               => $response['patient']['race'],
                'national'           => $response['patient']['national'],
                'martial'            => $response['patient']['martial'],
                'age'                => $response['patient']['age'],
                'phone'              => $response['patient']['telephone'],
                'mobile'             => $response['patient']['phone'],
                'email'              => $response['patient']['email'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'address'            => $response['patient']['address']['home']['full_address'],
                'address_contact'    => $response['patient']['address']['contact']['full_address'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => ($response['patient']['allergy']) ? $allergyName : '',
                'allergy_symptom'    => ($response['patient']['allergy']) ? $allergySymptom : '',
                'represent'          => isset($response['patient']['notify']) ? true : false,
                'represent_name'     => $response['patient']['notify']['first_name'],
                'represent_surname'  => $response['patient']['notify']['last_name'],
                'represent_relation' => $response['patient']['notify']['relation'],
                'represent_phone'    => $response['patient']['notify']['phone'],
            ],
            'vn'            => $consent->vn,
            'name'          => $consent->name,
            'name_type'     => $consent->name_type,
            'name_relation' => $consent->name_relation,
            'name_phone'    => $consent->name_phone,
            'name_address'  => $consent->name_address,
            'visit_date'    => date('d/m/Y', strtotime($consent->visit_date)),
            'visit_time'    => date('H:i', strtotime($consent->visit_date)),
            'doctor_name'   => $consent->doctor_name,
            'hiv_consent'   => $consent->hiv_consent,
            'hiv_name'      => $consent->hiv_name,
            'signature'     => $consent->signature,
            'informer_name' => $consent->informer->name,
            'informer_sign' => $consent->informer->signature,
            'witness1_name' => $consent->witness1->name,
            'witness1_sign' => $consent->witness1->signature,
            'witness2_name' => $consent->witness2->name,
            'witness2_sign' => $consent->witness2->signature,
        ];
        return inertia::render('admin/pdf/hiv', [
            'consent' => $consentData,
        ]);
    }

    public function manageUsers(Request $request)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $sortField     = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $perPage       = $request->input('per_page', 10);

        $users = User::query()
            ->orderBy($sortField, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    public function setWitness(User $user)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $user->role = 'witness';
        $user->save();

        return back()->with('success', 'User role updated successfully');
    }

    public function addWitness(Request $request)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $request->validate([
            'userid' => 'required|string|unique:users,user_id',
        ]);

        $response = Http::withHeaders(['token' => env('API_AUTH_KEY')])
            ->post('http://172.20.1.12/dbstaff/api/getuser', [
                'userid' => $request->userid,
            ])
            ->json();

        if ($response['status'] == 1) {
            $user          = new User();
            $user->user_id = $request->userid;
            $user->name    = $response['user']['name'];
            $user->role    = 'witness';
            $user->save();

            return back()->with('success', 'User added successfully as witness');
        }

        return back()->with('error', 'User not found in the system');
    }

    public function checkSession()
    {
        if (! Auth::check()) {
            return response()->json(['valid' => false]);
        }

        return response()->json(['valid' => true]);
    }

    public function updateSignature(Request $request)
    {
        $request->validate([
            'signature' => 'required|string',
        ]);

        $user            = auth()->user();
        $user->signature = $request->signature;
        $user->save();

        return response()->json(['message' => 'Signature updated successfully']);
    }
}
