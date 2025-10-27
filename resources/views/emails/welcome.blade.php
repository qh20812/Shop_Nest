<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Shop_Nest</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #1976D2, #42A5F5);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #1976D2;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Welcome to Shop_Nest!</h1>
        <p>Thank you for joining our marketplace community</p>
    </div>
    
    <div class="content">
        <h2>Hello {{ $user->username }}!</h2>
        
        <p>We're excited to have you on board! Your account has been successfully created with the email address: <strong>{{ $user->email }}</strong></p>
        
        <h3>What's Next?</h3>
        <ul>
            <li>✅ <strong>Complete your profile</strong> - Add your name, phone number, and other details</li>
            <li>🛍️ <strong>Start shopping</strong> - Browse thousands of products from verified sellers</li>
            <li>💼 <strong>Become a seller</strong> - List your own products and start earning</li>
            <li>🚚 <strong>Track your orders</strong> - Stay updated on all your purchases</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $loginUrl }}" class="button">Login Now</a>
        </div>
        
        <p><strong>Important:</strong> Your username is <code>{{ $user->username }}</code>. You can change this later in your profile settings.</p>
        
        <p>If you have any questions or need assistance, our support team is here to help!</p>
        
        <p>Happy shopping!<br>
        <strong>The Shop_Nest Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This email was sent to {{ $user->email }}. If you didn't create this account, please ignore this email.</p>
        <p>&copy; {{ date('Y') }} Shop_Nest. All rights reserved.</p>
    </div>
</body>
</html>