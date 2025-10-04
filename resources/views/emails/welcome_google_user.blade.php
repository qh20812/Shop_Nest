<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Shop Nest</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .welcome-message {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .credentials-box {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .credential-item {
            margin: 10px 0;
            font-weight: bold;
        }
        .password {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 16px;
            color: #856404;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .info {
            background-color: #d1ecf1;
            border-left: 4px solid #17a2b8;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #666;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }
        .btn:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Shop Nest</div>
            <h1>Welcome to Shop Nest!</h1>
        </div>

        <div class="welcome-message">
            <p>Hello <strong>{{ $user->first_name }} {{ $user->last_name }}</strong>,</p>
            <p>Welcome to Shop Nest! Your account has been successfully created using your Google account.</p>
        </div>

        <div class="credentials-box">
            <h3>Your Account Details:</h3>
            <div class="credential-item">
                <strong>Email:</strong> {{ $user->email }}
            </div>
            <div class="credential-item">
                <strong>Username:</strong> {{ $user->username }}
            </div>
            <div class="credential-item">
                <strong>Temporary Password:</strong>
                <div class="password">{{ $password }}</div>
            </div>
        </div>

        <div class="warning">
            <h4>⚠️ Important Security Notice</h4>
            <p>This is a temporary password generated for your account. For security reasons, we strongly recommend that you:</p>
            <ul>
                <li>Log in to your account using this temporary password</li>
                <li>Change your password to something memorable and secure</li>
                <li>Keep this password safe until you change it</li>
            </ul>
        </div>

        <div class="info">
            <h4>ℹ️ How to Change Your Password</h4>
            <ol>
                <li>Log in to your Shop Nest account</li>
                <li>Go to your Profile Settings</li>
                <li>Click on "Change Password"</li>
                <li>Enter your new secure password</li>
            </ol>
        </div>

        <div style="text-align: center;">
            <a href="{{ url('/login') }}" class="btn">Log In to Your Account</a>
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Thank you for choosing Shop Nest!</p>
            <hr>
            <p><small>This email was sent because you registered for an account on Shop Nest using Google OAuth.</small></p>
        </div>
    </div>
</body>
</html>