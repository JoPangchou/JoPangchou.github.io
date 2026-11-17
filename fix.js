(function(){
  "use strict";
  function $(id){ return document.getElementById(id); }
  function ready(fn){
    if(document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function(){
    var st = $("aiState"), run = $("aiRun"), pv = $("photoPreview"), inp = $("photoInput"), box = $("aiCfgBox");
    if(!st || !run || !pv || !inp) return;
    function has(){ return !pv.hidden && !!pv.getAttribute("src"); }
    function hint(text, cls){ st.textContent = text; st.className = "aistate" + (cls ? " " + cls : ""); }
    function base(){ return st.textContent.replace(" · 先选一张照片再点识别", ""); }

    if(!has()) hint(base() + " · 先选一张照片再点识别", "");

    inp.addEventListener("change", function(){
      setTimeout(function(){
        if(has()) hint("照片已选，点「识别这张照片」", "");
        else hint("这张图没读出来，换一张再试", "bad");
      }, 500);
    });

    run.addEventListener("click", function(){
      if(!has()){
        hint("还没选到照片：先点上面那块区域，选拍照或从相册挑一张", "bad");
        if(box) box.hidden = false;
        return;
      }
      if(!$("aiKey").value.trim() || !$("aiModel").value.trim()){
        hint("接口没配好：先填 key 和模型 ID，再点「保存配置」", "bad");
        if(box) box.hidden = false;
      }
    }, true);
  });
})();
