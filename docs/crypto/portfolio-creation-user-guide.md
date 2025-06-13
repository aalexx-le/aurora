# Crypto Portfolio Creation User Guide

## Introduction

The Xela Finance Management System allows you to connect your cryptocurrency exchange accounts to automatically track your portfolio balance, performance, and trading history. This guide will walk you through the process of creating and managing your crypto portfolios.

## Supported Exchanges

### Exchanges with Full Setup Guides (20+)

We provide comprehensive setup guides for the following major exchanges:

#### Global Exchanges
- **Binance** - World's largest crypto exchange
- **OKX** - Advanced trading platform (requires passphrase)
- **MEXC** - Global digital asset exchange
- **Gate.io** - Established crypto trading platform
- **Bybit** - Derivatives and spot trading
- **Bitget** - Copy trading platform (requires passphrase)

#### US-Focused Exchanges
- **Coinbase** - User-friendly US exchange (requires passphrase)
- **Kraken** - Secure US-based exchange
- **Gemini** - Regulated US exchange

#### Regional Exchanges
- **Upbit** - South Korea's largest exchange
- **Coincheck** - Popular Japanese exchange
- **bitFlyer** - Japan's leading Bitcoin exchange
- **Bitstamp** - European crypto exchange

#### Other Popular Exchanges
- **KuCoin** - Wide variety of altcoins (requires passphrase)
- **Bitfinex** - Professional trading platform
- **HTX (Huobi)** - Global digital asset exchange
- **Crypto.com** - All-in-one crypto platform
- **Poloniex** - Established altcoin exchange
- **BitMart** - Global digital asset trading platform

### Additional Supported Exchanges (100+)

The system supports over 100 additional exchanges through the CCXT library, including but not limited to:
- Binance US, Bitrue, AscendEX, ProBit, LBank, Phemex, WOO, Deribit, BingX, WhiteBIT, and many more.

## Getting Started

### Step 1: Access Portfolio Creation

1. Navigate to the **Finance** section in your dashboard
2. Click on **Investment** → **Crypto Portfolio**
3. Click the **"New Portfolio"** button

### Step 2: Select Your Exchange

1. Choose your exchange from the dropdown menu
2. The form will automatically adapt based on your selection
3. If your exchange requires a passphrase, an additional field will appear

### Step 3: Create API Keys

Each exchange has its own process for creating API keys. Here's the general process:

#### General API Key Creation Steps

1. **Log into your exchange account**
2. **Navigate to API Management**
   - Usually found in Account Settings, Security, or API sections
3. **Create a new API key**
   - Give it a descriptive name (e.g., "Xela Read-Only")
4. **Set permissions to READ-ONLY**
   - ✅ Enable: View/Read permissions
   - ❌ Disable: Trading permissions
   - ❌ Disable: Withdrawal permissions
5. **Save your credentials securely**
   - API Key
   - Secret Key
   - Passphrase (if required)

#### Exchange-Specific Guides

When you select an exchange, the system will show:
- Direct link to the exchange's API settings page
- Step-by-step instructions specific to that exchange
- Important notes and warnings
- Required permissions checklist

### Step 4: Enter Your Credentials

1. **Portfolio Name** (Optional)
   - Give your portfolio a custom name
   - Default: "[Exchange Name] Portfolio"

2. **API Key** (Required)
   - Enter the API key from your exchange
   - This is typically a long string of letters and numbers

3. **Secret Key** (Required)
   - Enter the secret key from your exchange
   - Keep this secure and never share it

4. **Passphrase** (Required for some exchanges)
   - Only appears for: OKX, Coinbase, KuCoin, Bitget
   - Enter the passphrase you created when setting up the API key

### Step 5: Create Portfolio

1. Review your information
2. Click **"Create Portfolio"**
3. The system will begin the portfolio creation process

## Portfolio Creation Process

### Real-Time Progress Tracking

Once you submit the form, you'll see a progress indicator showing:

1. **Validation** (0-20%)
   - Verifying exchange support
   - Checking credential format

2. **Authentication** (20-40%)
   - Testing API connection
   - Verifying permissions

3. **Balance Retrieval** (40-60%)
   - Fetching your account balances
   - Processing asset information

4. **Database Storage** (60-80%)
   - Saving portfolio configuration
   - Storing balance data

5. **Completion** (80-100%)
   - Finalizing setup
   - Enabling real-time tracking

### Success Confirmation

When successful, you'll see:
- ✅ "Portfolio created successfully"
- Your portfolio will appear in the portfolio list
- Balance data will start populating immediately

## Error Handling

### Common Errors and Solutions

#### 1. Invalid API Credentials

**Error**: "Invalid API key" or "Authentication failed"

**Solutions**:
- Double-check your API key and secret
- Ensure you copied the entire key without spaces
- Verify the API key is active on the exchange
- Try regenerating the API key

