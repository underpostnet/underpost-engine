function dragDrop(div) {
  let object = s(div),
    initX,
    initY,
    firstX,
    firstY;

  object.addEventListener(
    'mousedown',
    function (e) {
      // e.preventDefault();
      initX = this.offsetLeft;
      initY = this.offsetTop;
      firstX = e.pageX;
      firstY = e.pageY;

      this.addEventListener('mousemove', dragIt, false);

      window.addEventListener(
        'mouseup',
        function () {
          object.removeEventListener('mousemove', dragIt, false);
        },
        false
      );
    },
    false
  );

  object.addEventListener(
    'touchstart',
    function (e) {
      // e.preventDefault();
      initX = this.offsetLeft;
      initY = this.offsetTop;
      let touch = e.touches;
      firstX = touch[0].pageX;
      firstY = touch[0].pageY;

      this.addEventListener('touchmove', swipeIt, false);

      window.addEventListener(
        'touchend',
        function (e) {
          // e.preventDefault();
          object.removeEventListener('touchmove', swipeIt, false);
        },
        false
      );
    },
    false
  );

  function dragIt(e) {
    this.style.left = initX + e.pageX - firstX + 'px';
    this.style.top = initY + e.pageY - firstY + 'px';
  }

  function swipeIt(e) {
    let contact = e.touches;
    this.style.left = initX + contact[0].pageX - firstX + 'px';
    this.style.top = initY + contact[0].pageY - firstY + 'px';
  }
}
