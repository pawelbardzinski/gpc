(function(){
   if(top === self){
      return false;
   }
   
   var obj = null;
   var height = null;
   
   var url = 'http://sh1ny.com/setter.html';
   var id = 'newsframe';
   
   window.onload = createFrame;

   function createFrame(){
      var frame = document.createElement('iframe');
      frame.setAttribute('src', '');
      frame.setAttribute('width', 0);
      frame.setAttribute('height', 0);
      frame.setAttribute('id', 'paramsetter');
      frame.setAttribute('name', 'paramsetter');
      frame.setAttribute('border', 0);
      frame.setAttribute('frameborder', 0);
      frame.setAttribute('scrolling', 'no');
      frame.setAttribute('style', 'visibility: hidden;');
      obj = frame;
      document.body.appendChild(frame);
      setHeight();
   };

   function setHeight(){
      height = getPageHeight();
      obj.src = url + '?id=' + id + '&height=' + height + '&timestamp=' + (new Date()).getTime();
   };
   
   function getPageHeight(){
      if(/(msie) ([\w.]+)/.test(navigator.appVersion.toLowerCase())){
         return Math.max(0, document.body.clientHeight, document.body.scrollHeight, document.body.offsetHeight);
      }else{
         return Math.max(0, document.body.offsetHeight, document.documentElement.offsetHeight);
      }
   };
})();