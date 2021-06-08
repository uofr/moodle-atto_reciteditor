M = M || {};
M.recit = M.recit || {};
M.recit.reciteditor = M.recit.reciteditor || {};

M.recit.reciteditor.Popup = class {
    constructor(content) {
      this.popup = document.createElement('div');
      this.popup.classList.add('r_popup-overlay');
      this.popup.onclick = this.destroy.bind(this);
      let inner = document.createElement('div');
      inner.classList.add('r_popup');
      inner.appendChild(content);
      this.popup.appendChild(inner)
      document.body.appendChild(this.popup)
    }
    destroy(){
        this.popup.remove();
    }
}

document.body.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains('videobtn')){
        let url = e.target.getAttribute('data-videourl');
        if (url){
            let iframe = document.createElement('iframe');
            iframe.src = url;
            new M.recit.reciteditor.Popup(iframe);
        }
        e.preventDefault();
    }else if(e.target && e.target.classList.contains('img-popup')){
        let url = e.target.src;
        if (url){
            let img = document.createElement('img');
            img.src = url;
            new M.recit.reciteditor.Popup(img);
        }
        e.preventDefault();
    }
});

