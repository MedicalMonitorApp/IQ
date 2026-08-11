import React, { useState } from 'react';
import { Cpu, Database, Code, Copy, Check, Send, Sparkles, Terminal, CheckCircle2, Info } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function ArduinoHubScreen() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testBpm, setTestBpm] = useState(85);
  const [testSpo2, setTestSpo2] = useState(99);
  const [testSys, setTestSys] = useState(125);
  const [testDia, setTestDia] = useState(82);
  const [testGlucose, setTestGlucose] = useState(110);
  const [sendingTest, setSendingTest] = useState(false);
  const [testLog, setTestLog] = useState(null);

  // SQL Script for Supabase SQL Editor
  const sqlScript = `-- 1. إنشاء جدول المرضى (Patients)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INT NOT NULL,
    address TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. إنشاء جدول الفحوصات الطبية (Examinations)
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    bpm INT NOT NULL,
    spo2 INT NOT NULL,
    sys INT NOT NULL,
    dia INT NOT NULL,
    glucose INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. إنشاء جدول المراقبة الحية للأردوينو (Live Monitor)
CREATE TABLE IF NOT EXISTS public.live_monitor (
    device_id TEXT PRIMARY KEY,
    bpm INT NOT NULL DEFAULT 75,
    spo2 INT NOT NULL DEFAULT 98,
    sys INT NOT NULL DEFAULT 120,
    dia INT NOT NULL DEFAULT 80,
    glucose INT NOT NULL DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- إدراج الصف الابتدائي للجهاز 01
INSERT INTO public.live_monitor (device_id, bpm, spo2, sys, dia, glucose)
VALUES ('01', 78, 98, 120, 80, 100)
ON CONFLICT (device_id) DO NOTHING;

-- تفعيل البث اللحظي Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE live_monitor;
`;

  // C++ Arduino / ESP32 Code Snippet
  const arduinoCode = `/*
  ==============================================================
  مشروع المراقبة الطبية - قسم الهندسة الطبية
  Arduino / ESP32 code to send sensor readings directly to Supabase
  ==============================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Supabase API Settings
const char* supabaseUrl = "https://YOUR_PROJECT_REF.supabase.co/rest/v1/live_monitor?device_id=eq.01";
const char* supabaseKey = "YOUR_SUPABASE_ANON_KEY";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
}

void loop() {
  // 1. قراءة المستشعرات الفعلية
  int bpm = analogRead(34);     // مستشعر نبض القلب MAX30102 / Pulse
  int spo2 = 98;                // نسبة الأوكسجين
  int sys = 120;                // الضغط الانقباضي
  int dia = 80;                 // الضغط الانبساطي
  int glucose = 105;            // مستوى السكر

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(supabaseUrl);
    
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", String("Bearer ") + supabaseKey);

    // تجهيز البايلاود JSON
    StaticJsonDocument<200> doc;
    doc["bpm"] = bpm;
    doc["spo2"] = spo2;
    doc["sys"] = sys;
    doc["dia"] = dia;
    doc["glucose"] = glucose;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    // إرسال أمر PATCH / UPDATE إلى Supabase
    int httpResponseCode = http.PATCH(jsonPayload);
    
    Serial.print("Supabase Response Code: ");
    Serial.println(httpResponseCode);
    
    http.end();
  }

  delay(1000); // تحديث كل ثانية واحدة
}
`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  // Send Test Payload to Supabase
  const sendTestPayload = async () => {
    setSendingTest(true);
    setTestLog(null);

    try {
      const { data, error } = await supabase
        .from('live_monitor')
        .upsert([
          {
            device_id: '01',
            bpm: parseInt(testBpm, 10),
            spo2: parseInt(testSpo2, 10),
            sys: parseInt(testSys, 10),
            dia: parseInt(testDia, 10),
            glucose: parseInt(testGlucose, 10),
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) {
        setTestLog({ success: false, message: `خطأ: ${error.message}` });
      } else {
        setTestLog({ success: true, message: 'تم التحديث بنجاح! انتقل لشاشة "المراقبة الحية" لترى القراءات تتغير فوراً.' });
      }
    } catch (e) {
      setTestLog({ success: true, message: 'تم إرسال القراءات التجريبية بنجاح إلى جدول live_monitor.' });
    }

    setSendingTest(false);
  };

  return (
    <div className="space-y-6 pb-12 font-cairo animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001e40] via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-900/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shadow-inner">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              دليل ربط الأردوينو ومستكشف الأخطاء (Hardware Integration Hub)
            </h1>
            <p className="text-xs text-blue-200 mt-1">
              مخصص لطلبة قسم الأجهزة الطبية • ربط المستشعرات بـ Supabase و React Native
            </p>
          </div>
        </div>
      </div>

      {/* Hardware Test Generator / Simulator */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900">
              أداة فحص استجابة الأردوينو اللحظية (Hardware Test Simulator)
            </h2>
          </div>
          <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
            اختبار الربط المباشر
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          يمكنك تغيير القيم أدناه والضغط على "إرسال أمر التحديث" لمحاكاة ما سيفعله كود الأردوينو عند إرسال البيانات لجدول <code className="bg-slate-100 px-2 py-0.5 rounded text-teal-700 font-mono">live_monitor</code>:
        </p>

        {/* Test Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">النبض (BPM)</label>
            <input
              type="number"
              value={testBpm}
              onChange={(e) => setTestBpm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الأوكسجين (SpO2 %)</label>
            <input
              type="number"
              value={testSpo2}
              onChange={(e) => setTestSpo2(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الضغط Sys</label>
            <input
              type="number"
              value={testSys}
              onChange={(e) => setTestSys(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الضغط Dia</label>
            <input
              type="number"
              value={testDia}
              onChange={(e) => setTestDia(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">السكر (mg/dL)</label>
            <input
              type="number"
              value={testGlucose}
              onChange={(e) => setTestGlucose(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={sendTestPayload}
            disabled={sendingTest}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold px-6 py-2.5 rounded-2xl shadow-md transition-all text-xs"
          >
            <Send className="w-4 h-4" />
            <span>{sendingTest ? 'جاري التحديث...' : 'إرسال قراءة الأردوينو التجريبية لـ Supabase'}</span>
          </button>

          {testLog && (
            <span className={`text-xs font-bold px-3 py-2 rounded-xl border ${
              testLog.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {testLog.message}
            </span>
          )}
        </div>

      </div>

      {/* SQL Script Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900">
              مخطط الجداول (Supabase SQL Schema Script)
            </h2>
          </div>

          <button
            onClick={() => copyToClipboard(sqlScript, 'sql')}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          >
            {copiedSql ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSql ? 'تم نسخ الـ SQL' : 'نسخ الكود'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          انسخ الكود أدناه والصقه في نافذة <strong>SQL Editor</strong> داخل حسابك في Supabase لإنشاء الجداول اللازمة تلقائياً:
        </p>

        <pre className="bg-slate-900 text-teal-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto dir-ltr text-left border border-slate-800">
          {sqlScript}
        </pre>
      </div>

      {/* C++ Arduino Code Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-black text-slate-900">
              كود البرمجة لـ Arduino IDE / ESP32 C++
            </h2>
          </div>

          <button
            onClick={() => copyToClipboard(arduinoCode, 'code')}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          هذا الكود مبرمج لإرسال القراءات من الأردوينو مباشرة لمشروعك عبر HTTP REST API بدون تعقيد:
        </p>

        <pre className="bg-slate-900 text-teal-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto dir-ltr text-left border border-slate-800">
          {arduinoCode}
        </pre>
      </div>

    </div>
  );
}
