(function(){
  "use strict";

  var KEY = "owen.fatloss.v2";
  var OLDKEY = "owen.fatloss.v1";
  var START_W = 170, TARGET_W = 140, J2KG = 0.5;
  var BASE = { h:174, kg:85, muscle:35, fat:25, bf:28, age:42 };
  function bmr(){ return Math.round(10*BASE.kg + 6.25*BASE.h - 5*BASE.age - 161); }

  var PLAN = [
    { name:"适应期", from:"2026-11-16", to:"2026-11-29", intake:1550, ex:400 },
    { name:"主减期", from:"2026-11-30", to:"2027-01-24", intake:1450, ex:500 },
    { name:"冲刺期", from:"2027-01-25", to:"2027-02-28", intake:1400, ex:550 },
    { name:"维持期", from:"2027-03-01", to:"2099-12-31", intake:2100, ex:400 }
  ];

  var WEEKPLAN = [
    "全身循环 + 快走 30 分钟",                 // 周日
    "腿：深蹲 · 硬拉 · 箭步蹲 + 快走 20 分钟",   // 周一
    "有氧 40 分钟 + 核心 10 分钟",              // 周二
    "推：卧推 · 推举 · 侧平举 + 快走 20 分钟",   // 周三
    "有氧 40 分钟 + 拉伸 10 分钟",              // 周四
    "拉：划船 · 高位下拉 · 弯举 + 快走 20 分钟",  // 周五
    "有氧 50 分钟（快走或爬坡）"                 // 周六
  ];
  var CARDIO = { "快走":5.5, "爬坡走":8, "慢跑":9, "单车":7, "跳绳":11 };

  var FOOD = [
    {n:"米饭",d:"1 小碗 · 150g",k:174,c:"主食",p:3},
    {n:"杂粮饭",d:"1 小碗 · 150g",k:160,c:"主食",p:4},
    {n:"面条",d:"1 碗 · 250g",k:280,c:"主食",p:8},
    {n:"馒头",d:"1 个 · 100g",k:223,c:"主食",p:7},
    {n:"全麦面包",d:"1 片 · 35g",k:80,c:"主食",p:4},
    {n:"白粥",d:"1 碗 · 250g",k:90,c:"主食",p:2},
    {n:"玉米",d:"1 根 · 200g",k:130,c:"主食",p:4},
    {n:"红薯",d:"1 个 · 200g",k:180,c:"主食",p:3},
    {n:"土豆",d:"1 个 · 150g",k:115,c:"主食",p:3},
    {n:"饺子",d:"10 个",k:230,c:"主食",p:8},
    {n:"鸡蛋",d:"1 个",k:78,c:"蛋白",p:6.5},
    {n:"蛋白（只吃白）",d:"1 个",k:17,c:"蛋白",p:3.5},
    {n:"鸡胸肉",d:"100g",k:133,c:"蛋白",p:31},
    {n:"鸡腿肉",d:"100g",k:181,c:"蛋白",p:27},
    {n:"牛肉",d:"100g",k:190,c:"蛋白",p:26},
    {n:"猪肉",d:"100g",k:240,c:"蛋白",p:20},
    {n:"鱼肉",d:"100g",k:110,c:"蛋白",p:20},
    {n:"虾",d:"100g",k:93,c:"蛋白",p:18},
    {n:"豆腐",d:"100g",k:82,c:"蛋白",p:8},
    {n:"无糖豆浆",d:"250ml",k:80,c:"蛋白",p:8},
    {n:"牛奶",d:"250ml",k:135,c:"蛋白",p:8},
    {n:"无糖酸奶",d:"1 杯 · 150g",k:90,c:"蛋白",p:9},
    {n:"蛋白饮",d:"1 瓶（以瓶身标注为准）",k:100,c:"蛋白",p:20},
    {n:"清炒青菜",d:"1 份 · 200g",k:70,c:"蔬菜",p:3},
    {n:"西兰花",d:"100g",k:34,c:"蔬菜",p:3},
    {n:"番茄",d:"1 个 · 180g",k:25,c:"蔬菜",p:1},
    {n:"黄瓜",d:"1 根 · 200g",k:30,c:"蔬菜",p:1},
    {n:"青菜汤",d:"1 碗",k:40,c:"蔬菜",p:2},
    {n:"苹果",d:"1 个 · 200g",k:90,c:"水果",p:0.5},
    {n:"香蕉",d:"1 根 · 120g",k:90,c:"水果",p:1.3},
    {n:"橙子",d:"1 个 · 200g",k:60,c:"水果",p:2},
    {n:"蓝莓",d:"100g",k:57,c:"水果",p:0.7},
    {n:"西瓜",d:"1 片 · 300g",k:90,c:"水果",p:1.5},
    {n:"葡萄",d:"100g",k:45,c:"水果",p:0.5},
    {n:"烹调油",d:"1 汤匙 · 15g",k:135,c:"油与零食",p:0},
    {n:"坚果",d:"10 颗 · 20g",k:120,c:"油与零食",p:3},
    {n:"饼干",d:"2 块",k:100,c:"油与零食",p:1.5},
    {n:"薯片",d:"1 小包 · 30g",k:160,c:"油与零食",p:2},
    {n:"蛋糕",d:"1 块 · 80g",k:300,c:"油与零食",p:3},
    {n:"火锅蘸料",d:"1 小碟",k:120,c:"油与零食",p:1},
    {n:"奶茶",d:"1 杯 · 500ml",k:400,c:"饮品",p:4},
    {n:"含糖饮料",d:"1 罐 · 330ml",k:140,c:"饮品",p:0.3},
    {n:"美式咖啡（无糖）",d:"1 杯",k:10,c:"饮品",p:0.2},
    {n:"拿铁（全脂）",d:"1 杯 · 350ml",k:180,c:"饮品",p:10},
    {n:"啤酒",d:"1 罐 · 330ml",k:110,c:"饮品",p:1.3}
  ];

  var DFLT_VISION = { key:"", model:"doubao-seed-2-1-lite-260915" };

  var state = {
    settings:{ startWeight:START_W, targetWeight:TARGET_W, vision:{key:DFLT_VISION.key, model:DFLT_VISION.model}, planV2:false },
    days:{}
  };
  var draft = [];        // 待存清单
  var mealPhoto = "";    // 当餐照片 dataURL
  var watchShot = "";    // 手表截图 dataURL
  var chart = null;

  /* ---------- 基础工具 ---------- */
  function pad(n){ return n < 10 ? "0"+n : ""+n; }
  function keyOf(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function todayKey(){ return keyOf(new Date()); }
  function fmt(n, f){ return (typeof n !== "number" || isNaN(n)) ? "—" : n.toFixed(f===undefined?1:f); }
  function phaseToday(){
    var k = todayKey();
    for(var i=0;i<PLAN.length;i++){ if(k >= PLAN[i].from && k <= PLAN[i].to) return PLAN[i]; }
    return PLAN[PLAN.length-1];
  }
  function targetW(){ return state.settings.targetWeight || TARGET_W; }
  function startW(){ return state.settings.startWeight || START_W; }
  function day(k){
    k = k || todayKey();
    if(!state.days[k]){
      state.days[k] = { weight:null, bf:null, muscle:null, waist:null, meals:[], water:0, protein:false, sugar:false, strength:[], cardio:[], steps:0 };
    }
    var d = state.days[k];
    if(!Array.isArray(d.meals)) d.meals = [];
    if(!Array.isArray(d.strength)) d.strength = [];
    if(!Array.isArray(d.cardio)) d.cardio = [];
    return d;
  }
  function save(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var o = JSON.parse(raw);
        if(o && o.settings){
          if(o.settings.vision) state.settings.vision = o.settings.vision;
          if(o.settings.planV2){
            state.settings.planV2 = true;
            if(o.settings.startWeight) state.settings.startWeight = o.settings.startWeight;
            if(o.settings.targetWeight) state.settings.targetWeight = o.settings.targetWeight;
          }
        }
        if(o && o.days) state.days = o.days;
      } else {
        var olds = localStorage.getItem(OLDKEY);
        if(olds){
          var ob = JSON.parse(olds);
          if(ob && Array.isArray(ob.records)){
            ob.records.forEach(function(r){
              if(!r || !r.date) return;
              var d = day(r.date);
              if(typeof r.weight === "number") d.weight = r.weight;
              d.water = r.water || 0;
              d.protein = !!r.protein;
              d.sugar = !!r.sugar;
              d.steps = Math.round((r.exercise || 0) * 120);
              if(Array.isArray(r.meals)){
                r.meals.forEach(function(m){
                  (m.items || []).forEach(function(it){
                    d.meals.push({ name: it.name, unit: "", qty: it.qty || 1, kcal: it.kcal || 0, p: 0, at: m.at || "" });
                  });
                });
              }
            });
          }
          if(ob && ob.settings && ob.settings.vision) state.settings.vision = ob.settings.vision;
        }
      }
    }catch(e){}
    if(!state.settings.vision) state.settings.vision = { key:DFLT_VISION.key, model:DFLT_VISION.model };
  }

  /* ---------- 身体数据 ---------- */
  function weighIns(){
    var arr = [];
    Object.keys(state.days).forEach(function(k){
      var d = state.days[k];
      if(d && typeof d.weight === "number" && d.weight > 0) arr.push({ date:k, weight:d.weight, bf:d.bf, muscle:d.muscle, waist:d.waist, arm:d.arm, hip:d.hip });
    });
    arr.sort(function(a,b){ return a.date < b.date ? -1 : 1; });
    return arr;
  }
  function latestWeigh(){
    var w = weighIns();
    return w.length ? w[w.length-1] : null;
  }

  // 人物身形：腰半宽随减重收窄，6 档构成从起点到目标的刻度
  function personSvg(w){
    w = Number(w) || 12;
    var a=(30-w).toFixed(1), b=(30+w).toFixed(1);
    return "<circle cx='30' cy='10' r='6.6'/>"+
      "<path d='M30,19.4 C26,19.4 20,21 18,24 C16.4,30 "+a+",34 "+a+",40 C15.2,45 15,46 15,50 L45,50 "+
      "C45,46 44.8,45 "+b+",40 C"+b+",34 43.6,30 42,24 C40,21 34,19.4 30,19.4 Z'/>"+
      "<path d='M18.5,49 L26.5,49 L27.5,79 L16.5,79 Z'/>"+
      "<path d='M33.5,49 L41.5,49 L43.5,79 L32.5,79 Z'/>";
  }

  function figStripHtml(){
    var sw = startW(), tw = targetW();
    var total = Math.max(sw - tw, 1);
    var last = latestWeigh();
    var cur = last ? last.weight : sw;
    var p = Math.min(Math.max((sw - cur) / total, 0), 1);
    var idx = Math.round(p * 5), out = "";
    for(var i=0;i<6;i++){
      var lb = Math.round(sw - (sw - tw) * i / 5);
      var w = (12.5 - 3.5 * i / 5).toFixed(1);
      out += "<i"+(i === idx ? " class='on'" : "")+"><svg viewBox='0 0 60 80' aria-hidden='true'>"+personSvg(w)+"</svg><b>"+lb+"</b></i>";
    }
    return out;
  }

  function renderBody(){
    var last = latestWeigh();
    var cur = last ? last.weight : startW();
    document.getElementById("curW").innerHTML = fmt(cur, cur % 1 ? 1 : 0) + "<span>斤</span>";
    var total = startW() - targetW();
    var done = Math.min(Math.max(startW() - cur, 0), Math.max(total, 0));
    document.getElementById("doneW").textContent = fmt(done,1) + " 斤";
    document.getElementById("leftW").textContent = fmt(Math.max(cur - targetW(), 0),1) + " 斤";
    var pct = total > 0 ? done / total : 0;
    var C = 2 * Math.PI * 63;
    document.getElementById("ringArc").setAttribute("stroke-dashoffset", String(C * (1 - pct)));
    document.getElementById("ringPct").textContent = Math.round(pct * 100) + "%";

    var past = weighIns().slice(-7);
    var avg = past.length ? past.reduce(function(s,x){ return s + x.weight; }, 0) / past.length : null;
    document.getElementById("avg7").textContent = avg ? fmt(avg,1) + " 斤" : "—";

    var t = day();
    document.getElementById("inW").value = t.weight || "";
    document.getElementById("inBF").value = t.bf || "";
    document.getElementById("inMUS").value = t.muscle || "";
    document.getElementById("inWaist").value = t.waist || "";
    document.getElementById("inArm").value = t.arm || "";
    document.getElementById("inHip").value = t.hip || "";
    var fs = document.getElementById("figStrip");
    if(fs) fs.innerHTML = figStripHtml();
    document.getElementById("inStart").value = startW();
    document.getElementById("inTarget").value = targetW();

    var ph = phaseToday();
    document.getElementById("phaseBadge").textContent = ph.name;
    for(var i=0;i<PLAN.length;i++){
      var el = document.getElementById("ph"+i);
      if(el) el.classList.toggle("cur", PLAN[i].name === ph.name);
    }

    var rows = weighIns().slice().reverse().slice(0,14).map(function(r){
      var circ = [r.waist, r.arm, r.hip].map(function(v){ return v ? String(Math.round(v*10)/10) : "—"; }).join(" / ");
      return "<tr><td>"+r.date.slice(5)+"</td><td>"+fmt(r.weight,1)+"</td><td>"+(r.bf?fmt(r.bf,1):"—")+"</td><td>"+(r.muscle?fmt(r.muscle,1):"—")+"</td><td>"+circ+"</td></tr>";
    }).join("");
    document.getElementById("histBody").innerHTML = rows || "<tr><td colspan='5' style='color:#9aa79f'>还没有记录</td></tr>";

    renderChart();
  }

  function emptyRow(text){
    return "<div class='emptyrow'><svg class='figfaint' viewBox='0 0 60 80' aria-hidden='true'>"+personSvg(10.5)+"</svg><span>"+text+"</span></div>";
  }

  function emptyHtml(text){
    return "<svg class='figfaint' viewBox='0 0 60 80' aria-hidden='true'>"+personSvg(10.5)+"</svg><span>"+text+"</span>";
  }

  function renderChart(){
    var box = document.getElementById("chart");
    var tip = document.getElementById("chartTip");
    var empty = document.getElementById("chartEmpty");
    if(typeof echarts === "undefined"){
      box.hidden = true; empty.hidden = false; empty.innerHTML = emptyHtml("图表组件没加载成功，下面的历史表仍然可用"); tip.hidden = true; return;
    }
    var days = weighIns();
    var cut = new Date(); cut.setDate(cut.getDate()-34);
    var recs = days.filter(function(r){ return r.date >= keyOf(cut); });
    if(recs.length < 2){
      box.hidden = true; empty.hidden = false; empty.innerHTML = emptyHtml("存两三天体重，这里就会出曲线"); tip.hidden = true; return;
    }
    box.hidden = false; empty.hidden = true; tip.hidden = false;
    tip.textContent = "近 " + recs.length + " 条记录 · 最近一次 " + recs[recs.length-1].date;
    if(box.clientWidth === 0) return;
    if(!chart) chart = echarts.init(box, null, { renderer:"canvas" });
    var labels = recs.map(function(r){ return r.date.slice(5); });
    var data = recs.map(function(r){ return r.weight; });
    chart.setOption({
      animationDuration:400,
      grid:{ left:44, right:16, top:16, bottom:30 },
      tooltip:{ trigger:"axis", backgroundColor:"rgba(255,252,246,.96)", borderColor:"rgba(139,92,58,.2)", textStyle:{ color:"#342a20", fontSize:12 } },
      xAxis:{ type:"category", data:labels, axisLine:{ lineStyle:{ color:"#d9c9b4" } }, axisLabel:{ color:"#94826d", fontSize:10.5 }, axisTick:{ show:false } },
      yAxis:{ type:"value", scale:true, axisLine:{ show:false }, axisTick:{ show:false }, splitLine:{ lineStyle:{ color:"rgba(122,88,55,.12)" } }, axisLabel:{ color:"#94826d", fontSize:10.5 } },
      series:[{
        type:"line", data:data, smooth:true, showSymbol:true, symbolSize:5,
        lineStyle:{ color:"#8b5c3a", width:2 }, itemStyle:{ color:"#8b5c3a" },
        areaStyle:{ color:"rgba(139,92,58,.12)" },
        markLine:{ silent:true, symbol:"none", data:[{ yAxis: targetW(), lineStyle:{ color:"#c0653f", type:"dashed", width:1.4 }, label:{ formatter:"目标 "+targetW()+" 斤", color:"#c0653f", fontSize:10.5, position:"insideEndTop" } }] }
      }]
    });
    chart.resize();
  }

  /* ---------- 饮食 ---------- */
  function eatenKcal(d){ return (d.meals||[]).reduce(function(s,m){ return s + (m.kcal||0); }, 0); }
  function eatenProtein(d){ return (d.meals||[]).reduce(function(s,m){ return s + ((m.p||0)*(m.qty||1)); }, 0); }

  function dailyBurn(){
    var kg = curKg();
    return Math.round((10*kg + 6.25*BASE.h - 5*BASE.age - 161) * 1.3);
  }

  function paintGap(){
    var d = day(), ph = phaseToday();
    var intake = Math.round(eatenKcal(d));
    var ex = Math.round(burnTotal(d));
    var daily = dailyBurn();
    var total = daily + ex;
    var gap = total - intake;
    var planGap = daily + ph.ex - ph.intake;

    // 今天什么都没记时不下结论
    if(!intake && !ex){
      document.getElementById("gapVal").innerHTML = "—<span>千卡</span>";
      document.getElementById("gapBurn").textContent = daily + " 千卡";
      document.getElementById("gapIntake").textContent = "0 千卡";
      document.getElementById("gapNote").textContent = "只算了日常消耗 " + daily + "，记一餐、记运动后出缺口";
      document.getElementById("gapBar").classList.remove("over");
      document.getElementById("gapFill").style.width = "0%";
      document.getElementById("gapLeftBar").textContent = "等记录";
      document.getElementById("gapRightBar").textContent = "计划缺口 " + planGap + " 千卡";
      document.getElementById("gapTip").textContent = "今天还没有记录，先记一餐或一次训练";
      return;
    }

    document.getElementById("gapVal").innerHTML = Math.abs(gap) + "<span>千卡</span>";
    document.getElementById("gapBurn").textContent = total + " 千卡";
    document.getElementById("gapIntake").textContent = intake + " 千卡";
    document.getElementById("gapNote").textContent =
      "日常 " + daily + " + 运动 " + ex + " − 摄入 " + intake + " = " + (gap >= 0 ? "缺口 " : "超支 ") + Math.abs(gap) + " 千卡";

    var ratio = planGap > 0 ? gap / planGap : 0;
    var bar = document.getElementById("gapBar");
    bar.classList.toggle("over", gap < 0);
    document.getElementById("gapFill").style.width = Math.round(Math.min(Math.abs(ratio), 1.4) * 100) + "%";
    var gapLeft;
    if(gap < 0) gapLeft = "超支 " + Math.abs(gap) + " 千卡";
    else if(ratio <= 1.2) gapLeft = "达成计划缺口 " + Math.round(ratio * 100) + "%";
    else gapLeft = "比计划多 " + (gap - planGap) + " 千卡";
    document.getElementById("gapLeftBar").textContent = gapLeft;
    document.getElementById("gapRightBar").textContent = "计划缺口 " + planGap + " 千卡";

    var tip;
    if(intake < 30){ tip = "还没记吃的，缺口先按空腹算，记一餐再看"; }
    else if(intake < 800){ tip = "只记了 " + intake + " 千卡，缺口会虚高，三餐都记上才准"; }
    else if(gap < 0){ tip = "今天摄入超过总消耗 " + Math.abs(gap) + " 千卡，明天主食减一点补回来"; }
    else if(gap < planGap - 200){ tip = "缺口偏小，今天可以再多走 20 分钟"; }
    else if(gap > planGap + 250){ tip = "缺口偏大，注意力量重量别下滑，明天加回 200 千卡"; }
    else { tip = "缺口正好，按这个节奏走，别再多吃"; }
    document.getElementById("gapTip").textContent = tip;
  }

  function renderDiet(){
    var d = day(), ph = phaseToday();
    var eaten = eatenKcal(d), target = ph.intake;
    var left = target - eaten;
    document.getElementById("leftKcal").innerHTML = (left >= 0 ? left : Math.abs(left)) + "<span>千卡</span>";
    document.getElementById("budgetNote").textContent = (left >= 0 ? "还能摄入" : "已经超出预算") + " · " + ph.name;
    document.getElementById("targetKcal").textContent = target + " 千卡";
    document.getElementById("eatenKcal").textContent = eaten + " 千卡";
    var pct = Math.min(eaten / target, 1.4);
    var bar = document.getElementById("kcalBar");
    bar.classList.toggle("over", left < 0);
    document.getElementById("kcalFill").style.width = Math.round(pct * 100) + "%";
    document.getElementById("barLeft").textContent = "已吃 " + Math.round(pct*100) + "%";
    document.getElementById("barRight").textContent = "蛋白 " + Math.round(eatenProtein(d)) + " / 145 g";
    document.getElementById("waterCup").textContent = d.water || 0;
    document.getElementById("chipProtein").classList.toggle("on", !!d.protein);
    document.getElementById("chipSugar").classList.toggle("on", !!d.sugar);

    renderDraft();
    renderTodayMeals();
    renderFoodGrid(document.getElementById("foodSearch").value);
    var cfg = state.settings.vision || {};
    document.getElementById("aiKey").value = cfg.key || "";
    document.getElementById("aiModel").value = cfg.model || "";
    setAiState(cfg.key && cfg.model ? "已接通 · " + cfg.model : "还没配置接口", cfg.key && cfg.model ? "ok" : "");
    paintGap();
  }

  function renderFoodGrid(q){
    q = (q || "").trim();
    var list = FOOD.filter(function(f){
      if(!q) return true;
      return f.n.indexOf(q) >= 0 || f.c.indexOf(q) >= 0;
    }).slice(0, 30);
    document.getElementById("foodGrid").innerHTML = list.map(function(f, i){
      var idx = FOOD.indexOf(f);
      return "<button class='food' type='button' data-idx='"+idx+"'><b>"+f.n+"<i>"+f.k+"</i></b><span>"+f.d+"</span></button>";
    }).join("") || "<p class='sub'>没搜到，换个词试试</p>";
  }

  function renderDraft(){
    var box = document.getElementById("mealList");
    if(!draft.length){
      box.innerHTML = "<p class='sub' style='margin:6px 0 0'>拍照记，或者从食物库挑，都会进这里</p>";
      document.getElementById("mealHint").textContent = "共 0 千卡 · 蛋白 0 g";
      return;
    }
    var kcal = draft.reduce(function(s,x){ return s + x.kcal * x.qty; }, 0);
    var p = draft.reduce(function(s,x){ return s + x.p * x.qty; }, 0);
    document.getElementById("mealHint").textContent = "共 " + Math.round(kcal) + " 千卡 · 蛋白 " + Math.round(p) + " g";
    box.innerHTML = draft.map(function(it, i){
      return "<div class='row'><div class='nm'>"+it.name+"<small>"+it.unit+" · "+Math.round(it.kcal)+" 千卡/份</small></div>"+
        "<div style='display:flex;align-items:center;gap:8px'><div class='stepper'><button data-q='-1' data-i='"+i+"' type='button'>−</button><span>"+it.qty+"</span><button data-q='1' data-i='"+i+"' type='button'>+</button></div>"+
        "<button class='del' data-d='"+i+"' type='button'>×</button></div></div>";
    }).join("");
  }

  function renderTodayMeals(){
    var d = day();
    var box = document.getElementById("todayMeals");
    if(!d.meals.length){ box.innerHTML = emptyRow("今天还没记吃的"); return; }
    box.innerHTML = d.meals.map(function(m, i){
      return "<div class='row'><div class='nm'>"+m.name+"<small>"+(m.unit||"")+(m.at?" · "+m.at:"")+"</small></div>"+
        "<div style='display:flex;align-items:center;gap:10px'><span class='kcal'>"+Math.round(m.kcal)+" 千卡</span><button class='del' data-m='"+i+"' type='button'>×</button></div></div>";
    }).join("");
  }

  function setAiState(text, cls){
    var el = document.getElementById("aiState");
    el.textContent = text;
    el.className = "aistate" + (cls ? " " + cls : "");
  }

  function compressPhoto(file, cb){
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function(){
      var max = 900;
      var w = img.width, h = img.height;
      if(w > h && w > max){ h = Math.round(h * max / w); w = max; }
      else if(h >= w && h > max){ w = Math.round(w * max / h); h = max; }
      var c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      cb(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = function(){ URL.revokeObjectURL(url); cb(""); };
    img.src = url;
  }

  function runAI(){
    var cfg = state.settings.vision || {};
    if(!mealPhoto){ alert("先拍一张或选一张照片。"); return; }
    if(!cfg.key || !cfg.model){ alert("还没配置接口，点「接口设置」把 key 和模型 ID 填上。"); return; }
    setAiState("识别中…", "");
    var body = {
      model: cfg.model,
      temperature: 0.2,
      messages: [
        { role:"system", content:"你是中文营养估算助手。看图认出盘中或桌上的食物，按中国常见做法和可见份量估热量。只输出 JSON，不要解释。格式：{\"items\":[{\"name\":\"食物名\",\"portion\":\"份量\",\"kcal\":整数,\"p\":蛋白克数}],\"note\":\"一句提醒\"}" },
        { role:"user", content:[
          { type:"text", text:"估算这张照片里食物的热量和蛋白，按主食、蛋白、蔬菜、饮品分别列出。" },
          { type:"image_url", image_url:{ url: mealPhoto } }
        ]}
      ]
    };
    fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + cfg.key },
      body: JSON.stringify(body)
    }).then(function(r){ return r.json(); }).then(function(j){
      if(j.error){ setAiState("接口报错：" + j.error.code, "bad"); return; }
      var text = j.choices[0].message.content;
      var m = text.match(/\{[\s\S]*\}/);
      if(!m){ setAiState("识别结果格式不对，再拍一张试试", "bad"); return; }
      var obj = JSON.parse(m[0]);
      var items = obj.items || [];
      items.forEach(function(it){
        draft.push({ name: it.name || "食物", unit: it.portion || "", qty: 1, kcal: Number(it.kcal) || 0, p: Number(it.p) || 0 });
      });
      renderDraft();
      setAiState("认出 " + items.length + " 样，份量可调" + (obj.note ? " · " + obj.note : ""), "ok");
    }).catch(function(e){ setAiState("请求失败：" + e.message, "bad"); });
  }

  function runWatchAI(){
    var cfg = state.settings.vision || {};
    var el = document.getElementById("watchAi");
    if(!watchShot){ alert("先选一张手表或运动 App 的数据截图。"); return; }
    if(!cfg.key || !cfg.model){ alert("还没配置接口，点「接口设置」把 key 和模型 ID 填上。"); return; }
    el.textContent = "识别中…"; el.className = "aistate";
    var body = {
      model: cfg.model,
      temperature: 0.1,
      messages: [
        { role:"system", content:"你是读数助手。从智能手表或运动 App 的今日数据截图里读出两个数字：步数、活动消耗（千卡）。只输出 JSON：{\"steps\":整数,\"kcal\":整数}；看不清的给 null，不要解释。" },
        { role:"user", content:[
          { type:"text", text:"读出这张截图里的今日步数和活动消耗（千卡）。" },
          { type:"image_url", image_url:{ url: watchShot } }
        ]}
      ]
    };
    fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + cfg.key },
      body: JSON.stringify(body)
    }).then(function(r){ return r.json(); }).then(function(j){
      if(j.error){ el.className = "aistate bad"; el.textContent = "接口报错：" + j.error.code; return; }
      var text = j.choices[0].message.content;
      var m = text.match(/\{[\s\S]*\}/);
      if(!m){ el.className = "aistate bad"; el.textContent = "没读出数字，换张图或手动填"; return; }
      var o = JSON.parse(m[0]);
      var steps = parseInt(o.steps, 10), kcal = parseInt(o.kcal, 10);
      var d = day(), got = [];
      if(!isNaN(steps) && steps > 0 && steps < 60000){ d.steps = steps; got.push(steps + " 步"); }
      if(!isNaN(kcal) && kcal > 0 && kcal < 3000){ d.watchKcal = kcal; got.push(kcal + " 千卡"); }
      if(!got.length){ el.className = "aistate bad"; el.textContent = "截图里没认出身步数和消耗"; return; }
      save(); renderMove(); flash("watchTip");
      el.className = "aistate ok"; el.textContent = "已填入 " + got.join(" · ");
    }).catch(function(e){ el.className = "aistate bad"; el.textContent = "请求失败：" + e.message; });
  }

  /* ---------- 运动 ---------- */
  // 力量按 MET 5.0 估算：每组约 2.5 分钟（含组间休息）+ 整场 8 分钟热身
  // 有氧按种类基准强度 × 体重系数（基准 70kg），步数按 0.03 千卡/步 × 体重系数
  function curKg(){
    var last = latestWeigh();
    var jin = last ? last.weight : startW();
    return Math.round((jin / 2) * 10) / 10;
  }
  function bwFactor(){ return curKg() / 70; }
  function strengthMinutes(d){
    var sets = (d.strength||[]).reduce(function(s,x){ return s + (x.sets||0); }, 0);
    return sets ? 8 + sets * 2.5 : 0;
  }
  function strengthKcal(d){
    if(!(d.strength||[]).length) return 0;
    return 5 * 3.5 * curKg() / 200 * strengthMinutes(d);
  }
  function setKcal(x, d){
    var totalSets = (d.strength||[]).reduce(function(s,y){ return s + (y.sets||0); }, 0);
    return totalSets ? strengthKcal(d) * (x.sets||0) / totalSets : 0;
  }
  function cardioKcal(d){
    return (d.cardio||[]).reduce(function(s,x){ return s + (CARDIO[x.type] || 6) * bwFactor() * (x.min || 0); }, 0);
  }
  function stepKcal(d){ return Math.round((d.steps || 0) * 0.03 * bwFactor()); }
  function watchKcal(d){ return Math.round(d.watchKcal || 0); }
  // 手表的活动消耗已含走路，所以有手表数据时用它替换步数折算，避免重复计
  function activeKcal(d){ return watchKcal(d) || stepKcal(d); }
  function burnTotal(d){ return strengthKcal(d) + cardioKcal(d) + activeKcal(d); }

  function paintBurn(){
    var d = day(), ph = phaseToday();
    var st = Math.round(strengthKcal(d)), ca = Math.round(cardioKcal(d));
    var step = stepKcal(d), act = activeKcal(d), isWatch = watchKcal(d) > 0;
    var tot = st + ca + act;
    document.getElementById("stepKcal").value = step;
    document.getElementById("burnStepsLabel").textContent = isWatch ? "手表" : "步数";
    document.getElementById("burnStrength").textContent = st + " 千卡";
    document.getElementById("burnCardio").textContent = ca + " 千卡";
    document.getElementById("burnSteps").textContent = act + " 千卡";
    document.getElementById("burnTotal").textContent = tot + " 千卡";
    var rate = ph.ex ? Math.min(1, tot / ph.ex) : 0;
    var fill = document.getElementById("burnFill");
    if(fill) fill.style.width = Math.round(rate * 100) + "%";
    var note = document.getElementById("burnNote");
    if(note) note.textContent = "阶段目标 " + ph.ex + " 千卡 · 今天完成 " + Math.round(rate * 100) + "%" +
      (tot >= ph.ex ? "，达标了" : "，还差 " + Math.round(ph.ex - tot) + " 千卡") +
      (isWatch ? " · 用手表实测消耗" : "");
    var f = document.getElementById("burnFormula");
    if(f) f.textContent = "按体重 " + curKg() + " kg 估算：力量 MET 5.0（每组约 2.5 分钟含组间休息 + 热身 8 分钟），有氧按种类强度 × 体重系数，步数 0.03 千卡/步 × 体重系数。体重变了自动重算；有氧那段路的步数会重复计，保守点就把步数按净走的记。" + (isWatch ? " 已用手表消耗替代步数折算（手表里含走路）；若手表也记了力量和这场的训练，那两项会重复，可删掉对应记录。" : "");
  }

  function renderMove(){
    var d = day();
    paintGap();
    var wd = new Date().getDay();
    document.getElementById("todayPlan").innerHTML = "<b>今天：" + WEEKPLAN[wd] + "</b><br><small style='color:#5d6f65'>按周几固定，练不动就先做力量那一半</small>";
    var names = ["日","一","二","三","四","五","六"];
    var dayIdx = wd === 0 ? 6 : wd - 1;   // 周一为 0
    var chips = "";
    for(var ci=0; ci<7; ci++){            // 顺序：一 二 三 四 五 六 日
      chips += "<div class='weekchip"+(ci===dayIdx?" on":"")+"'>周"+names[(ci+1)%7]+"</div>";
    }
    document.getElementById("weekChips").innerHTML = chips;

    document.getElementById("strengthList").innerHTML = (d.strength||[]).map(function(x,i){
      return "<div class='row'><div class='nm'>"+x.name+"<small>"+x.weight+" kg × "+x.sets+" 组 × "+x.reps+" 次</small></div>"+
        "<div style='display:flex;align-items:center;gap:10px'><span class='kcal'>约 "+Math.round(setKcal(x,d))+" 千卡</span><button class='del' data-s='"+i+"' type='button'>×</button></div></div>";
    }).join("") || emptyRow("今天还没记力量");

    document.getElementById("cardioList").innerHTML = (d.cardio||[]).map(function(x,i){
      return "<div class='row'><div class='nm'>"+x.type+"<small>"+x.min+" 分钟 · 约 "+Math.round((CARDIO[x.type]||6)*bwFactor()*x.min)+" 千卡</small></div><button class='del' data-c='"+i+"' type='button'>×</button></div>";
    }).join("") || emptyRow("今天还没记有氧");

    document.getElementById("inSteps").value = d.steps || "";
    document.getElementById("inWatchKcal").value = d.watchKcal || "";
    paintWatchStatus(d);
    paintBurn();
    var ph = phaseToday();

    // 本周柱状（含今天往前 7 天）
    var bars = [];
    var today = new Date();
    for(var i=6;i>=0;i--){
      var dt = new Date(today); dt.setDate(dt.getDate()-i);
      var k = keyOf(dt);
      var dd = state.days[k];
      bars.push({ label: k.slice(8), val: dd ? burnTotal(dd) : 0, on: k === todayKey() });
    }
    var max = Math.max(ph.ex * 1.4, Math.max.apply(null, bars.map(function(b){ return b.val; })), 1);
    var hasData = bars.some(function(b){ return b.val > 0; });
    document.getElementById("weekBars").innerHTML = hasData ? bars.map(function(b){
      return "<div class='b"+(b.on?" on":"")+"'><i style='height:"+Math.max(3, Math.round(b.val/max*100))+"%'></i><span>"+b.label+"</span></div>";
    }).join("") : "<div class='barsempty'><svg class='figfaint' viewBox='0 0 60 80' aria-hidden='true'><circle cx='30' cy='10' r='6.6'/><path d='M30,19.4 C26,19.4 20,21 18,24 C16.4,30 19.5,34 19.5,40 C15.2,45 15,46 15,50 L45,50 C45,46 44.8,45 40.5,40 C40.5,34 43.6,30 42,24 C40,21 34,19.4 30,19.4 Z'/><path d='M18.5,49 L26.5,49 L27.5,79 L16.5,79 Z'/><path d='M33.5,49 L41.5,49 L43.5,79 L32.5,79 Z'/></svg><span>本周还没有训练记录</span></div>";
  }

  function updateBurn(){ paintBurn(); paintGap(); }

  function paintWatchStatus(d){
    var ws = document.getElementById("watchStatus");
    if(!ws) return;
    var has = watchKcal(d) > 0;
    ws.value = has ? "已接入手表数据" : "还没同步";
    ws.style.color = has ? "var(--wood-dark)" : "var(--faint)";
  }

  /* ---------- 导出/清空 ---------- */
  function exportCsv(){
    var recs = weighIns();
    var lines = ["日期,体重(斤),体脂率(%),骨骼肌(kg),腰围(cm),臂围(cm),臀围(cm),摄入(千卡),手表消耗(千卡),运动消耗(千卡),饮水(杯),缺口(千卡)"];
    Object.keys(state.days).sort().forEach(function(k){
      var d = state.days[k];
      lines.push([k, d.weight||"", d.bf||"", d.muscle||"", d.waist||"", d.arm||"", d.hip||"", eatenKcal(d), d.watchKcal||"", Math.round(burnTotal(d)), d.water||0, dailyBurn() + Math.round(burnTotal(d)) - Math.round(eatenKcal(d))].join(","));
    });
    var blob = new Blob(["\ufeff"+lines.join("\n")], { type:"text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "减脂数据-"+todayKey()+".csv";
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
  }

  /* ---------- 事件绑定 ---------- */
  function flash(id){
    var el = document.getElementById(id);
    el.classList.add("on");
    setTimeout(function(){ el.classList.remove("on"); }, 1600);
  }

  function bindBody(){
    document.getElementById("saveBody").addEventListener("click", function(){
      var d = day();
      var w = parseFloat(document.getElementById("inW").value);
      if(isNaN(w) || w < 40 || w > 300){ alert("体重填 40–300 斤之间。"); return; }
      d.weight = Math.round(w * 10) / 10;
      var bf = parseFloat(document.getElementById("inBF").value);
      var mus = parseFloat(document.getElementById("inMUS").value);
      var waist = parseFloat(document.getElementById("inWaist").value);
      var arm = parseFloat(document.getElementById("inArm").value);
      var hip = parseFloat(document.getElementById("inHip").value);
      if(!isNaN(bf)) d.bf = bf;
      if(!isNaN(mus)) d.muscle = mus;
      if(!isNaN(waist)) d.waist = waist;
      if(!isNaN(arm)) d.arm = arm;
      if(!isNaN(hip)) d.hip = hip;
      save(); renderBody(); flash("bodyTip");
    });

    document.getElementById("saveGoal").addEventListener("click", function(){
      var s = parseFloat(document.getElementById("inStart").value);
      var t = parseFloat(document.getElementById("inTarget").value);
      if(isNaN(s) || isNaN(t)){ alert("起始和目标都要填数字。"); return; }
      state.settings.startWeight = s;
      state.settings.targetWeight = t;
      state.settings.planV2 = true;
      save(); renderBody(); renderDiet(); flash("goalTip");
    });

    document.getElementById("exportCsv").addEventListener("click", exportCsv);

    document.getElementById("clearAll").addEventListener("click", function(){
      if(!confirm("清空所有记录？这一步不可撤销。")) return;
      state.days = {};
      save(); renderBody(); renderDiet(); renderMove();
    });
  }

  function bindDiet(){
    document.getElementById("foodSearch").addEventListener("input", function(){ renderFoodGrid(this.value); });
    document.getElementById("foodGrid").addEventListener("click", function(e){
      var b = e.target.closest(".food");
      if(!b) return;
      var f = FOOD[Number(b.getAttribute("data-idx"))];
      if(!f) return;
      var exist = draft.filter(function(x){ return x.name === f.n; })[0];
      if(exist) exist.qty += 1;
      else draft.push({ name:f.n, unit:f.d, qty:1, kcal:f.k, p:f.p });
      renderDraft();
    });
    document.getElementById("mealList").addEventListener("click", function(e){
      var q = e.target.getAttribute("data-q");
      var i = e.target.getAttribute("data-i");
      var del = e.target.getAttribute("data-d");
      if(del !== null){ draft.splice(Number(del),1); renderDraft(); return; }
      if(q){
        var it = draft[Number(i)];
        if(!it) return;
        it.qty = Math.round((it.qty + Number(q) * 0.5) * 10) / 10;
        if(it.qty <= 0) draft.splice(Number(i),1);
        renderDraft();
      }
    });
    document.getElementById("clearMeal").addEventListener("click", function(){ draft = []; renderDraft(); });
    document.getElementById("saveMeal").addEventListener("click", function(){
      if(!draft.length){ alert("清单是空的，先挑点吃的。"); return; }
      var d = day();
      var now = new Date();
      var at = pad(now.getHours()) + ":" + pad(now.getMinutes());
      draft.forEach(function(it){
        d.meals.push({ name:it.name, unit:it.unit, qty:it.qty, kcal: Math.round(it.kcal * it.qty), p: it.p || 0, at: at });
      });
      draft = []; mealPhoto = "";
      var pv = document.getElementById("photoPreview");
      pv.hidden = true; pv.removeAttribute("src");
      document.getElementById("photoEmpty").hidden = false;
      document.getElementById("photoInput").value = "";
      save(); renderDiet(); flash("mealTip");
    });
    document.getElementById("todayMeals").addEventListener("click", function(e){
      var m = e.target.getAttribute("data-m");
      if(m === null) return;
      day().meals.splice(Number(m),1);
      save(); renderDiet();
    });
    document.getElementById("waterPlus").addEventListener("click", function(){ day().water = (day().water||0) + 1; save(); renderDiet(); });
    document.getElementById("waterMinus").addEventListener("click", function(){ day().water = Math.max(0, (day().water||0) - 1); save(); renderDiet(); });
    document.getElementById("chipProtein").addEventListener("click", function(){ day().protein = !day().protein; save(); renderDiet(); });
    document.getElementById("chipSugar").addEventListener("click", function(){ day().sugar = !day().sugar; save(); renderDiet(); });

    // 拍照
    document.getElementById("photoInput").addEventListener("change", function(){
      var f = this.files && this.files[0];
      if(!f) return;
      compressPhoto(f, function(dataUrl){
        if(!dataUrl){ alert("这张图读不出来，换一张试试。"); return; }
        mealPhoto = dataUrl;
        var pv = document.getElementById("photoPreview");
        pv.src = dataUrl; pv.hidden = false;
        document.getElementById("photoEmpty").hidden = true;
      });
    });
    document.getElementById("aiRun").addEventListener("click", runAI);
    document.getElementById("aiCfg").addEventListener("click", function(){
      var box = document.getElementById("aiCfgBox");
      box.hidden = !box.hidden;
    });
    document.getElementById("aiSave").addEventListener("click", function(){
      var k = document.getElementById("aiKey").value.trim();
      var m = document.getElementById("aiModel").value.trim();
      state.settings.vision = { key:k, model:m };
      save();
      setAiState(k && m ? "已保存 · " + m : "还差 key 或模型 ID", k && m ? "ok" : "bad");
    });
  }

  function bindMove(){
    document.getElementById("addStrength").addEventListener("click", function(){
      var n = document.getElementById("stName").value.trim();
      var w = parseFloat(document.getElementById("stWeight").value);
      var s = parseFloat(document.getElementById("stSets").value);
      var r = parseFloat(document.getElementById("stReps").value);
      if(!n){ alert("先填动作名，比如深蹲。"); return; }
      if(isNaN(w) || isNaN(s) || isNaN(r)){ alert("重量、组数、次数都要填。"); return; }
      day().strength.push({ name:n, weight:w, sets:s, reps:r });
      document.getElementById("stName").value = "";
      document.getElementById("stWeight").value = "";
      document.getElementById("stSets").value = "";
      document.getElementById("stReps").value = "";
      save(); renderMove(); flash("strengthTip");
    });
    document.getElementById("strengthList").addEventListener("click", function(e){
      var i = e.target.getAttribute("data-s");
      if(i === null) return;
      day().strength.splice(Number(i),1);
      save(); renderMove();
    });
    document.getElementById("addCardio").addEventListener("click", function(){
      var type = document.getElementById("cardioType").value;
      var min = parseFloat(document.getElementById("cardioMin").value);
      if(isNaN(min) || min <= 0){ alert("填时长，单位分钟。"); return; }
      day().cardio.push({ type:type, min:min });
      document.getElementById("cardioMin").value = "";
      save(); renderMove();
    });
    document.getElementById("cardioList").addEventListener("click", function(e){
      var i = e.target.getAttribute("data-c");
      if(i === null) return;
      day().cardio.splice(Number(i),1);
      save(); renderMove();
    });
    document.getElementById("inSteps").addEventListener("input", function(){
      var v = parseFloat(this.value);
      var d = day();
      d.steps = isNaN(v) ? 0 : Math.round(v);
      save();
      updateBurn();
    });
    document.getElementById("inWatchKcal").addEventListener("input", function(){
      var v = parseFloat(this.value);
      var d = day();
      if(isNaN(v)) delete d.watchKcal; else d.watchKcal = Math.round(v);
      save(); paintBurn(); paintWatchStatus(d); paintGap();
    });
    document.getElementById("watchInput").addEventListener("change", function(){
      var f = this.files && this.files[0];
      if(!f) return;
      compressPhoto(f, function(dataUrl){
        if(!dataUrl){ alert("这张图读不了，换一张试试。"); return; }
        watchShot = dataUrl;
        var pv = document.getElementById("watchPreview");
        pv.src = dataUrl; pv.hidden = false;
        document.getElementById("watchEmpty").hidden = true;
        document.getElementById("watchAi").textContent = "";
        document.getElementById("watchAi").className = "aistate";
      });
    });
    document.getElementById("watchRun").addEventListener("click", runWatchAI);
    document.getElementById("saveMove").addEventListener("click", function(){ save(); flash("moveTip"); });
  }

  function bindTabs(){
    var bar = document.getElementById("tabbar");
    bar.addEventListener("click", function(e){
      var b = e.target.closest("button[data-tab]");
      if(!b) return;
      var name = b.getAttribute("data-tab");
      Array.prototype.forEach.call(bar.querySelectorAll("button"), function(x){ x.classList.toggle("on", x === b); });
      ["body","diet","move"].forEach(function(n){
        document.getElementById("pane-" + n).classList.toggle("on", n === name);
      });
      if(name === "body"){ renderBody(); setTimeout(function(){ if(chart) chart.resize(); }, 60); }
      if(name === "diet") renderDiet();
      if(name === "move") renderMove();
      window.scrollTo({ top:0, behavior:"smooth" });
    });
  }

  /* ---------- 启动 ---------- */
  load();
  bindBody(); bindDiet(); bindMove(); bindTabs();
  renderBody(); renderDiet(); renderMove();
  window.addEventListener("resize", function(){ if(chart) chart.resize(); });

  /* ---------- 快捷指令带参同步：?sync=1&steps=…&burn=… ---------- */
  (function syncFromUrl(){
    try{
      var q = new URLSearchParams(location.search || "");
      if(!q.get("sync")) return;
      var d = day(), got = [];
      var steps = parseInt(q.get("steps"), 10), kcal = parseInt(q.get("burn") || q.get("kcal"), 10);
      if(!isNaN(steps) && steps > 0 && steps < 60000){ d.steps = steps; got.push(steps + " 步"); }
      if(!isNaN(kcal) && kcal > 0 && kcal < 3000){ d.watchKcal = kcal; got.push(kcal + " 千卡"); }
      if(!got.length) return;
      save(); renderMove(); renderDiet(); renderBody();
      setTimeout(function(){ alert("已从手表同步：" + got.join(" · ")); }, 150);
      history.replaceState(null, "", location.pathname);
    }catch(e){}
  })();
})();
