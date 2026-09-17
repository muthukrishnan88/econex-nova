# ECONEX NOVA - Demo Mode Information

## ⚠️ CURRENT MODE: DEVELOPMENT (MOCK)

Server running in **MOCK MODE** - Not analyzing actual images.

---

## 🎭 HOW MOCK MODE WORKS

### Cannot Analyze Images

Mock provider **cannot** see or understand image content.

Returns pre-built scenarios regardless of what image you upload.

### Predictable Cycle

Scenarios cycle in order:

**Upload 1:** Air Pollution (Open Waste Burning)
- Smoke plume, active burning
- Concern: 82/100 (High)
- Primary: Air Pollution
- Secondary: Land Pollution

**Upload 2:** Water Pollution (Sewage/Industrial)
- Contaminated water, discharge
- Concern: 85/100 (High)
- Primary: Water Pollution
- Secondary: Land Pollution

**Upload 3:** Plastic Pollution (Littering)
- Plastic waste accumulation
- Concern: 68/100 (Moderate-High)
- Primary: Plastic Pollution
- Secondary: Land Pollution

**Upload 4:** Industrial Air Pollution
- Factory emissions, vehicle exhaust
- Concern: 71/100 (Moderate-High)
- Primary: Industrial/Vehicle Emissions
- Secondary: (varies)

**Upload 5:** Cycles back to scenario 1 (Air Pollution)

---

## ✅ WHAT THIS DEMONSTRATES

### Evidence-First Features:

- ✓ Maximum 1 primary + 2 secondary types
- ✓ High precision (not 8-10 random categories)
- ✓ Visual evidence lists
- ✓ Confidence scores
- ✓ Concern scoring (0-100)
- ✓ Health impact analysis
- ✓ Environmental impact breakdown
- ✓ Pollution pathways
- ✓ Reduction/prevention plans
- ✓ Action priority (Now/Next/Long Term)

### UI/UX Features:

- ✓ Professional environmental intelligence design
- ✓ Circular concern score visualization
- ✓ Evidence-first precision messaging
- ✓ Anti-panic calm language
- ✓ Measurement transparency
- ✓ AI transparency section
- ✓ Limitations disclosure

---

## 🚀 UPGRADE TO REAL AI

For actual image analysis (analyzes what you upload):

### Requirements:

1. **AWS Account** with Bedrock access
2. **Claude 3.5 Sonnet** enabled in Bedrock
3. **AWS Credentials** (Access Key + Secret)

### Setup:

1. **Get AWS Credentials:**
   ```
   AWS Console → IAM → Create User
   Attach Policy: AmazonBedrockFullAccess
   Create Access Key → Copy credentials
   ```

2. **Update .env:**
   ```bash
   cd econex-image-server
   cp .env.example .env
   nano .env
   ```

   Set:
   ```
   NODE_ENV=production
   AI_PROVIDER=bedrock
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
   ```

3. **Install AWS SDK:**
   ```bash
   npm install @aws-sdk/client-bedrock-runtime
   ```

4. **Restart Server:**
   ```bash
   npm start
   ```

5. **Test:**
   Upload actual pollution images → Get real analysis

---

## 💰 COST ESTIMATE

### AWS Bedrock Pricing (Claude 3.5 Sonnet):

**Input:** ~$3 per million tokens  
**Output:** ~$15 per million tokens

**Per Image Analysis:**
- Input: ~1,500 tokens (image + prompt)
- Output: ~1,000 tokens (analysis)
- **Cost: ~$0.02 per analysis**

**1,000 analyses:** ~$20  
**10,000 analyses:** ~$200

AWS Free Tier: First 2 months free (limited usage)

---

## 🎯 WHEN TO USE EACH MODE

### Mock Mode (Current):

✅ **Use for:**
- Demonstrations
- UI/UX testing
- Feature showcasing
- Development
- No AWS account

❌ **Don't use for:**
- Real pollution analysis
- Production deployment
- Actual environmental monitoring
- Research/studies

### Bedrock Mode (Real AI):

✅ **Use for:**
- Real image analysis
- Production deployment
- Actual environmental monitoring
- Research projects
- Field work

❌ **Don't use for:**
- Free tier exceeded (costs money)
- Offline environments (needs internet)

---

## 📊 COMPARISON

| Feature | Mock Mode | Bedrock Mode |
|---------|-----------|--------------|
| **Image Analysis** | ❌ Pre-built scenarios | ✅ Real AI vision |
| **Accuracy** | Demo only | High precision |
| **Cost** | Free | ~$0.02/image |
| **Setup** | None | AWS account |
| **Internet** | Not needed | Required |
| **Speed** | Instant | 2-5 seconds |
| **Evidence-First** | ✅ Demonstrated | ✅ Actual analysis |

---

## 🔧 CURRENT STATUS

```
Mode: DEVELOPMENT (MOCK)
AI Provider: Mock scenarios
Image Analysis: ❌ Not available
Scenario Cycling: ✅ Predictable order
Evidence-First: ✅ Demonstrated
Cost: FREE
```

---

## 📖 DOCUMENTATION

- **Evidence-First Features:** `POLLUTION-ACCURACY-UPGRADE.md`
- **Deployment Guide:** `DEPLOY-QUICK.md`
- **Quick Start:** `START-HERE.md`

---

## 🌱 ECONEX NOVA

**Current Mode:** Demo (Mock Scenarios)

**Upgrade to Real AI:** Set `AI_PROVIDER=bedrock` in `.env`

**Repository:** https://github.com/muthukrishnan88/econex-nova
