<?php

declare(strict_types=1);

require_once __DIR__ . '/news-bootstrap.php';

lvj_require_method('GET');

$configUrl = rtrim(trim((string) lvj_setting('SUPABASE_URL')), '/');
$publishableKey = trim((string) lvj_setting('SUPABASE_ANON_KEY'));

if ($configUrl === '' || $publishableKey === '') {
  lvj_json_response(['success' => false, 'error' => 'CONTENT_API_NOT_CONFIGURED'], 503);
}

$routes = [
  'programs' => ['table' => 'programs', 'query' => 'select=id,title,slug,summary,category,host_name,weekday,start_time,end_time,schedule_text,stream_url,cover_url,sort_order&status=eq.published&order=sort_order.asc&limit=100'],
  'audio' => ['table' => 'audio_items', 'query' => 'select=id,title,slug,description,artist_name,category,audio_url,cover_url,duration_seconds,published_at&status=eq.published&order=published_at.desc&limit=100'],
  'artists' => ['table' => 'artists', 'query' => 'select=id,name,slug,bio,image_url,website_url,social_links&status=eq.published&order=name.asc&limit=100'],
  'videos' => ['table' => 'videos', 'query' => 'select=id,title,slug,description,category,video_url,thumbnail_url,published_at&status=eq.published&order=published_at.desc&limit=100'],
  'playlists' => ['table' => 'playlists', 'query' => 'select=id,title,slug,description,cover_url,tracks,published_at&status=eq.published&order=published_at.desc&limit=100'],
  'pages' => ['table' => 'content_pages', 'query' => 'select=id,title,slug,summary,body,published_at&status=eq.published&order=slug.asc&limit=100'],
  'media' => ['table' => 'media_assets', 'query' => 'select=id,title,asset_type,url,alt_text&status=eq.published&order=asset_type.asc&limit=200'],
  'settings' => ['table' => 'site_settings', 'query' => 'select=key,value&is_public=eq.true&order=key.asc&limit=100'],
  'theme' => ['table' => 'liturgical_themes', 'query' => 'select=id,title,slug,season,primary_color,accent_color,background_color,image_url,start_date,end_date&status=in.(scheduled,active)&order=start_date.desc&limit=20'],
];

$type = trim((string) ($_GET['tipo'] ?? ''));
if (!isset($routes[$type])) {
  lvj_json_response(['success' => false, 'error' => 'INVALID_CONTENT_TYPE'], 400);
}

if (!function_exists('curl_init')) {
  error_log('LVJ content API: PHP cURL extension is unavailable.');
  lvj_json_response(['success' => false, 'error' => 'CONTENT_SOURCE_UNAVAILABLE'], 502);
}

$endpoint = $configUrl . '/rest/v1/' . $routes[$type]['table'] . '?' . $routes[$type]['query'];
if ($type === 'theme') {
  $today = gmdate('Y-m-d');
  $endpoint .= '&start_date=lte.' . rawurlencode($today) . '&end_date=gte.' . rawurlencode($today);
}

$curl = curl_init($endpoint);
curl_setopt_array($curl, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => ['Accept: application/json', 'apikey: ' . $publishableKey],
  CURLOPT_CONNECTTIMEOUT => 8,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_FOLLOWLOCATION => false,
  CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
]);
$body = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$failed = $body === false || curl_errno($curl) !== 0;
curl_close($curl);

if ($failed || $status < 200 || $status >= 300) {
  $safeBody = is_string($body) ? substr($body, 0, 700) : '';
  error_log('LVJ content API: Supabase read failed for ' . $type . ' (HTTP ' . $status . '): ' . preg_replace('/[\r\n]+/', ' ', $safeBody));
  lvj_json_response(['success' => false, 'error' => 'CONTENT_SOURCE_UNAVAILABLE'], 502);
}

$data = json_decode((string) $body, true);
if (!is_array($data)) {
  lvj_json_response(['success' => false, 'error' => 'CONTENT_SOURCE_INVALID'], 502);
}

lvj_json_response($data);