#### 2. Insufficient Permissions

**Error**: "Insufficient permissions" or "API permissions error"

**Solutions**:
- Return to exchange API settings
- Ensure READ permissions are enabled
- Check that trading/withdrawal are disabled
- Some exchanges require specific permission combinations

#### 3. Rate Limit Exceeded

**Error**: "Rate limit exceeded"

**Solutions**:
- Wait a few minutes before retrying
- The system will automatically retry after the limit resets
- Contact support if the issue persists

#### 4. Passphrase Required

**Error**: "Passphrase is required for [Exchange]"

**Solutions**:
- Ensure you've entered the passphrase
- Verify it matches exactly what you set on the exchange
- Passphrases are case-sensitive

### Error Recovery Options

When an error occurs, you'll see recovery options:

1. **Retry**
   - Attempts the operation again
   - Useful for temporary network issues

2. **Update Credentials**
   - Opens a form to enter new API credentials
   - Use this if you've regenerated your API keys

3. **Contact Support**
   - Creates a support ticket
   - Include error details for faster resolution

## Security Best Practices

### 1. Use Read-Only Permissions

**Always** create API keys with only read permissions:
- ✅ View account balance
- ✅ View trade history
- ❌ Place trades
- ❌ Withdraw funds

### 2. IP Whitelisting

For enhanced security:
- Enable IP whitelisting on your exchange
- Add Xela's IP addresses (provided in setup)
- This prevents unauthorized access

### 3. Regular Key Rotation

- Rotate API keys every 3-6 months
- Delete old keys after creating new ones
- Update credentials in Xela immediately

### 4. Monitor API Access

- Regularly check API access logs on your exchange
- Look for any unauthorized access attempts
- Revoke keys if you notice suspicious activity

## Managing Your Portfolios

### Viewing Portfolio Details

- Click on any portfolio to see detailed information
- View current balances by asset
- Track performance over time
- Analyze profit/loss metrics

### Updating Portfolio Credentials

If you need to update API keys:

1. Find the portfolio in your list
2. Click the settings icon
3. Select "Update Credentials"
4. Enter new API information
5. Save changes

### Deactivating a Portfolio

To temporarily stop tracking:

1. Select the portfolio
2. Click "Deactivate"
3. The portfolio remains saved but stops syncing
4. Reactivate anytime to resume tracking

## Frequently Asked Questions

### Q: Is it safe to provide my API keys?

**A:** Yes, when configured correctly:
- We only request read-only permissions
- All credentials are encrypted using AES-256-GCM
- We never have access to withdraw or trade
- You can revoke access anytime from your exchange

### Q: How often does the portfolio sync?

**A:** 
- Initial sync: Immediately after creation
- Regular updates: Every 5 minutes
- Manual refresh: Available anytime
- Real-time updates for price changes

### Q: Can I connect multiple accounts from the same exchange?

**A:** Yes, you can create multiple portfolios:
- Use different API keys for each account
- Give each portfolio a unique name
- All portfolios sync independently

### Q: What if my exchange isn't listed?

**A:** 
- Check if it's in the "Additional Exchanges" list
- Contact support to request new exchange support
- We regularly add new exchanges based on demand

### Q: Why do some exchanges require a passphrase?

**A:** 
- Extra security layer required by the exchange
- Prevents unauthorized API usage
- Must match exactly what you set during API creation
- Cannot be recovered if lost

## Troubleshooting Checklist

Before contacting support, please check:

- [ ] API key is active and not expired
- [ ] Correct permissions are set (read-only)
- [ ] No typos in API key or secret
- [ ] Passphrase is correct (if required)
- [ ] IP whitelist includes Xela (if enabled)
- [ ] Exchange services are operational
- [ ] You're using the latest version of the app

## Getting Help

### Support Channels

1. **In-App Support**
   - Click "Contact Support" in error messages
   - Automatic error details included

2. **Help Center**
   - Detailed guides for each exchange
   - Video tutorials available

3. **Community Forum**
   - Connect with other users
   - Share tips and solutions

### Information to Provide

When contacting support, include:
- Exchange name
- Error message (exact text)
- Time of error
- Steps you've already tried
- Screenshot (without showing keys)

## Advanced Features

### Portfolio Aggregation

- View combined balances across all exchanges
- Unified performance tracking
- Consolidated reporting

### Historical Data

- Import past trading history
- Calculate historical profits
- Generate tax reports

### Alerts and Notifications

- Balance change alerts
- Large transaction notifications
- Portfolio performance updates

## Conclusion

Creating a crypto portfolio in Xela is designed to be secure and straightforward. By following this guide and using read-only API keys, you can safely track all your cryptocurrency investments in one place. If you encounter any issues, our support team is here to help you get set up successfully. 