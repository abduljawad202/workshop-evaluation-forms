#!/bin/bash

# Get the dev server URL
DEV_URL="https://3000-i62vvg93mtj500unhxayj-2633c58a.manus-asia.computer"

# Create QR codes directory
mkdir -p /home/ubuntu/workshop_evaluation_forms/qr_codes

# Generate QR codes for each language
qrencode -o /home/ubuntu/workshop_evaluation_forms/qr_codes/qr_arabic.png -s 10 "${DEV_URL}/form/ar"
qrencode -o /home/ubuntu/workshop_evaluation_forms/qr_codes/qr_english.png -s 10 "${DEV_URL}/form/en"
qrencode -o /home/ubuntu/workshop_evaluation_forms/qr_codes/qr_malayalam.png -s 10 "${DEV_URL}/form/ml"
qrencode -o /home/ubuntu/workshop_evaluation_forms/qr_codes/qr_nepali.png -s 10 "${DEV_URL}/form/ne"

echo "✓ QR codes generated successfully"
ls -lh /home/ubuntu/workshop_evaluation_forms/qr_codes/
