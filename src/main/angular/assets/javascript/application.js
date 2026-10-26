// State variables
let currentSenderType = 'masking';
let currentPricingType = 'nonmasking';

// Rates in BDT per SMS based on volume
const rates = {
    nonmasking: [
        { limit: 5000, rate: 0.35 },
        { limit: 25000, rate: 0.30 },
        { limit: 100000, rate: 0.28 },
        { limit: Infinity, rate: 0.25 }
    ],
    masking: [
        { limit: 5000, rate: 0.50 },
        { limit: 25000, rate: 0.45 },
        { limit: 100000, rate: 0.40 },
        { limit: Infinity, rate: 0.38 }
    ],
    otp: [
        { limit: 5000, rate: 0.40 },
        { limit: 25000, rate: 0.35 },
        { limit: 100000, rate: 0.32 },
        { limit: Infinity, rate: 0.30 }
    ]
};

// 1. Live SMS Character & Parts Counter Simulator
function updateSMSStats() {
    const text = document.getElementById('sms-text').value;
    const charCountEl = document.getElementById('char-count');
    const partsCountEl = document.getElementById('parts-count');
    const estCostEl = document.getElementById('est-cost');
    const encodingBadge = document.getElementById('encoding-badge');

    // Detect Unicode (Bangla, Arabic, Emoji etc.)
    const isUnicode = /[^\u0000-\u007F]/.test(text);

    if (isUnicode) {
        encodingBadge.innerText = 'Unicode (Bangla)';
        encodingBadge.className = 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30';
    } else {
        encodingBadge.innerText = 'GSM-7 (English)';
        encodingBadge.className = 'text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400';
    }

    const charCount = text.length;
    charCountEl.innerText = charCount;

    // Calculate Parts
    let parts = 1;
    if (isUnicode) {
        if (charCount > 70) {
            parts = Math.ceil(charCount / 67);
        }
    } else {
        if (charCount > 160) {
            parts = Math.ceil(charCount / 153);
        }
    }

    partsCountEl.innerText = `${parts} SMS`;

    // Calculate Single SMS cost
    const perSmsRate = currentSenderType === 'masking' ? 0.45 : 0.30;
    const totalEst = (parts * perSmsRate).toFixed(2);
    estCostEl.innerText = `৳${totalEst}`;
}

function setSenderType(type) {
    currentSenderType = type;
    const maskingBtn = document.getElementById('btn-masking');
    const nonmaskingBtn = document.getElementById('btn-nonmasking');

    if (type === 'masking') {
        maskingBtn.className = 'py-2 px-3 rounded-lg text-xs font-medium border border-indigo-500 bg-indigo-600/20 text-indigo-300 flex items-center justify-center gap-1.5 transition-all';
        nonmaskingBtn.className = 'py-2 px-3 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/50 text-slate-400 flex items-center justify-center gap-1.5 transition-all';
    } else {
        nonmaskingBtn.className = 'py-2 px-3 rounded-lg text-xs font-medium border border-indigo-500 bg-indigo-600/20 text-indigo-300 flex items-center justify-center gap-1.5 transition-all';
        maskingBtn.className = 'py-2 px-3 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/50 text-slate-400 flex items-center justify-center gap-1.5 transition-all';
    }
    updateSMSStats();
}

// 2. Simulate Sending SMS Animation
function simulateSendSMS() {
    const btn = document.getElementById('send-demo-btn');
    const responseDiv = document.getElementById('demo-response');
    const phoneVal = document.getElementById('phone-number').value;

    if (!phoneVal || phoneVal.length < 10) {
        alert('Please enter a valid 10-digit Bangladeshi mobile number.');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing & Dispatching...`;

    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Test SMS Now`;

        // Set DLR values
        document.getElementById('dlr-id').innerText = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
        document.getElementById('dlr-time').innerText = new Date().toLocaleTimeString();

        responseDiv.classList.remove('hidden');
    }, 1200);
}

// 3. Dynamic Pricing Calculator
function setPricingType(type) {
    currentPricingType = type;
    const types = ['nonmasking', 'masking', 'otp'];
    types.forEach(t => {
        const btn = document.getElementById(`type-${t}`);
        if (t === type) {
            btn.className = 'flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all bg-indigo-600 text-white shadow';
        } else {
            btn.className = 'flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all';
        }
    });
    calculatePrice();
}

function calculatePrice() {
    const quantity = parseInt(document.getElementById('sms-slider').value);
    document.getElementById('quantity-display').innerText = `${quantity.toLocaleString()} SMS`;

    // Find applicable rate tier
    const tierList = rates[currentPricingType];
    let applicableRate = 0.35;
    for (let i = 0; i < tierList.length; i++) {
        if (quantity <= tierList[i].limit) {
            applicableRate = tierList[i].rate;
            break;
        }
    }

    const totalPrice = Math.round(quantity * applicableRate);
    document.getElementById('per-sms-rate').innerText = `৳${applicableRate.toFixed(2)}`;
    document.getElementById('total-price-bdt').innerText = `৳${totalPrice.toLocaleString()}`;
}

// 4. Developer Code Snippet Switcher
const codeSnippets = {
    curl: `curl -X POST https://api.textersms.com/v1/send \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sender_id": "YourBrand",
    "recipient": "8801712345678",
    "type": "plain",
    "message": "Your OTP code is 9841. Valid for 5 minutes."
  }'`,
    node: `const axios = require('axios');

axios.post('https://api.textersms.com/v1/send', {
    sender_id: 'YourBrand',
    recipient: '8801712345678',
    message: 'Your OTP code is 9841.'
}, {
    headers: { 'Authorization': 'Bearer YOUR_API_TOKEN' }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));`,
    php: `<?php
$ch = curl_init("https://api.textersms.com/v1/send");
$data = array(
    "sender_id" => "YourBrand",
    "recipient" => "8801712345678",
    "message"   => "Your OTP code is 9841."
);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer YOUR_API_TOKEN', 'Content-Type: application/json'));
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
    python: `import requests

url = "https://api.textersms.com/v1/send"
headers = {"Authorization": "Bearer YOUR_API_TOKEN"}
payload = {
    "sender_id": "YourBrand",
    "recipient": "8801712345678",
    "message": "Your OTP code is 9841."
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
};

function switchCodeTab(lang) {
    const tabs = ['curl', 'node', 'php', 'python'];
    tabs.forEach(t => {
        const tabBtn = document.getElementById(`tab-${t}`);
        if (t === lang) {
            tabBtn.className = 'px-3 py-1 rounded-lg text-xs font-mono bg-indigo-600 text-white';
        } else {
            tabBtn.className = 'px-3 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white';
        }
    });
    document.getElementById('code-block').innerText = codeSnippets[lang];
}

function copyCodeSnippet() {
    const codeText = document.getElementById('code-block').innerText;
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = codeText;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    const copyBtnText = document.getElementById('copy-btn-text');
    copyBtnText.innerText = 'Copied!';
    setTimeout(() => {
        copyBtnText.innerText = 'Copy Code';
    }, 2000);
}

// Login Modal Control
function toggleLoginModal(show) {
    const modal = document.getElementById('login-modal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

// Initialize on Load
window.onload = function() {
    updateSMSStats();
    calculatePrice();
};