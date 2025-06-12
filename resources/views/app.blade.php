<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}" @class(["dark" => ($appearance ?? "system") == "dark"])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config("app.name", "Laravel") }}</title>

    <link rel="icon" href="{{ env("APP_URL") }}/images/Logo.ico" sizes="any">
    <link rel="icon" href="{{ env("APP_URL") }}/images/Logo.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ env("APP_URL") }}/images/Logo.png">

    @routes
    @if (app()->environment("dev"))
        @viteReactRefresh
    @endif
    @vite(["resources/js/app.tsx", "resources/js/pages/{$page["component"]}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
