'use strict';
{
  // --------------------
  // ハンバーガーメニュー
  // --------------------
  const toggles = document.querySelectorAll('.toggle');
  const toggleHamburgers = document.querySelectorAll('.toggle-hamburger')

  toggles.forEach(toggle=>{
    toggle.addEventListener('click',()=>{
      toggleHamburgers.forEach(toggleHamburger=>{
        toggleHamburger.classList.toggle('appear');
      });
    });
  })

  //---------------------------------------
  // メインビジュアルのカルーセル（無限ループ）
  //---------------------------------------
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  const ul = document.getElementById('ul');
  const slides = ul.children;//配列で取得
  const dots = [];
  let currentIndex = 2;//スライドの移動距離の倍数


  // スライドをコピーし、b,c,(a,b,c),a,bを作る
  function copySlides(){
    // 最初のスライドaをコピーし最後尾に貼り付け
    const firstImage = slides[0];
    const copyImageFirst = firstImage.cloneNode(true);
    const setImageLater = slides[slides.length];
    ul.insertBefore(copyImageFirst,setImageLater); //aのクローンを最後尾に挿入

    // 最初+1番目のスライドbをコピーし最後尾に挿入
    const secondImage = slides[1];
    const copyImageSecond = secondImage.cloneNode(true);
    const setImageLast = slides[slides.length];
    ul.insertBefore(copyImageSecond,setImageLast);

    // 最後+1番目のスライドbをコピーし最後尾に挿入
    const laterImage = slides[slides.length - 4];
    const copyImageLater = laterImage.cloneNode(true);
    const setImageFirst = slides[0];
    ul.insertBefore(copyImageLater,setImageFirst);
    // 最後のスライドcをコピーし、先頭に貼り付け
    const lastImage = slides[slides.length - 3];
    const copyImageLast = lastImage.cloneNode(true);
    const setImageSecond = slides[1];
    ul.insertBefore(copyImageLast,setImageSecond); //cのクローンを最後尾に挿入
  }

  // スライドの初期位置の設定
  function slidesInitialPosition(){
    const slideWidth = slides[0].getBoundingClientRect().width; //スライド幅を取得
    ul.style.transform = `translateX(${-2.24 * slideWidth}px)`;
  }
  
  // currentIndexの+時のループ
  function currentIndexNext(){
    if(currentIndex >= slides.length - 2){
      currentIndex = 2;
    }else{
      currentIndex++;
    }
  }

  // currentIndexの-時のループ
  function currentIndexPrev(){
    if(currentIndex <= 1){
      currentIndex = slides.length - 3;
    }else{
      currentIndex--;
    }
  }

  // next時スライドの移動速度の設定
  function slideTransformNext(){
    if(currentIndex === 2){
      ul.classList.remove('transform-on');
      ul.classList.add('transform-off'); //0秒でスライドの切り換え
    }else{
      ul.classList.remove('transform-off');
      ul.classList.add('transform-on');
    }
  }
  // prev時スライドの移動速度
  function slideTransformPrev(){
    if(currentIndex === slides.length - 3){
      ul.classList.remove('transform-on');
      ul.classList.add('transform-off');
      //0秒でスライドの切り換え
    }else{
      ul.classList.remove('transform-off');
      ul.classList.add('transform-on');
    }
  }
  // ドットボタン押し時のスライド速度
  function slideTransformDot(){
      ul.classList.remove('transform-off');
      ul.classList.add('transform-on');
  }

  //イメージの幅分だけスライドを左右に動かすための処理
  function moveSlides(){
    const slideWidth = slides[0].getBoundingClientRect().width; //スライド幅を取得
    ul.style.transform = `translateX(${-1.12 * slideWidth * currentIndex}px)`;
  }
  
  //ドットボタンの処理・生成
  function setupDots(){
    for(let i=0; i < slides.length;i++){
      const button = document.createElement('button');
      button.addEventListener('click',()=>{
        currentIndex = i;
        updateDots();
        moveSlides();
        slideTransformDot()
      });
      dots.push(button);
      
      document.getElementById('nav').appendChild(button);
    }
    dots[2].classList.add('current');
  }
  //クリックしたボタンに色をつける
  function updateDots(){
    dots.forEach(dot=>{
      dot.classList.remove('current');
    });
    dots[currentIndex].classList.add('current');
  }


  copySlides();
  slidesInitialPosition();
  setupDots();

  next.addEventListener('click',()=>{
    function slideFlowNext(){
      currentIndexNext();
      updateDots();
      moveSlides();
      slideTransformNext();
      ul.addEventListener('transitionend',()=>{
        if(currentIndex === slides.length - 2){
          slideFlowNext();
        }
      });
    }
    slideFlowNext();
  });

  prev.addEventListener('click',()=>{
    function slideFlowPrev(){
      currentIndexPrev();
      updateDots();
      moveSlides();
      slideTransformPrev();
      ul.addEventListener('transitionend',()=>{
        if(currentIndex === 1){
          slideFlowPrev();
        }
      });
    }
    slideFlowPrev();
  });
  // ウィンドウの大きさが変わってもスライドの位置を調整
  window.addEventListener('resize',()=>{
    moveSlides();
  });

  //--------------------------------
  // メインビジュアル
  // アンケートのお願いの閉じるボタン
  //---------------------------------
  const closeBtns = document.querySelectorAll('.questionary-close');
  const questionarys = document.querySelectorAll('.questionary');

  closeBtns.forEach((closeBtn,value) =>{
    closeBtn.addEventListener('click',()=>{
      questionarys[value].classList.add('hide');
    });
  });

  //-------------------------
  // TOPICSのすべて見る
  //-------------------------

  const allWatch = document.getElementById('all-watch');
  const topicsLists = document.querySelectorAll('#topics li,#all-watch img');
  const allWatchText = document.querySelector('#all-watch p');

  allWatch.addEventListener('click',()=>{
    topicsLists.forEach(topicsList=>{
      topicsList.classList.toggle('appear');
      if(topicsList.classList.contains('appear') === true){
        allWatchText.textContent = '閉じる';
      }else{
        allWatchText.textContent = 'すべて見る'
      } 
    });
  }); 

  // ----------------------------
  // 動画の再生（モーダル表示）
  // ----------------------------
  const close = document.getElementById('close');
  const videoPlays = document.querySelectorAll('.video-play');
  const videoModal = document.querySelector('.video-modal');

  // 画像をクリックしたら動画を表示
  videoPlays.forEach(videoPlay=>{
    videoPlay.addEventListener('click',()=>{
      videoModal.classList.add('appear');
    });
  });
  // 閉じるボタンでモーダルを閉じる
  close.addEventListener('click',()=>{
    videoModal.classList.remove('appear');
  });

  //--------------------------
  // おすすめ動画のカルーセル
  //--------------------------
  const videoPrev = document.getElementById('video-prev');
  const videoNext = document.getElementById('video-next');
  const videoContents = document.getElementById('video-contents');
  const videos = document.querySelectorAll('#video-contents li');
  const videoDots = [];
  let videoCurrentIndex = 0;

  // videoPrev,videoNextボタンの表示、非表示
  function videoUpdateButtons(){
    const style = window.getComputedStyle(videoContents);
    const marginPx = style.getPropertyValue('margin-left');
    const margin = parseInt(marginPx,10);
    let videoWidth = videos[0].getBoundingClientRect().width; //動画幅を取得
    let numberOfShow = Math.floor((window.innerWidth - margin) / (videoWidth + 50)); //動画の表示数 

    //画像が画面幅をoverflowしない場合
    if(videos.length <= numberOfShow){
      videoNext.classList.add('hidden');
      videoPrev.classList.add('hidden');
    }else{// overflowする場合
      videoNext.classList.remove('hidden');
      videoPrev.classList.remove('hidden');
      if(videoCurrentIndex <= 0){
        videoPrev.classList.add('hidden');//prevボタンを隠す
      }
      if(videoCurrentIndex >= videos.length - (numberOfShow)){
        videoNext.classList.add('hidden');//nextボタンを隠す
      }
    } 
  }

  //動画の配置
  function videoLayout(){
    const style = window.getComputedStyle(videoContents);
    const marginPx = style.getPropertyValue('margin-left');
    const margin = parseInt(marginPx,10);
    let videoWidth = videos[0].getBoundingClientRect().width; //動画幅を取得
    let numberOfShow = Math.floor((window.innerWidth - margin) / (videoWidth + 50)); //動画の表示数
    
    //画像が画面幅をoverflowしない場合
    if(videos.length <= numberOfShow){
      videoContents.classList.add('layout');
    }else{
      videoContents.classList.remove('layout');
    }
  }
  
  //イメージの幅分 + marginだけスライドを左右に動かすための処理
  function videoMoveSlides(){
    let videoWidth = videos[0].getBoundingClientRect().width; //動画幅を取得
    videoContents.style.transform = `translateX(${-1 * (videoWidth + 50) * videoCurrentIndex}px)`;
  }
  // //ドットボタンの処理・生成
  function videoSetupDots(){
    for(let i=0; i < videos.length;i++){
      const button = document.createElement('button');
      button.addEventListener('click',()=>{
        videoCurrentIndex = i;
        videoUpdateDots();
        videoUpdateButtons();
        videoMoveSlides();
      });
      videoDots.push(button);
      document.getElementById('video-nav').appendChild(button);
    }
    videoDots[0].classList.add('current');
  }
  //クリックしたボタンに色をつける
  function videoUpdateDots(){
    videoDots.forEach(videoDot=>{
      videoDot.classList.remove('current');
    });
    videoDots[videoCurrentIndex].classList.add('current');
  }

  // //hoverしたボタンに色をつける
  function hoverVideoUpdateDots(){
    videos.forEach(video=>{
      video.addEventListener('mouseover',(event)=>{
        const index = event.target.dataset.index;
      videoDots.forEach(videoDot=>{
        videoDot.classList.remove('current');
      });
      videoDots[index].classList.add('current');
      });
    });
    videos.forEach(video=>{
      video.addEventListener('mouseout',()=>{
        videoDots.forEach(videoDot=>{
        videoDot.classList.remove('current');
      });
      videoDots[videoCurrentIndex].classList.add('current');
      });
    });
  }

  hoverVideoUpdateDots();
  videoUpdateButtons();
  videoSetupDots();
  videoLayout();

  // videoNextボタンクリック時
  videoNext.addEventListener('click',()=>{
    videoCurrentIndex++;
    videoUpdateButtons();
    videoUpdateDots();
    videoMoveSlides();
    console.log(videoCurrentIndex);
  });

  // videoPrevボタンクリック時
  videoPrev.addEventListener('click',()=>{
    videoCurrentIndex--;
    videoUpdateButtons();
    videoUpdateDots();
    videoMoveSlides();
  });

  //リサイズによるレイアウト等の変更
  window.addEventListener('resize',()=>{
    videoUpdateButtons();
    videoLayout();
    videoMoveSlides()
  });

  //--------------------------------
  // トップページへ戻るボタンの表示
  //--------------------------------
  const toTop = document.getElementById('to-top');
  const scrolledTarget = document.getElementById('scrolled-target');

  // #scrolled-targetが消えればボタンの表示
  function callback(entries){
    entries.forEach(entry =>{
      if(!entry.isIntersecting){
        toTop.classList.add('scrolled');
      }else{
        toTop.classList.remove('scrolled');
      }
    });
  }
  const observer = new IntersectionObserver(callback);
  observer.observe(scrolledTarget);
}  

//---------------------
//jQuery
//---------------------
$(function(){
  //--------------------
  // スムーススクロール
  //--------------------
  $('a').click(function(){
    let id = $(this).attr('href');
    let position = $(id).offset().top;
    let height = $('#header').height();

    $('html,body').animate({
      'scrollTop':position - height
    },500);
  });
});

  




