#!/usr/bin/env python3
import os
from datetime import datetime

# Create markdown files for each language with QR codes

languages = {
    "ar": {
        "name": "العربية",
        "title": "نموذج تقييم ورشة العمل",
        "subtitle": "نظافة آمنة، الاشتراطات الصحية في خدمات التدليك والاسترخاء",
        "qr_path": "/home/ubuntu/workshop_evaluation_forms/qr_codes/qr_arabic.png",
        "questions": [
            "مدى رضاك عن محتوى الورشة؟",
            "كيف تقيم أداء المدرب؟",
            "ما مدى فائدة المواد المقدمة؟",
            "كيف تقيم التنظيم العام للورشة؟",
            "هل يمكنك تطبيق ما تعلمته في عملك؟",
            "هل توصي بهذه الورشة للآخرين؟",
        ],
        "labels": {
            "personal_info": "المعلومات الشخصية",
            "name": "الاسم",
            "company": "اسم المنشأة",
            "phone": "رقم التواصل",
            "email": "البريد الإلكتروني",
            "evaluation": "التقييم",
            "suggestions": "الاقتراحات والملاحظات",
            "rating_scale": "التقييم من 1 (ضعيف) إلى 5 (ممتاز)",
            "scan_qr": "امسح رمز QR للتعبئة الإلكترونية",
        },
        "dir": "rtl"
    },
    "en": {
        "name": "English",
        "title": "Workshop Evaluation Form",
        "subtitle": "Safe Hygiene, Health Requirements in Massage and Relaxation Services",
        "qr_path": "/home/ubuntu/workshop_evaluation_forms/qr_codes/qr_english.png",
        "questions": [
            "How satisfied are you with the workshop content?",
            "How do you rate the trainer's performance?",
            "How useful were the materials provided?",
            "How do you rate the overall organization?",
            "Can you apply what you learned in your work?",
            "Would you recommend this workshop to others?",
        ],
        "labels": {
            "personal_info": "Personal Information",
            "name": "Name",
            "company": "Company Name",
            "phone": "Contact Number",
            "email": "Email Address",
            "evaluation": "Evaluation",
            "suggestions": "Suggestions and Comments",
            "rating_scale": "Rating from 1 (Poor) to 5 (Excellent)",
            "scan_qr": "Scan QR Code for Online Submission",
        },
        "dir": "ltr"
    },
    "ml": {
        "name": "മലയാളം",
        "title": "വർക്ക്‌ഷോപ്പ് മൂല്യനിരണയ ഫോം",
        "subtitle": "സുരക്ഷിത ശുചിത്വം, തിരുമ്മൽ സേവനങ്ങളിലെ ആരോഗ്യ ആവശ്യകതകൾ",
        "qr_path": "/home/ubuntu/workshop_evaluation_forms/qr_codes/qr_malayalam.png",
        "questions": [
            "വർക്ക്‌ഷോപ്പ് ഉള്ളടക്കത്തിൽ നിങ്ങൾ എത്രത്തോളം സംതൃപ്തരാണ്?",
            "പരിശീലകന്റെ പ്രകടനം എങ്ങനെ വിലയിരുത്തും?",
            "നൽകിയ മെറ്റീരിയലുകൾ എത്രത്തോളം ഉപയോഗപ്രദമായിരുന്നു?",
            "മൊത്തത്തിലുള്ള സംഘടന എങ്ങനെ വിലയിരുത്തും?",
            "നിങ്ങൾ പഠിച്ചത് നിങ്ങളുടെ ജോലിയിൽ പ്രയോഗിക്കാൻ കഴിയുമോ?",
            "ഈ വർക്ക്‌ഷോപ്പ് മറ്റുള്ളവർക്ക് ശുപാർശ ചെയ്യുമോ?",
        ],
        "labels": {
            "personal_info": "വ്യക്തിഗത വിവരങ്ങൾ",
            "name": "പേര്",
            "company": "കമ്പനി പേര്",
            "phone": "ബന്ധപ്പെടാനുള്ള നമ്പർ",
            "email": "ഇമെയിൽ വിലാസം",
            "evaluation": "മൂല്യനിരണയം",
            "suggestions": "നിർദ്ദേശങ്ങളും അഭിപ്രായങ്ങളും",
            "rating_scale": "1 (മോശം) മുതൽ 5 (മികച്ചത്) വരെ റേറ്റിംഗ്",
            "scan_qr": "ഓൺലൈൻ സമർപ്പണത്തിനായി QR കോഡ് സ്കാൻ ചെയ്യുക",
        },
        "dir": "ltr"
    },
    "ne": {
        "name": "नेपाली",
        "title": "कार्यशाला मूल्यांकन फॉर्म",
        "subtitle": "सुरक्षित स्वच्छता, मालिश सेवाओं में स्वास्थ्य आवश्यकताएं",
        "qr_path": "/home/ubuntu/workshop_evaluation_forms/qr_codes/qr_nepali.png",
        "questions": [
            "कार्यशाला सामग्रीसँग तपाईं कति सन्तुष्ट हुनुहुन्छ?",
            "तपाईं प्रशिक्षकको प्रदर्शनलाई कसरी मूल्यांकन गर्नुहुन्छ?",
            "प्रदान गरिएका सामग्रीहरू कति उपयोगी थिए?",
            "तपाईं समग्र संगठनलाई कसरी मूल्यांकन गर्नुहुन्छ?",
            "के तपाईं आफ्नो काममा सिकेको कुरा लागू गर्न सक्नुहुन्छ?",
            "के तपाईं यो कार्यशाला अरूलाई सिफारिस गर्नुहुन्छ?",
        ],
        "labels": {
            "personal_info": "व्यक्तिगत जानकारी",
            "name": "नाम",
            "company": "कम्पनीको नाम",
            "phone": "सम्पर्क नम्बर",
            "email": "इमेल ठेगाना",
            "evaluation": "मूल्यांकन",
            "suggestions": "सुझाव र टिप्पणीहरू",
            "rating_scale": "1 (कमजोर) देखि 5 (उत्कृष्ट) सम्म मूल्यांकन",
            "scan_qr": "अनलाइन पेश गर्नको लागि QR कोड स्क्यान गर्नुहोस्",
        },
        "dir": "ltr"
    }
}

for lang_code, lang_data in languages.items():
    md_content = f"""# {lang_data['title']}

## {lang_data['subtitle']}

---

### {lang_data['labels']['scan_qr']}

![QR Code]({lang_data['qr_path']})

---

### {lang_data['labels']['personal_info']}

**{lang_data['labels']['name']}:** ___________________________

**{lang_data['labels']['company']}:** ___________________________

**{lang_data['labels']['phone']}:** ___________________________

**{lang_data['labels']['email']}:** ___________________________

---

### {lang_data['labels']['evaluation']}

*{lang_data['labels']['rating_scale']}*

"""
    
    for i, question in enumerate(lang_data['questions'], 1):
        md_content += f"""
**{i}. {question}**

⬜ 1   ⬜ 2   ⬜ 3   ⬜ 4   ⬜ 5

"""
    
    md_content += f"""
---

### {lang_data['labels']['suggestions']}

_____________________________________________

_____________________________________________

_____________________________________________

_____________________________________________

---

**Workshop Evaluation System • نظام تقييم ورش العمل**
"""
    
    # Write markdown file
    md_file = f"/home/ubuntu/workshop_evaluation_forms/form_{lang_code}.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    print(f"✓ Created {md_file}")

print("\n✓ All markdown files created successfully")
