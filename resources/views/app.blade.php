<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}" @class(["dark" => ($appearance ?? "system") == "dark"])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config("app.name", "Laravel") }}</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

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
