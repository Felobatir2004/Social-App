
export const template = (code , name,subject) => `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .email-header {
            text-align: center;
            background-color: #007BFF;
            color: white;
            padding: 10px;
            border-radius: 5px 5px 0 0;
        }
        .email-body {
            padding: 20px;
        }
        .email-body h2 {
            color: #007BFF;
        }
        .activation-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .activation-button:hover {
            background-color: #0056b3;
        }
        .email-footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 10px 0;
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }
        .email-footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${subject}</h1>
        </div>
        <div class="email-body">
            <h2>Hello, ${name}</h2>
            <p>Thank you for signing up with [Your Company Name]. To complete your registration and start using your account, please click the button below:</p>
            <h2 class="activation-button">${code}</h2>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p>Best regards,<br>[Your Team/Company Name]</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 [Your Company Name]. All rights reserved.</p>
            <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>

`