<?php
header('Content-Type: application/json');

// Spam protection: honeypot
if (!empty($_POST['fax'])) {
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Name, email, and phone are required.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}
if (!preg_match('/^[0-9+\-\s]+$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number format.']);
    exit;
}

$to = 'hello@chronotales.org';
$subject = 'New Contact from Chronotales Website';
$body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
$headers = "From: $email\r\nReply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Mail server error. Please try later.']);
}
?>