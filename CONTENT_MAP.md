# خريطة المحتوى — Linux Master Lab

## فلسفة الأوامر

### Track 01 — احفظ وأتقن
48 أمرًا/نمطًا يوميًا. المطلوب:
- معرفة وظيفة الأمر من الذاكرة.
- تذكر الصيغة والخيارات اليومية المهمة.
- كتابة الأمر دون نسخ.
- تفسير نتيجة التنفيذ.

### Track 02 — المرجع المتقدم
174 أداة/أمرًا في 11 مجالًا. المطلوب ليس الحفظ؛ المطلوب معرفة الاستخدام والسياق والرجوع إلى `man` والتوثيق الرسمي قبل التنفيذ.

| المجال | عدد الأدوات |
|---|---:|
| هوية النظام والتشخيص | 12 |
| معالجة النصوص والبحث المتقدم | 21 |
| الحسابات والتحكم في الوصول | 19 |
| إدارة العمليات وsystemd المتقدم | 13 |
| الشبكات والاتصال المتقدم | 27 |
| استعلامات وإدارة الحزم المتقدمة | 12 |
| التخزين والأقراص المتقدم | 25 |
| السجلات والتدقيق | 7 |
| ضوابط أمان النظام | 11 |
| الجدولة وخدمات السيرفر | 10 |
| Bash المتقدم وأدوات فحص السكربت | 17 |
| **الإجمالي** | **174** |

## الوحدات التعليمية (20)

1. Linux Architecture & Distribution
2. Build the Linux Lab
3. Terminal, Shell & Command Anatomy
4. Linux Filesystem Hierarchy
5. Files & Directory Operations
6. Search & Text Processing
7. Users, Groups & Authentication
8. Permissions & Access Control
9. Process Management
10. Boot Process & systemd
11. System Monitoring & Troubleshooting
12. Linux Networking
13. SSH & Remote Administration
14. Firewall & Host Network Security
15. Package Management & Repositories
16. Storage, Filesystems & LVM
17. Linux Logging & Auditing
18. Bash Scripting & Automation
19. Scheduling & Server Services
20. Linux Security Controls & Hardening

كل وحدة تحتوي على أهداف تعلم، موضوعات فرعية، مصدر/سياق دراسة، مهمة عملية، وأكورديون مغلق لربط الموضوع بالـSOC للمستقبل.

## المعامل

1. التعرف على النظام قبل العمل
2. ملفات ومجلدات بطريقة آمنة
3. Users وGroups وPermissions
4. Process Tree والتحكم في عملية
5. تشخيص شبكة Linux
6. تحليل سجلات مصادقة تجريبية
7. Debian APT مقابل Rocky DNF
8. Bash Script يفحص خدمة

## SOC Connection

مساحة منفصلة لا تدخل في تقدم Linux. تفتح يدويًا بعد تأكيد إكمال Linux وCompTIA Security+. تشمل Log Analysis وEDR وMITRE ATT&CK وSIEM وIncident Response وThreat Hunting وDetection Engineering ومشروع L1/L2.


## مكتبة معرفة اختيارية — Linux Distribution Explorer

هذه مساحة قراءة منفصلة تمامًا عن المنهج الإلزامي؛ لا تدخل في progress ولا تتطلب تثبيت توزيعات أو تنفيذ Labs. تحتوي 10 ملفات تعريفية: 

1. Debian lineage: Debian وUbuntu وKali وParrot وLinux Mint.
2. RHEL-compatible Enterprise: RHEL وRocky وAlmaLinux وOracle Linux.
3. Fedora & CentOS Stream: توضيح upstream/midstream وعلاقتهما بـRHEL.
4. SUSE: SLES وopenSUSE Leap وTumbleweed.
5. Arch ecosystem: Arch وManjaro وEndeavourOS.
6. Alpine Linux: apk وmusl وBusyBox وOpenRC.
7. Amazon Linux 2023: DNF/RPM في بيئة AWS.
8. Gentoo: Portage/emerge وUSE flags.
9. NixOS: declarative configuration وNix.
10. Void Linux: XBPS وrunit.

كل ملف يشرح الاستخدام، العلاقة بالتوزيعات الأخرى، مدير الحزم، نموذج init/service، دورة الإصدار، وأين قد تصادف النظام. لا يوجد أي واجب أو عدد إنجاز مرتبط بهذه المكتبة.
