class Popup {
    constructor(content) {
      this.popup = document.createElement('div');
      this.popup.classList.add('r_popup-overlay');
      this.popup.onclick = this.destroy();
      let inner = document.createElement('div');
      inner.classList.add('r_popup');
      inner.appendChild(content);
      document.body.appendChild(this.popup)
    }

    destroy(){
        this.popup.remove();
    }
}

document.addEventListener('click',function(e){
    console.log(e.target)
    if(e.target && e.target.classList.contains('videobtn')){
        let url = e.target.getAttribute('data-videourl');
        if (url){
            let iframe = document.createElement('iframe');
            iframe.src = url;
            new Popup(iframe);
        }
        e.preventDefault();
    }
});