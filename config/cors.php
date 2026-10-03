<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations mayError **`array_merge(): Argument #2 must be of type array, int given`** pada file `LoadConfiguration.php` terjadi karena terdapat kesalahan sintaksis di dalam file konfigurasi Laravel, khususnya pada file **`config/cors.php`**. 

Di Laravel, file konfigurasi di folder `config/` wajib mengembalikan (*return*) sebuah array menggunakan sintaks `return [ ... ];`. Jika opsi konfigurasi seperti `'paths'`, `'allowed_origins'`, dan lainnya diletakkan di luar array utama atau ada koma/tanda kurung yang salah, Laravel akan membaca nilai konfigurasi sebagai tipe data lain (seperti `int`) yang menyebabkan fungsi `array_merge()` internal Laravel *crash*.

---

### Solusi Perbaikan File `config/cors.php`

Buka file **`config/cors.php`** pada proyek **`eduagro-backend`** Anda dan ganti seluruh isinya dengan struktur array yang valid berikut:

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', '[http://127.0.0.1:5173](http://127.0.0.1:5173)'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];