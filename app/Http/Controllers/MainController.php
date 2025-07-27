<?php
namespace App\Http\Controllers;

use App\Models\Hiv;
use App\Models\Patient;
use App\Models\ShortLink;
use App\Models\SleepnessForm;
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
    public function date_Full($dateInput, $perferEnglisgh = false)
    {
        $dateParts = explode('-', $dateInput);
        if (count($dateParts) !== 3) {
            return '';
        }

        list($year, $month, $day) = $dateParts;

        $thaiMonths = [
            '01' => 'มกราคม', '02'  => 'กุมภาพันธ์', '03' => 'มีนาคม',
            '04' => 'เมษายน', '05'  => 'พฤษภาคม', '06'    => 'มิถุนายน',
            '07' => 'กรกฎาคม', '08' => 'สิงหาคม', '09'    => 'กันยายน',
            '10' => 'ตุลาคม', '11'  => 'พฤศจิกายน', '12'  => 'ธันวาคม',
        ];

        $englishMonths = [
            '01' => 'January', '02' => 'February', '03' => 'March',
            '04' => 'April', '05'   => 'May', '06'      => 'June',
            '07' => 'July', '08'    => 'August', '09'   => 'September',
            '10' => 'October', '11' => 'November', '12' => 'December',
        ];

        $fullmonth = '';
        if ($perferEnglisgh) {
            $fullmonth = $englishMonths[$month] ?? '';
        } else {
            $year += 543;
            $fullmonth = $thaiMonths[$month] ?? '';
        }

        $dayPart = substr($day, 0, 2);

        return $dayPart . " " . $fullmonth . " " . $year;
    }

    public function login()
    {
        $users = User::where('role', 'witness')->get();

        return inertia('login', [
            'users' => $users,
        ]);
    }

    public function loginUser()
    {

        return inertia('index');
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
                $userData = User::where('user_id', $userid)->first();
                if ($userData == null) {
                    $userData          = new User();
                    $userData->user_id = $userid;
                    $userData->name    = $response['user']['name'];
                }
                $userData->department = $response['user']['department'];
                $userData->position   = $response['user']['position'];
                $userData->save();

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
            $userData->name       = $response['user']['name'];
            $userData->department = $response['user']['department'];
            $userData->position   = $response['user']['position'];
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

    public function loginUserRequest(Request $request)
    {
        $userid   = $request->userid;
        $password = $request->password;

        if (env('APP_ENV') == 'dev' || env('APP_PASSWORD') == $password) {
            $response = Http::withHeaders(['token' => env('API_AUTH_KEY')])
                ->post('http://172.20.1.12/dbstaff/api/getuser', [
                    'userid' => $userid,
                ])
                ->json();

            if ($response['status'] == 1) {
                $userData = User::where('user_id', $userid)->first();
                if ($userData == null) {
                    $userData          = new User();
                    $userData->user_id = $userid;
                    $userData->name    = $response['user']['name'];
                    $userData->role    = 'staff';
                }
                $userData->department = $response['user']['department'];
                $userData->position   = $response['user']['position'];
                $userData->save();

                Auth::login($userData);

                return redirect()->route('user.index');
            }

            return inertia('index', [
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
            $userData->name       = $response['user']['name'];
            $userData->department = $response['user']['department'];
            $userData->position   = $response['user']['position'];
            $userData->role       = 'staff';
            $userData->save();

            Auth::login($userData);

            return redirect()->route('user.index');
        }

        return inertia('index', [
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

    public function logoutUser(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return inertia('index');
    }

    public function user(Request $request)
    {
        if (! Auth::check()) {
            return redirect()->route('login.user');
        }

        $hn = $request->hn;

        // Prepare queries
        $telemedicines = Telemedicine::query();
        $telehealths   = Telehealth::query();
        $hivs          = Hiv::query();

        // Apply HN filter
        if ($hn) {
            $telemedicines->where('hn', 'like', "%{$hn}%");
            $telehealths->where('hn', 'like', "%{$hn}%");
            $hivs->where('hn', 'like', "%{$hn}%");
        } else {
            $telemedicines->wheredate('created_at', date('Y-m-d'));
            $telehealths->wheredate('created_at', date('Y-m-d'));
            $hivs->wheredate('created_at', date('Y-m-d'));
        }

        $consents = array_merge(
            $telemedicines->get()->toArray(),
            $telehealths->get()->toArray(),
            $hivs->get()->toArray()
        );

        // Sort by created_at descending
        array_multisort(array_column($consents, 'created_at'), SORT_DESC, $consents);

        // Add index/id for frontend
        foreach ($consents as $index => $consent) {
            $consents[$index]['id']       = $index + 1;
            $consents[$index]['fulldate'] = $this->date_Full(substr($consent['created_at'], 0, 10)) . ' ' . date('H:i', strtotime($consent['created_at']));
        }

        return inertia('user/index', [
            'consents' => $consents,
        ]);
    }

    public function admin()
    {
        if (auth()->user()->role == 'user') {

            return redirect()->route('user.index');
        }

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

        if ($response['status'] == 'success' && session('witness1') !== null) {
            $patient = Patient::where('hn', $hn)->first();
            if ($patient == null) {
                $patient           = new Patient();
                $patient->hn       = $hn;
                $patient->name     = $response['patient']['name']['first_th'] . ' ' . $response['patient']['name']['last_th'];
                $patient->token    = Crypt::encryptString($hn);
                $patient->ref      = $response['patient']['ref'][0]['ref'];
                $patient->passport = $response['patient']['ref'][0]['card'] == "1" ? false : true;
            }
            $patient->photo_consent     = $response['patient']['photo_consent'];
            $patient->treatment_consent = $response['patient']['treatment_consent'];
            $patient->insurance_consent = $response['patient']['insurance_consent'];
            $patient->marketing_consent = $response['patient']['marketing_consent'];
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
                'visit_date'       => $visit !== '' ? date('d/m/Y', strtotime($visit)) : '',
                'vn'               => $vn,
                'doctor_name'      => $doctor_name,
            ];

            $header_params = Crypt::encryptString(json_encode($queryParams));

            $baseUrl          = env('APP_URL');
            $telemedicinesURL = $this->getShortUrl("{$baseUrl}/telemedicine/{$patient->token}?data={$header_params}");
            $telehealthURL    = $this->getShortUrl("{$baseUrl}/telehealth/{$patient->token}?data={$header_params}&doctor_name={$doctor_name}");
            $hivURL           = $this->getShortUrl("{$baseUrl}/hiv/{$patient->token}?data={$header_params}");
            $sleepCheckURL    = $this->getShortUrl("{$baseUrl}/sleep-check/{$patient->token}?data={$header_params}");

            $patientData = [
                'hn'    => $patient->hn,
                'name'  => $response['patient']['name']['first_th'] . ' ' . $response['patient']['name']['last_th'] ?? 'N/A',
                'phone' => $response['patient']['phone'] ?? 'N/A',
            ];

        } else {

            $patient = null;

            $patientData = [
                'hn'    => $hn,
                'name'  => $response['message'],
                'phone' => 'N/A',
            ];

            $queryParams = [
                'witness1_user_id' => session('witness1'),
                'witness2_user_id' => session('witness2'),
                'informer_user_id' => auth()->user()->user_id,
                'visit'            => '',
                'visit_date'       => '',
                'vn'               => '',
                'doctor_name'      => '',
            ];

            $telemedicinesURL = "ไม่พบข้อมูลผู้ป่วย หรือ ข้อมูลการ Login ไม่ถูกต้องกรุณา Login ใหม่อีกครั้ง";
            $telehealthURL    = "";
            $hivURL           = "";
            $sleepCheckURL    = "";
        }

        return Inertia::render('admin/index', [
            'patient'           => $patientData,
            'telemedicines'     => $patient ? $patient->telemedicines->take(1) : [],
            'telehealths'       => $patient ? $patient->telehealths->take(1) : [],
            'hivs'              => $patient ? $patient->hivs->take(1) : [],
            'sleepnesses'       => $patient ? $patient->sleepnesses->take(1) : [],
            'telemedicine_link' => $telemedicinesURL,
            'telehealth_link'   => $telehealthURL,
            'hiv_link'          => $hivURL,
            'sleep_check_link'  => $sleepCheckURL,
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

        return inertia::render('forms/telemedicine', compact('patient'));
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
        $new->treatment_consent    = true;
        $new->insurance_consent    = ($request->insurance_consent === 'yes') ? true : false;
        $new->marketing_consent    = ($request->marketing_consent === 'yes') ? true : false;
        $new->informer_user_id     = $data['informer_user_id'];
        $new->witness_user_id      = $data['witness1_user_id'];
        $new->save();

        $patient = Patient::where('hn', $request->hn)->first();
        if ($patient->insurance_consent == null || $patient->marketing_consent == null) {
            $patient->insurance_consent = $request->insurance_consent;
            $patient->marketing_consent = $request->marketing_consent;
            $patient->save();

            $body = [
                'hn'         => $request->hn,
                "idCard"     => $patient->ref,
                "isPassport" => $patient->passport ? "true" : "false",
                "consent"    => [
                    "insurance" => ($request->insurance_consent === 'yes') ? "true" : "false",
                    "marketing" => ($request->marketing_consent === 'yes') ? "true" : "false",
                ],
            ];

            $response = Http::withHeaders(['API_KEY' => env('HIS_PATIENT_KEY')])
                ->put('http://172.20.1.12:8086/api/patient/patientInformation', $body)
                ->json();

        }

        return redirect()->route('success');
    }

    public function telehealth($token)
    {
        $patient = Patient::where('token', $token)->first();
        if (! $patient || $patient->expires_at < now()) {
            return redirect()->route('error');
        }

        return inertia::render('forms/telehealth', compact('patient'));
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
        $new->visit_date           = $data['visit'] == '' ? null : date('Y-m-d H:i:s', strtotime($data['visit']));
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

        return inertia::render('forms/hiv', compact('patient'));
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
        $new->visit_date       = $data['visit'] == '' ? null : date('Y-m-d H:i:s', strtotime($data['visit']));
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

    public function sleep_check($token)
    {
        $patient = Patient::where('token', $token)->first();
        if (! $patient || $patient->expires_at < now()) {
            return redirect()->route('error');
        }

        return inertia::render('forms/sleep_check', compact('patient'));
    }

    public function sleep_check_store(Request $request)
    {
        $validated = $request->validate([
            'hn'                              => 'required|string|exists:patients,hn',
            'data'                            => 'required|string',
            'type'                            => 'required|string',
            'weight'                          => 'required|string',
            'height'                          => 'required|string',
            'bmi'                             => 'required|string',
            'disease'                         => 'required|string',
            'medicine'                        => 'required|string',
            'sleep_pill'                      => 'required|string',
            'alcohol'                         => 'required|string',
            'tobacco'                         => 'required|string',
            'caffeine'                        => 'required|string',
            'sleep_problem_1'                 => 'required|string',
            'sleep_problem_2'                 => 'required|string',
            'sleep_problem_3'                 => 'required|string',
            'sleep_problem_4'                 => 'required|string',
            'sleep_problem_5'                 => 'required|string',
            'sleep_problem_6'                 => 'required|string',
            'sleep_problem_7'                 => 'required|string',
            'sleep_problem_8'                 => 'required|string',
            'sleep_problem_9'                 => 'required|string',
            'sleep_problem_10'                => 'required|string',
            'sleep_problem_11'                => 'required|string',
            'sleep_problem_12'                => 'required|string',
            'sleep_problem_13'                => 'required|string',
            'sleep_situation_1'               => 'required|string',
            'sleep_situation_2'               => 'required|string',
            'sleep_situation_3'               => 'required|string',
            'sleep_situation_4'               => 'required|string',
            'sleep_situation_5'               => 'required|string',
            'sleep_situation_6'               => 'required|string',
            'sleep_situation_7'               => 'required|string',
            'sleep_situation_8'               => 'required|string',
            'weekday_sleep'                   => 'required|string',
            'weekday_awake'                   => 'required|string',
            'weekday_turnoff_light'           => 'required|string',
            'weekday_night_awake'             => 'required|string',
            'weekday_night_awake_until_sleep' => 'required|string',
            'weekday_alarm'                   => 'required|string',
            'weekend_sleep'                   => 'required|string',
            'weekend_awake'                   => 'required|string',
            'weekend_turnoff_light'           => 'required|string',
            'weekend_night_awake'             => 'required|string',
            'weekend_night_awake_until_sleep' => 'required|string',
            'weekend_alarm'                   => 'required|string',
        ]);

        $sleep_problem = [
            'sleep_problem_1'  => $request->sleep_problem_1,
            'sleep_problem_2'  => $request->sleep_problem_2,
            'sleep_problem_3'  => $request->sleep_problem_3,
            'sleep_problem_4'  => $request->sleep_problem_4,
            'sleep_problem_5'  => $request->sleep_problem_5,
            'sleep_problem_6'  => $request->sleep_problem_6,
            'sleep_problem_7'  => $request->sleep_problem_7,
            'sleep_problem_8'  => $request->sleep_problem_8,
            'sleep_problem_9'  => $request->sleep_problem_9,
            'sleep_problem_10' => $request->sleep_problem_10,
            'sleep_problem_11' => $request->sleep_problem_11,
            'sleep_problem_12' => $request->sleep_problem_12,
            'sleep_problem_13' => $request->sleep_problem_13,
            'sleep_problem_14' => $request->sleep_problem_14,
        ];

        $sleep_situation = [
            'sleep_situation_1' => $request->sleep_situation_1,
            'sleep_situation_2' => $request->sleep_situation_2,
            'sleep_situation_3' => $request->sleep_situation_3,
            'sleep_situation_4' => $request->sleep_situation_4,
            'sleep_situation_5' => $request->sleep_situation_5,
            'sleep_situation_6' => $request->sleep_situation_6,
            'sleep_situation_7' => $request->sleep_situation_7,
            'sleep_situation_8' => $request->sleep_situation_8,
        ];

        $sleep_schedule = [
            'weekday_sleep'                   => $request->weekday_sleep,
            'weekday_awake'                   => $request->weekday_awake,
            'weekday_turnoff_light'           => $request->weekday_turnoff_light,
            'weekday_night_awake'             => $request->weekday_night_awake,
            'weekday_night_awake_until_sleep' => $request->weekday_night_awake_until_sleep,
            'weekday_alarm'                   => $request->weekday_alarm,
            'weekend_sleep'                   => $request->weekend_sleep,
            'weekend_awake'                   => $request->weekend_awake,
            'weekend_turnoff_light'           => $request->weekend_turnoff_light,
            'weekend_night_awake'             => $request->weekend_night_awake,
            'weekend_night_awake_until_sleep' => $request->weekend_night_awake_until_sleep,
            'weekend_alarm'                   => $request->weekend_alarm,
        ];

        $data = json_decode(Crypt::decryptString($request->data), true);

        $new                    = new SleepnessForm;
        $new->hn                = $request->hn;
        $new->type              = $request->type;
        $new->vn                = $data['vn'];
        $new->visit_date        = $data['visit'] == '' ? null : date('Y-m-d H:i:s', strtotime($data['visit']));
        $new->doctor_name       = $data['doctor_name'];
        $patient                = Patient::where('hn', $request->hn)->first();
        $new->patient_type      = $request->patient_type;
        $new->name              = ($request->patient_type == 'patient') ? $patient->name : $request->relative_name;
        $new->relative_relation = $request->relative_relation;
        $new->weight            = $request->weight;
        $new->height            = $request->height;
        $new->bmi               = $request->bmi;
        $new->neck_size         = $request->neck_size;
        $new->disease           = $request->disease;
        $new->disease_text      = $request->disease_text;
        $new->medicine          = $request->medicine;
        $new->medicine_text     = $request->medicine_text;
        $new->sleep_pill        = $request->sleep_pill;
        $new->sleep_pill_text   = $request->sleep_pill_text;
        $new->alcohol           = $request->alcohol;
        $new->tobacco           = $request->tobacco;
        $new->caffeine          = $request->caffeine;
        $new->sleep_problem     = json_encode($sleep_problem);
        $new->sleep_situation   = json_encode($sleep_situation);
        $new->sleep_schedule    = json_encode($sleep_schedule);
        $new->informer_user_id  = $data['informer_user_id'];
        $new->save();

        return redirect()->route('success');
    }

    public function allConsents(Request $request)
    {
        if (auth()->user()->role == 'user') {

            return redirect()->route('user.index');
        }

        $startDate = $request->start_date ?? now()->startOfDay()->format('Y-m-d');
        $endDate   = $request->end_date ?? now()->endOfDay()->format('Y-m-d');
        $hn        = $request->hn;
        $type      = $request->type;

        if ($type == 'Telemedicine') {
            $telemedicines = Telemedicine::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->orderBy('created_at', 'desc');
        } else if ($type == 'Telehealth') {
            $telehealths = Telehealth::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->orderBy('created_at', 'desc');
        } else if ($type == 'HIV') {
            $hivs = Hiv::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->orderBy('created_at', 'desc');
        } else {
            $telehealths = Telehealth::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->orderBy('created_at', 'desc');

            $telemedicines = Telemedicine::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->orderBy('created_at', 'desc');

            $hivs = Hiv::whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate)
                ->orderBy('created_at', 'desc');
        }

        if ($hn) {
            if ($type == 'Telemedicine') {
                $telemedicines->where('hn', 'like', "%{$hn}%");
            } else if ($type == 'Telehealth') {
                $telehealths->where('hn', 'like', "%{$hn}%");
            } else if ($type == 'HIV') {
                $hivs->where('hn', 'like', "%{$hn}%");
            } else {
                $telemedicines->where('hn', 'like', "%{$hn}%");
                $telehealths->where('hn', 'like', "%{$hn}%");
                $hivs->where('hn', 'like', "%{$hn}%");
            }
        }

        if ($type == 'Telemedicine') {
            $telemedicines = $telemedicines->get();

            $consents = $telemedicines->toArray();
        } else if ($type == 'Telehealth') {
            $telehealths = $telehealths->get();

            $consents = $telehealths->toArray();
        } else if ($type == 'HIV') {
            $hivs = $hivs->get();

            $consents = $hivs->toArray();
        } else {
            $telemedicines = $telemedicines->get();
            $telehealths   = $telehealths->get();
            $hivs          = $hivs->get();

            $consents = array_merge($telemedicines->toArray(), $telehealths->toArray(), $hivs->toArray());
        }

        array_multisort(array_column($consents, 'created_at'), SORT_DESC, $consents);
        foreach ($consents as $index => $consent) {
            $consents[$index]['pdf_id'] = $consent['id'];
            $consents[$index]['id']     = $index + 1;
        }

        $page        = 'all-consents';
        $type_select = [
            [
                'label' => 'All Types',
                'value' => '',
            ],
            [
                'label' => 'Telemedicine',
                'value' => 'Telemedicine',
            ],
            [
                'label' => 'Telehealth',
                'value' => 'Telehealth',
            ],
            [
                'label' => 'HIV',
                'value' => 'HIV',
            ],
        ];

        return inertia::render('admin/view', compact('consents', 'type_select', 'page'));
    }

    public function allForms(Request $request)
    {
        if (auth()->user()->role == 'user') {

            return redirect()->route('user.index');
        }

        $startDate = $request->start_date ?? now()->startOfDay()->format('Y-m-d');
        $endDate   = $request->end_date ?? now()->endOfDay()->format('Y-m-d');
        $hn        = $request->hn;

        $sleepnesses = SleepnessForm::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->orderBy('created_at', 'desc');

        if ($hn) {
            $sleepnesses->where('hn', 'like', "%{$hn}%");
        }

        $sleepnesses = $sleepnesses->get();
        $consents    = array_merge($sleepnesses->toArray());

        array_multisort(array_column($consents, 'created_at'), SORT_DESC, $consents);
        foreach ($consents as $index => $consent) {
            $consents[$index]['pdf_id'] = $consent['id'];
            $consents[$index]['id']     = $index + 1;
        }

        $page        = 'all-forms';
        $type_select = [
            [
                'label' => 'All Types',
                'value' => '',
            ],
            [
                'label' => 'Sleep Check',
                'value' => 'Sleep Check',
            ],
        ];

        return inertia::render('admin/view', compact('consents', 'type_select', 'page'));
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
                'phone'              => $response['patient']['phone'],
                'mobile'             => $response['patient']['mobile'],
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
                'photo'              => true,
            ],
            'visit_date'           => $this->date_Full($consent->created_at->format('Y-m-d')),
            'visit_time'           => $consent->created_at->format('H:i'),
            'telemedicine_consent' => $consent->telemedicine_consent,
            'treatment_consent'    => $consent->treatment_consent,
            'insurance_consent'    => $consent->insurance_consent,
            'marketing_consent'    => $consent->marketing_consent,
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
        $visit   = ($consent->visit_date == null) ? strtotime($consent->created_at) : strtotime($consent->visit_date);

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
        foreach ($response['patient']['allergy_list'] as $allergy) {
            if (array_key_exists('name', $allergy)) {
                $allergyName .= $allergy['name'] . ', ';
            }
            if (array_key_exists('remark', $allergy)) {
                $allergySymptom .= $allergy['remark'] . ', ';
            }
        }
        $allergyName    = rtrim($allergyName, ', ');
        $allergySymptom = rtrim($allergySymptom, ', ');

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
                'phone'              => $response['patient']['phone'],
                'mobile'             => $response['patient']['mobile'],
                'email'              => $response['patient']['email'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'address'            => $response['patient']['address']['home']['full_address'],
                'address_contact'    => $response['patient']['address']['contact']['full_address'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => $allergyName,
                'allergy_symptom'    => $allergySymptom,
                'represent'          => isset($response['patient']['notify']) ? true : false,
                'represent_name'     => $response['patient']['notify']['first_name'],
                'represent_surname'  => $response['patient']['notify']['last_name'],
                'represent_relation' => $response['patient']['notify']['relation'],
                'represent_phone'    => $response['patient']['notify']['phone'],
                'blood_reaction'     => $response['patient']['blood_reaction'],
            ],
            'vn'                   => $consent->vn,
            'name'                 => $consent->name,
            'name_type'            => $consent->name_type,
            'name_relation'        => $consent->name_relation,
            'name_phone'           => $consent->name_phone,
            'name_address'         => $consent->name_address,
            'visit_date'           => $this->date_Full(date('Y-m-d', $visit)),
            'visit_time'           => date('H:i', strtotime($consent->created_at)),
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
        $visit   = ($consent->visit_date == null) ? strtotime($consent->created_at) : strtotime($consent->visit_date);

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
        foreach ($response['patient']['allergy_list'] as $allergy) {
            if (array_key_exists('name', $allergy)) {
                $allergyName .= $allergy['name'] . ', ';
            }
            if (array_key_exists('remark', $allergy)) {
                $allergySymptom .= $allergy['remark'] . ', ';
            }
        }
        $allergyName    = rtrim($allergyName, ', ');
        $allergySymptom = rtrim($allergySymptom, ', ');

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
                'phone'              => $response['patient']['phone'],
                'mobile'             => $response['patient']['mobile'],
                'email'              => $response['patient']['email'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'address'            => $response['patient']['address']['home']['full_address'],
                'address_contact'    => $response['patient']['address']['contact']['full_address'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => $allergyName,
                'allergy_symptom'    => $allergySymptom,
                'represent'          => isset($response['patient']['notify']) ? true : false,
                'represent_name'     => $response['patient']['notify']['first_name'],
                'represent_surname'  => $response['patient']['notify']['last_name'],
                'represent_relation' => $response['patient']['notify']['relation'],
                'represent_phone'    => $response['patient']['notify']['phone'],
                'blood_reaction'     => $response['patient']['blood_reaction'],
            ],
            'vn'            => $consent->vn,
            'name'          => $consent->name,
            'name_type'     => $consent->name_type,
            'name_relation' => $consent->name_relation,
            'name_phone'    => $consent->name_phone,
            'name_address'  => $consent->name_address,
            'visit_date'    => $this->date_Full(date('Y-m-d', $visit)),
            'visit_time'    => date('H:i', strtotime($consent->created_at)),
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

    public function viewSleepnessConsent($id)
    {
        $consent = SleepnessForm::findOrFail($id);
        $visit   = ($consent->visit_date == null) ? strtotime($consent->created_at) : strtotime($consent->visit_date);

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
        foreach ($response['patient']['allergy_list'] as $allergy) {
            if (array_key_exists('name', $allergy)) {
                $allergyName .= $allergy['name'] . ', ';
            }
            if (array_key_exists('remark', $allergy)) {
                $allergySymptom .= $allergy['remark'] . ', ';
            }
        }
        $allergyName    = rtrim($allergyName, ', ');
        $allergySymptom = rtrim($allergySymptom, ', ');

        $consentData = [
            'hn'                => $consent->hn,
            'patient'           => [
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
                'phone'              => $response['patient']['phone'],
                'mobile'             => $response['patient']['mobile'],
                'email'              => $response['patient']['email'],
                'occupation'         => $response['patient']['ocupation'],
                'education'          => $response['patient']['education'],
                'address'            => $response['patient']['address']['home']['full_address'],
                'address_contact'    => $response['patient']['address']['contact']['full_address'],
                'allergy'            => $response['patient']['allergy'],
                'allergy_name'       => $allergyName,
                'allergy_symptom'    => $allergySymptom,
                'represent'          => isset($response['patient']['notify']) ? true : false,
                'represent_name'     => $response['patient']['notify']['first_name'],
                'represent_surname'  => $response['patient']['notify']['last_name'],
                'represent_relation' => $response['patient']['notify']['relation'],
                'represent_phone'    => $response['patient']['notify']['phone'],
                'blood_reaction'     => $response['patient']['blood_reaction'],
            ],
            'vn'                => $consent->vn,
            'visit_date'        => $this->date_Full(date('Y-m-d', $visit)),
            'visit_time'        => date('H:i', strtotime($consent->created_at)),
            'doctor_name'       => $consent->doctor_name,
            'patient_type'      => $consent->patient_type,
            'name'              => $consent->name,
            'relative_relation' => $consent->relative_relation,
            'weight'            => $consent->weight,
            'height'            => $consent->height,
            'bmi'               => $consent->bmi,
            'neck_size'         => $consent->neck_size,
            'disease'           => $consent->disease,
            'disease_text'      => $consent->disease_text,
            'medicine'          => $consent->medicine,
            'medicine_text'     => $consent->medicine_text,
            'sleep_pill'        => $consent->sleep_pill,
            'sleep_pill_text'   => $consent->sleep_pill_text,
            'tobacco'           => $consent->tobacco,
            'alcohol'           => $consent->alcohol,
            'caffeine'          => $consent->caffeine,
            'informer_name'     => $consent->informer->name,
            'informer_position' => $consent->informer->position,
        ];
        $sleep_problem = json_decode($consent->sleep_problem);
        foreach ($sleep_problem as $key => $problem) {
            $consentData[$key] = $problem;
        }
        $sleep_situation = json_decode($consent->sleep_situation);
        $total_situation = 0;
        foreach ($sleep_situation as $key => $situation) {
            $consentData[$key] = $situation;
            $total_situation += $situation;
        }
        $sleep_schedule = json_decode($consent->sleep_schedule);
        foreach ($sleep_schedule as $key => $schedule) {
            $consentData[$key] = $schedule;
        }
        $consentData['total_situation'] = $total_situation;

        return inertia::render('admin/pdf/sleepness', [
            'consent' => $consentData,
        ]);
    }

    public function manageUsers(Request $request)
    {
        if (auth()->user()->role == 'user') {

            return redirect()->route('user.index');
        }

        if (! auth()->check()) {
            return redirect()->route('login');
        }

        $sortField     = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $perPage       = $request->input('per_page', 10);

        $users = User::query()
            ->where('role', '!=', 'user')
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

    public function setUser(User $user)
    {
        if (! auth()->check()) {
            return redirect()->route('login');
        }
        $user->role = 'staff';
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
            $user             = new User();
            $user->user_id    = $request->userid;
            $user->name       = $response['user']['name'];
            $user->department = $response['user']['department'];
            $user->role       = 'witness';
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

    private function getShortUrl($longUrl)
    {
        // Check if already exists
        $existing = ShortLink::where('long_url', $longUrl)->first();
        if ($existing) {
            return url('/s/' . $existing->code);
        }
        // Generate unique code
        do {
            $code = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6);
        } while (ShortLink::where('code', $code)->exists());
        // Store
        ShortLink::create([
            'code'     => $code,
            'long_url' => $longUrl,
        ]);
        return url('/s/' . $code);
    }

    public function redirectShortLink($code)
    {
        $shortLink = ShortLink::where('code', $code)->first();
        if (! $shortLink) {
            abort(404);
        }
        return redirect($shortLink->long_url);
    }
}
