<?php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\NotFoundHttpException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (NotFoundHttpException $e) {
            if (request()->wantsJson()) {
                return response()->json(['message' => 'Not Found'], 404);
            }

            if (auth()->check()) {
                return redirect()->route('index');
            }

            return redirect()->route('login');
        });

        $this->renderable(function (Throwable $e) {
            if (request()->wantsJson()) {
                return response()->json(['message' => $e->getMessage()], 500);
            }

            return Inertia::render('Error', [
                'status'  => 500,
                'message' => $e->getMessage(),
            ])->toResponse(request())->setStatusCode(500);
        });
    }
}
