<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["success" => false, "error" => "Invalid request"]);
  exit;
}

// =====================
// SANITIZE INPUT
// =====================
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phoneRaw = trim($_POST['phone'] ?? '');
$phone = preg_replace('/[^\d+]/', '', $phoneRaw);
$message = trim($_POST['message'] ?? '');

// =====================
// REQUIRED FIELDS
// =====================
if ($name === '') {
  echo json_encode(["success" => false, "error" => "Name is required"]);
  exit;
}

if ($email === '') {
  echo json_encode(["success" => false, "error" => "Email is required"]);
  exit;
}

if ($phone === '') {
  echo json_encode(["success" => false, "error" => "Phone is required"]);
  exit;
}

if ($message === '') {
  echo json_encode(["success" => false, "error" => "Message is required"]);
  exit;
}

// =====================
// VALIDATION
// =====================
if (!preg_match('/^[a-zA-Z\s]{2,50}$/', $name)) {
  echo json_encode(["success" => false, "error" => "Invalid name"]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(["success" => false, "error" => "Invalid email"]);
  exit;
}

if (!preg_match('/^\+?[0-9]{10,15}$/', $phone)) {
  echo json_encode(["success" => false, "error" => "Invalid phone number"]);
  exit;
}

// =====================
// SPAM PROTECTION
// =====================
if (!empty($_POST['company_website'])) {
  echo json_encode(["success" => false, "error" => "Spam detected"]);
  exit;
}

$formTime = intval($_POST['form_time'] ?? 0);
if ($formTime <= 0 || (int)(microtime(true) * 1000) - $formTime < 3000) {
  echo json_encode(["success" => false, "error" => "Submission too fast"]);
  exit;
}

// =====================
// EMAIL SEND
// =====================
$to = "info@chronotales.org";
$subject = "New Enquiry - Chronotales";

$emailBody = "New Enquiry Received:\n\n";
$emailBody .= "Name: {$name}\n";
$emailBody .= "Email: {$email}\n";
$emailBody .= "Phone: {$phone}\n\n";
$emailBody .= "Message:\n{$message}\n";

$fromEmail = "no-reply@chronotales.org";
$headers = "From: Chronotales <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = @mail($to, $subject, $emailBody, $headers);

// =====================
// LOGGING
// =====================
$logDir = __DIR__ . '/logs';
$logFile = $logDir . '/leads.txt';

if (!is_dir($logDir)) {
  mkdir($logDir, 0755, true);
}

$logEntry = [
  'time' => date('Y-m-d H:i:s'),
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'message' => $message,
  'mail_sent' => $mailSent ? 'yes' : 'no'
];

$line = json_encode($logEntry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

// =====================
// RESPONSE
// =====================
if (!$mailSent) {
  echo json_encode([
    "success" => true,
    "warning" => "Enquiry saved, but email delivery could not be confirmed"
  ]);
  exit;
}

echo json_encode([
  "success" => true
]);