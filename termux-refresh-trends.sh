#!/bin/bash

echo "⏳ جاري بدء تحديث بيانات تطبيق Trenda World..."
echo "📦 معرف الحزمة المستهدف: com.trendatlas.world"

SCRIPT_DIR="$(dirname "$0")"

if ping -c 1 8.8.8.8 &> /dev/null; then
    echo "🌐 الاتصال بالإنترنت مستقر."
else
    echo "❌ خطأ: لا يوجد اتصال بالإنترنت، يرجى تشغيل الشبكة في Termux."
    exit 1
fi

if [ -f "$SCRIPT_DIR/fetch.js" ]; then
    node "$SCRIPT_DIR/fetch.js"
    echo "✅ تم دفع تحديثات الترندات بنجاح إلى قاعدة بيانات Firestore!"
else
    echo "⚠️ تنبيه: ملف fetch.js غير موجود في هذا المسار لتمرير البيانات للـ Package الجديد."
fi
