<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitizar datos
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r", "\n"), array(" ", " "), $name);

    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

    $phone = trim($_POST["phone"]);

    $message = trim($_POST["message"]);

    // Validación
    if (
        empty($name) ||
        empty($phone) ||
        empty($message) ||
        !filter_var($email, FILTER_VALIDATE_EMAIL)
    ) {

        http_response_code(400);
        echo "Please complete the form correctly.";
        exit;
    }

    // Correo destino
    $recipient = "contact@megatx.us";

    // Asunto
    $subject = "New Contact Form Message";

    // Contenido
    $email_content = "
    Name: $name

    Email: $email

    Phone: $phone

    Message:
    $message
    ";

    // Headers
    $headers = "From: Website Contact <noreply@tudominio.com>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Enviar
    if (mail($recipient, $subject, $email_content, $headers)) {

        http_response_code(200);
        echo "Thank you! Your message has been sent.";
    } else {

        http_response_code(500);
        echo "Oops! Something went wrong.";
    }
} else {

    http_response_code(403);
    echo "There was a problem with your submission.";
}
