(() => {
  const D = window.LINUX_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORE = 'linux-master-lab-progress-v1';
  const state = loadState();
  if(!Array.isArray(state.topicDone)) state.topicDone=[];
  let activeView='overview', coreCat='all', advCat='all', moduleLevel='all', familyFilter='all';
  const catLabels = {
    'التنقل':'تنقل','الملفات':'ملفات','القراءة':'قراءة','البحث والنصوص':'بحث ونصوص','الهوية والصلاحيات':'هوية وصلاحيات',
    'العمليات والخدمات':'عمليات وخدمات','الشبكات':'شبكات','التخزين':'تخزين','السجلات':'سجلات','الحزم':'حزم','Shell & Bash':'Shell / Bash','معلومات النظام':'النظام'
  };
  const coreCats = ['all', ...new Set(D.core.map(x=>x.cat))];
  const advancedCount = D.advancedGroups.reduce((n,g)=>n+g.commands.length,0);
  $('#coreCountSide').textContent = D.core.length;
  $('#advancedCountSide').textContent = advancedCount;
  $('#statCore').textContent = D.core.length;
  $('#trackCoreCount').textContent = D.core.length;
  $('#coreRuleCount').textContent = `${D.core.length} COMMANDS`;
  $('#statAdvanced').textContent = advancedCount;
  $('#trackAdvancedCount').textContent = advancedCount;
  $('#statModules').textContent = D.modules.length;
  $('#moduleCountHeader').textContent = D.modules.length;
  $('#coreResultText').textContent = `عرض ${D.core.length} أمرًا أساسيًا`;
  $('#advancedDoneHeader').textContent = advancedCount;

  function loadState(){
    try { return {...{coreDone:[],modulesDone:[],topicDone:[],labsDone:[],linuxFinished:false,securityFinished:false,socUnlocked:false,moduleNotes:{}},...JSON.parse(localStorage.getItem(STORE)||'{}')}; }
    catch { return {coreDone:[],modulesDone:[],topicDone:[],labsDone:[],linuxFinished:false,securityFinished:false,socUnlocked:false,moduleNotes:{}}; }
  }
  function save(){ localStorage.setItem(STORE,JSON.stringify(state)); updateProgress(); }
  function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2300);}
  function formatText(s=''){return escapeHtml(s).replace(/\n/g,'<br>');}
  function showView(view){
    activeView=view; $$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));
    $$('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
    if(view==='core') renderCore(); if(view==='advanced') renderAdvanced(); if(view==='learn') renderModules(); if(view==='labs') renderLabs(); if(view==='soc') updateSoc(); if(view==='families') renderDistroAtlas();
  }
  $$('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#globalSearchBtn').addEventListener('click',()=>{showView('core');$('#coreSearch').focus();});

  function updateProgress(){
    const pct=Math.round(state.coreDone.length/D.core.length*100);
    $('#sideProgressText').textContent=pct+'%'; $('#sideProgressBar').style.width=pct+'%'; $('#coreDoneHeader').textContent=pct+'%';
    const modulePct=Math.round(state.modulesDone.length/D.modules.length*100);
    $('#moduleProgressText').textContent=`${state.modulesDone.length} / ${D.modules.length}`; $('#moduleProgressBar').style.width=modulePct+'%';
    $('#labDoneHeader').textContent=Math.round(state.labsDone.length/D.labs.length*100)+'%';
  }

  // CORE MEMORY TRACK
  function renderCoreFilters(){
    $('#coreFilters').innerHTML=coreCats.map(c=>`<button class="filter ${coreCat===c?'active':''}" data-cat="${escapeHtml(c)}">${c==='all'?'كل الفئات':escapeHtml(catLabels[c]||c)}</button>`).join('');
    $$('#coreFilters [data-cat]').forEach(b=>b.onclick=()=>{coreCat=b.dataset.cat;renderCoreFilters();renderCore();});
  }
  function commandCard(item,track){
    const done=track==='core' && state.coreDone.includes(item.id);
    const cmdText=item.example?.split('\n')[0] || item.cmd;
    return `<article class="command-card ${done?'done':''}">
      <div class="command-card-head"><span class="cmd-cat">${escapeHtml(item.cat||'REFERENCE')}</span><span class="cmd-status">${track==='core'?(done?'✓ مُتقن':'قيد الإتقان'):'LOOKUP / لا يُحفظ'}</span></div>
      <div class="cmd-title"><code>${escapeHtml(item.cmd)}</code><h3>${escapeHtml(item.title)}</h3></div>
      <p class="cmd-desc">${escapeHtml(item.desc)}</p>
      <div class="cmd-snippet"><button class="copy-btn" data-copy="${escapeHtml(cmdText)}">نسخ</button>${escapeHtml(cmdText)}</div>
      <div class="card-actions"><button class="details-btn" data-details="${track}:${escapeHtml(item.id)}">شرح كامل ←</button>${track==='core'?`<button class="master-btn" data-master="${escapeHtml(item.id)}">${done?'إلغاء الإتقان':'أتقنت الاستخدام ✓'}</button>`:''}</div>
    </article>`;
  }
  function renderCore(){
    renderCoreFilters(); const q=($('#coreSearch').value||'').trim().toLowerCase(); const status=$('#coreStatus').value;
    const results=D.core.filter(x=>(coreCat==='all'||x.cat===coreCat)&&(status==='all'||(status==='done')===state.coreDone.includes(x.id))&&(!q||[x.cmd,x.title,x.desc,x.use,x.syntax,x.example].join(' ').toLowerCase().includes(q)));
    $('#coreGrid').innerHTML=results.length?results.map(x=>commandCard(x,'core')).join(''):`<div class="empty-state">لا توجد نتائج. جرّب كلمة أخرى أو أزل الفلتر.</div>`;
    $('#coreResultText').textContent=`عرض ${results.length} من ${D.core.length} أمرًا أساسيًا`;
    bindCards();
  }
  $('#coreSearch').addEventListener('input',renderCore); $('#coreStatus').addEventListener('change',renderCore);

  // ADVANCED REFERENCE TRACK
  function renderAdvancedCategories(){
    $('#advancedCategories').innerHTML=`<button class="advanced-cat ${advCat==='all'?'active':''}" data-advcat="all"><span>كل المجالات</span><b>${advancedCount}</b></button>`+D.advancedGroups.map(g=>`<button class="advanced-cat ${advCat===g.id?'active':''}" data-advcat="${g.id}"><span>${escapeHtml(g.name.replace(/^\d+ \/ /,''))}</span><b>${g.commands.length}</b></button>`).join('');
    $$('#advancedCategories [data-advcat]').forEach(b=>b.onclick=()=>{advCat=b.dataset.advcat;renderAdvanced();});
  }
  function renderAdvanced(){
    renderAdvancedCategories(); const q=($('#advancedSearch').value||'').trim().toLowerCase();
    let groups=D.advancedGroups.filter(g=>advCat==='all'||g.id===advCat);
    let items=groups.flatMap(g=>g.commands.map(x=>({...x,group:g.name,cat:g.name})));
    items=items.filter(x=>!q||[x.cmd,x.title,x.desc,x.example,x.group,x.distro,x.note].join(' ').toLowerCase().includes(q));
    $('#advancedGrid').innerHTML=items.length?items.map(x=>commandCard(x,'advanced')).join(''):`<div class="empty-state">لا توجد نتائج مطابقة. حاول البحث بكلمة أقصر.</div>`;
    $('#advancedResultText').textContent=`${items.length} أداة / أمر في ${advCat==='all'?'كل المجالات':groups[0]?.name||'المجال المحدد'}`;
    const selected = advCat==='all' ? null : D.advancedGroups.find(g=>g.id===advCat);
    $('#advancedContext').innerHTML = selected
      ? `<div class="advanced-stage-kicker">${escapeHtml(selected.name)} / STAGE BRIEF</div><h3>${escapeHtml(selected.name.replace(/^\d+ \/ /,''))}</h3><p>${escapeHtml(selected.desc)}</p><div class="advanced-stage-rule"><b>المطلوب منك في هذه المرحلة:</b> افهم وظيفة كل أداة، اعرف متى تحتاجها، وتدرّب على مثال آمن. لا تحفظ جميع الخيارات؛ راجع صفحة الدليل (man page) قبل استعمال أداة متقدمة، خصوصًا أوامر التخزين والجدار الناري والصلاحيات.</div>`
      : `<div class="advanced-stage-kicker">REFERENCE MAP / 11 OPERATIONAL DOMAINS</div><h3>مرجع حسب المهمة، لا حسب الحفظ</h3><p>اختر مجالًا من القائمة أو ابحث عن المشكلة التي تواجهك. كل مرحلة توضح الغرض من الأدوات ومتى تحتاج إليها.</p><div class="advanced-stage-rule"><b>المطلوب منك:</b> معرفة وظيفة الأداة وسياق استخدامها. استخدم البحث والـman pages ولا تنفّذ أوامر تغييرية على نظام حقيقي قبل مراجعة أثرها.</div>`;
    bindCards();
  }
  $('#advancedSearch').addEventListener('input',renderAdvanced);

  function bindCards(){
    $$('[data-copy]').forEach(b=>b.onclick=async e=>{e.stopPropagation();try{await navigator.clipboard.writeText(b.dataset.copy);toast('تم نسخ المثال');}catch{toast('تعذر النسخ في هذا السياق؛ انسخ النص يدويًا.');}});
    $$('[data-details]').forEach(b=>b.onclick=()=>{const [track,id]=b.dataset.details.split(':');const item=track==='core'?D.core.find(x=>x.id===id):D.advancedGroups.flatMap(g=>g.commands).find(x=>x.id===id);if(item)openCommand(item,track);});
    $$('[data-master]').forEach(b=>b.onclick=()=>{const id=b.dataset.master;state.coreDone=state.coreDone.includes(id)?state.coreDone.filter(x=>x!==id):[...state.coreDone,id];save();renderCore();toast(state.coreDone.includes(id)?'تم تسجيل الإتقان':'تمت إعادة الأمر إلى قائمة التدريب');});
  }
  function openCommand(x,track){
    const flags=x.flags?.length?`<div class="modal-section"><h4>الخيارات المهمة</h4><ul>${x.flags.map(f=>`<li><code>${escapeHtml(f[0])}</code> — ${escapeHtml(f[1])}</li>`).join('')}</ul></div>`:'';
    const warning=x.warning?`<div class="modal-section modal-note">⚠ ${escapeHtml(x.warning)}</div>`:'';
    const distro=x.distro?`<div class="modal-section"><h4>ملاحظة التوزيعات</h4><p>${escapeHtml(x.distro)}</p></div>`:'';
    const extra=x.tip||x.note?`<div class="modal-grid"><div class="detail-box"><h4>نصيحة عملية</h4><p>${escapeHtml(x.tip||x.note)}</p></div><div class="detail-box"><h4>متى أستخدمه؟</h4><p>${escapeHtml(x.use||'عند الحاجة إلى تنفيذ المهمة الموضحة.')}</p></div></div>`:'';
    $('#modalContent').innerHTML=`<div class="modal-kicker">${track==='core'?'TRACK 01 / CORE MEMORIZATION':'TRACK 02 / ADVANCED FIELD REFERENCE'}</div><h2 class="modal-title"><code dir="ltr">${escapeHtml(x.cmd)}</code> — ${escapeHtml(x.title)}</h2><p class="modal-desc">${escapeHtml(x.desc)}</p><div class="modal-section"><h4>الصيغة</h4><pre>${escapeHtml(x.syntax||x.example||x.cmd)}</pre></div><div class="modal-section"><h4>مثال عملي</h4><pre>${escapeHtml(x.example||x.cmd)}</pre></div>${flags}${distro}${extra}${warning}<div class="modal-section"><h4>ما الذي يجب أن تتذكره؟</h4><p>${track==='core'?'هذا ضمن مجموعة الإتقان: اكتب الأمر بنفسك، غيّر المسارات/القيم في بيئة الاختبار، وتأكد أنك تفسر الناتج.':'هذا في المرجع المتقدم: لا تحتاج حفظه. افهم الغرض، وتحقق من التوثيق والخيارات قبل الاستخدام.'}</p></div><div class="source-links"><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noreferrer">Linux man-pages ↗</a><a href="https://www.debian.org/doc/manuals/debian-reference/" target="_blank" rel="noreferrer">Debian Reference ↗</a><a href="https://docs.rockylinux.org/10/" target="_blank" rel="noreferrer">Rocky Linux Docs ↗</a></div>`;
    $('#modalBackdrop').classList.add('show');
  }
  $('#modalClose').onclick=()=>$('#modalBackdrop').classList.remove('show');
  $('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')$('#modalBackdrop').classList.remove('show');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#modalBackdrop').classList.remove('show');if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showView('core');$('#coreSearch').focus();}});

  // LEARNING MAP
  function renderModules(){
    const q=($('#moduleSearch').value||'').toLowerCase().trim();
    const mods=D.modules.filter(m=>(moduleLevel==='all'||m.level===moduleLevel)&&(!q||[m.title,m.subtitle,m.desc,...m.topics].join(' ').toLowerCase().includes(q)));
    $('#moduleList').innerHTML=mods.map((m,i)=>`<article class="module-item" data-module="${m.id}"><button class="module-summary"><span class="module-num">${String(D.modules.indexOf(m)+1).padStart(2,'0')}</span><span><span class="module-title">${escapeHtml(m.title)}</span><span class="module-sub">${escapeHtml(m.subtitle)}</span></span><span class="module-tag">${m.level==='foundation'?'تأسيس':m.level==='admin'?'إدارة':'أمان'}</span><span class="module-chevron">⌄</span></button><div class="module-body"><p class="module-description">${escapeHtml(m.desc)}</p><div class="topic-chips">${m.topics.map((t,j)=>`<button class="topic-chip topic-chip-button ${state.topicDone.includes(m.id+'::'+t)?'topic-done':''}" data-topic="${escapeHtml(m.id)}" data-topic-name="${escapeHtml(t)}">${state.topicDone.includes(m.id+'::'+t)?'✓ ':''}${escapeHtml(t)} <small>↗</small></button>`).join('')}</div><div class="module-detail-grid"><div class="detail-box"><h4>النتيجة المطلوبة</h4><p>${escapeHtml(m.goal)}</p></div><div class="detail-box"><h4>المصدر التعليمي</h4><p>${escapeHtml(m.sources)}</p></div></div><div class="lab-mini"><b>⚒ المعمل بعد هذا الموضوع</b><p>${escapeHtml(m.lab)}</p><p dir="ltr" style="font-family:var(--mono);color:#c3e69a;margin-top:7px">${escapeHtml(m.commands)}</p></div><div class="module-note"><label style="display:block;font-size:11px;color:#9eb4c7;margin:12px 0 5px">ملاحظتك الخاصة على هذه الوحدة</label><textarea data-note="${m.id}" placeholder="اكتب ما فهمته، أو الخطأ الذي واجهته، أو ما تريد تذكره..." style="width:100%;min-height:72px;background:#0d1924;border:1px solid #34495b;border-radius:8px;padding:10px;color:#eaf1f5;font:12px var(--font);resize:vertical">${escapeHtml(state.moduleNotes[m.id]||'')}</textarea><button class="master-btn" data-savemodule="${m.id}" style="margin-top:7px">حفظ الملاحظة</button> <button class="master-btn ${state.modulesDone.includes(m.id)?'done':''}" data-module-done="${m.id}" style="margin-top:7px">${state.modulesDone.includes(m.id)?'✓ أنهيت الوحدة':'تسجيل إتمام الوحدة'}</button></div><details class="soc-accordion"><summary>صلة هذا الموضوع بالـ SOC — مؤجل</summary><div class="soc-hidden">${escapeHtml(m.soc)}<br><b>هذا الربط للمستقبل فقط، ولا يدخل ضمن شرح Linux الأساسي أو واجباته الحالية.</b></div></details></div></article>`).join('')||'<div class="empty-state">لا توجد وحدات مطابقة لبحثك.</div>';
    $$('.module-summary').forEach(b=>b.onclick=()=>b.closest('.module-item').classList.toggle('open'));
    $$('[data-topic]').forEach(b=>b.onclick=()=>openTopic(D.modules.find(m=>m.id===b.dataset.topic),b.dataset.topicName));
    $$('[data-savemodule]').forEach(b=>b.onclick=()=>{const id=b.dataset.savemodule;state.moduleNotes[id]=$(`[data-note="${id}"]`).value;save();toast('تم حفظ الملاحظة على هذا المتصفح.');});
    $$('[data-module-done]').forEach(b=>b.onclick=()=>{const id=b.dataset.moduleDone;state.modulesDone=state.modulesDone.includes(id)?state.modulesDone.filter(x=>x!==id):[...state.modulesDone,id];save();renderModules();});
    $('#moduleProgressText').textContent=`${state.modulesDone.length} / ${D.modules.length}`;$('#moduleProgressBar').style.width=(state.modulesDone.length/D.modules.length*100)+'%';
  }
  $('#moduleSearch').addEventListener('input',renderModules);
  $$('#moduleLevelFilters [data-level]').forEach(b=>b.onclick=()=>{moduleLevel=b.dataset.level;$$('#moduleLevelFilters [data-level]').forEach(x=>x.classList.toggle('active',x===b));renderModules();});

  function topicExercise(topic,module){
    const t=topic.toLowerCase();
    if(/kernel|نواة/.test(t)) return {why:'افهم أن النواة هي الجزء الذي يدير موارد العتاد والعمليات والذاكرة ويقدم واجهات للنظام.',cmd:'uname -r\ncat /proc/version\ncat /proc/cmdline',task:'اعرف إصدار النواة، ثم حدد أين تظهر معلومات النواة وإعدادات الإقلاع.'};
    if(/shell|terminal|ترمنال|طرفية|bash/.test(t)) return {why:'ميّز بين التطبيق الذي يعرض الطرفية وبين الـShell الذي يفسر الأوامر وينفذها.',cmd:'echo "$SHELL"\nps -p $$ -o pid,ppid,comm,args\ntype cd',task:'حدد اسم الـShell الحالي، ثم اعرف هل cd أمر خارجي أم Shell builtin.'};
    if(/distribution|توزيع|debian|rocky|ubuntu/.test(t)) return {why:'التوزيعة تجمع Kernel وأدوات ومكتبات ومدير حزم وسياسات افتراضية.',cmd:'cat /etc/os-release\nuname -r\ncommand -v apt dnf',task:'حدد ID وVERSION_ID، ثم لاحظ أي مدير حزم متوفر في بيئتك.'};
    if(/file system|filesystem|directory|مسارات|مجلدات|root directory|inode|links|ملفات/.test(t)) return {why:'نظام الملفات ينظم المسارات والأسماء والبيانات والـmetadata، وليس مجرد شجرة مجلدات.',cmd:'pwd\nls -la /\nfind /etc -maxdepth 1 -type d\nstat /etc/passwd',task:'اختر مسارًا من /etc أو /var، واشرح ما الذي تتوقع أن تجده فيه، ثم افحص نوع ملف واحد.'};
    if(/user|group|uid|gid|مستخدم|مجموعة|passwd|shadow|pam|authentication/.test(t)) return {why:'Linux يربط الهوية الرقمية UID/GID بالحسابات والمجموعات وسياسات المصادقة.',cmd:'whoami\nid\ngetent passwd "$USER"\ngetent group',task:'استخرج UID وGID والمجموعات للمستخدم الحالي، ثم حدد مصدر معلومات الحساب.'};
    if(/permission|chmod|chown|suid|sgid|sticky|acl|capabilit|صلاحيات|ملكية|umask/.test(t)) return {why:'التحكم في الوصول يحدد من يستطيع القراءة أو الكتابة أو التنفيذ، وقد توجد طبقات إضافية مثل ACL وSELinux.',cmd:'tmp=$(mktemp)\nstat -c "%A %a %U:%G %n" "$tmp"\nchmod 640 "$tmp"\nstat -c "%A %a" "$tmp"\nrm -i "$tmp"',task:'أنشئ ملفًا مؤقتًا، غيّر صلاحياته إلى 640، وتحقق من النتيجة قبل حذفه.'};
    if(/grep|awk|sed|cut|sort|uniq|text|نصوص|regular expression|regex|redirection|pipe/.test(t)) return {why:'معالجة النصوص تبني pipeline من مصادر البيانات إلى فلترة واستخراج وترتيب النتائج.',cmd:'cut -d: -f1 /etc/passwd | sort | head\ngrep -n "root" /etc/passwd\nawk -F: \'{print $1, $3}\' /etc/passwd | head',task:'استخرج أسماء أول خمسة حسابات، ثم اشرح وظيفة كل مرحلة في الـpipeline.'};
    if(/process|pid|ppid|signal|عملية|عمليات/.test(t)) return {why:'العملية instance يعمل داخل النظام ولها PID ومالك وحالة وعلاقات parent/child.',cmd:'ps -eo pid,ppid,user,stat,comm --sort=pid | head -n 15\npstree -p | head',task:'اختر عملية آمنة، وسجل PID وPPID والمالك وحالة العملية.'};
    if(/systemd|service|daemon|boot|إقلاع|خدمات/.test(t)) return {why:'systemd يدير الخدمات والـunits والاعتماديات ومرحلة التشغيل.',cmd:'systemctl --failed\nsystemctl list-units --type=service --state=running | head\nsystemctl get-default',task:'اعرض الخدمات العاملة والفاشلة، ثم اشرح الفرق بين active وenabled.'};
    if(/network|ip address|route|dns|port|socket|شبكة|اتصال|منافذ/.test(t)) return {why:'طبقة الشبكة في Linux تتعامل مع الواجهات والعناوين والمسارات وDNS والـsockets.',cmd:'ip -br addr\nip route\nip neigh\nss -tulpn',task:'حدد الواجهة النشطة والبوابة والمنافذ التي تستمع محليًا.'};
    if(/ssh|secure shell|مفتاح|remote/.test(t)) return {why:'SSH يوفر قناة إدارة عن بعد مشفرة ويستخدم مفاتيح host ومفاتيح مستخدم.',cmd:'ssh -V\nls -la ~/.ssh 2>/dev/null\nss -tln | grep ":22"',task:'اعرف إصدار عميل SSH، وافحص مجلد مفاتيحك دون مشاركة المفتاح الخاص.'};
    if(/log|journal|audit|سجل/.test(t)) return {why:'السجلات تسجل أحداث النواة والخدمات والمصادقة وفق مصادر وإعدادات مختلفة.',cmd:'journalctl -b -n 30\njournalctl -p warning -b\nls -ld /var/log',task:'اعثر على حدث حديث، وحدد توقيته ومصدره والخدمة المرتبطة به.'};
    if(/package|apt|dnf|rpm|dpkg|حزم|تثبيت/.test(t)) return {why:'مدير الحزم يحل الاعتماديات ويثبت ملفات البرنامج من مستودعات موثوقة.',cmd:'cat /etc/os-release\napt policy bash 2>/dev/null || dnf info bash',task:'حدد مدير الحزم المناسب لتوزيعتك، ثم اعرض معلومات حزمة دون تثبيتها.'};
    if(/disk|storage|partition|filesystem|lvm|raid|swap|تخزين|قرص/.test(t)) return {why:'إدارة التخزين تبدأ من block device ثم partitions ثم filesystem ونقطة التركيب.',cmd:'lsblk -f\nfindmnt\ndf -h',task:'حدد الأقراص وأنواع أنظمة الملفات ونقاط التركيب دون إجراء أي تغيير.'};
    if(/selinux|apparmor|firewall|security|أمن|جدار/.test(t)) return {why:'ضوابط الحماية الإضافية تحدد ما يمكن للخدمات والمستخدمين فعله حتى بعد صلاحيات Unix التقليدية.',cmd:'getenforce 2>/dev/null || true\nsestatus 2>/dev/null | head\nsudo aa-status 2>/dev/null | head',task:'حدد آلية الحماية المتاحة في التوزيعة، ولا تعطلها. اقرأ حالة السياسة فقط.'};
    if(/cron|schedule|timer|جدولة/.test(t)) return {why:'الجدولة تشغّل مهام في أوقات محددة عبر cron أو at أو systemd timers.',cmd:'crontab -l 2>/dev/null\nsystemctl list-timers --all | head',task:'اعرض المهام المجدولة للمستخدم والمؤقتات النظامية، ثم ميّز بين cron وsystemd timer.'};
    if(/bash|script|variable|array|function|loop|سكربت/.test(t)) return {why:'Bash يحول المهام المتكررة إلى خطوات قابلة لإعادة التنفيذ والتحقق.',cmd:'bash --version | head -n 1\nprintf "topic=%s\\n" "linux-lab"\nVAR=linux; printf "%s\\n" "$VAR"',task:'اكتب سطرًا يعرّف متغيرًا ويطبعه، ثم وسّع التجربة إلى شرط بسيط في ملف مؤقت.'};
    return {why:`هذا المفهوم جزء من وحدة ${module.title}. افهم تعريفه وعلاقته ببقية مكونات الوحدة قبل الانتقال إلى التطبيق.`,cmd:'man -k linux | head\ncommand --help 2>&1 | head',task:'اكتب تعريفًا للمفهوم بأسلوبك، وحدد الأمر أو الملف أو الخدمة التي ترتبط به.'};
  }
  function openTopic(module,topic){
    if(!module)return; const ex=topicExercise(topic,module); const key=module.id+'::'+topic; const done=state.topicDone.includes(key);
    $('#modalContent').innerHTML=`<div class="modal-kicker">TOPIC MICRO-LAB / ${escapeHtml(module.title)}</div><h2 class="modal-title">${escapeHtml(topic)}</h2><p class="modal-desc">${escapeHtml(module.desc)}</p><div class="modal-section"><h4>الفكرة التي يجب فهمها</h4><p>${escapeHtml(ex.why)}</p></div><div class="modal-section"><h4>تجربة قصيرة على الـVM</h4><pre>${escapeHtml(ex.cmd)}</pre><p>${escapeHtml(ex.task)}</p></div><div class="modal-note">نفّذ التجربة في بيئة الاختبار فقط. الأمثلة الاستعلامية آمنة افتراضيًا؛ راجع أي أمر يحتوي على sudo أو يغير حالة النظام قبل تشغيله.</div><div class="modal-section"><button class="primary-btn" id="topicDoneBtn">${done?'إلغاء إتمام الموضوع':'أنهيت الفهم والتطبيق ✓'}</button></div><div class="modal-section"><h4>صلة الموضوع بالـSOC — مؤجلة</h4><p>${escapeHtml(module.soc)} (هذا الجزء مرجعي للمستقبل فقط.)</p></div>`;
    $('#modalBackdrop').classList.add('show');
    $('#topicDoneBtn').onclick=()=>{state.topicDone=state.topicDone.includes(key)?state.topicDone.filter(x=>x!==key):[...state.topicDone,key];save();$('#modalBackdrop').classList.remove('show');renderModules();toast(state.topicDone.includes(key)?'تم تسجيل إتمام الموضوع':'تم إلغاء حالة الإتمام');};
  }

  // DISTRO MATRIX
  $('#distroTableBody').innerHTML=D.distroRows.map(r=>`<tr><td>${escapeHtml(r[0])}</td><td>${escapeHtml(r[1])}</td><td>${escapeHtml(r[2])}</td><td>${escapeHtml(r[3])}</td></tr>`).join('');

  // OPTIONAL DISTRIBUTION KNOWLEDGE LIBRARY — NOT PART OF LEARNING PROGRESS
  function renderDistroAtlas(){
    const q=($('#familySearch').value||'').trim().toLowerCase();
    const items=D.distroAtlas.filter(x=>(familyFilter==='all'||x.category===familyFilter)&&(!q||[x.title,x.subtitle,x.eyebrow,x.distros,x.package,x.init,x.release,x.role,x.where,x.relationship,x.why].join(' ').toLowerCase().includes(q)));
    $('#familyResultText').textContent=`عرض ${items.length} من ${D.distroAtlas.length} ملفات تعريفية — قراءة حرة`;
    $('#distroFamilyGrid').innerHTML=items.length?items.map((x,i)=>`<details class="family-card family-${escapeHtml(x.category)}">
      <summary class="family-card-summary">
        <span class="family-card-mark">${escapeHtml(x.mark)}</span>
        <span class="family-card-heading"><small>${escapeHtml(x.eyebrow)}</small><strong>${escapeHtml(x.title)}</strong><em>${escapeHtml(x.subtitle)}</em><span class="family-card-distros">${escapeHtml(x.distros)}</span></span>
        <span class="family-card-open">＋</span>
      </summary>
      <div class="family-card-body">
        <div class="family-meta-grid">
          <div><small>PACKAGE MANAGEMENT</small><b>${escapeHtml(x.package)}</b></div>
          <div><small>INIT / SERVICE MODEL</small><b>${escapeHtml(x.init)}</b></div>
          <div><small>RELEASE MODEL</small><b>${escapeHtml(x.release)}</b></div>
        </div>
        <div class="family-explain-grid">
          <section><h4>الفكرة والاستخدام</h4><p>${escapeHtml(x.role)}</p><h4>أين قد تصادفها؟</h4><p>${escapeHtml(x.where)}</p></section>
          <section><h4>العلاقة ببقية التوزيعات</h4><p>${escapeHtml(x.relationship)}</p><h4>لماذا تعرفها؟</h4><p>${escapeHtml(x.why)}</p></section>
        </div>
        <div class="family-command-box"><div><small>COMMAND SHAPE / للتعرّف فقط</small><button class="copy-btn" data-copy="${escapeHtml(x.command.split('\n')[0])}">نسخ أول مثال</button></div><pre>${escapeHtml(x.command)}</pre><p>${escapeHtml(x.commandNote)}</p></div>
        <div class="family-official-links"><b>مراجع رسمية</b>${x.links.map(l=>`<a href="${escapeHtml(l[1])}" target="_blank" rel="noreferrer">${escapeHtml(l[0])} ↗</a>`).join('')}</div>
      </div>
    </details>`).join(''):`<div class="empty-state">لا توجد توزيعات مطابقة للبحث. جرّب اسمًا آخر أو اختر كل العائلات.</div>`;
    $$('#familyFilters [data-family]').forEach(b=>b.classList.toggle('active',b.dataset.family===familyFilter));
    bindCards();
  }
  $('#familySearch').addEventListener('input',renderDistroAtlas);
  $$('#familyFilters [data-family]').forEach(b=>b.addEventListener('click',()=>{familyFilter=b.dataset.family;renderDistroAtlas();}));

  // LABS
  function renderLabs(){
    $('#labGrid').innerHTML=D.labs.map((l,i)=>`<article class="lab-card"><div class="lab-head"><span class="lab-number">LAB-${String(i+1).padStart(2,'0')}</span><span class="lab-state">${state.labsDone.includes(l.id)?'✓ مكتمل':'بانتظار التنفيذ'}</span></div><h3>${escapeHtml(l.title)}</h3><p>${escapeHtml(l.goal)}</p><pre>${escapeHtml(l.commands)}</pre><ol class="lab-steps">${l.steps.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol><div class="modal-note">احتياط: ${escapeHtml(l.safe)}</div><div class="lab-footer"><small>${escapeHtml(l.level)} · نفّذ على VM</small><button class="lab-done ${state.labsDone.includes(l.id)?'done':''}" data-labdone="${l.id}">${state.labsDone.includes(l.id)?'إلغاء الإكمال':'أنهيت المعمل ✓'}</button></div></article>`).join('');
    $$('[data-labdone]').forEach(b=>b.onclick=()=>{const id=b.dataset.labdone;state.labsDone=state.labsDone.includes(id)?state.labsDone.filter(x=>x!==id):[...state.labsDone,id];save();renderLabs();});
    $('#labDoneHeader').textContent=Math.round(state.labsDone.length/D.labs.length*100)+'%';
  }

  // SOC VAULT
  function updateSoc(){
    $('#linuxFinished').checked=!!state.linuxFinished;$('#securityFinished').checked=!!state.securityFinished;
    const allowed=state.linuxFinished&&state.securityFinished;
    $('#unlockSocBtn').disabled=!allowed;
    $('#unlockFeedback').textContent=allowed?'تم تأكيد المرحلتين. افتح الخزانة عندما تكون مستعدًا.':'الخزانة مغلقة افتراضيًا حفاظًا على تركيزك في Linux.';
    $('#socContent').classList.toggle('locked-content',!(state.socUnlocked && allowed));
    $('#socTracks').innerHTML=D.socTracks.map((g,i)=>`<details class="soc-track"><summary>${escapeHtml(g.title)}</summary><div class="soc-track-body"><ol>${g.items.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol></div></details>`).join('')+`<div class="source-links"><a href="https://attack.mitre.org/" target="_blank" rel="noreferrer">MITRE ATT&CK ↗</a><a href="https://documentation.wazuh.com/" target="_blank" rel="noreferrer">Wazuh Docs ↗</a><a href="https://learn.microsoft.com/en-us/defender-endpoint/" target="_blank" rel="noreferrer">Defender for Endpoint ↗</a><a href="https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/" target="_blank" rel="noreferrer">SC-200 ↗</a></div>`;
  }
  $('#linuxFinished').onchange=e=>{state.linuxFinished=e.target.checked;if(!state.linuxFinished)state.socUnlocked=false;save();updateSoc();};
  $('#securityFinished').onchange=e=>{state.securityFinished=e.target.checked;if(!state.securityFinished)state.socUnlocked=false;save();updateSoc();};
  $('#unlockSocBtn').onclick=()=>{if(state.linuxFinished&&state.securityFinished){state.socUnlocked=true;save();updateSoc();toast('تم فتح خزانة SOC المرجعية.');}};

  // EXPORT / IMPORT
  function exportProgress(){
    const payload={app:'LINUX MASTER LAB',version:1,exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='linux-master-lab-progress.json';a.click();URL.revokeObjectURL(url);toast('تم تنزيل نسخة التقدم.');
  }
  $('#exportBtn').onclick=exportProgress;
  function importProgress(file){const r=new FileReader();r.onload=()=>{try{const obj=JSON.parse(r.result);const s=obj.state||obj;if(!Array.isArray(s.coreDone)||!Array.isArray(s.labsDone))throw new Error('invalid');Object.assign(state,{coreDone:s.coreDone,modulesDone:s.modulesDone||[],topicDone:s.topicDone||[],labsDone:s.labsDone,linuxFinished:!!s.linuxFinished,securityFinished:!!s.securityFinished,socUnlocked:!!s.socUnlocked,moduleNotes:s.moduleNotes||{}});save();renderCore();renderModules();renderLabs();updateSoc();toast('تم استيراد تقدمك بنجاح.');}catch{toast('ملف التقدم غير صالح أو من إصدار غير متوافق.');}};r.readAsText(file);}
  $('#importBtn').onclick=()=>$('#importFile').click();$('#importFileTop').onclick=()=>$('#importFile').click();$('#importFile').onchange=e=>{if(e.target.files[0])importProgress(e.target.files[0]);e.target.value='';};

  // SOURCES PANEL
  $('#sourcesBtn').onclick=()=>{
    $('#modalContent').innerHTML=`<div class="modal-kicker">TRUSTED TECHNICAL REFERENCES</div><h2 class="modal-title">المراجع الرسمية</h2><p class="modal-desc">الأمثلة التعليمية مبنية على سلوك الأدوات الشائع، لكن صفحة man الخاصة بالنظام هي المرجع الحاسم للإصدار المثبت لديك.</p><div class="source-modal-links">${D.sources.map(s=>`<a href="${s[1]}" target="_blank" rel="noreferrer"><b>${escapeHtml(s[0])}</b><br><span style="color:#92a7b8">${escapeHtml(s[2])}</span></a>`).join('')}</div>`;
    $('#modalBackdrop').classList.add('show');
  };

  // Simple recall drill: describe the purpose, choose the right command.
  const drillBtn=document.createElement('button');drillBtn.className='secondary-btn';drillBtn.id='drillBtn';drillBtn.textContent='اختبر ذاكرتك ↗';
  $('.core-rule').appendChild(drillBtn);
  drillBtn.addEventListener('click',()=>{
    const pool=D.core.filter(x=>!state.coreDone.includes(x.id)); const options=pool.length?pool:D.core; const item=options[Math.floor(Math.random()*options.length)];
    $('#modalContent').innerHTML=`<div class="modal-kicker">CORE MEMORY / QUICK RECALL</div><h2 class="modal-title">أي أمر تستخدمه؟</h2><p class="modal-desc">${escapeHtml(item.desc)} ${escapeHtml(item.use)}</p><div class="modal-section"><h4>تلميح الاستخدام</h4><p>${escapeHtml(item.title)}</p></div><div class="modal-section"><h4>هل تتذكر الصيغة؟</h4><pre>${escapeHtml(item.syntax)}</pre></div><button class="primary-btn" id="revealDrill">إظهار الإجابة</button><div id="drillAnswer" hidden class="modal-section"><h4>الإجابة: ${escapeHtml(item.cmd)}</h4><pre>${escapeHtml(item.example)}</pre><p>${escapeHtml(item.distro||'')}</p></div>`;
    $('#modalBackdrop').classList.add('show');$('#revealDrill').onclick=()=>{$('#drillAnswer').hidden=false;};
  });

  // Initial render
  updateProgress();renderCore();renderAdvanced();renderModules();renderDistroAtlas();renderLabs();updateSoc();
  const hashView=location.hash.replace('#',''); if(['overview','learn','core','advanced','distros','families','labs','soc'].includes(hashView)) showView(hashView);
})();
